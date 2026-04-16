// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE  = '+91 22 4567 8900';
const SITE         = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
// NOTE: imageUrl must be a publicly accessible HTTPS URL.
// If your property images are hosted on your Vercel site at /images/p1.jpg etc.,
// set them here. WhatsApp fetches them directly — they must be reachable without auth.
// Recommended: host on Cloudinary, Vercel /public, or an S3 bucket.
const BUY_PROPERTIES = [
  {
    id: 'p1',
    name: 'Luxury Sea-View Penthouse',
    location: 'Mumbai, Maharashtra',
    price: '₹12.50 Cr',
    beds: 5, baths: 6,
    area: '6,500 Sq Ft',
    url: `${SITE}/property/p1`,
    imageUrl: `${SITE}/images/p1.jpg`,   // ← replace with real image URL
    tag: 'Premium',
  },
  {
    id: 'p2',
    name: 'Modern Villa in Whitefield',
    location: 'Bangalore, Karnataka',
    price: '₹4.20 Cr',
    beds: 4, baths: 4,
    area: '3,800 Sq Ft',
    url: `${SITE}/property/p2`,
    imageUrl: `${SITE}/images/p2.jpg`,
    tag: 'New',
  },
  {
    id: 'p5',
    name: 'Modern Tech Office Space',
    location: 'Hyderabad, Telangana',
    price: '₹18.00 Cr',
    beds: null, baths: null,
    area: '25,000 Sq Ft',
    url: `${SITE}/property/p5`,
    imageUrl: `${SITE}/images/p5.jpg`,
    tag: 'Commercial',
  },
  {
    id: 'p6',
    name: 'Serene Waterfront Villa',
    location: 'North Goa, Goa',
    price: '₹5.50 Cr',
    beds: 4, baths: 4,
    area: '4,200 Sq Ft',
    url: `${SITE}/property/p6`,
    imageUrl: `${SITE}/images/p6.jpg`,
    tag: 'Featured',
  },
];

