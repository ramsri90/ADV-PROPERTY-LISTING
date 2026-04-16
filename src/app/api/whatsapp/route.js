// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VERIFY_TOKEN = 'webbheads_webhook_token';
const AGENT_PHONE = '+91 22 4567 8900';
const SITE = 'https://adv-property-listing-gamma.vercel.app';
const SHEETS_WEBHOOK = process.env.SHEETS_WEBHOOK_URL;

// ─── PROPERTY DATA ────────────────────────────────────────────────────────────
const BUY_PROPERTIES = [ /* SAME AS YOURS (NO CHANGE) */ ];
const RENT_PROPERTIES = [ /* SAME AS YOURS (NO CHANGE) */ ];

// ─── SESSION STORE ────────────────────────────────────────────────────────────
const sessions = {};
function getSession(from) {
  if (!sessions[from]) sessions[from] = { step: 'start', lang: 'en', data: {} };
  return sessions[from];
}

// ─── TRANSLATIONS (NO CHANGE) ─────────────────────────────────────────────────
const T = { /* KEEP SAME */ };

// ─── HELPERS (NO CHANGE) ──────────────────────────────────────────────────────
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

async function sendButtons(to, bodyText, buttons) {
  return sendPayload(to, {
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
  });
}

// ─── ✅ UPDATED PROPERTY CARD (SLIDER) ────────────────────────────────────────
async function sendPropertyCard(to, lang, property) {
  const t = T[lang];
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
          { type: 'reply', reply: { id: `prev_${property.id}`, title: '⬅️ Prev' } },
          { type: 'reply', reply: { id: `interested_${property.id}`, title: t.btnInterested } },
          { type: 'reply', reply: { id: `next_${property.id}`, title: 'Next ➡️' } },
        ],
      },
    },
  });
}

// ─── PROPERTY DETAIL ──────────────────────────────────────────────────────────
function sendPropertyDetail(to, lang, property) {
  const t = T[lang];
  return sendButtons(to, t.propDetail(property), [
    { id: `confirm_${property.id}`, title: t.btnInterested },
    { id: 'back_menu', title: t.btnMainMenu },
  ]);
}

// ─── BUY / RENT START (SLIDER INIT) ───────────────────────────────────────────
async function sendBuyProperties(to, lang, session) {
  session.data.currentList = BUY_PROPERTIES;
  session.data.currentIndex = 0;
  return sendPropertyCard(to, lang, BUY_PROPERTIES[0]);
}

async function sendRentProperties(to, lang, session) {
  session.data.currentList = RENT_PROPERTIES;
  session.data.currentIndex = 0;
  return sendPropertyCard(to, lang, RENT_PROPERTIES[0]);
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handleMessage(from, text, buttonId) {
  const session = getSession(from);
  const msg = (text || '').toLowerCase().trim();
  const t = T[session.lang] || T['en'];

  // RESET
  if (['hi', 'menu', 'start'].includes(msg) || buttonId === 'back_menu') {
    session.step = 'lang_select';
    session.data = {};
    return sendButtons(from, 'Select language', [
      { id: 'lang_en', title: 'English' },
      { id: 'lang_te', title: 'తెలుగు' },
      { id: 'lang_hi', title: 'हिंदी' },
    ]);
  }

  // LANGUAGE
  if (buttonId?.startsWith('lang_')) {
    session.lang = buttonId.split('_')[1];
    session.step = 'main_menu';
    return sendButtons(from, 'Choose option', [
      { id: 'menu_buy', title: '🏠 Buy' },
      { id: 'menu_rent', title: '🏘️ Rent' },
      { id: 'menu_commercial', title: '🏢 Commercial' },
    ]);
  }

  // BUY / RENT
  if (buttonId === 'menu_buy') return sendBuyProperties(from, session.lang, session);
  if (buttonId === 'menu_rent') return sendRentProperties(from, session.lang, session);

  // ─── ✅ SLIDER NAVIGATION ───────────────────────────────────────────────────
  if (buttonId?.startsWith('next_') || buttonId?.startsWith('prev_')) {
    const list = session.data.currentList;
    let index = session.data.currentIndex;

    if (buttonId.startsWith('next_')) index = (index + 1) % list.length;
    else index = (index - 1 + list.length) % list.length;

    session.data.currentIndex = index;
    return sendPropertyCard(from, session.lang, list[index]);
  }

  // ─── FIRST INTEREST CLICK ───────────────────────────────────────────────────
  if (buttonId?.startsWith('interested_')) {
    const id = buttonId.replace('interested_', '');
    const property = [...BUY_PROPERTIES, ...RENT_PROPERTIES].find(p => p.id === id);

    session.data.selectedProperty = property;
    await sendPropertyDetail(from, session.lang, property);

    session.step = 'confirm_interest';
    return;
  }

  // ─── SECOND INTEREST CLICK (CONFIRM) ────────────────────────────────────────
  if (buttonId?.startsWith('confirm_')) {
    session.step = 'collect_name';
    return sendText(from, t.detailsPrompt);
  }

  // ─── FORM FLOW ─────────────────────────────────────────────────────────────
  if (session.step === 'collect_name') {
    session.data.name = text;
    session.step = 'collect_phone';
    return sendText(from, t.askPhone);
  }

  if (session.step === 'collect_phone') {
    session.data.phone = text;
    session.step = 'collect_email';
    return sendText(from, t.askEmail);
  }

  if (session.step === 'collect_email') {
    session.data.email = text;
    session.step = 'main_menu';
    return sendText(from, t.thankYou);
  }
}

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return Response.json({});

  const from = message.from;

  if (message.type === 'interactive') {
    const i = message.interactive;
    const id = i.button_reply?.id || i.list_reply?.id;
    if (id) await handleMessage(from, null, id);
  }

  if (message.type === 'text') {
    await handleMessage(from, message.text.body, null);
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
