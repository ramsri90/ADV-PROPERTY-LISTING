// ─── CONFIG ───────────────────────────────────────────────────────────────────
const VERIFY_TOKEN   = 'webbheads_webhook_token';
const AGENT_PHONE    = '+91 22 4567 8900';
const SITE            = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
// FIXED: Removed p5 (Commercial office) from BUY - it belongs in Commercial only
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
    id: 'r3',
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
    id: 'r4',
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
    id: 'c3',
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

// ─── ALL PROPERTIES LOOKUP (single source of truth) ──────────────────────────
const ALL_PROPERTIES = [
  ...BUY_PROPERTIES,
  ...RENT_PROPERTIES,
  ...COMMERCIAL_PROPERTIES,
].filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx);

// ─── SESSION STORE ────────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    welcomeBody:      `👋 Welcome to *Webb Heads* – India's Premium Property Platform!

Please select your language:`,
    mainMenuBody:     `🏠 *Webb Heads Main Menu*

What are you looking for today?`,
    moreOptionsBody:  `➕ *More Options*

Choose an option below:`,
    buyTitle:         `🏠 *Properties for Sale*

Browse our listings 👇`,
    rentTitle:        `🏘️ *Properties for Rent*

Browse our listings 👇`,
    commercialTitle:  `🏢 *Commercial Properties*

Browse our listings 👇`,
    askName:          `👤 Please enter your *Full Name*:`,
    askPhone:         `📱 Please enter your *WhatsApp number*:`,
    askEmail:         `📧 Please enter your *Email ID*:`,
    thankYou:         (name) => `✅ *Thank you${name ? ', ' + name : ''}!* Our executive will contact you shortly.

📞 Direct queries: ${AGENT_PHONE}
🌐 Browse all listings: ${SITE}`,
    sell:              `📋 *List / Sell Your Property*

Our team will contact you within 24 hours!
👉 ${SITE}/sell`,
    website:           `🌐 *Visit our Website*

Browse all listings at:
👉 ${SITE}`,
    invalid:           `❌ Please use the buttons below to navigate.`,
    invalidPhone:      `❌ Invalid number. Please try again.

📱 Please enter your *WhatsApp number*:`,
    invalidEmail:      `❌ Invalid email. Please try again.

📧 Please enter your *Email ID*:`,
    propCard:          (p, idx, total) =>
      `🏷️ *${p.name}*
📍 ${p.location}
💰 ${p.price}${
        p.beds ? `  🛏️ ${p.beds}bd/${p.baths}ba` : ''
      }
📐 ${p.area}

📊 ${idx + 1} of ${total}`,
    propDetail:        (p) =>
      `🏷️ *${p.name}*

📍 *Location:* ${p.location}
💰 *Price:* ${p.price}
📐 *Area:* ${p.area}${
        p.beds ? `
🛏️ *Beds:* ${p.beds}  🚿 *Baths:* ${p.baths}` : ''
      }
🏗️ *Type:* ${p.type}

📝 ${p.desc}

🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *Talk to an Agent*

Please enter your *name*:`,
    agentAskPhone:    `📱 Enter your *WhatsApp number*:`,
    agentThankYou:    (name) => `✅ *Hi ${name}!* An agent will call you shortly.

📞 Or call us directly: ${AGENT_PHONE}`,
    btnBuy:            '🏠 Buy',
    btnRent:           '🏘️ Rent',
    btnCommercial:    '🏢 Commercial',
    btnMore:           '➕ More',
    btnAgent:          '🧑‍💼 Talk to Agent',
    btnSell:           '📋 List Property',
    btnWebsite:        '🌐 Visit Website',
    btnInterested:    '✅ Interested',
    btnMainMenu:      '🏠 Main Menu',
    btnViewDetails:    '📋 View Details',
    btnConfirm:        '✅ Yes, Contact Me',
    btnPrev:           '⬅️ Prev',
    btnNext:           'Next ➡️',
    selectOption:      '👇',
  },
  te: {
    welcomeBody:      `👋 *Webb Heads*కి స్వాగతం – భారత్ యొక్క ప్రీమియం ప్రాపర్టీ ప్లాట్‌ఫారమ్!

భాష ఎంచుకోండి:`,
    mainMenuBody:     `🏠 *Webb Heads మెనూ*

ఏం కావాలి?`,
    moreOptionsBody:  `➕ *మరిన్ని ఎంపికలు*