const RENT_PROPERTIES = [
  {
    id: 'p3',
    name: 'Prime Commercial Space',
    location: 'New Delhi, Delhi',
    price: '₹8.50 L/mo',
    beds: null, baths: null,
    area: '2,200 Sq Ft',
    url: `${SITE}/property/p3`,
    imageUrl: `${SITE}/images/p3.jpg`,
    tag: 'Hot Deal',
  },
  {
    id: 'p4',
    name: 'Elegant Heritage Apartment',
    location: 'Kolkata, West Bengal',
    price: '₹6.80 L/mo',
    beds: 3, baths: 3,
    area: '2,500 Sq Ft',
    url: `${SITE}/property/p4`,
    imageUrl: `${SITE}/images/p4.jpg`,
    tag: 'Heritage',
  },
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
    welcomeBody:    `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nPlease select your language:`,
    mainMenuBody:   `🏠 *Webb Heads Main Menu*\n\nWhat are you looking for today?`,
    buyTitle:       `🏠 *Properties for Sale*\n\nSelect a property to view details:`,
    rentTitle:      `🏘️ *Properties for Rent*\n\nSelect a property to view details:`,
    interestedBody: `Great choice! What would you like to do?`,
    detailsPrompt:  `📋 Please share your details.\n\nEnter your *Full Name*:`,
    askPhone:       `📱 Enter your *Phone Number*:`,
    askEmail:       `📧 Enter your *Email Address*:`,
    thankYou:       `✅ *Thank you!* Our executive will contact you shortly.\n\n📞 Queries: ${AGENT_PHONE}\n🌐 Browse: ${SITE}`,
    commercial:     `🏢 *Commercial Properties*\n\nExplore our premium commercial listings:\n👉 ${SITE}/commercial`,
    sell:           `📋 *List / Sell Your Property*\n\nOur team will contact you within 24 hours!\n👉 ${SITE}/sell`,
    invalid:        `❌ Please use the buttons below to navigate.`,
    agentPrompt:    `👨‍💼 *Talk to an Agent*\n\nEnter your *Full Name*:`,
    propDetail: (p) =>
      `🏷️ *${p.name}*\n` +
      (p.tag ? `🔖 ${p.tag}\n` : '') +
      `📍 ${p.location}\n` +
      `💰 ${p.price}\n` +
      (p.beds ? `🛏️ ${p.beds} Beds  🚿 ${p.baths} Baths\n` : '') +
      `📐 ${p.area}\n` +
      `🔗 ${p.url}`,
    btnBuy:          '🏠 Buy Property',
    btnRent:         '🏘️ Rent Property',
    btnCommercial:   '🏢 Commercial',
    btnSell:         '📋 List / Sell',
    btnAgent:        '👨‍💼 Talk to Agent',
    btnInterested:   '✅ I\'m Interested',
    btnMainMenu:     '🏠 Main Menu',
    btnViewMore:     '👁️ More Options',
  },
  te: {
    welcomeBody:    `👋 *Webb Heads*కి స్వాగతం!\n\nభాష ఎంచుకోండి:`,
    mainMenuBody:   `🏠 *Webb Heads మెనూ*\n\nఏం కావాలి?`,
    buyTitle:       `🏠 *అమ్మకానికి ఉన్న ప్రాపర్టీలు*\n\nప్రాపర్టీ ఎంచుకోండి:`,
    rentTitle:      `🏘️ *అద్దెకు ఉన్న ప్రాపర్టీలు*\n\nప్రాపర్టీ ఎంచుకోండి:`,
    interestedBody: `మీకు ఏది కావాలి?`,
    detailsPrompt:  `📋 మీ వివరాలు నమోదు చేయండి.\n\n*పూర్తి పేరు*:`,
    askPhone:       `📱 *ఫోన్ నంబర్*:`,
    askEmail:       `📧 *ఇమెయిల్*:`,
    thankYou:       `✅ *ధన్యవాదాలు!* మా ఎగ్జిక్యూటివ్ త్వరలో సంప్రదిస్తారు.\n\n📞 ${AGENT_PHONE}\n🌐 ${SITE}`,
    commercial:     `🏢 *కమర్షియల్ ప్రాపర్టీలు*\n👉 ${SITE}/commercial`,
    sell:           `📋 *ప్రాపర్టీ లిస్ట్ / అమ్మండి*\n👉 ${SITE}/sell`,
    invalid:        `❌ దయచేసి బటన్లు వాడండి.`,
    agentPrompt:    `👨‍💼 *ఏజెంట్‌తో మాట్లాడండి*\n\n*పూర్తి పేరు*:`,
    propDetail: (p) =>
      `🏷️ *${p.name}*\n` +
      (p.tag ? `🔖 ${p.tag}\n` : '') +
      `📍 ${p.location}\n` +
      `💰 ${p.price}\n` +
      (p.beds ? `🛏️ ${p.beds} పడకలు  🚿 ${p.baths} బాత్‌రూమ్‌లు\n` : '') +
      `📐 ${p.area}\n` +
      `🔗 ${p.url}`,
    btnBuy:          '🏠 కొనండి',
    btnRent:         '🏘️ అద్దెకు',
    btnCommercial:   '🏢 కమర్షియల్',
    btnSell:         '📋 లిస్ట్ / అమ్మండి',
    btnAgent:        '👨‍💼 ఏజెంట్',
    btnInterested:   '✅ ఆసక్తి ఉంది',
    btnMainMenu:     '🏠 మెనూ',
    btnViewMore:     '👁️ మరిన్ని',
  },
  hi: {
    welcomeBody:    `👋 *Webb Heads* में आपका स्वागत है!\n\nभाषा चुनें:`,
    mainMenuBody:   `🏠 *Webb Heads मेनू*\n\nआप क्या ढूंढ रहे हैं?`,
    buyTitle:       `🏠 *बिक्री के लिए प्रॉपर्टी*\n\nप्रॉपर्टी चुनें:`,
    rentTitle:      `🏘️ *किराए की प्रॉपर्टी*\n\nप्रॉपर्टी चुनें:`,
    interestedBody: `आप क्या करना चाहते हैं?`,
    detailsPrompt:  `📋 अपनी जानकारी दर्ज करें।\n\n*पूरा नाम*:`,
    askPhone:       `📱 *फोन नंबर*:`,
    askEmail:       `📧 *ईमेल*:`,
    thankYou:       `✅ *धन्यवाद!* हमारे एग्जीक्यूटिव जल्द संपर्क करेंगे।\n\n📞 ${AGENT_PHONE}\n🌐 ${SITE}`,
    commercial:     `🏢 *कमर्शियल प्रॉपर्टी*\n👉 ${SITE}/commercial`,
    sell:           `📋 *प्रॉपर्टी लिस्ट / बेचें*\n👉 ${SITE}/sell`,
    invalid:        `❌ कृपया बटन का उपयोग करें।`,
    agentPrompt:    `👨‍💼 *एजेंट से बात करें*\n\n*पूरा नाम*:`,
    propDetail: (p) =>
      `🏷️ *${p.name}*\n` +
      (p.tag ? `🔖 ${p.tag}\n` : '') +
      `📍 ${p.location}\n` +
      `💰 ${p.price}\n` +
      (p.beds ? `🛏️ ${p.beds} बेड  🚿 ${p.baths} बाथ\n` : '') +
      `📐 ${p.area}\n` +
      `🔗 ${p.url}`,
    btnBuy:          '🏠 खरीदें',
    btnRent:         '🏘️ किराए पर',
    btnCommercial:   '🏢 कमर्शियल',
    btnSell:         '📋 लिस्ट / बेचें',
    btnAgent:        '👨‍💼 एजेंट',
    btnInterested:   '✅ रुचि है',
    btnMainMenu:     '🏠 मेनू',
    btnViewMore:     '👁️ और देखें',
  },
};

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;
  const res = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('WA send error:', err);
  }
}

