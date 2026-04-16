// ─── CONFIG ───────────────────────────────────────────────────────────────────
const VERIFY_TOKEN   = 'webbheads_webhook_token';
const AGENT_PHONE    = '+91 22 4567 8900';
const SITE           = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const BUY_PROPERTIES = [
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
];

const RENT_PROPERTIES = [
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

const COMMERCIAL_PROPERTIES = [
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
    buyTitle:         `🏠 *Properties for Sale*\n\nSwipe through our latest listings ⬅️ ➡️`,
    rentTitle:        `🏘️ *Properties for Rent*\n\nSwipe through our latest listings ⬅️ ➡️`,
    commercialTitle:  `🏢 *Commercial Properties*\n\nSwipe through our listings ⬅️ ➡️`,
    interestedBody:   `Great choice! What would you like to do?`,
    askPhone:         `📱 Please enter your *WhatsApp number* so our executive can reach you:`,
    thankYou:         (name) => `✅ *Thank you${name ? ', ' + name : ''}!* Our executive will contact you shortly.\n\n📞 Direct queries: ${AGENT_PHONE}\n🌐 Browse all listings: ${SITE}`,
    sell:             `📋 *List / Sell Your Property*\n\nOur team will contact you within 24 hours!\n👉 ${SITE}/sell`,
    website:          `🌐 *Visit our Website*\n\nBrowse all listings at:\n👉 ${SITE}`,
    invalid:          `❌ Please use the buttons below to navigate.`,
    propCard:         (p, idx, total) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `  🛏️ ${p.beds}bd/${p.baths}ba` : ''
      }\n📐 ${p.area}\n\n📊 ${idx + 1} of ${total}`,
    propDetail:       (p) =>
      `🏷️ *${p.name}*\n\n📍 *Location:* ${p.location}\n💰 *Price:* ${p.price}\n📐 *Area:* ${p.area}${
        p.beds ? `\n🛏️ *Beds:* ${p.beds}  🚿 *Baths:* ${p.baths}` : ''
      }\n🏗️ *Type:* ${p.type}\n\n📝 ${p.desc}\n\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *Talk to an Agent*\n\nPlease enter your *name*:`,
    agentAskPhone:    `📱 Enter your *WhatsApp number*:`,
    agentThankYou:    (name) => `✅ *Hi ${name}!* An agent will call you shortly.\n\n📞 Or call us directly: ${AGENT_PHONE}`,
    btnBuy:           '🏠 Buy',
    btnRent:          '🏘️ Rent',
    btnCommercial:    '🏢 Commercial',
    btnMore:          '➕ More',
    btnAgent:         '🧑‍💼 Talk to Agent',
    btnSell:          '📋 List Property',
    btnWebsite:       '🌐 Visit Website',
    btnInterested:    '✅ Interested',
    btnMainMenu:      '🏠 Main Menu',
    btnViewDetails:   '📋 View Details',
    btnConfirm:       '✅ Yes, Contact Me',
  },
  te: {
    welcomeBody:      `👋 *Webb Heads*కి స్వాగతం – భారత్ యొక్క ప్రీమియం ప్రాపర్టీ ప్లాట్‌ఫారమ్!\n\nభాష ఎంచుకోండి:`,
    mainMenuBody:     `🏠 *Webb Heads మెనూ*\n\nఏం కావాలి?`,
    moreOptionsBody:  `➕ *మరిన్ని ఎంపికలు*\n\nదిగువ ఒక ఎంపిక చేయండి:`,
    buyTitle:         `🏠 *అమ్మకానికి ఉన్న ప్రాపర్టీలు*\n\nమా తాజా లిస్టింగ్‌లు చూడండి ⬅️ ➡️`,
    rentTitle:        `🏘️ *అద్దెకు ఉన్న ప్రాపర్టీలు*\n\nమా తాజా లిస్టింగ్‌లు చూడండి ⬅️ ➡️`,
    commercialTitle:  `🏢 *కమర్షియల్ ప్రాపర్టీలు*\n\nమా లిస్టింగ్‌లు చూడండి ⬅️ ➡️`,
    interestedBody:   `మీకు ఏది కావాలి?`,
    askPhone:         `📱 మీ *WhatsApp నంబర్* నమోదు చేయండి:`,
    thankYou:         (name) => `✅ *ధన్యవాదాలు${name ? ', ' + name : ''}!* మా ఎగ్జిక్యూటివ్ త్వరలో సంప్రదిస్తారు.\n\n📞 సందేహాలకు: ${AGENT_PHONE}\n🌐 చూడండి: ${SITE}`,
    sell:             `📋 *ప్రాపర్టీ లిస్ట్ / అమ్మండి*\n👉 ${SITE}/sell`,
    website:          `🌐 *మా వెబ్‌సైట్ సందర్శించండి*\n👉 ${SITE}`,
    invalid:          `❌ దయచేసి బటన్లు వాడండి.`,
    propCard:         (p, idx, total) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `  🛏️ ${p.beds}పడ/${p.baths}బా` : ''
      }\n📐 ${p.area}\n\n📊 ${idx + 1} / ${total}`,
    propDetail:       (p) =>
      `🏷️ *${p.name}*\n\n📍 *స్థానం:* ${p.location}\n💰 *ధర:* ${p.price}\n📐 *విస్తీర్ణం:* ${p.area}${
        p.beds ? `\n🛏️ *పడకలు:* ${p.beds}  🚿 *బాత్‌రూమ్‌లు:* ${p.baths}` : ''
      }\n🏗️ *రకం:* ${p.type}\n\n📝 ${p.desc}\n\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *ఏజెంట్‌తో మాట్లాడండి*\n\nమీ *పేరు* నమోదు చేయండి:`,
    agentAskPhone:    `📱 మీ *WhatsApp నంబర్* నమోదు చేయండి:`,
    agentThankYou:    (name) => `✅ *నమస్కారం ${name}!* ఒక ఏజెంట్ త్వరలో కాల్ చేస్తారు.\n\n📞 నేరుగా కాల్ చేయండి: ${AGENT_PHONE}`,
    btnBuy:           '🏠 కొనండి',
    btnRent:          '🏘️ అద్దెకు',
    btnCommercial:    '🏢 కమర్షియల్',
    btnMore:          '➕ మరిన్ని',
    btnAgent:         '🧑‍💼 ఏజెంట్',
    btnSell:          '📋 లిస్ట్ చేయండి',
    btnWebsite:       '🌐 వెబ్‌సైట్',
    btnInterested:    '✅ ఆసక్తి ఉంది',
    btnMainMenu:      '🏠 మెనూ',
    btnViewDetails:   '📋 వివరాలు',
    btnConfirm:       '✅ సంప్రదించండి',
  },
  hi: {
    welcomeBody:      `👋 *Webb Heads* में आपका स्वागत है – भारत का प्रीमियम प्रॉपर्टी प्लेटफ़ॉर्म!\n\nभाषा चुनें:`,
    mainMenuBody:     `🏠 *Webb Heads मेनू*\n\nआप क्या ढूंढ रहे हैं?`,
    moreOptionsBody:  `➕ *और विकल्प*\n\nनीचे से चुनें:`,
    buyTitle:         `🏠 *बिक्री के लिए प्रॉपर्टी*\n\nहमारी नई लिस्टिंग देखें ⬅️ ➡️`,
    rentTitle:        `🏘️ *किराए की प्रॉपर्टी*\n\nहमारी नई लिस्टिंग देखें ⬅️ ➡️`,
    commercialTitle:  `🏢 *कमर्शियल प्रॉपर्टी*\n\nहमारी लिस्टिंग देखें ⬅️ ➡️`,
    interestedBody:   `आप क्या करना चाहते हैं?`,
    askPhone:         `📱 अपना *WhatsApp नंबर* दर्ज करें:`,
    thankYou:         (name) => `✅ *धन्यवाद${name ? ', ' + name : ''}!* हमारे एग्जीक्यूटिव जल्द संपर्क करेंगे।\n\n📞 प्रश्नों के लिए: ${AGENT_PHONE}\n🌐 देखें: ${SITE}`,
    sell:             `📋 *प्रॉपर्टी लिस्ट / बेचें*\n👉 ${SITE}/sell`,
    website:          `🌐 *हमारी वेबसाइट देखें*\n👉 ${SITE}`,
    invalid:          `❌ कृपया बटन का उपयोग करें।`,
    propCard:         (p, idx, total) =>
      `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${
        p.beds ? `  🛏️ ${p.beds}bd/${p.baths}ba` : ''
      }\n📐 ${p.area}\n\n📊 ${idx + 1} / ${total}`,
    propDetail:       (p) =>
      `🏷️ *${p.name}*\n\n📍 *स्थान:* ${p.location}\n💰 *कीमत:* ${p.price}\n📐 *क्षेत्र:* ${p.area}${
        p.beds ? `\n🛏️ *बेड:* ${p.beds}  🚿 *बाथ:* ${p.baths}` : ''
      }\n🏗️ *प्रकार:* ${p.type}\n\n📝 ${p.desc}\n\n🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *एजेंट से बात करें*\n\nअपना *नाम* दर्ज करें:`,
    agentAskPhone:    `📱 अपना *WhatsApp नंबर* दर्ज करें:`,
    agentThankYou:    (name) => `✅ *नमस्ते ${name}!* एक एजेंट जल्द कॉल करेगा।\n\n📞 सीधे कॉल करें: ${AGENT_PHONE}`,
    btnBuy:           '🏠 खरीदें',
    btnRent:          '🏘️ किराए पर',
    btnCommercial:    '🏢 कमर्शियल',
    btnMore:          '➕ और विकल्प',
    btnAgent:         '🧑‍💼 एजेंट',
    btnSell:          '📋 लिस्ट करें',
    btnWebsite:       '🌐 वेबसाइट',
    btnInterested:    '✅ रुचि है',
    btnMainMenu:      '🏠 मेनू',
    btnViewDetails:   '📋 विवरण',
    btnConfirm:       '✅ संपर्क करें',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;
  const res = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('WA send error:', err);
  }
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
        buttons: buttons.slice(0, 3).map((b) => ({
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
 * Send a list menu (up to 10 items grouped in sections).
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

/**
 * Send a property card with image header.
 * Buttons: ⬅️ Prev  |  ✅ Interested  |  Next ➡️
 *
 * BUG FIX: index is stored in session and passed here explicitly —
 * the old code tried to derive it from buttonId which breaks on wrap-around.
 */
async function sendPropertyCard(to, lang, property, index, total) {
  const t = T[lang] || T['en'];
  const imageUrl = property.image || `${SITE}/images/default.jpg`;

  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: { link: imageUrl },
      },
      body: { text: t.propCard(property, index, total) },
      footer: { text: `${property.type} · Webb Heads` },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: { id: `prev_prop`, title: '⬅️ Prev' },
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
            reply: { id: `next_prop`, title: 'Next ➡️' },
          },
        ],
      },
    },
  });
}

