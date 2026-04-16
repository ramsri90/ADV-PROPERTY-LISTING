// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE = '+91 22 4567 8900';
const SITE = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const BUY_PROPERTIES = [
  { id: 'p1', name: 'Luxury Sea-View Penthouse', location: 'Mumbai, Maharashtra', price: '₹12.50 Cr', beds: 5, baths: 6, area: '6,500 Sq Ft', url: `${SITE}/property/p1` },
  { id: 'p2', name: 'Modern Villa in Whitefield', location: 'Bangalore, Karnataka', price: '₹4.20 Cr', beds: 4, baths: 4, area: '3,800 Sq Ft', url: `${SITE}/property/p2` },
  { id: 'p5', name: 'Modern Tech Office Space', location: 'Hyderabad, Telangana', price: '₹18.00 Cr', beds: null, baths: null, area: '25,000 Sq Ft', url: `${SITE}/property/p5` },
  { id: 'p6', name: 'Serene Waterfront Villa', location: 'North Goa, Goa', price: '₹5.50 Cr', beds: 4, baths: 4, area: '4,200 Sq Ft', url: `${SITE}/property/p6` },
];

const RENT_PROPERTIES = [
  { id: 'p3', name: 'Prime Commercial Space in Connaught Place', location: 'New Delhi, Delhi', price: '₹8.50 Cr/mo', beds: null, baths: null, area: '2,200 Sq Ft', url: `${SITE}/property/p3` },
  { id: 'p4', name: 'Elegant Heritage Apartment', location: 'Kolkata, West Bengal', price: '₹6.80 Cr/mo', beds: 3, baths: 3, area: '2,500 Sq Ft', url: `${SITE}/property/p4` },
];

