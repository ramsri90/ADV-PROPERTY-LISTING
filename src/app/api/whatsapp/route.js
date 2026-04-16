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
    welcomeBody: `👋 Welcome to *Webb Heads*!\n\nPlease select your language:`,
    mainMenuBody: `🏠 *Webb Heads Main Menu*\n\nWhat are you looking for today?`,
    askName: `👤 Please enter your *Full Name*:`,
    askPhone: `📱 Please enter your *WhatsApp number*:`,
    askEmail: `📧 Please enter your *Email ID*:`,
    thankYou: (name) => `✅ *Thank you${name ? ', ' + name : ''}!* Our executive will contact you shortly.\n\n📞 Direct queries: ${AGENT_PHONE}`,
    propCard: (p, idx, total) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n\n📊 ${idx + 1} of ${total}`,
    propDetail: (p) => `🏷️ *${p.name}*\n\n📍 *Loc:* ${p.location}\n💰 *Price:* ${p.price}\n📐 *Area:* ${p.area}\n📝 ${p.desc}`,
    invalid: `❌ Please use the buttons below.`,
    btnBuy: '🏠 Buy', btnRent: '🏘️ Rent', btnCommercial: '🏢 Commercial', btnInterested: '✅ Interested', btnConfirm: '✅ Yes, Contact Me', btnMainMenu: '🏠 Main Menu'
  },
  te: {
    welcomeBody: `👋 *Webb Heads*కి స్వాగతం!\n\nభాషను ఎంచుకోండి:`,
    mainMenuBody: `🏠 *మెయిన్ మెనూ*\n\nమీరు ఈరోజు ఏం వెతుకుతున్నారు?`,
    askName: `👤 దయచేసి మీ *పూర్తి పేరు* నమోదు చేయండి:`,
    askPhone: `📱 మీ *WhatsApp నంబర్* నమోదు చేయండి:`,
    askEmail: `📧 మీ *ఈమెయిల్ ఐడి* నమోదు చేయండి:`,
    thankYou: (name) => `✅ *ధన్యవాదాలు${name ? ', ' + name : ''}!* మా ఎగ్జిక్యూటివ్ త్వరలో మిమ్మల్ని సంప్రదిస్తారు.`,
    propCard: (p, idx, total) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n\n📊 ${idx + 1} / ${total}`,
    propDetail: (p) => `🏷️ *${p.name}*\n\n📍 *స్థలం:* ${p.location}\n💰 *ధర:* ${p.price}\n📝 ${p.desc}`,
    invalid: `❌ దయచేసి బటన్లను ఉపయోగించండి.`,
    btnBuy: '🏠 కొనండి', btnRent: '🏘️ అద్దెకు', btnCommercial: '🏢 కమర్షియల్', btnInterested: '✅ ఆసక్తి ఉంది', btnConfirm: '✅ నన్ను సంప్రదించండి', btnMainMenu: '🏠 మెనూ'
  },
  hi: {
    welcomeBody: `👋 *Webb Heads* में आपका स्वागत है!\n\nअपनी भाषा चुनें:`,
    mainMenuBody: `🏠 *मुख्य मेनू*\n\nआप आज क्या ढूंढ रहे हैं?`,
    askName: `👤 कृपया अपना *पूరా नाम* दर्ज करें:`,
    askPhone: `📱 अपना *WhatsApp नंबर* दर्ज करें:`,
    askEmail: `📧 अपनी *ईमेल आईडी* दर्ज करें:`,
    thankYou: (name) => `✅ *धन्यवाद${name ? ', ' + name : ''}!* हमारे कार्यकारी जल्द ही आपसे संपर्क करेंगे।`,
    propCard: (p, idx, total) => `🏷️ *${p.name}*\n📍 ${p.location}\n💰 ${p.price}\n\n📊 ${idx + 1} / ${total}`,
    propDetail: (p) => `🏷️ *${p.name}*\n\n📍 *स्थान:* ${p.location}\n💰 *कीमत:* ${p.price}\n📝 ${p.desc}`,
    invalid: `❌ कृपया बटन का उपयोग करें।`,
    btnBuy: '🏠 खरीदें', btnRent: '🏘️ किराए पर', btnCommercial: '🏢 कमर्शियल', btnInterested: '✅ रुचि है', btnConfirm: '✅ संपर्क करें', btnMainMenu: '🏠 मेनू'
  }
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