async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  try {
    await fetch(SHEETS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('Sheets save error:', e);
  }
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
 * Main menu — 3 interactive BUTTONS for Buy / Rent / Commercial
 * + a 4th row via a list section for "More Options"
 *
 * WhatsApp only allows 3 buttons per message, so we send TWO messages:
 *   1. Button message: Buy | Rent | Commercial
 *   2. Button message: ➕ More Options
 *
 * Both are sent together so the user sees all choices without scrolling far.
 */
async function sendMainMenu(to, lang) {
  const t = T[lang] || T['en'];

  // Message 1: 3 property-type buttons (like language picker)
  await sendButtons(
    to,
    t.mainMenuBody,
    [
      { id: 'menu_buy',        title: t.btnBuy        },
      { id: 'menu_rent',       title: t.btnRent       },
      { id: 'menu_commercial', title: t.btnCommercial },
    ],
    'Webb Heads 🏠',
    'Tap a category to explore'
  );

  // Message 2: More Options button
  return sendButtons(
    to,
    `➕ *More Options*\n\nAgent support, list your property or visit our website:`,
    [
      { id: 'menu_more', title: t.btnMore },
    ]
  );
}

/**
 * More Options sub-menu — list format to fit 3 items cleanly.
 */
function sendMoreOptions(to, lang) {
  const t = T[lang] || T['en'];
  return sendList(
    to,
    t.moreOptionsBody,
    '📋 Select',
    [
      {
        title: 'Options',
        rows: [
          { id: 'menu_agent',   title: t.btnAgent,   description: 'Connect with a property expert'     },
          { id: 'menu_sell',    title: t.btnSell,    description: 'List or sell your property with us' },
          { id: 'menu_website', title: t.btnWebsite, description: 'Browse all listings online'         },
        ],
      },
    ],
    'Webb Heads 🏠',
    `Reply *hi* to restart`
  );
}

/**
 * Send first property card in a list (slider mode).
 * Sends a title text then the first card.
 */
async function sendPropertyList(to, lang, session, list, titleKey) {
  const t = T[lang] || T['en'];
  session.data.currentList  = list;
  session.data.currentIndex = 0;
  await sendText(to, t[titleKey]);
  return sendPropertyCard(to, lang, list[0], 0, list.length);
}

/**
 * Send full property detail card with Confirm + Main Menu buttons.
 */
async function sendPropertyDetail(to, lang, property) {
  const t = T[lang] || T['en'];
  return sendButtons(
    to,
    t.propDetail(property),
    [
      { id: `confirm_${property.id}`, title: t.btnConfirm  },
      { id: 'back_menu',              title: t.btnMainMenu },
    ],
    null,
    'Webb Heads 🏠'
  );
}

function sendBackToMenu(to, lang, name) {
  const t = T[lang] || T['en'];
  return sendButtons(
    to,
    t.thankYou(name),
    [{ id: 'back_menu', title: t.btnMainMenu }]
  );
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg     = (text || '').toLowerCase().trim();
  const t       = T[session.lang] || T['en'];

  // ── GLOBAL RESET ─────────────────────────────────────────────────────────────
  if (['hi', 'hello', 'menu', 'start', '/start'].includes(msg) || buttonId === 'back_menu') {
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
    else if (msg === '2')   { session.lang = 'te'; }
    else if (msg === '3')   { session.lang = 'hi'; }
    else {
      // If we're at lang_select and got an unexpected input, show picker again
      if (session.step === 'lang_select') return sendLanguagePicker(from);
    }
    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  // ── MAIN MENU SELECTIONS ──────────────────────────────────────────────────────
  if (buttonId === 'menu_buy') {
    session.step = 'browse_props';
    return sendPropertyList(from, session.lang, session, BUY_PROPERTIES, 'buyTitle');
  }

  if (buttonId === 'menu_rent') {
    session.step = 'browse_props';
    return sendPropertyList(from, session.lang, session, RENT_PROPERTIES, 'rentTitle');
  }

  if (buttonId === 'menu_commercial') {
    session.step = 'browse_props';
    return sendPropertyList(from, session.lang, session, COMMERCIAL_PROPERTIES, 'commercialTitle');
  }

  // ── MORE OPTIONS ──────────────────────────────────────────────────────────────
  if (buttonId === 'menu_more') {
    session.step = 'more_options';
    return sendMoreOptions(from, session.lang);
  }

  if (buttonId === 'menu_agent') {
    session.step = 'agent_collect_name';
    session.data.intent = 'Talk to Agent';
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

  // ── SLIDER NAVIGATION ─────────────────────────────────────────────────────────
  // BUG FIX: Use session index directly, not derived from buttonId
  if (buttonId === 'next_prop' || buttonId === 'prev_prop') {
    const list = session.data.currentList;
    if (!list || list.length === 0) return sendMainMenu(from, session.lang);

    let index = session.data.currentIndex ?? 0;

    if (buttonId === 'next_prop') {
      index = (index + 1) % list.length;
    } else {
      index = (index - 1 + list.length) % list.length;
    }

    session.data.currentIndex = index;
    return sendPropertyCard(from, session.lang, list[index], index, list.length);
  }

  // ── INTERESTED → Show full property detail ────────────────────────────────────
  if (buttonId?.startsWith('interested_')) {
    const propId = buttonId.replace('interested_', '');
    const allProps = [...BUY_PROPERTIES, ...RENT_PROPERTIES, ...COMMERCIAL_PROPERTIES];
    // Deduplicate by id
    const property = allProps.find((p) => p.id === propId);

    if (property) {
      session.data.selectedProperty = property;
      session.data.intent           = 'Property Interest';
      session.step                  = 'confirm_interest';
      return sendPropertyDetail(from, session.lang, property);
    }
    // Property not found — go back to menu
    return sendMainMenu(from, session.lang);
  }

  // ── CONFIRM INTEREST → Ask only for phone number ──────────────────────────────
  if (buttonId?.startsWith('confirm_')) {
    // Validate the property id in the button matches what we have in session
    const propId = buttonId.replace('confirm_', '');
    if (session.data.selectedProperty?.id !== propId) {
      // Mismatch — safely reuse whatever property is stored or restart
      if (!session.data.selectedProperty) return sendMainMenu(from, session.lang);
    }
    session.step = 'collect_phone';
    return sendText(from, t.askPhone);
  }

  // ── LEAD CAPTURE — Phone Only ──────────────────────────────────────────────────
  if (session.step === 'collect_phone') {
    // Accept digits, spaces, +, -, ()
    const cleaned = (text || '').replace(/[\s\-().]/g, '');
    if (!cleaned || !/^\+?\d{7,15}$/.test(cleaned)) {
      return sendText(from, `❌ Please enter a valid phone number (7–15 digits).\n\n${t.askPhone}`);
    }
    session.data.phone = cleaned;

    await saveToSheets({
      name:      session.data.name     || 'Not provided',
      phone:     session.data.phone,
      email:     'Not provided',
      intent:    session.data.intent   || 'Property Interest',
      property:  session.data.selectedProperty?.name || 'N/A',
      location:  session.data.selectedProperty?.location || 'N/A',
      price:     session.data.selectedProperty?.price || 'N/A',
      whatsapp:  from,
      language:  session.lang,
      time:      new Date().toISOString(),
    });

    session.step = 'main_menu';
    session.data = {};
    return sendBackToMenu(from, session.lang, session.data.name || null);
  }

  // ── AGENT FLOW: Collect Name → Phone ──────────────────────────────────────────
  if (session.step === 'agent_collect_name') {
    if (!text || text.trim().length < 2) {
      return sendText(from, t.agentPrompt);
    }
    session.data.agentName = text.trim();
    session.step = 'agent_collect_phone';
    return sendText(from, t.agentAskPhone);
  }

  if (session.step === 'agent_collect_phone') {
    const cleaned = (text || '').replace(/[\s\-().]/g, '');
    if (!cleaned || !/^\+?\d{7,15}$/.test(cleaned)) {
      return sendText(from, `❌ Please enter a valid phone number.\n\n${t.agentAskPhone}`);
    }
    session.data.agentPhone = cleaned;

    await saveToSheets({
      name:     session.data.agentName,
      phone:    session.data.agentPhone,
      email:    'Not provided',
      intent:   'Talk to Agent',
      property: 'N/A',
      location: 'N/A',
      price:    'N/A',
      whatsapp: from,
      language: session.lang,
      time:     new Date().toISOString(),
    });

    const thankMsg = t.agentThankYou(session.data.agentName);
    session.step = 'main_menu';
    session.data = {};

    await sendText(from, thankMsg);
    return sendButtons(from, '👇', [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  // ── FALLBACK ──────────────────────────────────────────────────────────────────
  return sendButtons(
    from,
    t.invalid,
    [{ id: 'back_menu', title: t.btnMainMenu }]
  );
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body    = await req.json();
    const entry   = body.entry?.[0];
    const change  = entry?.changes?.[0];
    const value   = change?.value;
    const message = value?.messages?.[0];

    // Ignore delivery/read receipts and status updates
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
      const text = message.text?.body?.trim();
      if (text) await handleMessage(from, text, null);
    }

    return Response.json({});
  } catch (err) {
    console.error('Webhook error:', err);
    // Always return 200 to WhatsApp so it doesn't retry endlessly
    return Response.json({ error: 'Internal error' }, { status: 200 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === VERIFY_TOKEN) {
    return new Response(searchParams.get('hub.challenge'));
  }
  return new Response('Forbidden', { status: 403 });
}
