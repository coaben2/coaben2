import nodemailer from 'nodemailer';

const MAIL_TO_DEFAULT = 'coaben2@gmail.com';

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const mailTo = process.env.FAQ_MAIL_TO || MAIL_TO_DEFAULT;

  if (!smtpUser || !smtpPass) {
    res.status(500).json({
      ok: false,
      error: 'SMTP_USER and SMTP_PASS must be configured in environment variables.'
    });
    return;
  }

  const payload = req.body || {};
  const title = String(payload.title || '').trim();
  const content = String(payload.content || '').trim();
  const author = String(payload.author || 'Anonyme').trim();
  const tagNames = Array.isArray(payload.tag_names) ? payload.tag_names : [];
  const createdAt = String(payload.created_at || new Date().toISOString());

  if (!title || !content) {
    res.status(400).json({ ok: false, error: 'title and content are required.' });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const subject = `[FAQ] ${title}`;
  const text = [
    'Nouvelle question FAQ',
    '',
    `Titre: ${title}`,
    `Auteur: ${author}`,
    `Date: ${createdAt}`,
    `Tags: ${tagNames.join(', ') || 'Aucun'}`,
    '',
    'Contenu:',
    content
  ].join('\n');

  const html = `
    <h2>Nouvelle question FAQ</h2>
    <p><strong>Titre:</strong> ${escapeHtml(title)}</p>
    <p><strong>Auteur:</strong> ${escapeHtml(author)}</p>
    <p><strong>Date:</strong> ${escapeHtml(createdAt)}</p>
    <p><strong>Tags:</strong> ${escapeHtml(tagNames.join(', ') || 'Aucun')}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(content)}</p>
  `;

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: mailTo,
      subject,
      text,
      html
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Mail send failed.' });
  }
}
