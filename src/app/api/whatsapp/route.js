const VERIFY_TOKEN = 'webbheads_webhook_token';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function sendMessage(PHONE_ID, WA_TOKEN, to, body) {
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      ...body,
    }),
  });
}

// Sends a message with up to 3 tap-able buttons
async function sendButtons(PHONE_ID, WA_TOKEN, to, headerText, bodyText, buttons) {
  await sendMessage(PHONE_ID, WA_TOKEN, to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'text', text: headerText },
      body: { text: bodyText },
      action: {
        buttons: buttons.map((b) => ({
          type: 'reply',
          reply: { id: b.id, title: b.title },
        })),
      },
    },
  });
}

// Sends a list menu (supports more than 3 options, up to 10)
async function sendList(PHONE_ID, WA_TOKEN, to, headerText, bodyText, buttonLabel, sections) {
  await sendMessage(PHONE_ID, WA_TOKEN, to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: headerText },
      body: { text: bodyText },
      action: {
        button: buttonLabel,
        sections,
      },
    },
  });
}

// Plain text fallback
async function sendText(PHONE_ID, WA_TOKEN, to, text) {
  await sendMessage(PHONE_ID, WA_TOKEN, to, {
    type: 'text',
    text: { body: text },
  });
}

// ─── Main Menu ───────────────────────────────────────────────────────────────

async function sendMainMenu(PHONE_ID, WA_TOKEN, to) {
  // WhatsApp buttons support max 3 — use a list for 5 options
  await sendList(PHONE_ID, WA_TOKEN, to,
    '🏡 Webb Heads',
    'Welcome to *Webb Heads* – India\'s Premium Property Platform!\n\nHow can we help you today?',
    'View Options',
    [
      {
        title: 'Properties',
        rows: [
          { id: 'BUY',        title: '🏠 Buy Property',         description: 'Browse verified sale listings' },
          { id: 'RENT',       title: '🏘️ Rent Property',        description: 'Explore rental listings' },
          { id: 'COMMERCIAL', title: '🏢 Commercial Property',   description: 'Office, retail & more' },
        ],
      },
      {
        title: 'Other Services',
        rows: [
          { id: 'SELL',  title: '📋 List / Sell My Property', description: 'Post your property with us' },
          { id: 'AGENT', title: '👨‍💼 Talk to an Agent',        description: 'Get personalised assistance' },
        ],
      },
    ]
  );
}

// ─── GET – Webhook Verification ──────────────────────────────────────────────

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

// ─── POST – Incoming Messages ─────────────────────────────────────────────────

export async function POST(req) {
  try {
    const body    = await req.json();
    const value   = body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    if (!message) return Response.json({ status: 'ok' });

    const from     = message.from;
    const WA_TOKEN = process.env.WA_TOKEN;
    const PHONE_ID = process.env.PHONE_ID;

    // ── Interactive reply (button / list tap) ──────────────────────────────
    if (message.type === 'interactive') {
      const buttonId =
        message.interactive?.button_reply?.id ||   // button tap
        message.interactive?.list_reply?.id;       // list selection

      switch (buttonId) {
        case 'BUY':
          await sendButtons(PHONE_ID, WA_TOKEN, from,
            '🏠 Buy a Property',
            'Browse our verified sale listings across India:\n👉 https://adv-property-listing-gamma.vercel.app/buy\n\nWould you like to filter further?',
            [
              { id: 'MAIN_MENU', title: '🏠 Main Menu' },
              { id: 'AGENT',     title: '👨‍💼 Talk to Agent' },
            ]
          );
          break;

        case 'RENT':
          await sendButtons(PHONE_ID, WA_TOKEN, from,
            '🏘️ Rent a Property',
            'Browse rental listings across India:\n👉 https://adv-property-listing-gamma.vercel.app/rent',
            [
              { id: 'MAIN_MENU', title: '🏠 Main Menu' },
              { id: 'AGENT',     title: '👨‍💼 Talk to Agent' },
            ]
          );
          break;

        case 'COMMERCIAL':
          await sendButtons(PHONE_ID, WA_TOKEN, from,
            '🏢 Commercial Properties',
            'Explore office spaces, retail shops & more:\n👉 https://adv-property-listing-gamma.vercel.app/commercial',
            [
              { id: 'MAIN_MENU', title: '🏠 Main Menu' },
              { id: 'AGENT',     title: '👨‍💼 Talk to Agent' },
            ]
          );
          break;

        case 'SELL':
          await sendButtons(PHONE_ID, WA_TOKEN, from,
            '📋 List Your Property',
            'Post your property with Webb Heads:\n👉 https://adv-property-listing-gamma.vercel.app/sell\n\nOur team will contact you within 24 hours!',
            [
              { id: 'MAIN_MENU', title: '🏠 Main Menu' },
              { id: 'AGENT',     title: '👨‍💼 Talk to Agent' },
            ]
          );
          break;

        case 'AGENT':
          await sendButtons(PHONE_ID, WA_TOKEN, from,
            '👨‍💼 Talk to an Agent',
            'Our agents are ready to help!\n👉 https://adv-property-listing-gamma.vercel.app/agents\n\n📞 Call us: +91 22 4567 8900',
            [
              { id: 'MAIN_MENU', title: '🏠 Main Menu' },
            ]
          );
          break;

        case 'MAIN_MENU':
          await sendMainMenu(PHONE_ID, WA_TOKEN, from);
          break;

        default:
          await sendMainMenu(PHONE_ID, WA_TOKEN, from);
      }

      return Response.json({ status: 'ok' });
    }

    // ── Text message ───────────────────────────────────────────────────────
    if (message.type === 'text') {
      const text = message.text.body.toLowerCase().trim();

      if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text === 'menu') {
        await sendMainMenu(PHONE_ID, WA_TOKEN, from);
      } else {
        // User typed something else – show menu with a gentle prompt
        await sendText(PHONE_ID, WA_TOKEN, from,
          'I\'m not sure I understood that 😊\nSay *hi* or *menu* to see your options.'
        );
      }

      return Response.json({ status: 'ok' });
    }

    // ── Unsupported message type (image, audio, etc.) ──────────────────────
    await sendText(PHONE_ID, WA_TOKEN, from,
      'I can only handle text and button replies right now. Say *hi* to get started! 😊'
    );

    return Response.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    return Response.json({ status: 'error' }, { status: 500 });
  }
}