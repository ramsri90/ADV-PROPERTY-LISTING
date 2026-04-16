// ─── CONFIG ───────────────────────────────────────────────────────────────────
const VERIFY_TOKEN   = 'webbheads_webhook_token';
const AGENT_PHONE    = '+91 22 4567 8900';
const SITE            = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const BUY_PROPERTIES = [
  { id: 'p1', name: 'Luxury Sea-View Penthouse', location: 'Mumbai, Maharashtra', price: '₹12.50 Cr', beds: 5, baths: 6, area: '6,500 Sq Ft', type: 'Residential', desc: 'Stunning 5-bed penthouse with panoramic sea views, private terrace & world-class amenities in the heart of South Mumbai.', url: `${SITE}/property/p1`, image: `${SITE}/images/p1.jpg` },
  { id: 'p2', name: 'Modern Villa in Whitefield', location: 'Bangalore, Karnataka', price: '₹4.20 Cr', beds: 4, baths: 4, area: '3,800 Sq Ft', type: 'Villa', desc: 'Contemporary 4-bed villa in premium Whitefield gated community with landscaped garden, modular kitchen & solar power.', url: `${SITE}/property/p2`, image: `${SITE}/images/p2.jpg` },
  { id: 'p5', name: 'Modern Tech Office Space', location: 'Hyderabad, Telangana', price: '₹18.00 Cr', beds: null, baths: null, area: '25,000 Sq Ft', type: 'Commercial', desc: 'Grade-A tech office campus in HITEC City with open floor plans, conference suites, cafeteria & dedicated parking.', url: `${SITE}/property/p5`, image: `${SITE}/images/p5.jpg` },
  { id: 'p6', name: 'Serene Waterfront Villa', location: 'North Goa, Goa', price: '₹5.50 Cr', beds: 4, baths: 4, area: '4,200 Sq Ft', type: 'Villa', desc: 'Exclusive 4-bed villa steps from the beach with infinity pool, lush tropical garden & private boat dock.', url: `${SITE}/property/p6`, image: `${SITE}/images/p6.jpg` },
];

const RENT_PROPERTIES = [
  { id: 'p3', name: 'Prime Commercial Space', location: 'New Delhi, Delhi', price: '₹8.50 L/mo', beds: null, baths: null, area: '2,200 Sq Ft', type: 'Commercial', desc: 'Premium retail/office space on Connaught Place with high footfall, 24×7 security & ample parking.', url: `${SITE}/property/p3`, image: `${SITE}/images/p3.jpg` },
  { id: 'p4', name: 'Elegant Heritage Apartment', location: 'Kolkata, West Bengal', price: '₹6.80 L/mo', beds: 3, baths: 3, area: '2,500 Sq Ft', type: 'Apartment', desc: 'Beautifully restored 3-bed heritage apartment in Alipore with original wooden flooring, high ceilings & modern kitchen.', url: `${SITE}/property/p4`, image: `${SITE}/images/p4.jpg` },
];

const COMMERCIAL_PROPERTIES = [...BUY_PROPERTIES.filter(p => p.type === 'Commercial'), ...RENT_PROPERTIES.filter(p => p.type === 'Commercial')];
const ALL_PROPERTIES = [...BUY_PROPERTIES, ...RENT_PROPERTIES];