// ─── IN-MEMORY SESSION STORE ──────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    welcome: `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nReply *hi* or *menu* anytime to restart.\n\n🌐 Select your language:\n1️⃣ English\n2️⃣ తెలుగు (Telugu)\n3️⃣ हिंदी (Hindi)`,
    mainMenu: `🏠 *Webb Heads Main Menu*\n\n1️⃣ Buy Property\n2️⃣ Rent Property\n3️⃣ Commercial Property\n4️⃣ List / Sell Property\n5️⃣ Talk to an Agent`,
    buyTitle: `🏠 *Properties for Sale:*\n`,
    rentTitle: `🏘️ *Properties for Rent:*\n`,
    interestedPrompt: `Are you interested to:\n1️⃣ Buy\n2️⃣ Rent`,
    detailsPrompt: `📋 Please share your details.\n\nEnter your *Full Name*:`,
    askPhone: `📱 Enter your *Phone Number*:`,
    askEmail: `📧 Enter your *Email Address*:`,
    thankYou: `✅ Thank you! Our executive will contact you shortly.\n\nFor queries call: ${AGENT_PHONE}\n\nReply *menu* for main menu.`,
    commercial: `🏢 *Commercial Properties*\n👉 ${SITE}/commercial\n\nReply *menu* to go back.`,
    sell: `📋 *List / Sell Your Property*\n👉 ${SITE}/sell\n\nOur team will contact you within 24 hours!\nReply *menu* to go back.`,
    invalid: `❌ Invalid option. Reply *menu* for main menu.`,
    prop: (p) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${p.beds ? `\n🛏️ ${p.beds} Beds  🚿 ${p.baths} Baths` : ''}\n📐 ${p.area}\n🔗 ${p.url}`,
    agentMenu: `👨‍💼 *Talk to an Agent*\n\nEnter your *Full Name*:`,
    langPrompt: `🌐 Select language:\n1️⃣ English\n2️⃣ తెలుగు\n3️⃣ हिंदी`,
  },
  te: {
    welcome: `👋 *Webb Heads*కి స్వాగతం!\n\nఎప్పుడైనా *hi* లేదా *menu* పంపండి.\n\n🌐 భాష ఎంచుకోండి:\n1️⃣ English\n2️⃣ తెలుగు\n3️⃣ हिंदी`,
    mainMenu: `🏠 *Webb Heads మెనూ*\n\n1️⃣ ప్రాపర్టీ కొనండి\n2️⃣ అద్దెకు తీసుకోండి\n3️⃣ కమర్షియల్\n4️⃣ లిస్ట్ / అమ్మండి\n5️⃣ ఏజెంట్‌తో మాట్లాడండి`,
    buyTitle: `🏠 *అమ్మకానికి ఉన్న ప్రాపర్టీలు:*\n`,
    rentTitle: `🏘️ *అద్దెకు ఉన్న ప్రాపర్టీలు:*\n`,
    interestedPrompt: `మీకు ఏది కావాలి:\n1️⃣ కొనాలి\n2️⃣ అద్దెకు తీసుకోవాలి`,
    detailsPrompt: `📋 మీ వివరాలు నమోదు చేయండి.\n\n*పూర్తి పేరు* నమోదు చేయండి:`,
    askPhone: `📱 *ఫోన్ నంబర్* నమోదు చేయండి:`,
    askEmail: `📧 *ఇమెయిల్* నమోదు చేయండి:`,
    thankYou: `✅ ధన్యవాదాలు! మా ఎగ్జిక్యూటివ్ త్వరలో సంప్రదిస్తారు.\n\nసందేహాలకు: ${AGENT_PHONE}\n\nమెనూకు *menu* పంపండి.`,
    commercial: `🏢 *కమర్షియల్ ప్రాపర్టీలు*\n👉 ${SITE}/commercial\n\nమెనూకు *menu* పంపండి.`,
    sell: `📋 *ప్రాపర్టీ లిస్ట్ / అమ్మండి*\n👉 ${SITE}/sell\n\nమెనూకు *menu* పంపండి.`,
    invalid: `❌ చెల్లని ఆప్షన్. *menu* పంపండి.`,
    prop: (p) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${p.beds ? `\n🛏️ ${p.beds} పడకలు  🚿 ${p.baths} బాత్‌రూమ్‌లు` : ''}\n📐 ${p.area}\n🔗 ${p.url}`,
    agentMenu: `👨‍💼 *ఏజెంట్‌తో మాట్లాడండి*\n\n*పూర్తి పేరు* నమోదు చేయండి:`,
    langPrompt: `🌐 భాష ఎంచుకోండి:\n1️⃣ English\n2️⃣ తెలుగు\n3️⃣ हिंदी`,
  },
  hi: {
    welcome: `👋 *Webb Heads* में आपका स्वागत है!\n\nकभी भी *hi* या *menu* भेजें।\n\n🌐 भाषा चुनें:\n1️⃣ English\n2️⃣ తెలుగు\n3️⃣ हिंदी`,
    mainMenu: `🏠 *Webb Heads मेनू*\n\n1️⃣ प्रॉपर्टी खरीदें\n2️⃣ किराए पर लें\n3️⃣ कमर्शियल\n4️⃣ लिस्ट / बेचें\n5️⃣ एजेंट से बात करें`,
    buyTitle: `🏠 *बिक्री के लिए प्रॉपर्टी:*\n`,
    rentTitle: `🏘️ *किराए की प्रॉपर्टी:*\n`,
    interestedPrompt: `आप क्या चाहते हैं:\n1️⃣ खरीदना\n2️⃣ किराए पर लेना`,
    detailsPrompt: `📋 अपनी जानकारी दर्ज करें।\n\n*पूरा नाम* दर्ज करें:`,
    askPhone: `📱 *फोन नंबर* दर्ज करें:`,
    askEmail: `📧 *ईमेल* दर्ज करें:`,
    thankYou: `✅ धन्यवाद! हमारे एग्जीक्यूटिव जल्द संपर्क करेंगे।\n\nप्रश्नों के लिए: ${AGENT_PHONE}\n\nमेनू के लिए *menu* भेजें।`,
    commercial: `🏢 *कमर्शियल प्रॉपर्टी*\n👉 ${SITE}/commercial\n\nमेनू के लिए *menu* भेजें।`,
    sell: `📋 *प्रॉपर्टी लिस्ट / बेचें*\n👉 ${SITE}/sell\n\nमेनू के लिए *menu* भेजें।`,
    invalid: `❌ अमान्य विकल्प। *menu* भेजें।`,
    prop: (p) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}${p.beds ? `\n🛏️ ${p.beds} बेड  🚿 ${p.baths} बाथ` : ''}\n📐 ${p.area}\n🔗 ${p.url}`,
    agentMenu: `👨‍💼 *एजेंट से बात करें*\n\n*पूरा नाम* दर्ज करें:`,
    langPrompt: `🌐 भाषा चुनें:\n1️⃣ English\n2️⃣ తెలుగు\n3️⃣ हिंदी`,
  }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function buildCatalog(properties, t) {
  return properties.map((p, i) => `${i + 1}️⃣ ${t.prop(p)}`).join('\n\n');
}

function detectPropertyInquiry(text) {
  const lower = text.toLowerCase();
  if (!lower.includes('interested in')) return null;
  const all = [...BUY_PROPERTIES, ...RENT_PROPERTIES];
  return all.find(p => lower.includes(p.name.toLowerCase())) || null;
}

async function saveToSheets(data) {
  if (!SHEETS_WEBHOOK) return;
  try {
    await fetch(SHEETS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) { console.error('Sheets error:', e); }
}

async function sendPayload(to, payload) {
  const WA_TOKEN = process.env.WA_TOKEN;
  const PHONE_ID = process.env.PHONE_ID;
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload })
  });
}

async function sendText(to, body) {
  return await sendPayload(to, { text: { body } });
}

async function sendInteractiveButtons(to, body, buttons) {
  return await sendPayload(to, {
    recipient_type: 'individual',
    interactive: {
      type: 'button',
      body: { text: body },
      action: {
        buttons: buttons.map(({ id, title }) => ({ type: 'reply', reply: { id, title } }))
      }
    }
  });
}

async function sendInteractiveList(to, body, buttonText, sections) {
  return await sendPayload(to, {
    recipient_type: 'individual',
    interactive: {
      type: 'list',
      body: { text: body },
      action: {
        button: buttonText,
        sections
      }
    }
  });
}

function normalizeReply(text) {
  return text?.trim().toLowerCase();
}

function setLang(text) {
  const normalized = normalizeReply(text);
  if (normalized === '1' || normalized === 'lang_en' || normalized === 'english') return 'en';
  if (normalized === '2' || normalized === 'lang_te' || normalized === 'తెలుగు') return 'te';
  if (normalized === '3' || normalized === 'lang_hi' || normalized === 'हिंदी') return 'hi';
  return null;
}

function setIntent(text) {
  const normalized = normalizeReply(text);
  if (normalized === '1' || normalized === 'intent_buy' || normalized === 'buy') return 'Buy';
  if (normalized === '2' || normalized === 'intent_rent' || normalized === 'rent') return 'Rent';
  return null;
}

function setMenuOption(text) {
  const normalized = normalizeReply(text);
  if (normalized === '1' || normalized === 'main_1' || normalized === 'buy property') return 'main_1';
  if (normalized === '2' || normalized === 'main_2' || normalized === 'rent property') return 'main_2';
  if (normalized === '3' || normalized === 'main_3' || normalized === 'commercial property') return 'main_3';
  if (normalized === '4' || normalized === 'main_4' || normalized === 'list / sell property' || normalized === 'list sell property') return 'main_4';
  if (normalized === '5' || normalized === 'main_5' || normalized === 'talk to an agent') return 'main_5';
  return null;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text) {
  const session = getSession(from);
  const t = T[session.lang] || T.en;
  const lower = text.trim().toLowerCase();

  // Reset on hi/menu
  if (['hi', 'hello', 'hey', 'menu', 'start'].includes(lower)) {
    sessions[from] = { step: 'lang', lang: 'en', data: {} };
    return await sendInteractiveButtons(from, T.en.welcome, [
      { id: 'lang_en', title: 'English' },
      { id: 'lang_te', title: 'తెలుగు' },
      { id: 'lang_hi', title: 'हिंदी' }
    ]);
  }

  // ── FLOW 1: Click-to-chat property inquiry ──────────────────────────────────
  if (session.step === 'start') {
    const prop = detectPropertyInquiry(text);
    if (prop) {
      session.data.property = prop;
      session.step = 'inquiry_lang';
      return await sendInteractiveButtons(from, `${T.en.prop(prop)}\n\n${T.en.langPrompt}`, [
        { id: 'lang_en', title: 'English' },
        { id: 'lang_te', title: 'తెలుగు' },
        { id: 'lang_hi', title: 'हिंदी' }
      ]);
    }
    // Unknown message — show welcome
    sessions[from] = { step: 'lang', lang: 'en', data: {} };
    return await sendInteractiveButtons(from, T.en.welcome, [
      { id: 'lang_en', title: 'English' },
      { id: 'lang_te', title: 'తెలుగు' },
      { id: 'lang_hi', title: 'हिंदी' }
    ]);
  }

  // ── LANGUAGE SELECTION ──────────────────────────────────────────────────────
  if (session.step === 'lang' || session.step === 'inquiry_lang') {
    const lang = setLang(text);
    if (!lang) return await sendText(from, `Please tap a button or reply 1, 2 or 3.`);
    session.lang = lang;
    const tNew = T[lang];
    if (session.step === 'inquiry_lang') {
      session.step = 'inquiry_intent';
      return await sendInteractiveButtons(from, tNew.interestedPrompt, [
        { id: 'intent_buy', title: 'Buy' },
        { id: 'intent_rent', title: 'Rent' }
      ]);
    }
    session.step = 'main_menu';
    return await sendInteractiveList(from, tNew.mainMenu, 'Open menu', [{
      title: 'Options',
      rows: [
        { id: 'main_1', title: 'Buy Property', description: 'Browse homes for sale' },
        { id: 'main_2', title: 'Rent Property', description: 'See rental options' },
        { id: 'main_3', title: 'Commercial Property', description: 'Commercial listings' },
        { id: 'main_4', title: 'List / Sell Property', description: 'List your property' },
        { id: 'main_5', title: 'Talk to an Agent', description: 'Contact our team' }
      ]
    }] );
  }

  // ── INQUIRY INTENT ──────────────────────────────────────────────────────────
  if (session.step === 'inquiry_intent') {
    const intent = setIntent(text);
    if (!intent) return await sendText(from, t.invalid);
    session.data.intent = intent;
    session.step = 'collect_name';
    return await sendText(from, t.detailsPrompt);
  }

  // ── MAIN MENU ───────────────────────────────────────────────────────────────
  if (session.step === 'main_menu') {
    const menuOption = setMenuOption(text);
    if (menuOption === 'main_1') {
      const catalog = buildCatalog(BUY_PROPERTIES, t);
      session.step = 'start';
      return await sendText(from, `${t.buyTitle}\n${catalog}\n\n👉 ${SITE}/buy\n\nReply *menu* for main menu.`);
    }
    if (menuOption === 'main_2') {
      const catalog = buildCatalog(RENT_PROPERTIES, t);
      session.step = 'start';
      return await sendText(from, `${t.rentTitle}\n${catalog}\n\n👉 ${SITE}/rent\n\nReply *menu* for main menu.`);
    }
    if (menuOption === 'main_3') { session.step = 'start'; return await sendText(from, t.commercial); }
    if (menuOption === 'main_4') { session.step = 'start'; return await sendText(from, t.sell); }
    if (menuOption === 'main_5') {
      session.data.intent = 'Agent';
      session.step = 'collect_name';
      return await sendText(from, t.agentMenu);
    }
    return await sendText(from, t.invalid);
  }

  // ── LEAD COLLECTION ─────────────────────────────────────────────────────────
  if (session.step === 'collect_name') {
    session.data.name = text.trim();
    session.step = 'collect_phone';
    return await sendText(from, t.askPhone);
  }
  if (session.step === 'collect_phone') {
    session.data.phone = text.trim();
    session.step = 'collect_email';
    return await sendText(from, t.askEmail);
  }
  if (session.step === 'collect_email') {
    session.data.email = text.trim();
    await saveToSheets({
      timestamp: new Date().toISOString(),
      name: session.data.name,
      phone: session.data.phone,
      email: session.data.email,
      intent: session.data.intent || 'Inquiry',
      property: session.data.property?.name || 'General',
      whatsapp: from,
      language: session.lang
    });
    session.step = 'start';
    return await sendText(from, t.thankYou);
  }

  // Default fallback
  sessions[from] = { step: 'lang', lang: 'en', data: {} };
  return await sendText(from, T.en.welcome);
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return Response.json({ status: 'ok' });

    let userInput = null;
    const interactive = message.interactive;
    if (message.type === 'text') {
      userInput = message.text.body;
    }
    if (interactive) {
      userInput = interactive.button_reply?.id || interactive.list_reply?.id || interactive.button_reply?.title || interactive.list_reply?.title || message.text?.body || userInput;
    }
    if (!userInput && message.text?.body) {
      userInput = message.text.body;
    }

    if (!userInput) return Response.json({ status: 'ok' });
    await handleMessage(message.from, userInput);
    return Response.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    return Response.json({ status: 'error' }, { status: 500 });
  }
}