దిగువ ఒక ఎంపిక చేయండి:`,
    buyTitle:         `🏠 *అమ్మకానికి ఉన్న ప్రాపర్టీలు*

మా లిస్టింగ్‌లు చూడండి 👇`,
    rentTitle:        `🏘️ *అద్దెకు ఉన్న ప్రాపర్టీలు*

మా లిస్టింగ్‌లు చూడండి 👇`,
    commercialTitle:  `🏢 *కమర్షియల్ ప్రాపర్టీలు*

మా లిస్టింగ్‌లు చూడండి 👇`,
    askName:          `👤 దయచేసి మీ *పూర్తి పేరు* నమోదు చేయండి:`,
    askPhone:         `📱 మీ *WhatsApp నంబర్* నమోదు చేయండి:`,
    askEmail:         `📧 మీ *ఈమెయిల్ ఐడి* నమోదు చేయండి:`,
    thankYou:         (name) => `✅ *ధన్యవాదాలు${name ? ', ' + name : ''}!* మా ఎగ్జిక్యూటివ్ త్వరలో సంప్రదిస్తారు.

📞 సందేహాలకు: ${AGENT_PHONE}
🌐 చూడండి: ${SITE}`,
    sell:              `📋 *ప్రాపర్టీ లిస్ట్ / అమ్మండి*
👉 ${SITE}/sell`,
    website:           `🌐 *మా వెబ్‌సైట్ సందర్శించండి*
👉 ${SITE}`,
    invalid:           `❌ దయచేసి బటన్లు వాడండి.`,
    invalidPhone:      `❌ తప్పు నంబర్. మళ్ళీ ప్రయత్నించండి.

📱 మీ *WhatsApp నంబర్* నమోదు చేయండి:`,
    invalidEmail:      `❌ తప్పు ఈమెయిల్. మళ్ళీ ప్రయత్నించండి.

📧 మీ *ఈమెయిల్ ఐడి* నమోదు చేయండి:`,
    propCard:          (p, idx, total) =>
      `🏷️ *${p.name}*
📍 ${p.location}
💰 ${p.price}${
        p.beds ? `  🛏️ ${p.beds}పడ/${p.baths}బా` : ''
      }
📐 ${p.area}

📊 ${idx + 1} / ${total}`,
    propDetail:        (p) =>
      `🏷️ *${p.name}*

📍 *స్థానం:* ${p.location}
💰 *ధర:* ${p.price}
📐 *విస్తీర్ణం:* ${p.area}${
        p.beds ? `
🛏️ *పడకలు:* ${p.beds}  🚿 *బాత్‌రూమ్‌లు:* ${p.baths}` : ''
      }
🏗️ *రకం:* ${p.type}

📝 ${p.desc}

🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *ఏజెంట్‌తో మాట్లాడండి*

మీ *పేరు* నమోదు చేయండి:`,
    agentAskPhone:    `📱 మీ *WhatsApp నంబర్* నమోదు చేయండి:`,
    agentThankYou:    (name) => `✅ *నమస్కారం ${name}!* ఒక ఏజెంట్ త్వరలో కాల్ చేస్తారు.

📞 నేరుగా కాల్ చేయండి: ${AGENT_PHONE}`,
    btnBuy:            '🏠 కొనండి',
    btnRent:           '🏘️ అద్దెకు',
    btnCommercial:    '🏢 కమర్షియల్',
    btnMore:           '➕ మరిన్ని',
    btnAgent:          '🧑‍💼 ఏజెంట్',
    btnSell:           '📋 లిస్ట్ చేయండి',
    btnWebsite:        '🌐 వెబ్‌సైట్',
    btnInterested:    '✅ ఆసక్తి ఉంది',
    btnMainMenu:      '🏠 మెనూ',
    btnViewDetails:    '📋 వివరాలు',
    btnConfirm:        '✅ సంప్రదించండి',
    btnPrev:           '⬅️ ముందు',
    btnNext:           'తర్వాత ➡️',
    selectOption:      '👇',
  },
  hi: {
    welcomeBody:      `👋 *Webb Heads* में आपका स्वागत है – भारत का प्रीमियम प्रॉपर्टी प्लेटफ़ॉर्म!

भाषा चुनें:`,
    mainMenuBody:     `🏠 *Webb Heads मेनू*

आप क्या ढूंढ रहे हैं?`,
    moreOptionsBody:  `➕ *और विकल्प*

