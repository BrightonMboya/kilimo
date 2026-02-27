import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_RECIPIENT;
    const from = process.env.RESEND_FROM;

    if (!apiKey) {
      console.error('Missing RESEND_API_KEY env var');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    if (!recipient || !from) {
      console.error('Missing RESEND_FROM or CONTACT_RECIPIENT env vars');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to: recipient,
      subject: `Contact form: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error sending contact email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
