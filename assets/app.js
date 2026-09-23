(() => {
  const toast = document.querySelector('.toast');
  let timer;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 1700);
  }

  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', async () => {
      const value = el.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(value);
        el.classList.add('copied');
        setTimeout(() => el.classList.remove('copied'), 700);
        showToast(`已复制：${value}`);
      } catch (_) {
        showToast(value);
      }
    });
  });
})();