async function sendText(to, body) {
  return sendPayload(to, { type: 'text', text: { body } });
}

// ── Up to 3 quick-reply buttons ───────────────────────────────────────────────
async function sendButtons(to, bodyText, buttons, headerText = null, footerText = null) {
  const payload = {
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
  };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
  if (footerText) payload.interactive.footer = { text: footerText };
  return sendPayload(to, payload);
}

// ── Up to 10 list rows grouped in sections ────────────────────────────────────
async function sendList(to, bodyText, buttonLabel, sections, headerText = null, footerText = null) {
  const payload = {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: { button: buttonLabel, sections },
    },
  };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
  if (footerText) payload.interactive.footer = { text: footerText };
  return sendPayload(to, payload);
}

// ── Send image message (standalone, before property detail) ───────────────────
async function sendImage(to, imageUrl, caption = '') {
  return sendPayload(to, {
    type: 'image',
    image: { link: imageUrl, caption },
  });
}

// ── Send interactive message with IMAGE header + buttons (catalog-style card) ─
// This is the WhatsApp "product card" look from your reference screenshot.
// WhatsApp renders: image on top → body text → buttons below.
async function sendPropertyCard(to, lang, property) {
  const t   = T[lang];
  const body = t.propDetail(property);

  const payload = {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type:  'image',
        image: { link: property.imageUrl },   // must be a public HTTPS URL
      },
      body: { text: body },
      footer: { text: 'Webb Heads 🏠 | Reply *hi* to restart' },
      action: {
        buttons: [
          { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested.substring(0, 20) } },
          { type: 'reply', reply: { id: 'back_menu',                  title: t.btnMainMenu.substring(0, 20)   } },
        ],
      },
    },
  };
  return sendPayload(to, payload);
}

// ─── GOOGLE SHEETS WEBHOOK ────────────────────────────────────────────────────
async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  try {
    await fetch(SHEETS_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
  } catch (err) {
    console.error('Sheets webhook error:', err);
  }
}

