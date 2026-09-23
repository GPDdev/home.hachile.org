(() => {
  const apiOrigin = 'https://home-api.hachile.org';
  const english = document.documentElement.lang === 'en';
  const labels = english ? {
    loading: 'Loading discussions…', empty: 'No topics yet. Start the first one.', unavailable: 'Discussions are temporarily unavailable. Please try again later.',
    newTopic: 'Start a topic', reply: 'Reply to this topic', recent: 'Recent discussions', back: '← All topics', deleted: 'Deleted',
    replies: 'replies', delete: 'Delete my post', confirm: 'Delete this post?', posted: 'Published.', removed: 'Deleted.',
    verify: 'Please complete the verification.', rate_limited: 'Please wait a minute before posting again.',
    verification_failed: 'Verification failed. Please try again.', invalid_fields: 'Please check the length of your name and message.',
    not_yours: 'This browser does not hold the deletion key.', server_error: 'Server error. Please try again.'
  } : {
    loading: '正在加载讨论…', empty: '还没有主题，来发第一帖吧。', unavailable: '讨论区暂时不可用，请稍后再试。',
    newTopic: '发布新主题', reply: '回复这个主题', recent: '最近的讨论', back: '← 返回全部主题', deleted: '已删除',
    replies: '条回复', delete: '删除我的帖子', confirm: '确定删除这条内容吗？', posted: '发布成功。', removed: '已删除。',
    verify: '请先完成人机验证。', rate_limited: '发帖太频繁，请一分钟后再试。',
    verification_failed: '验证失败，请重试。', invalid_fields: '请检查昵称和内容长度。',
    not_yours: '当前浏览器没有这条内容的删除密钥。', server_error: '服务器暂时出错，请重试。'
  };
  const form = document.getElementById('discussion-form');
  if (!form) return;
  const list = document.getElementById('discussion-threads');
  const detail = document.getElementById('discussion-detail');
  const boardStatus = document.getElementById('discussion-status');
  const formStatus = document.getElementById('discussion-form-status');
  const titleField = document.getElementById('topic-title-field');
  const replyTarget = document.getElementById('reply-target');
  const cancelReply = document.getElementById('cancel-reply');
  let selectedThread = null;
  let siteKey = '';
  let widgetId = null;
  let owned;
  try { owned = JSON.parse(localStorage.getItem('home-discussion-owned') || '{}'); } catch { owned = {}; }
  form.elements.author.value = localStorage.getItem('home-discussion-name') || '';

  async function request(path, options) {
    const response = await fetch(apiOrigin + path, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'server_error');
    return data;
  }
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function time(timestamp) { return new Date(timestamp * 1000).toLocaleString(english ? 'en-US' : 'zh-CN'); }
  function errorText(error) { return labels[error.message] || labels.unavailable; }
  function saveOwned() { localStorage.setItem('home-discussion-owned', JSON.stringify(owned)); }
  function newToken() { return [...crypto.getRandomValues(new Uint8Array(32))].map(byte => byte.toString(16).padStart(2, '0')).join(''); }

  function messageCard(message, root = false) {
    const card = node('article', root ? 'thread-card' : 'message-card');
    if (root && !selectedThread) {
      const open = node('button', 'thread-open', message.hidden ? labels.deleted : message.title);
      open.type = 'button';
      open.addEventListener('click', () => openThread(message.id));
      card.append(open);
    } else if (root) card.append(node('strong', '', message.hidden ? labels.deleted : message.title));
    if (!root) card.append(node('strong', '', message.hidden ? labels.deleted : message.author));
    const info = `${message.hidden ? labels.deleted : message.author} · ${time(message.createdAt)}${root && !selectedThread ? ` · ${message.replyCount} ${labels.replies}` : ''}`;
    card.append(node('small', 'thread-meta', info));
    card.append(node('p', '', message.hidden ? labels.deleted : message.body));
    if (!message.hidden && owned[message.id]) {
      const button = node('button', 'discussion-delete', labels.delete);
      button.type = 'button';
      button.addEventListener('click', () => removeMessage(message.id));
      card.append(button);
    }
    return card;
  }

  function resetComposer() {
    selectedThread = null;
    titleField.hidden = false;
    form.elements.title.required = true;
    form.elements.body.maxLength = 2000;
    document.getElementById('discussion-form-title').textContent = labels.newTopic;
    replyTarget.hidden = true;
    cancelReply.hidden = true;
  }
  async function loadThreads() {
    resetComposer();
    list.hidden = false;
    detail.hidden = true;
    document.getElementById('discussion-board-title').textContent = labels.recent;
    boardStatus.textContent = labels.loading;
    try {
      const { threads } = await request('/api/threads');
      list.replaceChildren(...threads.map(thread => messageCard(thread, true)));
      boardStatus.textContent = threads.length ? '' : labels.empty;
    } catch { boardStatus.textContent = labels.unavailable; }
  }
  async function openThread(id) {
    selectedThread = id;
    boardStatus.textContent = labels.loading;
    try {
      const { thread, replies } = await request(`/api/threads/${id}`);
      list.hidden = true;
      detail.hidden = false;
      detail.replaceChildren();
      const back = node('button', 'discussion-back', labels.back);
      back.type = 'button';
      back.addEventListener('click', loadThreads);
      detail.append(back, messageCard(thread, true), ...replies.map(item => messageCard(item)));
      document.getElementById('discussion-board-title').textContent = thread.hidden ? labels.deleted : thread.title;
      boardStatus.textContent = '';
      titleField.hidden = true;
      form.elements.title.required = false;
      form.elements.body.maxLength = 1000;
      document.getElementById('discussion-form-title').textContent = labels.reply;
      replyTarget.textContent = thread.hidden ? labels.deleted : thread.title;
      replyTarget.hidden = false;
      cancelReply.hidden = false;
    } catch { boardStatus.textContent = labels.unavailable; }
  }
  async function removeMessage(id) {
    if (!confirm(labels.confirm)) return;
    try {
      await request(`/api/messages/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleteToken: owned[id] }) });
      delete owned[id]; saveOwned();
      formStatus.textContent = labels.removed;
      if (selectedThread) await openThread(selectedThread); else await loadThreads();
    } catch (error) { formStatus.textContent = errorText(error); }
  }
  function renderWidget() {
    if (!siteKey || !window.turnstile) return;
    if (widgetId !== null) window.turnstile.remove(widgetId);
    widgetId = window.turnstile.render('#discussion-turnstile', { sitekey: siteKey, theme: document.documentElement.dataset.theme });
  }
  async function initWidget() {
    try {
      siteKey = (await request('/api/config')).turnstileSiteKey;
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.onload = renderWidget;
      document.head.append(script);
    } catch { formStatus.textContent = labels.unavailable; }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const turnstileToken = widgetId === null ? '' : window.turnstile.getResponse(widgetId);
    if (!turnstileToken) { formStatus.textContent = labels.verify; return; }
    const author = form.elements.author.value.trim();
    const title = form.elements.title.value.trim();
    const body = form.elements.body.value.trim();
    const deleteToken = newToken();
    const path = selectedThread ? `/api/threads/${selectedThread}/replies` : '/api/threads';
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    formStatus.textContent = '';
    try {
      const { id } = await request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author, title, body, deleteToken, turnstileToken }) });
      owned[id] = deleteToken; saveOwned();
      localStorage.setItem('home-discussion-name', author);
      form.elements.body.value = '';
      form.elements.title.value = '';
      if (widgetId !== null) window.turnstile.reset(widgetId);
      if (selectedThread) await openThread(selectedThread); else await loadThreads();
      formStatus.textContent = labels.posted;
    } catch (error) {
      formStatus.textContent = errorText(error);
      if (widgetId !== null) window.turnstile.reset(widgetId);
    } finally { submit.disabled = false; }
  });
  document.getElementById('discussion-refresh').addEventListener('click', () => selectedThread ? openThread(selectedThread) : loadThreads());
  cancelReply.addEventListener('click', loadThreads);
  document.addEventListener('home-theme-change', renderWidget);
  loadThreads();
  initWidget();
})();
