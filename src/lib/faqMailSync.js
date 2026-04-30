const STORAGE_KEY = 'faq_system';
const SENT_IDS_KEY = 'faq_mail_sent_question_ids';

function loadFaqState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { questions: [], tags: [] };

    const parsed = JSON.parse(raw);
    return {
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : []
    };
  } catch {
    return { questions: [], tags: [] };
  }
}

function loadSentIds() {
  try {
    const raw = localStorage.getItem(SENT_IDS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((id) => String(id)));
  } catch {
    return new Set();
  }
}

function saveSentIds(sentIds) {
  localStorage.setItem(SENT_IDS_KEY, JSON.stringify(Array.from(sentIds)));
}

function getTagNames(question, tags) {
  const tagIds = Array.isArray(question.tags) ? question.tags : [];
  return tagIds
    .map((id) => tags.find((tag) => Number(tag.id) === Number(id))?.name)
    .filter(Boolean);
}

async function sendQuestionByMail(question, tags) {
  const payload = {
    title: question.title,
    content: question.content,
    author: question.author || 'Anonyme',
    tags: Array.isArray(question.tags) ? question.tags : [],
    tag_names: getTagNames(question, tags),
    created_at: question.created_at || new Date().toISOString(),
    local_id: question.id
  };

  const response = await fetch('/api/faq-mail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error || `Mail API returned status ${response.status}`;
    throw new Error(message);
  }
}

export async function syncPendingFaqQuestions() {
  if (typeof window === 'undefined') {
    return { pending: 0, sent: 0, failed: 0 };
  }

  const { questions, tags } = loadFaqState();
  const sentIds = loadSentIds();

  const pendingQuestions = questions.filter((question) => !sentIds.has(String(question.id)));
  if (pendingQuestions.length === 0) {
    return { pending: 0, sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const question of pendingQuestions) {
    try {
      await sendQuestionByMail(question, tags);
      sentIds.add(String(question.id));
      sent += 1;
    } catch {
      failed += 1;
    }
  }

  saveSentIds(sentIds);
  return { pending: pendingQuestions.length, sent, failed };
}
