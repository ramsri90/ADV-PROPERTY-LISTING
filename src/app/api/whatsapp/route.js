// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE = '+91 22 4567 8900';
const SITE = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
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
    image: `${SITE}/images/p1.jpg`,
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
    image: `${SITE}/images/p2.jpg`,
  },
  {
    id: 'p5',
    name: 'Modern Tech Office Space',
    location: 'Hyderabad, Telangana',
    price: '₹18.00 Cr',
    beds: null,
    baths: null,
    area: '25,000 Sq Ft',
    url: `${SITE}/property/p5`,
    image: `${SITE}/images/p5.jpg`,
  },
  {
    id: 'p6',
    name: 'Serene Waterfront Villa',
    location: 'North Goa, Goa',
    price: '₹5.50 Cr',
    beds: 4,
    baths: 4,
    area: '4,200 Sq Ft',
    url: `${SITE}/property/p6`,
    image: `${SITE}/images/p6.jpg`,
  },
];

const RENT_PROPERTIES = [
  {
    id: 'p3',
    name: 'Prime Commercial Space',
    location: 'New Delhi, Delhi',
    price: '₹8.50 L/mo',
    beds: null,
    baths: null,
    area: '2,200 Sq Ft',
    url: `${SITE}/property/p3`,
    image: `${SITE}/images/p3.jpg`,
  },
  {
    id: 'p4',
    name: 'Elegant Heritage Apartment',
    location: 'Kolkata, West Bengal',
    price: '₹6.80 L/mo',
    beds: 3,
    baths: 3,
    area: '2,500 Sq Ft',
    url: `${SITE}/property/p4`,
    image: `${SITE}/images/p4.jpg`,
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
    welcomeBody:      `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nPlease select your language:`,
    mainMenuBody:     `🏠 *Webb Heads Main Menu*\n\nWhat are you looking for today?`,
    moreOptionsBody:  `➕ *More Options*\n\nChoose an option below:`,
    buyTitle:         `🏠 *Properties for Sale*\n\nHere are our latest listings:`,
    rentTitle:        `🏘️ *Properties for Rent*\n\nHere are our latest listings:`,
    interestedBody:   `Great choice! What would you like to do?`,
    detailsPrompt:    `📋 Please share your details.\n\nEnter your *Full Name*:`,
    askPhone:         `📱 Enter your *Phone Number*:`,
    askEmail:         `📧 Enter your *Email Address*:`,
    thankYou:         `✅ *Thank you!* Our executive will contact you shortly.\n\n📞 For queries call: ${AGENT_PHONE}\n🌐 Browse: ${SITE}`,
    commercial:       `🏢 *Commercial Properties*\n\nExplore our premium commercial listings:\n👉 ${SITE}/commercial`,
    sell:             `📋 *List / Sell Your Property*\n\nOur team will contact you within 24 hours!\n👉 ${SITE}/sell`,
    website:          `🌐 *Visit our Website*\n\nBrowse all listings at:\n👉 ${SITE}`,
    invalid:          `❌ Please use the buttons below to navigate.`,
    propDetail:       (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `\n🛏️ ${p.beds} Beds  🚿 ${p.baths} Baths` : ''
      }\n📐 ${p.area}\n🔗 ${p.url}`,
    propCard:         (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}  📐 ${p.area}`,
    agentPrompt:      `👨‍💼 *Talk to an Agent*\n\nEnter your *Full Name*:`,
    btnEnglish:       'English',
    btnTelugu:        'తెలుగు',
    btnHindi:         'हिंदी',
    btnBuy:           '🏠 Buy',
    btnRent:          '🏘️ Rent',
    btnCommercial:    '🏢 Commercial',
    btnMore:          '➕ More Options',
    btnAgent:         '🧑‍💼 Talk to an Agent',
    btnSell:          '📋 List / Sell Property',
    btnWebsite:       '🌐 Visit Website',
    btnInterested:    '✅ Interested',
    btnMainMenu:      '🏠 Main Menu',
    btnBuyInterest:   '🏠 Buy',
    btnRentInterest:  '🏘️ Rent',
    bedLabel:         'Beds',
    bathLabel:        'Baths',
  },
  te: {
    welcomeBody:      `👋 *Webb Heads*కి స్వాగతం!\n\nభాష ఎంచుకోండి:`,
    mainMenuBody:     `🏠 *Webb Heads మెనూ*\n\nఏం కావాలి?`,
    moreOptionsBody:  `➕ *మరిన్ని ఎంపికలు*\n\nదిగువ ఒక ఎంపిక చేయండి:`,
    buyTitle:         `🏠 *అమ్మకానికి ఉన్న ప్రాపర్టీలు*\n\nమా తాజా లిస్టింగ్‌లు:`,
    rentTitle:        `🏘️ *అద్దెకు ఉన్న ప్రాపర్టీలు*\n\nమా తాజా లిస్టింగ్‌లు:`,
    interestedBody:   `మీకు ఏది కావాలి?`,
    detailsPrompt:    `📋 మీ వివరాలు నమోదు చేయండి.\n\n*పూర్తి పేరు* నమోదు చేయండి:`,
    askPhone:         `📱 *ఫోన్ నంబర్* నమోదు చేయండి:`,
    askEmail:         `📧 *ఇమెయిల్* నమోదు చేయండి:`,
    thankYou:         `✅ *ధన్యవాదాలు!* మా ఎగ్జిక్యూటివ్ త్వరలో సంప్రదిస్తారు.\n\n📞 సందేహాలకు: ${AGENT_PHONE}\n🌐 చూడండి: ${SITE}`,
    commercial:       `🏢 *కమర్షియల్ ప్రాపర్టీలు*\n👉 ${SITE}/commercial`,
    sell:             `📋 *ప్రాపర్టీ లిస్ట్ / అమ్మండి*\n👉 ${SITE}/sell`,
    website:          `🌐 *మా వెబ్‌సైట్ సందర్శించండి*\n👉 ${SITE}`,
    invalid:          `❌ దయచేసి బటన్లు వాడండి.`,
    propDetail:       (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `\n🛏️ ${p.beds} పడకలు  🚿 ${p.baths} బాత్‌రూమ్‌లు` : ''
      }\n📐 ${p.area}\n🔗 ${p.url}`,
    propCard:         (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}  📐 ${p.area}`,
    agentPrompt:      `👨‍💼 *ఏజెంట్‌తో మాట్లాడండి*\n\n*పూర్తి పేరు* నమోదు చేయండి:`,
    btnEnglish:       'English',
    btnTelugu:        'తెలుగు',
    btnHindi:         'हिंदी',
    btnBuy:           '🏠 కొనండి',
    btnRent:          '🏘️ అద్దెకు',
    btnCommercial:    '🏢 కమర్షియల్',
    btnMore:          '➕ మరిన్ని',
    btnAgent:         '🧑‍💼 ఏజెంట్',
    btnSell:          '📋 లిస్ట్ / అమ్మండి',
    btnWebsite:       '🌐 వెబ్‌సైట్',
    btnInterested:    '✅ ఆసక్తి ఉంది',
    btnMainMenu:      '🏠 మెనూ',
    btnBuyInterest:   '🏠 కొనాలి',
    btnRentInterest:  '🏘️ అద్దెకు',
    bedLabel:         'పడకలు',
    bathLabel:        'బాత్‌రూమ్‌లు',
  },
  hi: {
    welcomeBody:      `👋 *Webb Heads* में आपका स्वागत है!\n\nभाषा चुनें:`,
    mainMenuBody:     `🏠 *Webb Heads मेनू*\n\nआप क्या ढूंढ रहे हैं?`,
    moreOptionsBody:  `➕ *और विकल्प*\n\nनीचे से चुनें:`,
    buyTitle:         `🏠 *बिक्री के लिए प्रॉपर्टी*\n\nहमारी नई लिस्टिंग:`,
    rentTitle:        `🏘️ *किराए की प्रॉपर्टी*\n\nहमारी नई लिस्टिंग:`,
    interestedBody:   `आप क्या करना चाहते हैं?`,
    detailsPrompt:    `📋 अपनी जानकारी दर्ज करें।\n\n*पूरा नाम* दर्ज करें:`,
    askPhone:         `📱 *फोन नंबर* दर्ज करें:`,
    askEmail:         `📧 *ईमेल* दर्ज करें:`,
    thankYou:         `✅ *धन्यवाद!* हमारे एग्जीक्यूटिव जल्द संपर्क करेंगे।\n\n📞 प्रश्नों के लिए: ${AGENT_PHONE}\n🌐 देखें: ${SITE}`,
    commercial:       `🏢 *कमर्शियल प्रॉपर्टी*\n👉 ${SITE}/commercial`,
    sell:             `📋 *प्रॉपर्टी लिस्ट / बेचें*\n👉 ${SITE}/sell`,
    website:          `🌐 *हमारी वेबसाइट देखें*\n👉 ${SITE}`,
    invalid:          `❌ कृपया बटन का उपयोग करें।`,
    propDetail:       (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `\n🛏️ ${p.beds} बेड  🚿 ${p.baths} बाथ` : ''
      }\n📐 ${p.area}\n🔗 ${p.url}`,
    propCard:         (p) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}  📐 ${p.area}`,
    agentPrompt:      `👨‍💼 *एजेंट से बात करें*\n\n*पूरा नाम* दर्ज करें:`,
    btnEnglish:       'English',
    btnTelugu:        'తెలుగు',
    btnHindi:         'हिंदी',
    btnBuy:           '🏠 खरीदें',
    btnRent:          '🏘️ किराए पर',
    btnCommercial:    '🏢 कमर्शियल',
    btnMore:          '➕ और विकल्प',
    btnAgent:         '🧑‍💼 एजेंट',
    btnSell:          '📋 लिस्ट / बेचें',
    btnWebsite:       '🌐 वेबसाइट',
    btnInterested:    '✅ रुचि है',
    btnMainMenu:      '🏠 मेनू',
    btnBuyInterest:   '🏠 खरीदना',
    btnRentInterest:  '🏘️ किराए पर',
    bedLabel:         'बेड',
    bathLabel:        'बाथ',
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
          reply: { id: b.id, title: b.title.substring(0, 20) },
        })),
      },
    },
  };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
  if (footerText) payload.interactive.footer = { text: footerText };
  return sendPayload(to, payload);
}

