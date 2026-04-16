// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE = '+91 22 4567 8900';
const SITE = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const BUY_PROPERTIES = [
  { id: 'p1', name: 'Luxury Sea-View Penthouse',   location: 'Mumbai, Maharashtra',    price: '₹12.50 Cr',    beds: 5,    baths: 6,    area: '6,500 Sq Ft',  url: `${SITE}/property/p1` },
  { id: 'p2', name: 'Modern Villa in Whitefield',  location: 'Bangalore, Karnataka',   price: '₹4.20 Cr',     beds: 4,    baths: 4,    area: '3,800 Sq Ft',  url: `${SITE}/property/p2` },
  { id: 'p5', name: 'Modern Tech Office Space',    location: 'Hyderabad, Telangana',   price: '₹18.00 Cr',    beds: null, baths: null, area: '25,000 Sq Ft', url: `${SITE}/property/p5` },
  { id: 'p6', name: 'Serene Waterfront Villa',     location: 'North Goa, Goa',         price: '₹5.50 Cr',     beds: 4,    baths: 4,    area: '4,200 Sq Ft',  url: `${SITE}/property/p6` },
];

const RENT_PROPERTIES = [
  { id: 'p3', name: 'Prime Commercial Space',      location: 'New Delhi, Delhi',       price: '₹8.50 Cr/mo',  beds: null, baths: null, area: '2,200 Sq Ft',  url: `${SITE}/property/p3` },
  { id: 'p4', name: 'Elegant Heritage Apartment',  location: 'Kolkata, West Bengal',   price: '₹6.80 Cr/mo',  beds: 3,    baths: 3,    area: '2,500 Sq Ft',  url: `${SITE}/property/p4` },
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
    welcomeBody:      `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nPlease select your language:`,
    mainMenuBody:     `🏠 *Webb Heads Main Menu*\n\nWhat are you looking for today?`,
    buyTitle:         `🏠 Properties for Sale`,
    rentTitle:        `🏘️ Properties for Rent`,
    interestedBody:   `Great choice! What would you like to do?`,
    detailsPrompt:    `📋 Please share your details.\n\nEnter your *Full Name*:`,
    askPhone:         `📱 Enter your *Phone Number*:`,
    askEmail:         `📧 Enter your *Email Address*:`,
    thankYou:         `✅ *Thank you!* Our executive will contact you shortly.\n\n📞 For queries call: ${AGENT_PHONE}\n🌐 Browse: ${SITE}`,
    commercial:       `🏢 *Commercial Properties*\n\nExplore our premium commercial listings:\n👉 ${SITE}/commercial`,
    sell:             `📋 *List / Sell Your Property*\n\nOur team will contact you within 24 hours!\n👉 ${SITE}/sell`,
    invalid:          `❌ Please use the buttons below to navigate.`,
    prop:             (p) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${p.beds ? `\n🛏️ ${p.beds} Beds  🚿 ${p.baths} Baths` : ''}\n📐 ${p.area}\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *Talk to an Agent*\n\nEnter your *Full Name*:`,
    btnEnglish:       'English',
    btnTelugu:        'తెలుగు',
    btnHindi:         'हिंदी',
    btnBuy:           '🏠 Buy Property',
    btnRent:          '🏘️ Rent Property',
    btnCommercial:    '🏢 Commercial',
    btnSell:          '📋 List / Sell',
    btnAgent:         '👨‍💼 Talk to Agent',
    btnInterested:    '✅ I\'m Interested',
    btnMainMenu:      '🏠 Main Menu',
    btnBuyInterest:   '🏠 Buy',
    btnRentInterest:  '🏘️ Rent',
  },
  te: {
    welcomeBody:      `👋 *Webb Heads*కి స్వాగతం!\n\nభాష ఎంచుకోండి:`,
    mainMenuBody:     `🏠 *Webb Heads మెనూ*\n\nఏం కావాలి?`,
    buyTitle:         `🏠 అమ్మకానికి ఉన్న ప్రాపర్టీలు`,
    rentTitle:        `🏘️ అద్దెకు ఉన్న ప్రాపర్టీలు`,
    interestedBody:   `మీకు ఏది కావాలి?`,
    detailsPrompt:    `📋 మీ వివరాలు నమోదు చేయండి.\n\n*పూర్తి పేరు* నమోదు చేయండి:`,
    askPhone:         `📱 *ఫోన్ నంబర్* నమోదు చేయండి:`,
    askEmail:         `📧 *ఇమెయిల్* నమోదు చేయండి:`,
    thankYou:         `✅ *ధన్యవాదాలు!* మా ఎగ్జిక్యూటివ్ త్వరలో సంప్రదిస్తారు.\n\n📞 సందేహాలకు: ${AGENT_PHONE}\n🌐 చూడండి: ${SITE}`,
    commercial:       `🏢 *కమర్షియల్ ప్రాపర్టీలు*\n👉 ${SITE}/commercial`,
    sell:             `📋 *ప్రాపర్టీ లిస్ట్ / అమ్మండి*\n👉 ${SITE}/sell`,
    invalid:          `❌ దయచేసి బటన్లు వాడండి.`,
    prop:             (p) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${p.beds ? `\n🛏️ ${p.beds} పడకలు  🚿 ${p.baths} బాత్‌రూమ్‌లు` : ''}\n📐 ${p.area}\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *ఏజెంట్‌తో మాట్లాడండి*\n\n*పూర్తి పేరు* నమోదు చేయండి:`,
    btnEnglish:       'English',
    btnTelugu:        'తెలుగు',
    btnHindi:         'हिंदी',
    btnBuy:           '🏠 కొనండి',
    btnRent:          '🏘️ అద్దెకు',
    btnCommercial:    '🏢 కమర్షియల్',
    btnSell:          '📋 లిస్ట్ / అమ్మండి',
    btnAgent:         '👨‍💼 ఏజెంట్',
    btnInterested:    '✅ ఆసక్తి ఉంది',
    btnMainMenu:      '🏠 మెనూ',
    btnBuyInterest:   '🏠 కొనాలి',
    btnRentInterest:  '🏘️ అద్దెకు',
  },
  hi: {
    welcomeBody:      `👋 *Webb Heads* में आपका स्वागत है!\n\nभाषा चुनें:`,
    mainMenuBody:     `🏠 *Webb Heads मेनू*\n\nआप क्या ढूंढ रहे हैं?`,
    buyTitle:         `🏠 बिक्री के लिए प्रॉपर्टी`,
    rentTitle:        `🏘️ किराए की प्रॉपर्टी`,
    interestedBody:   `आप क्या करना चाहते हैं?`,
    detailsPrompt:    `📋 अपनी जानकारी दर्ज करें।\n\n*पूरा नाम* दर्ज करें:`,
    askPhone:         `📱 *फोन नंबर* दर्ज करें:`,
    askEmail:         `📧 *ईमेल* दर्ज करें:`,
    thankYou:         `✅ *धन्यवाद!* हमारे एग्जीक्यूटिव जल्द संपर्क करेंगे।\n\n📞 प्रश्नों के लिए: ${AGENT_PHONE}\n🌐 देखें: ${SITE}`,
    commercial:       `🏢 *कमर्शियल प्रॉपर्टी*\n👉 ${SITE}/commercial`,
    sell:             `📋 *प्रॉपर्टी लिस्ट / बेचें*\n👉 ${SITE}/sell`,
    invalid:          `❌ कृपया बटन का उपयोग करें।`,
    prop:             (p) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${p.beds ? `\n🛏️ ${p.beds} बेड  🚿 ${p.baths} बाथ` : ''}\n📐 ${p.area}\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *एजेंट से बात करें*\n\n*पूरा नाम* दर्ज करें:`,
    btnEnglish:       'English',
    btnTelugu:        'తెలుగు',
    btnHindi:         'हिंदी',
    btnBuy:           '🏠 खरीदें',
    btnRent:          '🏘️ किराए पर',
    btnCommercial:    '🏢 कमर्शियल',
    btnSell:          '📋 लिस्ट / बेचें',
    btnAgent:         '👨‍💼 एजेंट',
    btnInterested:    '✅ रुचि है',
    btnMainMenu:      '🏠 मेनू',
    btnBuyInterest:   '🏠 खरीदना',
    btnRentInterest:  '🏘️ किराए पर',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
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

/**
 * Send up to 3 quick-reply buttons.
 * buttons = [{ id: 'btn_id', title: 'Label' }, ...]
 */
async function sendButtons(to, bodyText, buttons, headerText = null, footerText = null) {
  const payload = {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.map((b) => ({
          type: 'reply',
          reply: { id: b.id, title: b.title.substring(0, 20) }, // WhatsApp max 20 chars
        })),
      },
    },
  };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
  if (footerText) payload.interactive.footer = { text: footerText };
  return sendPayload(to, payload);
}

/**
 * Send a list menu (up to 10 items, grouped in sections).
 * sections = [{ title: 'Section', rows: [{ id, title, description }] }]
 */
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

async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  await fetch(SHEETS_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ─── INTERACTIVE MESSAGE SENDERS ─────────────────────────────────────────────

function sendLanguagePicker(to) {
  return sendButtons(
    to,
    `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nPlease select your language:`,
    [
      { id: 'lang_en', title: 'English' },
      { id: 'lang_te', title: 'తెలుగు (Telugu)' },
      { id: 'lang_hi', title: 'हिंदी (Hindi)' },
    ],
    'Webb Heads 🏠',
    'India\'s Premium Property Platform'
  );
}

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
          { id: 'menu_buy',        title: t.btnBuy,        description: 'Browse properties available for purchase' },
          { id: 'menu_rent',       title: t.btnRent,       description: 'Browse properties available for rent' },
          { id: 'menu_commercial', title: t.btnCommercial, description: 'Office spaces & commercial properties' },
        ],
      },
      {
        title: 'More Options',
        rows: [
          { id: 'menu_sell',  title: t.btnSell,  description: 'List your property with us' },
          { id: 'menu_agent', title: t.btnAgent, description: 'Speak directly with our property experts' },
        ],
      },
    ],
    'Webb Heads 🏠',
    'Reply *hi* anytime to restart'
  );
}

function sendBuyProperties(to, lang) {
  const t = T[lang];
  const rows = BUY_PROPERTIES.map((p) => ({
    id: `buy_prop_${p.id}`,
    title: p.name.substring(0, 24),
    description: `${p.price} | ${p.area} | ${p.location}`,
  }));
  return sendList(
    to,
    t.buyTitle,
    '🏠 View Properties',
    [{ title: 'Available Listings', rows }],
    'Buy Property'
  );
}

function sendRentProperties(to, lang) {
  const t = T[lang];
  const rows = RENT_PROPERTIES.map((p) => ({
    id: `rent_prop_${p.id}`,
    title: p.name.substring(0, 24),
    description: `${p.price} | ${p.area} | ${p.location}`,
  }));
  return sendList(
    to,
    t.rentTitle,
    '🏘️ View Properties',
    [{ title: 'Available Listings', rows }],
    'Rent Property'
  );
}

function sendPropertyDetail(to, lang, property) {
  const t = T[lang];
  return sendButtons(
    to,
    t.prop(property),
    [
      { id: `interested_${property.id}`, title: t.btnInterested },
      { id: 'back_menu',                 title: t.btnMainMenu   },
    ]
  );
}

function sendInterestedOptions(to, lang) {
  const t = T[lang];
  return sendButtons(
    to,
    t.interestedBody,
    [
      { id: 'interest_buy',  title: t.btnBuyInterest  },
      { id: 'interest_rent', title: t.btnRentInterest },
    ]
  );
}

function sendBackToMenu(to, lang) {
  const t = T[lang];
  return sendButtons(
    to,
    t.thankYou,
    [{ id: 'back_menu', title: t.btnMainMenu }]
  );
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg = (text || '').toLowerCase().trim();
  const t = T[session.lang] || T['en'];

  // ── GLOBAL RESET ────────────────────────────────────────────────────────────
  if (['hi', 'menu', 'start'].includes(msg) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    session.data = {};
    return sendLanguagePicker(from);
  }

  // ── LANGUAGE SELECTION ───────────────────────────────────────────────────────
  if (session.step === 'lang_select' || buttonId?.startsWith('lang_')) {
    const langMap = { lang_en: 'en', lang_te: 'te', lang_hi: 'hi' };
    if (buttonId && langMap[buttonId]) {
      session.lang = langMap[buttonId];
    } else if (msg === '1') { session.lang = 'en'; }
    else if (msg === '2')   { session.lang = 'te'; }
    else if (msg === '3')   { session.lang = 'hi'; }
    else {
      return sendLanguagePicker(from); // re-prompt if invalid
    }
    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  // ── MAIN MENU SELECTIONS ────────────────────────────────────────────────────
  if (buttonId === 'menu_buy' || (session.step === 'main_menu' && msg === '1')) {
    session.step = 'browse_buy';
    return sendBuyProperties(from, session.lang);
  }

  if (buttonId === 'menu_rent' || (session.step === 'main_menu' && msg === '2')) {
    session.step = 'browse_rent';
    return sendRentProperties(from, session.lang);
  }

  if (buttonId === 'menu_commercial' || (session.step === 'main_menu' && msg === '3')) {
    session.step = 'main_menu';
    await sendText(from, T[session.lang].commercial);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: T[session.lang].btnMainMenu }]);
  }

  if (buttonId === 'menu_sell' || (session.step === 'main_menu' && msg === '4')) {
    session.step = 'main_menu';
    await sendText(from, T[session.lang].sell);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: T[session.lang].btnMainMenu }]);
  }

  if (buttonId === 'menu_agent' || (session.step === 'main_menu' && msg === '5')) {
    session.step = 'collect_name';
    session.data.intent = 'Agent';
    return sendText(from, T[session.lang].agentPrompt);
  }

  // ── PROPERTY DETAIL VIEW ────────────────────────────────────────────────────
  if (buttonId?.startsWith('buy_prop_')) {
    const propId = buttonId.replace('buy_prop_', '');
    const property = BUY_PROPERTIES.find((p) => p.id === propId);
    if (property) {
      session.step = 'view_property';
      session.data.selectedProperty = property;
      return sendPropertyDetail(from, session.lang, property);
    }
  }

  if (buttonId?.startsWith('rent_prop_')) {
    const propId = buttonId.replace('rent_prop_', '');
    const property = RENT_PROPERTIES.find((p) => p.id === propId);
    if (property) {
      session.step = 'view_property';
      session.data.selectedProperty = property;
      return sendPropertyDetail(from, session.lang, property);
    }
  }

  // ── INTERESTED IN A SPECIFIC PROPERTY ───────────────────────────────────────
  if (buttonId?.startsWith('interested_')) {
    session.step = 'collect_name';
    session.data.intent = 'Property Interest';
    return sendText(from, T[session.lang].detailsPrompt);
  }

  // ── GENERAL INTEREST (from list browse) ─────────────────────────────────────
  if (buttonId === 'interest_buy' || buttonId === 'interest_rent') {
    session.data.intent = buttonId === 'interest_buy' ? 'Buy' : 'Rent';
    session.step = 'collect_name';
    return sendText(from, T[session.lang].detailsPrompt);
  }

  // ── LEAD CAPTURE FLOW ────────────────────────────────────────────────────────
  if (session.step === 'collect_name') {
    if (!text || text.trim().length < 2) {
      return sendText(from, T[session.lang].detailsPrompt);
    }
    session.data.name = text.trim();
    session.step = 'collect_phone';
    return sendText(from, T[session.lang].askPhone);
  }

  if (session.step === 'collect_phone') {
    if (!text || text.trim().length < 7) {
      return sendText(from, T[session.lang].askPhone);
    }
    session.data.phone = text.trim();
    session.step = 'collect_email';
    return sendText(from, T[session.lang].askEmail);
  }

  if (session.step === 'collect_email') {
    if (!text || !text.includes('@')) {
      return sendText(from, `❌ Please enter a valid email address.\n\n${T[session.lang].askEmail}`);
    }
    session.data.email = text.trim();

    await saveToSheets({
      name:      session.data.name,
      phone:     session.data.phone,
      email:     session.data.email,
      intent:    session.data.intent || 'General',
      property:  session.data.selectedProperty?.name || 'N/A',
      whatsapp:  from,
      language:  session.lang,
      time:      new Date().toISOString(),
    });

    session.step = 'main_menu';
    return sendBackToMenu(from, session.lang);
  }

  // ── FALLBACK ─────────────────────────────────────────────────────────────────
  return sendButtons(
    from,
    T[session.lang].invalid,
    [{ id: 'back_menu', title: T[session.lang].btnMainMenu }]
  );
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return Response.json({});

  const from = message.from;

  // Handle interactive button/list replies
  if (message.type === 'interactive') {
    const interactive = message.interactive;

    // Button reply
    if (interactive?.type === 'button_reply') {
      const buttonId = interactive.button_reply.id;
      await handleMessage(from, null, buttonId);
      return Response.json({});
    }

    // List reply
    if (interactive?.type === 'list_reply') {
      const buttonId = interactive.list_reply.id;
      await handleMessage(from, null, buttonId);
      return Response.json({});
    }
  }

  // Handle plain text messages (for name/phone/email input steps + hi/menu/start)
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