// ─── MENU SENDERS ─────────────────────────────────────────────────────────────

// Step 1: Language picker (3 quick-reply buttons)
function sendLanguagePicker(to) {
  return sendButtons(
    to,
    `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nPlease select your language:`,
    [
      { id: 'lang_en', title: 'English'         },
      { id: 'lang_te', title: 'తెలుగు (Telugu)'  },
      { id: 'lang_hi', title: 'हिंदी (Hindi)'    },
    ],
    'Webb Heads 🏠',
    "India's Premium Property Platform"
  );
}

// Step 2: After language chosen → show main menu as a list
function sendMainMenu(to, lang) {
  const t = T[lang];
  return sendList(
    to,
    t.mainMenuBody,
    '📋 View Options',
    [
      {
        title: 'Properties',
        rows: [
          { id: 'menu_buy',        title: t.btnBuy.substring(0, 24),        description: 'Browse properties for sale'        },
          { id: 'menu_rent',       title: t.btnRent.substring(0, 24),       description: 'Browse properties for rent'        },
          { id: 'menu_commercial', title: t.btnCommercial.substring(0, 24), description: 'Office & commercial spaces'         },
        ],
      },
      {
        title: 'More Options',
        rows: [
          { id: 'menu_sell',  title: t.btnSell.substring(0, 24),  description: 'List your property with us'           },
          { id: 'menu_agent', title: t.btnAgent.substring(0, 24), description: 'Speak with a property expert directly' },
        ],
      },
    ],
    'Webb Heads 🏠',
    'Reply *hi* anytime to restart'
  );
}

// Property listing (sendList rows)
function sendBuyProperties(to, lang) {
  const t    = T[lang];
  const rows = BUY_PROPERTIES.map((p) => ({
    id:          `buy_prop_${p.id}`,
    title:       p.name.substring(0, 24),
    description: `${p.price} · ${p.area} · ${p.location}`,
  }));
  return sendList(
    to,
    t.buyTitle,
    '🏠 View Properties',
    [{ title: 'Available Listings', rows }],
    'Buy Property',
    'Tap any property to see image & details'
  );
}

function sendRentProperties(to, lang) {
  const t    = T[lang];
  const rows = RENT_PROPERTIES.map((p) => ({
    id:          `rent_prop_${p.id}`,
    title:       p.name.substring(0, 24),
    description: `${p.price} · ${p.area} · ${p.location}`,
  }));
  return sendList(
    to,
    t.rentTitle,
    '🏘️ View Properties',
    [{ title: 'Available Listings', rows }],
    'Rent Property',
    'Tap any property to see image & details'
  );
}

