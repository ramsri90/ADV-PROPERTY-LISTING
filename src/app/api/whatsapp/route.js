// ─── CONFIG ───────────────────────────────────────────────────────────────────
const VERIFY_TOKEN   = 'webbheads_webhook_token';
const AGENT_PHONE    = '+91 22 4567 8900';
const SITE            = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const ALL_PROPERTIES = [
  {
    id: 'p1',
    name: 'Luxury Sea-View Penthouse',
    location: 'Mumbai, Maharashtra',
    price: '₹12.50 Cr',
    beds: 5, baths: 6,
    area: '6,500 Sq Ft',
    type: 'Residential',
    desc: 'Stunning 5-bed penthouse with panoramic sea views, private terrace & world-class amenities in the heart of South Mumbai.',
    url: `${SITE}/property/p1`,
    image: `${SITE}/images/p1.jpg`,
  },
  {
    id: 'p2',
    name: 'Modern Villa in Whitefield',
    location: 'Bangalore, Karnataka',
    price: '₹4.20 Cr',
    beds: 4, baths: 4,
    area: '3,800 Sq Ft',
    type: 'Villa',
    desc: 'Contemporary 4-bed villa in premium Whitefield gated community with landscaped garden, modular kitchen & solar power.',
    url: `${SITE}/property/p2`,
    image: `${SITE}/images/p2.jpg`,
  },
  {
    id: 'p5',
    name: 'Modern Tech Office Space',
    location: 'Hyderabad, Telangana',
    price: '₹18.00 Cr',
    beds: null, baths: null,
    area: '25,000 Sq Ft',
    type: 'Commercial',
    desc: 'Grade-A tech office campus in HITEC City with open floor plans, conference suites, cafeteria & dedicated parking.',
    url: `${SITE}/property/p5`,
    image: `${SITE}/images/p5.jpg`,
  },
  {
    id: 'p6',
    name: 'Serene Waterfront Villa',
    location: 'North Goa, Goa',
    price: '₹5.50 Cr',
    beds: 4, baths: 4,
    area: '4,200 Sq Ft',
    type: 'Villa',
    desc: 'Exclusive 4-bed villa steps from the beach with infinity pool, lush tropical garden & private boat dock.',
    url: `${SITE}/property/p6`,
    image: `${SITE}/images/p6.jpg`,
  },
  {
    id: 'p3',
    name: 'Prime Commercial Space',
    location: 'New Delhi, Delhi',
    price: '₹8.50 L/mo',
    beds: null, baths: null,
    area: '2,200 Sq Ft',
    type: 'Commercial',
    desc: 'Premium retail/office space on Connaught Place with high footfall, 24×7 security & ample parking.',
    url: `${SITE}/property/p3`,
    image: `${SITE}/images/p3.jpg`,
  },
  {
    id: 'p4',
    name: 'Elegant Heritage Apartment',
    location: 'Kolkata, West Bengal',
    price: '₹6.80 L/mo',
    beds: 3, baths: 3,
    area: '2,500 Sq Ft',
    type: 'Apartment',
    desc: 'Beautifully restored 3-bed heritage apartment in Alipore with original wooden flooring, high ceilings & modern kitchen.',
    url: `${SITE}/property/p4`,
    image: `${SITE}/images/p4.jpg`,
  },
];

const BUY_PROPERTIES = ALL_PROPERTIES.filter(p => ['p1', 'p2', 'p5', 'p6'].includes(p.id));
const RENT_PROPERTIES = ALL_PROPERTIES.filter(p => ['p3', 'p4'].includes(p.id));
const COMMERCIAL_PROPERTIES = ALL_PROPERTIES.filter(p => ['p5', 'p3'].includes(p.id));

