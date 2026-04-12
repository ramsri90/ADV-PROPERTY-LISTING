const VERIFY_TOKEN = 'webbheads_webhook_token';

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

    if (!message || message.type !== 'text') {
      return Response.json({ status: 'ok' });
    }

    const from = message.from;
    const text = message.text.body.toLowerCase().trim();
    const WA_TOKEN = process.env.WA_TOKEN;
    const PHONE_ID = process.env.PHONE_ID;

    let reply = '';

    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      reply = `👋 Welcome to *Webb Heads* – India's Premium Property Platform!\n\nPlease reply with a number:\n1️⃣ Buy Property\n2️⃣ Rent Property\n3️⃣ Commercial Property\n4️⃣ List / Sell My Property\n5️⃣ Talk to an Agent`;
    } else if (text === '1') {
      reply = `🏠 *Buy a Property*\nBrowse our verified sale listings across India:\n👉 https://adv-property-listing-gamma.vercel.app/buy\n\nWant to filter by city? Reply with city name (e.g. *Mumbai*, *Bangalore*)`;
    } else if (text === '2') {
      reply = `🏘️ *Rent a Property*\nBrowse rental listings:\n👉 https://adv-property-listing-gamma.vercel.app/rent`;
    } else if (text === '3') {
      reply = `🏢 *Commercial Properties*\n👉 https://adv-property-listing-gamma.vercel.app/commercial`;
    } else if (text === '4') {
      reply = `📋 *List Your Property*\n👉 https://adv-property-listing-gamma.vercel.app/sell\nOur team will contact you within 24 hours!`;
    } else if (text === '5') {
      reply = `👨‍💼 *Talk to an Agent*\n👉 https://adv-property-listing-gamma.vercel.app/agents\nOr call us: +91 22 4567 8900`;
    } else {
      reply = `Sorry, I didn't understand that. 😊\nReply *hi* to see the main menu again.`;
    }

    await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: from,
        text: { body: reply },
      }),
    });

    return Response.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    return Response.json({ status: 'error' }, { status: 500 });
  }
}