नीचे से चुनें:`,
    buyTitle:         `🏠 *बिक्री के लिए प्रॉपर्टी*

हमारी लिस्टिंग देखें 👇`,
    rentTitle:        `🏘️ *किराये की प्रॉपर्टी*

हमारी लिस्टिंग देखें 👇`,
    commercialTitle:  `🏢 *कमर्शियल प्रॉपर्टी*

हमारी लिस्टिंग देखें 👇`,
    askName:          `👤 कृपया अपना *पूरा नाम* दर्ज करें:`,
    askPhone:         `📱 अपना *WhatsApp नंबर* दर्ज करें:`,
    askEmail:         `📧 अपनी *ईमेल आईडी* दर्ज करें:`,
    thankYou:         (name) => `✅ *धन्यवाद${name ? ', ' + name : ''}!* हमारे एग्जीक्यूटिव जल्द संपर्क करेंगे।

📞 प्रश्नों के लिए: ${AGENT_PHONE}
🌐 देखें: ${SITE}`,
    sell:              `📋 *प्रॉपर्टी लिस्ट / बेचें*
👉 ${SITE}/sell`,
    website:           `🌐 *हमारी वेबसाइट देखें*
👉 ${SITE}`,
    invalid:           `❌ कृपया बटन का उपयोग करें।`,
    invalidPhone:      `❌ गलत नंबर। फिर से कोशिश करें।

📱 अपना *WhatsApp नंबर* दर्ज करें:`,
    invalidEmail:      `❌ गलत ईमेल। फिर से कोशिश करें।

📧 अपनी *ईमेल आईडी* दर्ज करें:`,
    propCard:          (p, idx, total) =>
      `🏷️ *${p.name}*
📍 ${p.location}
💰 ${p.price}${
        p.beds ? `  🛏️ ${p.beds}बेड/${p.baths}बाथ` : ''
      }
📐 ${p.area}

📊 ${idx + 1} / ${total}`,
    propDetail:        (p) =>
      `🏷️ *${p.name}*

📍 *स्थान:* ${p.location}
💰 *कीमत:* ${p.price}
📐 *क्षेत्र:* ${p.area}${
        p.beds ? `
🛏️ *बेडरूम:* ${p.beds}  🚿 *बाथरूम:* ${p.baths}` : ''
      }
🏗️ *प्रकार:* ${p.type}

📝 ${p.desc}

🔗 ${p.url}`,
    agentPrompt:      `👨‍💼 *एजेंट से बात करें*

अपना *नाम* दर्ज करें:`,
    agentAskPhone:    `📱 अपना *WhatsApp नंबर* दर्ज करें:`,
    agentThankYou:    (name) => `✅ *नमस्ते ${name}!* एक एजेंट जल्द कॉल करेगा।

📞 सीधे कॉल करें: ${AGENT_PHONE}`,
    btnBuy:            '🏠 खरीदें',
    btnRent:           '🏘️ किराये पर',
    btnCommercial:    '🏢 कमर्शियल',
    btnMore:           '➕ और विकल्प',
    btnAgent:          '🧑‍💼 एजेंट',
    btnSell:           '📋 लिस्ट करें',
    btnWebsite:        '🌐 वेबसाइट',
    btnInterested:    '✅ रुचि है',
    btnMainMenu:      '🏠 मेनू',
    btnViewDetails:    '📋 विवरण',
    btnConfirm:        '✅ संपर्क करें',
    btnPrev:           '⬅️ पिछला',
    btnNext:           'अगला ➡️',
    selectOption:      '👇',
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

// ─── FIXED: Property card with bounded navigation (NO loop) ───────────────────
async function sendPropertyCard(to, lang, property, index, total) {
  const t = T[lang] || T['en'];
  const imageUrl = property.image || `${SITE}/images/default.jpg`;

  // Build buttons based on position - NO loop navigation
  const buttons = [];

  if (total === 1) {
    // Single property: Interested + Main Menu
    buttons.push(
      { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested.substring(0, 20) } },
      { type: 'reply', reply: { id: 'back_menu', title: t.btnMainMenu.substring(0, 20) } }
    );
  } else if (index === 0) {
    // First property: Interested + Next (NO Prev)
    buttons.push(
      { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested.substring(0, 20) } },
      { type: 'reply', reply: { id: `next_prop`, title: t.btnNext.substring(0, 20) } }
    );
  } else if (index === total - 1) {
    // Last property: Prev + Interested + Main Menu (NO Next)
    buttons.push(
      { type: 'reply', reply: { id: `prev_prop`, title: t.btnPrev.substring(0, 20) } },
      { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested.substring(0, 20) } },
      { type: 'reply', reply: { id: 'back_menu', title: t.btnMainMenu.substring(0, 20) } }
    );
  } else {
    // Middle properties: Prev + Interested + Next
    buttons.push(
      { type: 'reply', reply: { id: `prev_prop`, title: t.btnPrev.substring(0, 20) } },
      { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested.substring(0, 20) } },
      { type: 'reply', reply: { id: `next_prop`, title: t.btnNext.substring(0, 20) } }
    );
  }

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
      action: { buttons },
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
    `👋 Welcome to *Webb Heads* – India's Premium Property Platform!