// ─── SESSION STORE ────────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    welcomeBody:      `👋 Welcome to *Webb Heads*!\n\nPlease select your language to continue:`,
    mainMenuBody:     `🏠 *Webb Heads Main Menu*\n\nWhat are you looking for today?`,
    askName:          `👤 Please enter your *Full Name*:`,
    askPhone:         `📱 Please enter your *WhatsApp number*:`,
    askEmail:         `📧 Please enter your *Email ID*:`,
    thankYou:         (name) => `✅ *Thank you${name ? ', ' + name : ''}!* Our executive will contact you shortly.\n\n📞 Direct queries: ${AGENT_PHONE}`,
    invalid:           `❌ Please use the buttons below to navigate.`,
    propCard:          (p, idx, total) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n📐 ${p.area}\n\n📊 ${idx + 1} of ${total}`,
    propDetail:        (p) => `🏷️ *${p.name}*\n\n📍 *Location:* ${p.location}\n💰 *Price:* ${p.price}\n📐 *Area:* ${p.area}\n🏗️ *Type:* ${p.type}\n\n📝 ${p.desc}\n\n🔗 ${p.url}`,
    btnBuy: '🏠 Buy', btnRent: '🏘️ Rent', btnCommercial: '🏢 Commercial', btnMore: '➕ More',
    btnInterested: '✅ Interested', btnMainMenu: '🏠 Main Menu', btnConfirm: '✅ Yes, Contact Me',
  },
  te: { /* Telugu translations - same as before */ },
  hi: { /* Hindi translations - same as before */ }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
}

async function sendText(to, body) { return sendPayload(to, { type: 'text', text: { body } }); }

async function sendButtons(to, bodyText, buttons, headerText = null) {
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: headerText ? { type: 'text', text: headerText } : undefined,
      body: { text: bodyText },
      action: { buttons: buttons.map(b => ({ type: 'reply', reply: { id: b.id, title: b.title.substring(0, 20) } })) }
    }
  });
}

async function sendPropertyCard(to, lang, property, index, total) {
  const t = T[lang] || T['en'];
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'image', image: { link: property.image } },
      body: { text: t.propCard(property, index, total) },
      action: {
        buttons: [
          { type: 'reply', reply: { id: `prev_prop`, title: '⬅️ Prev' } },
          { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested } },
          { type: 'reply', reply: { id: `next_prop`, title: 'Next ➡️' } },
        ]
      }
    }
  });
}

async function saveToSheets(data) {
  if (SHEETS_WEBHOOK) await fetch(SHEETS_WEBHOOK, { method: 'POST', body: JSON.stringify(data) });
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg = (text || '').trim();
  const t = T[session.lang] || T['en'];

  // 1. DETECT WEBSITE CLICKS (Deep Linking)
  const isWebClick = msg.toLowerCase().includes("interested in") && msg.toLowerCase().includes("details");
  if (isWebClick) {
    const matchedProp = ALL_PROPERTIES.find(p => msg.toLowerCase().includes(p.name.toLowerCase()));
    if (matchedProp) {
      session.data.pendingProperty = matchedProp; // Save property for after language pick
      session.step = 'lang_select';
      return sendLanguagePicker(from);
    }
  }

  // 2. GLOBAL RESET
  if (['hi', 'hello', 'menu'].includes(msg.toLowerCase()) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    session.data = {};
    return sendLanguagePicker(from);
  }

  // 3. LANGUAGE SELECTION
  if (buttonId?.startsWith('lang_')) {
    session.lang = buttonId.replace('lang_', '');
    
    // If user came from a website click, show THAT property immediately
    if (session.data.pendingProperty) {
      const prop = session.data.pendingProperty;
      session.data.selectedProperty = prop;
      session.data.intent = 'Website Lead';
      session.step = 'confirm_interest';
      delete session.data.pendingProperty;
      return sendPropertyDetail(from, session.lang, prop);
    }
    
    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  // 4. BROWSE LOGIC (Buy/Rent/Commercial)
  if (buttonId === 'menu_buy') return sendPropertyList(from, session.lang, session, BUY_PROPERTIES, 'buyTitle');
  if (buttonId === 'menu_rent') return sendPropertyList(from, session.lang, session, RENT_PROPERTIES, 'rentTitle');
  if (buttonId === 'menu_commercial') return sendPropertyList(from, session.lang, session, COMMERCIAL_PROPERTIES, 'commercialTitle');

  // 5. SLIDER & INTEREST LOGIC
  if (buttonId === 'next_prop' || buttonId === 'prev_prop') {
    const list = session.data.currentList;
    let idx = session.data.currentIndex ?? 0;
    idx = (buttonId === 'next_prop') ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
    session.data.currentIndex = idx;
    return sendPropertyCard(from, session.lang, list[idx], idx, list.length);
  }

  if (buttonId?.startsWith('interested_')) {
    const prop = ALL_PROPERTIES.find(p => p.id === buttonId.replace('interested_', ''));
    session.data.selectedProperty = prop;
    session.step = 'confirm_interest';
    return sendPropertyDetail(from, session.lang, prop);
  }

  if (buttonId?.startsWith('confirm_')) {
    session.step = 'collect_name';
    return sendText(from, t.askName);
  }

  // 6. LEAD CAPTURE (Name -> Phone -> Email)
  if (session.step === 'collect_name') {
    session.data.leadName = msg;
    session.step = 'collect_phone';
    return sendText(from, t.askPhone);
  }
  if (session.step === 'collect_phone') {
    session.data.leadPhone = msg.replace(/\D/g,'');
    session.step = 'collect_email';
    return sendText(from, t.askEmail);
  }
  if (session.step === 'collect_email') {
    session.data.leadEmail = msg;
    await saveToSheets({ ...session.data, whatsapp: from, time: new Date().toISOString() });
    const finalName = session.data.leadName;
    session.step = 'main_menu'; session.data = {};
    return sendPayload(from, { type: 'interactive', interactive: { type: 'button', body: { text: t.thankYou(finalName) }, action: { buttons: [{ type: 'reply', reply: { id: 'back_menu', title: t.btnMainMenu } }] } } });
  }

  return sendButtons(from, t.invalid, [{ id: 'back_menu', title: t.btnMainMenu }]);
}

// ─── ADDITIONAL HELPERS ───────────────────────────────────────────────────────
function sendLanguagePicker(to) {
  return sendButtons(to, T.en.welcomeBody, [
    { id: 'lang_en', title: 'English' },
    { id: 'lang_te', title: 'తెలుగు' },
    { id: 'lang_hi', title: 'हिंदी' }
  ], 'Webb Heads 🏠');
}

async function sendMainMenu(to, lang) {
  const t = T[lang] || T['en'];
  return sendButtons(to, t.mainMenuBody, [
    { id: 'menu_buy', title: t.btnBuy },
    { id: 'menu_rent', title: t.btnRent },
    { id: 'menu_commercial', title: t.btnCommercial }
  ]);
}

async function sendPropertyList(to, lang, session, list, titleKey) {
  session.data.currentList = list; session.data.currentIndex = 0;
  await sendText(to, T[lang][titleKey]);
  return sendPropertyCard(to, lang, list[0], 0, list.length);
}

async function sendPropertyDetail(to, lang, prop) {
  const t = T[lang] || T['en'];
  return sendButtons(to, t.propDetail(prop), [
    { id: `confirm_${prop.id}`, title: t.btnConfirm },
    { id: 'back_menu', title: t.btnMainMenu }
  ]);
}

export async function POST(req) {
  const body = await req.json();
  const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (msg) {
    const from = msg.from;
    const text = msg.text?.body;
    const btnId = msg.interactive?.button_reply?.id;
    await handleMessage(from, text, btnId);
  }
  return Response.json({ success: true });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === VERIFY_TOKEN) return new Response(searchParams.get('hub.challenge'));
  return new Response('Error', { status: 403 });
}
