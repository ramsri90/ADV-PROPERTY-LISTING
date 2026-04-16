// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE = '+91 22 4567 8900';
const SITE = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA (WITH IMAGES) ──────────────────────────────────────────────
const BUY_PROPERTIES = [
  {
    id: 'p1',
    name: 'Luxury Sea-View Penthouse',
    location: 'Mumbai, Maharashtra',
    price: '₹12.50 Cr',
    beds: 5,
    baths: 6,
    area: '6,500 Sq Ft',
    url: `${SITE}/property/p1`,
    image: `${SITE}/images/p1.jpg`
  },
  {
    id: 'p2',
    name: 'Modern Villa in Whitefield',
    location: 'Bangalore, Karnataka',
    price: '₹4.20 Cr',
    beds: 4,
    baths: 4,
    area: '3,800 Sq Ft',
    url: `${SITE}/property/p2`,
    image: `${SITE}/images/p2.jpg`
  },
];

const RENT_PROPERTIES = [
  {
    id: 'p3',
    name: 'Prime Commercial Space',
    location: 'Delhi',
    price: '₹8.50 Cr/mo',
    area: '2,200 Sq Ft',
    url: `${SITE}/property/p3`,
    image: `${SITE}/images/p3.jpg`
  }
];

// ─── SESSION STORE ────────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', data: {} };
  return sessions[from];
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function propText(p) {
  return `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n📐 ${p.area}\n🔗 ${p.url}`;
}

async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;

  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      ...payload
    })
  });
}

async function sendText(to, body) {
  return sendPayload(to, { text: { body } });
}

async function sendImage(to, imageUrl, caption) {
  return sendPayload(to, {
    type: 'image',
    image: {
      link: imageUrl,
      caption
    }
  });
}

async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  await fetch(SHEETS_WEBHOOK, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text) {
  const session = getSession(from);
  const msg = text.toLowerCase().trim();

  // RESET
  if (['hi', 'menu', 'start'].includes(msg)) {
    session.step = 'menu';
    return sendText(from,
`🏠 *Main Menu*
1️⃣ Buy Property
2️⃣ Rent Property
3️⃣ Talk to Agent`);
  }

  // MENU
  if (session.step === 'menu') {
    if (msg === '1') {
      session.step = 'browse_buy';

      for (const p of BUY_PROPERTIES) {
        await sendImage(from, p.image, propText(p));
      }

      return sendText(from, `Reply *interested* to continue or *menu*`);
    }

    if (msg === '2') {
      session.step = 'browse_rent';

      for (const p of RENT_PROPERTIES) {
        await sendImage(from, p.image, propText(p));
      }

      return sendText(from, `Reply *interested* to continue or *menu*`);
    }

    if (msg === '3') {
      session.step = 'collect_name';
      session.data.intent = 'Agent';
      return sendText(from, `👨‍💼 Enter your *Full Name*`);
    }
  }

  // INTERESTED FLOW
  if (msg === 'interested') {
    session.step = 'collect_name';
    return sendText(from, `📋 Enter your *Full Name*`);
  }

  // NAME
  if (session.step === 'collect_name') {
    session.data.name = text;
    session.step = 'collect_phone';
    return sendText(from, `📱 Enter your *Phone Number*`);
  }

  // PHONE
  if (session.step === 'collect_phone') {
    session.data.phone = text;
    session.step = 'collect_email';
    return sendText(from, `📧 Enter your *Gmail Address*`);
  }

  // EMAIL
  if (session.step === 'collect_email') {
    if (!text.includes('@')) {
      return sendText(from, `❌ Enter valid Gmail`);
    }

    session.data.email = text;

    await saveToSheets({
      name: session.data.name,
      phone: session.data.phone,
      email: session.data.email,
      whatsapp: from,
      time: new Date()
    });

    session.step = 'menu';

    return sendText(from,
`✅ *Thank you, your request is submitted!*

📞 Our agent will contact you shortly.

👨‍💼 Agent Contact: ${AGENT_PHONE}

🌐 View Properties:
${SITE}

Reply *menu*`);
  }

  return sendText(from, `Type *menu* to start`);
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return Response.json({});

  const text = message.text?.body;
  const from = message.from;

  if (text) await handleMessage(from, text);

  return Response.json({});
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (
    searchParams.get('hub.verify_token') === VERIFY_TOKEN
  ) {
    return new Response(searchParams.get('hub.challenge'));
  }
  return new Response('Error', { status: 403 });
}
