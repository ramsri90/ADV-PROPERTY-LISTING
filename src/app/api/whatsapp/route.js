// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE  = '+91 22 4567 8900';
const SITE         = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const BUY_PROPERTIES = [
  { id: 'p1', name: 'Luxury Sea-View Penthouse', location: 'Mumbai', price: '₹12.50 Cr', area: '6,500 Sq Ft', imageUrl: `${SITE}/images/p1.jpg` },
  { id: 'p2', name: 'Modern Villa Whitefield', location: 'Bangalore', price: '₹4.20 Cr', area: '3,800 Sq Ft', imageUrl: `${SITE}/images/p2.jpg` },
  { id: 'p5', name: 'Tech Office Space', location: 'Hyderabad', price: '₹18.00 Cr', area: '25,000 Sq Ft', imageUrl: `${SITE}/images/p5.jpg` }
];

const RENT_PROPERTIES = [
  { id: 'p3', name: 'Prime Commercial Space', location: 'New Delhi', price: '₹8.50 L/mo', area: '2,200 Sq Ft', imageUrl: `${SITE}/images/p3.jpg` },
  { id: 'p4', name: 'Elegant Heritage Apt', location: 'Kolkata', price: '₹6.80 L/mo', area: '2,500 Sq Ft', imageUrl: `${SITE}/images/p4.jpg` }
];

// ─── SESSION STORE ────────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    welcome: "👋 Welcome to Webb Heads! Select your language:",
    mainMenu: "🏠 *Main Menu*\nSelect an option below:",
    buyTitle: "🏠 *Properties for Sale*",
    rentTitle: "🏘️ *Properties for Rent*",
    agentPrompt: "👨‍💼 *Talk to an Agent*\nPlease enter your *Full Name*:",
    detailsPrompt: "📋 Please enter your *Full Name*:",
    askPhone: "📱 Enter your *Phone Number*:",
    askEmail: "📧 Enter your *Email Address*:",
    thankYou: "✅ *Thank you!* Our team will contact you shortly.",
    btnBuy: "🏠 Buy Property",
    btnRent: "🏘️ Rent Property",
    btnComm: "🏢 Commercial",
    btnSell: "📋 List / Sell",
    btnAgent: "👨‍💼 Talk to Agent",
    btnInt: "✅ I'm Interested",
    btnMenu: "🏠 Main Menu",
    propDetail: (p) => `*${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n📐 ${p.area}\n🔗 ${p.imageUrl}`
  },
  // ... (Add 'te' and 'hi' following the same structure if needed)
};

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function sendPayload(to, payload) {
  const res = await fetch(`https://graph.facebook.com/v18.0/${process.env.PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.WA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

// 1. Language Picker (Buttons)
async function sendLanguagePicker(to) {
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: T.en.welcome },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'lang_en', title: 'English' } },
          { type: 'reply', reply: { id: 'lang_te', title: 'Telugu' } },
          { type: 'reply', reply: { id: 'lang_hi', title: 'Hindi' } }
        ]
      }
    }
  });
}

// 2. Main Menu (List/Pop-up)
async function sendMainMenu(to, lang) {
  const t = T[lang] || T.en;
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: t.mainMenu },
      action: {
        button: 'Select Option',
        sections: [
          {
            title: 'Browse',
            rows: [
              { id: 'menu_buy', title: t.btnBuy },
              { id: 'menu_rent', title: t.btnRent },
              { id: 'menu_comm', title: t.btnComm }
            ]
          },
          {
            title: 'Services',
            rows: [
              { id: 'menu_sell', title: t.btnSell },
              { id: 'menu_agent', title: t.btnAgent }
            ]
          }
        ]
      }
    }
  });
}

// 3. Property Card (Image + Details + Interested Button)
async function sendPropertyCard(to, lang, property) {
  const t = T[lang] || T.en;
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'image', image: { link: property.imageUrl } },
      body: { text: t.propDetail(property) },
      action: {
        buttons: [
          { type: 'reply', reply: { id: `int_${property.id}`, title: t.btnInt } },
          { type: 'reply', reply: { id: 'back_menu', title: t.btnMenu } }
        ]
      }
    }
  });
}

// ─── LOGIC HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg = (text || '').toLowerCase().trim();

  if (['hi', 'menu'].includes(msg) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    return sendLanguagePicker(from);
  }

  // Language Logic
  if (buttonId?.startsWith('lang_')) {
    session.lang = buttonId.split('_')[1];
    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  const t = T[session.lang] || T.en;

  // Menu Navigation
  if (buttonId === 'menu_buy') {
    for (const p of BUY_PROPERTIES) await sendPropertyCard(from, session.lang, p);
    return;
  }
  if (buttonId === 'menu_rent') {
    for (const p of RENT_PROPERTIES) await sendPropertyCard(from, session.lang, p);
    return;
  }
  if (buttonId === 'menu_agent' || buttonId === 'menu_sell') {
    session.step = 'col_name';
    session.data.intent = buttonId;
    return sendPayload(from, { type: 'text', text: { body: t.detailsPrompt } });
  }

  // Interest Logic
  if (buttonId?.startsWith('int_')) {
    const pId = buttonId.replace('int_', '');
    session.data.property = pId;
    session.step = 'col_name';
    return sendPayload(from, { type: 'text', text: { body: t.detailsPrompt } });
  }

  // Lead Collection
  if (session.step === 'col_name') {
    session.data.name = text;
    session.step = 'col_phone';
    return sendPayload(from, { type: 'text', text: { body: t.askPhone } });
  }
  if (session.step === 'col_phone') {
    session.data.phone = text;
    session.step = 'col_email';
    return sendPayload(from, { type: 'text', text: { body: t.askEmail } });
  }
  if (session.step === 'col_email') {
    session.data.email = text;
    // SAVE TO SHEETS
    await fetch(SHEETS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...session.data, whatsapp: from, time: new Date() })
    });
    session.step = 'main_menu';
    await sendPayload(from, { type: 'text', text: { body: t.thankYou } });
    return sendMainMenu(from, session.lang);
  }
}

// ─── WEBHOOK EXPORTS (Vercel/Node) ────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
  const val = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!val) return new Response('OK');

  const from = val.from;
  const text = val.text?.body;
  const btnId = val.interactive?.button_reply?.id || val.interactive?.list_reply?.id;

  await handleMessage(from, text, btnId);
  return new Response('OK');
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === VERIFY_TOKEN) {
    return new Response(searchParams.get('hub.challenge'));
  }
  return new Response('Error', { status: 403 });
}