// ─── SESSION STORE ────────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    welcomeBody:      `👋 Welcome to *Webb Heads*!\n\nPlease select your language:`,
    mainMenuBody:     `🏠 *Webb Heads Main Menu*\n\nWhat are you looking for today?`,
    moreOptionsBody:  `➕ *More Options*\n\nChoose an option below:`,
    buyTitle:         `🏠 *Properties for Sale*\n\nSwipe through our latest listings ⬅️ ➡️`,
    rentTitle:        `🏘️ *Properties for Rent*\n\nSwipe through our latest listings ⬅️ ➡️`,
    commercialTitle:  `🏢 *Commercial Properties*\n\nSwipe through our listings ⬅️ ➡️`,
    askName:          `👤 Please enter your *Full Name*:`,
    askPhone:         `📱 Please enter your *WhatsApp number*:`,
    askEmail:         `📧 Please enter your *Email ID*:`,
    thankYou:         (name) => `✅ *Thank you${name ? ', ' + name : ''}!* Our executive will contact you shortly.\n\n📞 Direct queries: ${AGENT_PHONE}`,
    sell:              `📋 *List / Sell Your Property*\n👉 ${SITE}/sell`,
    website:           `🌐 *Visit our Website*\n👉 ${SITE}`,
    invalid:           `❌ Please use the buttons below to navigate.`,
    propCard:          (p, idx, total) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n📐 ${p.area}\n\n📊 ${idx + 1} of ${total}`,
    propDetail:        (p) => `🏷️ *${p.name}*\n\n📍 *Location:* ${p.location}\n💰 *Price:* ${p.price}\n📐 *Area:* ${p.area}${p.beds ? `\n🛏️ *Beds:* ${p.beds}  🚿 *Baths:* ${p.baths}` : ''}\n🏗️ *Type:* ${p.type}\n\n📝 ${p.desc}\n\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *Talk to an Agent*\n\nPlease enter your *name*:`,
    agentAskPhone:    `📱 Enter your *WhatsApp number*:`,
    agentThankYou:    (name) => `✅ *Hi ${name}!* An agent will call you shortly.`,
    btnBuy: '🏠 Buy', btnRent: '🏘️ Rent', btnCommercial: '🏢 Commercial', btnMore: '➕ More', btnAgent: '🧑‍💼 Talk to Agent', btnSell: '📋 List Property', btnWebsite: '🌐 Visit Website', btnInterested: '✅ Interested', btnMainMenu: '🏠 Main Menu', btnViewDetails: '📋 View Details', btnConfirm: '✅ Yes, Contact Me',
  },
  te: { /* Telugu remains same as your previous version */ },
  hi: { /* Hindi remains same as your previous version */ }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;
  const res = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
}

async function sendText(to, body) { return sendPayload(to, { type: 'text', text: { body } }); }

async function sendButtons(to, bodyText, buttons, headerText = null, footerText = null) {
  const payload = { type: 'interactive', interactive: { type: 'button', body: { text: bodyText }, action: { buttons: buttons.slice(0, 3).map((b) => ({ type: 'reply', reply: { id: b.id, title: b.title.substring(0, 20) } })) } } };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
  if (footerText) payload.interactive.footer = { text: footerText };
  return sendPayload(to, payload);
}

async function sendList(to, bodyText, buttonLabel, sections, headerText = null, footerText = null) {
  const payload = { type: 'interactive', interactive: { type: 'list', body: { text: bodyText }, action: { button: buttonLabel, sections } } };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
  if (footerText) payload.interactive.footer = { text: footerText };
  return sendPayload(to, payload);
}

async function sendPropertyCard(to, lang, property, index, total) {
  const t = T[lang] || T['en'];
  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'image', image: { link: property.image || `${SITE}/images/default.jpg` } },
      body: { text: t.propCard(property, index, total) },
      footer: { text: `${property.type} · Webb Heads` },
      action: { buttons: [
        { type: 'reply', reply: { id: `prev_prop`, title: '⬅️ Prev' } },
        { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested } },
        { type: 'reply', reply: { id: `next_prop`, title: 'Next ➡️' } },
      ] }
    }
  });
}

async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  await fetch(SHEETS_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(console.error);
}

// ─── INTERACTIVE SENDERS ─────────────────────────────────────────────────────
function sendLanguagePicker(to) {
  return sendButtons(to, `👋 Welcome to *Webb Heads*!\n\nPlease select your language:`, 
    [{ id: 'lang_en', title: 'English' }, { id: 'lang_te', title: 'తెలుగు' }, { id: 'lang_hi', title: 'हिंदी' }], 
    'Webb Heads 🏠', "India's Premium Property Platform");
}

async function sendMainMenu(to, lang) {
  const t = T[lang] || T['en'];
  await sendButtons(to, t.mainMenuBody, [{ id: 'menu_buy', title: t.btnBuy }, { id: 'menu_rent', title: t.btnRent }, { id: 'menu_commercial', title: t.btnCommercial }], 'Webb Heads 🏠');
  return sendButtons(to, `➕ *More Options*`, [{ id: 'menu_more', title: t.btnMore }]);
}

async function sendPropertyDetail(to, lang, property) {
  const t = T[lang] || T['en'];
  return sendButtons(to, t.propDetail(property), [{ id: `confirm_${property.id}`, title: t.btnConfirm }, { id: 'back_menu', title: t.btnMainMenu }], null, 'Webb Heads 🏠');
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const rawText = (text || '').trim();
  const msg = rawText.toLowerCase();
  const t = T[session.lang] || T['en'];

  // 1. DETECT WEBSITE CLICK (e.g., "Hi Priya, I'm interested in...")
  if (msg.includes("interested in")) {
    const property = ALL_PROPERTIES.find(p => rawText.includes(p.name));
    if (property) {
      session.lang = 'en'; // Default to English for web clicks
      session.data.selectedProperty = property;
      session.data.intent = 'Website Lead';
      session.step = 'confirm_interest';
      // Step 1: Force Language select first (optional) or jump to details
      // According to your request: Language -> Property Details -> Flow
      await sendLanguagePicker(from); 
      return;
    }
  }

  // 2. GLOBAL RESET
  if (['hi', 'hello', 'menu', 'start'].includes(msg) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    session.data = {};
    return sendLanguagePicker(from);
  }

  // 3. LANGUAGE SELECTION
  if (buttonId?.startsWith('lang_')) {
    const langMap = { lang_en: 'en', lang_te: 'te', lang_hi: 'hi' };
    session.lang = langMap[buttonId];
    
    // If user came from a website click, jump to that property detail after lang choice
    if (session.data.selectedProperty && session.step === 'confirm_interest') {
      return sendPropertyDetail(from, session.lang, session.data.selectedProperty);
    }

    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  // 4. MAIN MENU
  if (buttonId === 'menu_buy') {
    session.data.currentList = BUY_PROPERTIES; session.data.currentIndex = 0;
    return sendPropertyCard(from, session.lang, BUY_PROPERTIES[0], 0, BUY_PROPERTIES.length);
  }
  if (buttonId === 'menu_rent') {
    session.data.currentList = RENT_PROPERTIES; session.data.currentIndex = 0;
    return sendPropertyCard(from, session.lang, RENT_PROPERTIES[0], 0, RENT_PROPERTIES.length);
  }

  // 5. SLIDER NAVIGATION (FIXED)
  if (buttonId === 'next_prop' || buttonId === 'prev_prop') {
    const list = session.data.currentList;
    let idx = session.data.currentIndex ?? 0;
    idx = (buttonId === 'next_prop') ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
    session.data.currentIndex = idx;
    return sendPropertyCard(from, session.lang, list[idx], idx, list.length);
  }

  // 6. INTERESTED FLOW
  if (buttonId?.startsWith('interested_')) {
    const propId = buttonId.replace('interested_', '');
    const property = ALL_PROPERTIES.find(p => p.id === propId);
    session.data.selectedProperty = property;
    session.step = 'confirm_interest';
    return sendPropertyDetail(from, session.lang, property);
  }

  if (buttonId?.startsWith('confirm_')) {
    session.step = 'collect_name';
    return sendText(from, t.askName);
  }

  // 7. LEAD CAPTURE (NAME -> PHONE -> EMAIL)
  if (session.step === 'collect_name') {
    session.data.leadName = rawText; session.step = 'collect_phone';
    return sendText(from, t.askPhone);
  }
  if (session.step === 'collect_phone') {
    session.data.leadPhone = rawText; session.step = 'collect_email';
    return sendText(from, t.askEmail);
  }
  if (session.step === 'collect_email') {
    session.data.leadEmail = rawText;
    await saveToSheets({
      name: session.data.leadName, phone: session.data.leadPhone, email: session.data.leadEmail,
      property: session.data.selectedProperty?.name, whatsapp: from, time: new Date().toISOString()
    });
    session.step = 'main_menu';
    await sendText(from, t.thankYou(session.data.leadName));
    return sendMainMenu(from, session.lang);
  }

  // FALLBACK
  return sendButtons(from, t.invalid, [{ id: 'back_menu', title: t.btnMainMenu }]);
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return Response.json({});
    const from = message.from;
    if (message.type === 'interactive') {
      const btnId = message.interactive?.button_reply?.id || message.interactive?.list_reply?.id;
      await handleMessage(from, null, btnId);
    } else if (message.type === 'text') {
      await handleMessage(from, message.text.body, null);
    }
    return Response.json({});
  } catch (err) { return Response.json({ error: 'Internal error' }, { status: 200 }); }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === VERIFY_TOKEN) return new Response(searchParams.get('hub.challenge'));
  return new Response('Forbidden', { status: 403 });
}