/**
 * Send a property card: image header + body text + Prev | Interested | Next buttons.
 * WhatsApp interactive message with image header supports up to 3 buttons.
 */
async function sendPropertyCard(to, lang, property) {
  const t = T[lang];

  // 🔥 fallback image if missing
  const imageUrl = property.image || `${SITE}/images/default.jpg`;

  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: { link: imageUrl },
      },
      body: { text: t.propCard(property) },
      footer: { text: property.area },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: { id: `prev_${property.id}`, title: '⬅️ Prev' },
          },
          {
            type: 'reply',
            reply: {
              id: `interested_${property.id}`,
              title: t.btnInterested.substring(0, 20),
            },
          },
          {
            type: 'reply',
            reply: { id: `next_${property.id}`, title: 'Next ➡️' },
          },
        ],
      },
    },
  });
}
/**
 * Send a list menu (up to 10 items, grouped in sections).
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
    "India's Premium Property Platform"
  );
}

/**
 * Main menu: 3 top-level buttons (Buy, Rent, Commercial) + More Options.
 * WhatsApp buttons are capped at 3, so "More Options" is the 3rd slot only
 * when Commercial is omitted — instead we use a list menu to fit all 4 options.
 */
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
          { id: 'menu_more', title: t.btnMore, description: 'Agent, list property, visit website' },
        ],
      },
    ],
    'Webb Heads 🏠',
    'Reply *hi* anytime to restart'
  );
}