function sendBackToMenu(to, lang) {
  const t = T[lang];
  return sendButtons(to, t.thankYou, [{ id: 'back_menu', title: t.btnMainMenu }]);
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg     = (text || '').toLowerCase().trim();

  // ── GLOBAL RESET ─────────────────────────────────────────────────────────────
  if (['hi', 'menu', 'start', 'hello', 'hey'].includes(msg) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    session.data = {};
    return sendLanguagePicker(from);
  }

  // ── LANGUAGE SELECTION ────────────────────────────────────────────────────────
  if (session.step === 'lang_select' || buttonId?.startsWith('lang_')) {
    const langMap = { lang_en: 'en', lang_te: 'te', lang_hi: 'hi' };
    if (buttonId && langMap[buttonId]) {
      session.lang = langMap[buttonId];
    } else if (msg === '1') { session.lang = 'en'; }
    else if  (msg === '2') { session.lang = 'te'; }
    else if  (msg === '3') { session.lang = 'hi'; }
    else                   { return sendLanguagePicker(from); }

    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  const t = T[session.lang] || T['en'];

  // ── MAIN MENU ──────────────────────────────────────────────────────────────────
  if (buttonId === 'menu_buy') {
    session.step = 'browse_buy';
    return sendBuyProperties(from, session.lang);
  }

  if (buttonId === 'menu_rent') {
    session.step = 'browse_rent';
    return sendRentProperties(from, session.lang);
  }

  if (buttonId === 'menu_commercial') {
    session.step = 'main_menu';
    await sendText(from, t.commercial);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  if (buttonId === 'menu_sell') {
    session.step = 'main_menu';
    await sendText(from, t.sell);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  if (buttonId === 'menu_agent') {
    session.step       = 'collect_name';
    session.data.intent = 'Agent';
    return sendText(from, t.agentPrompt);
  }

  // ── PROPERTY DETAIL (catalog card with image) ─────────────────────────────────
  if (buttonId?.startsWith('buy_prop_')) {
    const propId   = buttonId.replace('buy_prop_', '');
    const property = BUY_PROPERTIES.find((p) => p.id === propId);
    if (property) {
      session.step                  = 'view_property';
      session.data.selectedProperty = property;
      // Send image + detail card in one interactive message (catalog style)
      return sendPropertyCard(from, session.lang, property);
    }
  }

  if (buttonId?.startsWith('rent_prop_')) {
    const propId   = buttonId.replace('rent_prop_', '');
    const property = RENT_PROPERTIES.find((p) => p.id === propId);
    if (property) {
      session.step                  = 'view_property';
      session.data.selectedProperty = property;
      return sendPropertyCard(from, session.lang, property);
    }
  }

  // ── INTERESTED ────────────────────────────────────────────────────────────────
  if (buttonId?.startsWith('interested_')) {
    session.step        = 'collect_name';
    session.data.intent = 'Property Interest';
    return sendText(from, t.detailsPrompt);
  }

  // ── LEAD CAPTURE ──────────────────────────────────────────────────────────────
  if (session.step === 'collect_name') {
    if (!text || text.trim().length < 2) return sendText(from, t.detailsPrompt);
    session.data.name = text.trim();
    session.step      = 'collect_phone';
    return sendText(from, t.askPhone);
  }

  if (session.step === 'collect_phone') {
    // Accept digits, +, spaces, dashes — at least 7 chars
    const cleaned = text?.replace(/[\s\-]/g, '') || '';
    if (cleaned.length < 7) return sendText(from, t.askPhone);
    session.data.phone = text.trim();
    session.step       = 'collect_email';
    return sendText(from, t.askEmail);
  }

  if (session.step === 'collect_email') {
    if (!text || !text.includes('@') || !text.includes('.')) {
      return sendText(from, `❌ Please enter a valid email.\n\n${t.askEmail}`);
    }
    session.data.email = text.trim();

    // ── SAVE TO GOOGLE SHEETS ─────────────────────────────────────────────────
    await saveToSheets({
      name:     session.data.name,
      phone:    session.data.phone,
      email:    session.data.email,
      intent:   session.data.intent   || 'General',
      property: session.data.selectedProperty?.name || 'N/A',
      price:    session.data.selectedProperty?.price || 'N/A',
      location: session.data.selectedProperty?.location || 'N/A',
      whatsapp: from,
      language: session.lang,
      time:     new Date().toISOString(),
    });

    session.step = 'main_menu';
    return sendBackToMenu(from, session.lang);
  }

  // ── FALLBACK ──────────────────────────────────────────────────────────────────
  return sendButtons(from, t.invalid, [{ id: 'back_menu', title: t.btnMainMenu }]);
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body    = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return Response.json({});

  const from = message.from;

  if (message.type === 'interactive') {
    const interactive = message.interactive;
    if (interactive?.type === 'button_reply') {
      await handleMessage(from, null, interactive.button_reply.id);
      return Response.json({});
    }
    if (interactive?.type === 'list_reply') {
      await handleMessage(from, null, interactive.list_reply.id);
      return Response.json({});
    }
  }

  if (message.type === 'text') {
    const text = message.text?.body;
    if (text) await handleMessage(from, text, null);
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