Please select your language:`,
    [
      { id: 'lang_en', title: 'English' },
      { id: 'lang_te', title: 'తెలుగు (Telugu)' },
      { id: 'lang_hi', title: 'हिंदी (Hindi)' },
    ],
    'Webb Heads 🏠',
    "India's Premium Property Platform"
  );
}

async function sendMainMenu(to, lang) {
  const t = T[lang] || T['en'];
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

  return sendButtons(
    to,
    t.moreOptionsBody,
    [{ id: 'menu_more', title: t.btnMore }]
  );
}

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
          { id: 'menu_website', title: t.btnWebsite, description: 'Browse all listings online'          },
        ],
      },
    ],
    'Webb Heads 🏠',
    `Reply *hi* to restart`
  );
}

async function sendPropertyList(to, lang, session, list, titleKey) {
  const t = T[lang] || T['en'];
  if (!list || list.length === 0) {
    await sendText(to, '❌ No properties found.');
    return sendMainMenu(to, lang);
  }
  session.data.currentList  = list;
  session.data.currentIndex = 0;
  await sendText(to, t[titleKey]);
  return sendPropertyCard(to, lang, list[0], 0, list.length);
}

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

// ─── NEW: Direct interest from website wa.me link ────────────────────────────
async function sendDirectPropertyInterest(to, lang, property, userMessage) {
  const t = T[lang] || T['en'];
  const session = getSession(to);
  session.data.selectedProperty = property;
  session.data.intent = 'Property Interest (Direct from Website)';
  session.step = 'confirm_interest';

  // Acknowledge user's message from website
  const ackText = `👋 *Hello!* We received your message:

_"${userMessage}"_