/**
 * More Options sub-menu (shown when user taps ➕ More Options).
 * Uses 3-button interactive since we have exactly 3 items.
 */
function sendMoreOptions(to, lang) {
  const t = T[lang];
  return sendButtons(
    to,
    t.moreOptionsBody,
    [
      { id: 'menu_agent',   title: t.btnAgent   },
      { id: 'menu_sell',    title: t.btnSell    },
      { id: 'menu_website', title: t.btnWebsite },
    ],
    'Webb Heads 🏠'
  );
}

/**
 * Send first buy property card (slider mode).
 */
async function sendBuyProperties(to, lang, session) {
  const t = T[lang];

  session.data.currentList = BUY_PROPERTIES;
  session.data.currentIndex = 0;

  await sendText(to, t.buyTitle);
  return sendPropertyCard(to, lang, BUY_PROPERTIES[0]);
}

/**
 * Send first rent property card (slider mode).
 */
async function sendRentProperties(to, lang, session) {
  const t = T[lang];

  session.data.currentList = RENT_PROPERTIES;
  session.data.currentIndex = 0;

  await sendText(to, t.rentTitle);
  return sendPropertyCard(to, lang, RENT_PROPERTIES[0]);
}

/**
 * Send full property detail + Confirm | Main Menu buttons.
 */