async function sendButtons(to, bodyText, buttons, headerText = null) {
  const payload = { type: 'interactive', interactive: { type: 'button', body: { text: bodyText }, action: { buttons: buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.id, title: b.title.substring(0, 20) } })) } } };
  if (headerText) payload.interactive.header = { type: 'text', text: headerText };
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

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const rawText = (text || '').trim();
  const msg = rawText.toLowerCase();
  const t = T[session.lang] || T['en'];

  // Detect Website Click
  if (msg.includes("interested in")) {
    const property = ALL_PROPERTIES.find(p => rawText.toLowerCase().includes(p.name.toLowerCase()));
    if (property) {
      session.data.selectedProperty = property;
      session.step = 'await_lang_for_web'; 
      return sendButtons(from, `Select Language / భాషను ఎంచుకోండి / भाषा चुनें`, 
        [{ id: 'lang_en', title: 'English' }, { id: 'lang_te', title: 'తెలుగు' }, { id: 'lang_hi', title: 'हिंदी' }]);
    }
  }

  // Global Reset
  if (['hi', 'hello', 'menu', 'start'].includes(msg) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    session.data = {};
    return sendButtons(from, T.en.welcomeBody, [{ id: 'lang_en', title: 'English' }, { id: 'lang_te', title: 'తెలుగు' }, { id: 'lang_hi', title: 'हिंदी' }]);
  }

  // Language Selection
  if (buttonId?.startsWith('lang_')) {
    session.lang = buttonId.replace('lang_', '');
    const currentT = T[session.lang];
    if (session.step === 'await_lang_for_web') {
        session.step = 'confirm_interest';
        return sendButtons(from, currentT.propDetail(session.data.selectedProperty), [{ id: `confirm_${session.data.selectedProperty.id}`, title: currentT.btnConfirm }, { id: 'back_menu', title: currentT.btnMainMenu }]);
    }
    session.step = 'main_menu';
    return sendButtons(from, currentT.mainMenuBody, [{ id: 'menu_buy', title: currentT.btnBuy }, { id: 'menu_rent', title: currentT.btnRent }, { id: 'menu_commercial', title: currentT.btnCommercial }]);
  }

  // Menu Handling
  if (buttonId === 'menu_buy' || buttonId === 'menu_rent' || buttonId === 'menu_commercial') {
    const list = buttonId === 'menu_buy' ? BUY_PROPERTIES : buttonId === 'menu_rent' ? RENT_PROPERTIES : BUY_PROPERTIES.filter(p => p.type === 'Commercial');
    session.data.currentList = list;
    session.data.currentIndex = 0;
    session.step = 'browsing';
    return sendPropertyCard(from, session.lang, list[0], 0, list.length);
  }

  // Fixed Slider Logic
  if (buttonId === 'next_prop' || buttonId === 'prev_prop') {
    const list = session.data.currentList;
    if (!list) return handleMessage(from, 'menu', null);
    let idx = session.data.currentIndex ?? 0;
    idx = (buttonId === 'next_prop') ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;
    session.data.currentIndex = idx;
    return sendPropertyCard(from, session.lang, list[idx], idx, list.length);
  }

  // Interest Flow
  if (buttonId?.startsWith('interested_')) {
    const propId = buttonId.replace('interested_', '');
    const property = ALL_PROPERTIES.find(p => p.id === propId);
    session.data.selectedProperty = property;
    session.step = 'confirm_interest';
    return sendButtons(from, t.propDetail(property), [{ id: `confirm_${property.id}`, title: t.btnConfirm }, { id: 'back_menu', title: t.btnMainMenu }]);
  }

  if (buttonId?.startsWith('confirm_')) {
    session.step = 'collect_name';
    return sendPayload(from, { type: 'text', text: { body: t.askName } });
  }

  // Data Collection
  if (session.step === 'collect_name') {
    session.data.leadName = rawText; session.step = 'collect_phone';
    return sendPayload(from, { type: 'text', text: { body: t.askPhone } });
  }
  if (session.step === 'collect_phone') {
    session.data.leadPhone = rawText; session.step = 'collect_email';
    return sendPayload(from, { type: 'text', text: { body: t.askEmail } });
  }
  if (session.step === 'collect_email') {
    session.data.leadEmail = rawText;
    await saveToSheets({
      name: session.data.leadName, phone: session.data.leadPhone, email: session.data.leadEmail,
      property: session.data.selectedProperty?.name, whatsapp: from, lang: session.lang, time: new Date().toISOString()
    });
    session.step = 'done';
    await sendPayload(from, { type: 'text', text: { body: t.thankYou(session.data.leadName) } });
    return sendButtons(from, "Webb Heads", [{ id: 'back_menu', title: t.btnMainMenu }]);
  }

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
  } catch (err) { return Response.json({ error: 'error' }, { status: 200 }); }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === VERIFY_TOKEN) return new Response(searchParams.get('hub.challenge'));
  return new Response('Forbidden', { status: 403 });
}