Here's the property you're interested in:`;
  await sendText(to, ackText);

  // Show property card with Interested + Main Menu buttons
  const imageUrl = property.image || `${SITE}/images/default.jpg`;

  return sendPayload(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'image',
        image: { link: imageUrl },
      },
      body: { text: t.propCard(property, 0, 1) },
      footer: { text: `${property.type} · Webb Heads` },
      action: {
        buttons: [
          { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested.substring(0, 20) } },
          { type: 'reply', reply: { id: 'back_menu', title: t.btnMainMenu.substring(0, 20) } },
        ],
      },
    },
  });
}

// ─── FIX: Accept lang explicitly so it's never stale after session.data reset ─
function sendBackToMenu(to, lang, name) {
  const t = T[lang] || T['en'];
  return sendButtons(
    to,
    t.thankYou(name),
    [{ id: 'back_menu', title: t.btnMainMenu }]
  );
}

// ─── NEW: Parse wa.me pre-filled messages ────────────────────────────────────
function parseDirectInterest(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  if (lower.includes('interested in') || lower.includes('interested')) {
    const match = text.match(/interested in (.+?)(?:\.|\,|Please|\?|$)/i);
    if (match && match[1]) {
      const searchName = match[1].trim();
      const property = ALL_PROPERTIES.find(p => 
        p.name.toLowerCase().includes(searchName.toLowerCase()) ||
        searchName.toLowerCase().includes(p.name.toLowerCase())
      );
      if (property) return property;
    }

    for (const p of ALL_PROPERTIES) {
      if (lower.includes(p.name.toLowerCase())) {
        return p;
      }
    }
  }

  return null;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg     = (text || '').toLowerCase().trim();
  const lang    = session.lang || 'en';   // ← snapshot lang ONCE at top
  const t       = T[lang] || T['en'];

  // ── GLOBAL RESET ─────────────────────────────────────────────────────────────
  // Only reset on explicit "hi/hello/start" text OR back_menu button.
  // Do NOT let this interrupt an active lead-capture or agent flow.
  const isLeadFlow  = ['collect_name', 'collect_phone', 'collect_email'].includes(session.step);
  const isAgentFlow = ['agent_collect_name', 'agent_collect_phone'].includes(session.step);

  // FIXED: back_menu goes to Main Menu, NOT language picker
  if (buttonId === 'back_menu' && !isLeadFlow && !isAgentFlow) {
    session.step = 'main_menu';
    return sendMainMenu(from, lang);
  }

  // 'hi'/'hello'/'start' → language picker (full reset)
  if (['hi', 'hello', 'start', '/start'].includes(msg) && !isLeadFlow && !isAgentFlow) {
    session.step = 'lang_select';
    session.data = {};
    return sendLanguagePicker(from);
  }

  // 'menu' text → main menu (keep language)
  if (msg === 'menu' && !isLeadFlow && !isAgentFlow) {
    session.step = 'main_menu';
    return sendMainMenu(from, lang);
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
      if (session.step === 'lang_select') return sendLanguagePicker(from);
    }
    session.step = 'main_menu';
    return sendMainMenu(from, session.lang);
  }

  // ── DIRECT INTEREST FROM WEBSITE (wa.me pre-filled message) ────────────────
  if (text && !buttonId && session.step !== 'lang_select') {
    const directProperty = parseDirectInterest(text);
    if (directProperty) {
      return sendDirectPropertyInterest(from, lang, directProperty, text.trim());
    }
  }

  // ── LEAD CAPTURE FLOW — checked FIRST before any button handlers ──────────────
  // This ensures text input during lead capture is never swallowed by button logic.

  if (session.step === 'collect_name') {
    if (!text || text.trim().length < 2) return sendText(from, t.askName);
    session.data.leadName = text.trim();
    session.step          = 'collect_phone';
    return sendText(from, t.askPhone);
  }

  if (session.step === 'collect_phone') {
    const cleaned = (text || '').replace(/[\s\-().]/g, '');
    if (!cleaned || !/^\+?\d{10,15}$/.test(cleaned)) {
      return sendText(from, t.invalidPhone);
    }
    session.data.leadPhone = cleaned;
    session.step           = 'collect_email';
    return sendText(from, t.askEmail);
  }

  if (session.step === 'collect_email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text || !emailRegex.test(text.trim())) {
      return sendText(from, t.invalidEmail);
    }
    session.data.leadEmail = text.trim().toLowerCase();

    // Save lead to Google Sheets
    await saveToSheets({
      name:      session.data.leadName,
      phone:     session.data.leadPhone,
      email:     session.data.leadEmail,
      intent:    session.data.intent                    || 'Property Interest',
      property:  session.data.selectedProperty?.name    || 'N/A',
      location:  session.data.selectedProperty?.location || 'N/A',
      price:     session.data.selectedProperty?.price   || 'N/A',
      whatsapp:  from,
      language:  lang,
      time:      new Date().toISOString(),
    });

    // ── FIX: Snapshot everything we need BEFORE clearing session.data ─────────
    const finalName = session.data.leadName;
    const finalLang = lang;                  // already snapshotted above
    session.step    = 'main_menu';
    session.data    = {};
    // Use snapshotted lang so thank-you message is always in the user's language
    return sendBackToMenu(from, finalLang, finalName);
  }

  // ── AGENT FLOW — also checked before button handlers ─────────────────────────

  if (session.step === 'agent_collect_name') {
    if (!text || text.trim().length < 2) return sendText(from, t.agentPrompt);
    session.data.agentName = text.trim();
    session.step           = 'agent_collect_phone';
    return sendText(from, t.agentAskPhone);
  }

  if (session.step === 'agent_collect_phone') {
    const cleaned = (text || '').replace(/[\s\-().]/g, '');
    if (!cleaned || !/^\+?\d{10,15}$/.test(cleaned)) return sendText(from, t.agentAskPhone);
    session.data.agentPhone = cleaned;
    await saveToSheets({
      name:     session.data.agentName,
      phone:    session.data.agentPhone,
      email:    'N/A',
      intent:   'Talk to Agent',
      property: 'N/A',
      whatsapp: from,
      language: lang,
      time:     new Date().toISOString(),
    });
    // ── FIX: Snapshot before clearing ────────────────────────────────────────
    const agentName = session.data.agentName;
    const agentLang = lang;
    session.step    = 'main_menu';
    session.data    = {};
    const thankMsg  = (T[agentLang] || T['en']).agentThankYou(agentName);
    await sendText(from, thankMsg);
    const agentT = T[agentLang] || T['en'];
    return sendButtons(from, agentT.selectOption, [{ id: 'back_menu', title: agentT.btnMainMenu }]);
  }

  // ── MAIN MENU SELECTIONS ──────────────────────────────────────────────────────
  if (buttonId === 'menu_buy') {
    session.step = 'browse_props';
    return sendPropertyList(from, lang, session, BUY_PROPERTIES, 'buyTitle');
  }
  if (buttonId === 'menu_rent') {
    session.step = 'browse_props';
    return sendPropertyList(from, lang, session, RENT_PROPERTIES, 'rentTitle');
  }
  if (buttonId === 'menu_commercial') {
    session.step = 'browse_props';
    return sendPropertyList(from, lang, session, COMMERCIAL_PROPERTIES, 'commercialTitle');
  }

  // ── MORE OPTIONS ──────────────────────────────────────────────────────────────
  if (buttonId === 'menu_more') {
    session.step = 'more_options';
    return sendMoreOptions(from, lang);
  }
  if (buttonId === 'menu_agent') {
    session.step        = 'agent_collect_name';
    session.data.intent = 'Talk to Agent';
    return sendText(from, t.agentPrompt);
  }
  if (buttonId === 'menu_sell') {
    session.step = 'main_menu';
    await sendText(from, t.sell);
    return sendButtons(from, t.selectOption, [{ id: 'back_menu', title: t.btnMainMenu }]);
  }
  if (buttonId === 'menu_website') {
    session.step = 'main_menu';
    await sendText(from, t.website);
    return sendButtons(from, t.selectOption, [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

  // ── SLIDER NAVIGATION (NO LOOP - bounded) ─────────────────────────────────────
  if (buttonId === 'next_prop' || buttonId === 'prev_prop') {
    const list = session.data.currentList;
    if (!list || list.length === 0) return sendMainMenu(from, lang);

    let index = session.data.currentIndex ?? 0;
    if (buttonId === 'next_prop') {
      // Only go next if not at last item
      if (index < list.length - 1) {
        index = index + 1;
      }
      // At last item: stay there (Next button hidden anyway)
    } else {
      // Only go prev if not at first item
      if (index > 0) {
        index = index - 1;
      }
      // At first item: stay there (Prev button hidden anyway)
    }
    session.data.currentIndex = index;
    return sendPropertyCard(from, lang, list[index], index, list.length);
  }

  // ── INTERESTED → Show full property detail ────────────────────────────────────
  if (buttonId?.startsWith('interested_')) {
    const propId   = buttonId.replace('interested_', '');
    const property = ALL_PROPERTIES.find((p) => p.id === propId);
    if (property) {
      session.data.selectedProperty = property;
      session.data.intent           = 'Property Interest';
      session.step                  = 'confirm_interest';
      return sendPropertyDetail(from, lang, property);
    }
    return sendMainMenu(from, lang);
  }

  // ── CONFIRM INTEREST → Start Lead Capture Sequence ───────────────────────────
  if (buttonId?.startsWith('confirm_')) {
    // Guard: must have a selected property; also accept property ID from button
    // in case session was re-entered
    if (!session.data.selectedProperty) {
      const propId   = buttonId.replace('confirm_', '');
      const property = ALL_PROPERTIES.find((p) => p.id === propId);
      if (property) {
        session.data.selectedProperty = property;
        session.data.intent           = 'Property Interest';
      } else {
        return sendMainMenu(from, lang);
      }
    }
    session.step = 'collect_name';
    return sendText(from, t.askName);
  }

  // ── FALLBACK ──────────────────────────────────────────────────────────────────
  return sendButtons(from, t.invalid, [{ id: 'back_menu', title: t.btnMainMenu }]);
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body    = await req.json();
    const entry   = body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return Response.json({});
    const from = message.from;

    if (message.type === 'interactive') {
      const interactive = message.interactive;
      const btnId = interactive?.button_reply?.id || interactive?.list_reply?.id;
      if (btnId) await handleMessage(from, null, btnId);
    } else if (message.type === 'text') {
      const text = message.text?.body?.trim();
      if (text) await handleMessage(from, text, null);
    }
    return Response.json({});
  } catch (err) {
    console.error('Webhook error:', err);
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
