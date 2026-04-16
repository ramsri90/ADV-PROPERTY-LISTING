// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE = '+91 22 4567 8900';
const SITE = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA (NOW WITH IMAGES) ─────────────────────────────────────────
const BUY_PROPERTIES = [
  {
    id: 'p1',
    name: 'Luxury Sea-View Penthouse',
    location: 'Mumbai, Maharashtra',
    price: '₹12.50 Cr',
    beds: 5,
    baths: 6,
    area: '6,500 Sq Ft',
    image: `${SITE}/images/p1.jpg`,
    url: `${SITE}/property/p1`,
  },
  {
    id: 'p2',
    name: 'Modern Villa in Whitefield',
    location: 'Bangalore, Karnataka',
    price: '₹4.20 Cr',
    beds: 4,
    baths: 4,
    area: '3,800 Sq Ft',
    image: `${SITE}/images/p2.jpg`,
    url: `${SITE}/property/p2`,
  },
  {
    id: 'p5',
    name: 'Modern Tech Office Space',
    location: 'Hyderabad, Telangana',
    price: '₹18.00 Cr',
    beds: null,
    baths: null,
    area: '25,000 Sq Ft',
    image: `${SITE}/images/p5.jpg`,
    url: `${SITE}/property/p5`,
  },
  {
    id: 'p6',
    name: 'Serene Waterfront Villa',
    location: 'Goa',
    price: '₹5.50 Cr',
    beds: 4,
    baths: 4,
    area: '4,200 Sq Ft',
    image: `${SITE}/images/p6.jpg`,
    url: `${SITE}/property/p6`,
  },
];

const RENT_PROPERTIES = [
  {
    id: 'p3',
    name: 'Prime Commercial Space',
    location: 'Delhi',
    price: '₹8.50 Cr/mo',
    beds: null,
    baths: null,
    area: '2,200 Sq Ft',
    image: `${SITE}/images/p3.jpg`,
    url: `${SITE}/property/p3`,
  },
  {
    id: 'p4',
    name: 'Elegant Heritage Apartment',
    location: 'Kolkata',
    price: '₹6.80 Cr/mo',
    beds: 3,
    baths: 3,
    area: '2,500 Sq Ft',
    image: `${SITE}/images/p4.jpg`,
    url: `${SITE}/property/p4`,
  },
];

// ─── SESSION STORE ───────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS (SHORTENED FOR CLEANNESS) ──────────────────────────────────
const T = {
  en: {
    mainMenuBody: `🏠 *Main Menu*\n\nChoose option:`,
    buyTitle: `🏠 Properties for Sale`,
    rentTitle: `🏘️ Properties for Rent`,
    detailsPrompt: `Enter your *Full Name*:`,
    askPhone: `Enter your *Phone*:`,
    askEmail: `Enter your *Email*:`,
    thankYou: `✅ We will contact you soon!`,
    invalid: `❌ Use buttons.`,
    btnBuy: '🏠 Buy',
    btnRent: '🏘️ Rent',
    btnInterested: '✅ Interested',
    btnMainMenu: '🏠 Menu',
    prop: (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `\n🛏️ ${p.beds} Beds 🚿 ${p.baths}` : ''
      }\n📐 ${p.area}\n🔗 ${p.url}`,
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;

  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
}

async function sendText(to, body) {
  return sendPayload(to, { type: 'text', text: { body } });
}

// 🔥 NEW: SEND IMAGE
async function sendImage(to, imageUrl, caption = '') {
  return sendPayload(to, {
    type: 'image',
    image: {
      link: imageUrl,
      caption: caption,
    },
  });
}

async function sendButtons(to, bodyText, buttons) {
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.map((b) => ({
          type: 'reply',
          reply: { id: b.id, title: b.title.substring(0, 20) },
        })),
      },
    },
  });
}

async function sendList(to, bodyText, buttonLabel, sections) {
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: { button: buttonLabel, sections },
    },
  });
}

async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  await fetch(SHEETS_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ─── UI SENDERS ──────────────────────────────────────────────────────────────
function sendMainMenu(to) {
  return sendList(to, T.en.mainMenuBody, 'Options', [
    {
      title: 'Properties',
      rows: [
        { id: 'menu_buy', title: '🏠 Buy Property' },
        { id: 'menu_rent', title: '🏘️ Rent Property' },
      ],
    },
  ]);
}

function sendBuyProperties(to) {
  return sendList(
    to,
    T.en.buyTitle,
    'View',
    [
      {
        title: 'Listings',
        rows: BUY_PROPERTIES.map((p) => ({
          id: `buy_${p.id}`,
          title: p.name,
          description: `${p.price} | ${p.area}`,
        })),
      },
    ]
  );
}

function sendRentProperties(to) {
  return sendList(
    to,
    T.en.rentTitle,
    'View',
    [
      {
        title: 'Listings',
        rows: RENT_PROPERTIES.map((p) => ({
          id: `rent_${p.id}`,
          title: p.name,
          description: `${p.price} | ${p.area}`,
        })),
      },
    ]
  );
}

// 🔥 UPDATED: FULL PROPERTY CATALOGUE EXPERIENCE
async function sendPropertyDetail(to, property) {
  // 1. Send IMAGE FIRST
  await sendImage(
    to,
    property.image,
    `🏡 ${property.name}\n${property.location}`
  );

  // 2. Send DETAILS + BUTTONS
  return sendButtons(to, T.en.prop(property), [
    { id: `interested_${property.id}`, title: 'Interested' },
    { id: 'menu', title: 'Main Menu' },
  ]);
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg = (text || '').toLowerCase();

  if (msg === 'hi' || buttonId === 'menu') {
    session.step = 'menu';
    return sendMainMenu(from);
  }

  if (buttonId === 'menu_buy') {
    return sendBuyProperties(from);
  }

  if (buttonId === 'menu_rent') {
    return sendRentProperties(from);
  }

  if (buttonId?.startsWith('buy_')) {
    const id = buttonId.replace('buy_', '');
    const property = BUY_PROPERTIES.find((p) => p.id === id);
    return sendPropertyDetail(from, property);
  }

  if (buttonId?.startsWith('rent_')) {
    const id = buttonId.replace('rent_', '');
    const property = RENT_PROPERTIES.find((p) => p.id === id);
    return sendPropertyDetail(from, property);
  }

  if (buttonId?.startsWith('interested_')) {
    session.step = 'name';
    session.data.property = buttonId;
    return sendText(from, 'Enter Name:');
  }

  if (session.step === 'name') {
    session.data.name = text;
    session.step = 'phone';
    return sendText(from, 'Enter Phone:');
  }

  if (session.step === 'phone') {
    session.data.phone = text;
    session.step = 'email';
    return sendText(from, 'Enter Email:');
  }

  if (session.step === 'email') {
    session.data.email = text;

    await saveToSheets({
      ...session.data,
      time: new Date(),
    });

    session.step = 'menu';
    return sendText(from, '✅ Submitted!');
  }

  return sendText(from, 'Type hi');
}

// ─── WEBHOOK ─────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return Response.json({});

  const from = message.from;

  if (message.type === 'interactive') {
    const id =
      message.interactive.button_reply?.id ||
      message.interactive.list_reply?.id;
    await handleMessage(from, null, id);
  }

  if (message.type === 'text') {
    await handleMessage(from, message.text.body, null);
  }

  return Response.json({});
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === VERIFY_TOKEN) {
    return new Response(searchParams.get('hub.challenge'));
  }
  return new Response('Error', { status: 403 });
}