function sendPropertyDetail(to, lang, property) {
  const t = T[lang];
  return sendButtons(
    to,
    t.propDetail(property),
    [
      { id: `confirm_${property.id}`, title: t.btnInterested },
      { id: 'back_menu',              title: t.btnMainMenu   },
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
      return sendLanguagePicker(from);
    }
    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  const t = T[session.lang] || T['en'];

  // ── MAIN MENU SELECTIONS ────────────────────────────────────────────────────
  if (buttonId === 'menu_buy') {
    session.step = 'browse_buy';
    return sendBuyProperties(from, session.lang, session);
  }

  if (buttonId === 'menu_rent') {
    session.step = 'browse_rent';
    return sendRentProperties(from, session.lang, session);
  }

  if (buttonId === 'menu_commercial') {
    session.step = 'main_menu';
    await sendText(from, t.commercial);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  // ── MORE OPTIONS SUB-MENU ───────────────────────────────────────────────────
  if (buttonId === 'menu_more') {
    session.step = 'more_options';
    return sendMoreOptions(from, session.lang);
  }

  if (buttonId === 'menu_agent') {
    session.step = 'collect_name';
    session.data.intent = 'Agent';
    return sendText(from, t.agentPrompt);
  }

  if (buttonId === 'menu_sell') {
    session.step = 'main_menu';
    await sendText(from, t.sell);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  if (buttonId === 'menu_website') {
    session.step = 'main_menu';
    await sendText(from, t.website);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  // ── SLIDER NAVIGATION (Prev / Next) ─────────────────────────────────────────
  if (buttonId?.startsWith('next_') || buttonId?.startsWith('prev_')) {
    const list = session.data.currentList;
    let index = session.data.currentIndex;

    if (buttonId.startsWith('next_')) {
      index = (index + 1) % list.length;
    } else {
      index = (index - 1 + list.length) % list.length;
    }

    session.data.currentIndex = index;

    return sendPropertyCard(from, session.lang, list[index]);
  }

  // ── INTERESTED IN A SPECIFIC PROPERTY ───────────────────────────────────────
  // Tapped "Interested" on a property card → show full detail first, then collect lead
  if (buttonId?.startsWith('interested_')) {
    const propId = buttonId.replace('interested_', '');
    const property =
      BUY_PROPERTIES.find((p) => p.id === propId) ||
      RENT_PROPERTIES.find((p) => p.id === propId);

    if (property) {
      session.data.selectedProperty = property;
      session.data.intent = 'Property Interest';
      // Send the detailed card first
      await sendPropertyDetail(from, session.lang, property);
      // Wait for confirm button before collecting details
      session.step = 'confirm_interest';
      return;
    }
  }

  // ── CONFIRM INTEREST (2nd click → start lead capture) ───────────────────────
  if (buttonId?.startsWith('confirm_')) {
    session.step = 'collect_name';
    return sendText(from, t.detailsPrompt);
  }

  // ── LEAD CAPTURE FLOW ────────────────────────────────────────────────────────
  if (session.step === 'collect_name') {
    if (!text || text.trim().length < 2) {
      return sendText(from, t.detailsPrompt);
    }
    session.data.name = text.trim();
    session.step = 'collect_phone';
    return sendText(from, t.askPhone);
  }

  if (session.step === 'collect_phone') {
    if (!text || text.trim().length < 7) {
      return sendText(from, t.askPhone);
    }
    session.data.phone = text.trim();
    session.step = 'collect_email';
    return sendText(from, t.askEmail);
  }

  if (session.step === 'collect_email') {
    if (!text || !text.includes('@')) {
      return sendText(from, `❌ Please enter a valid email address.\n\n${t.askEmail}`);
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
    t.invalid,
    [{ id: 'back_menu', title: t.btnMainMenu }]
  );
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
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
