function setLanguage(lang) {
  localStorage.setItem('language', lang);
}

function continueToCategories() {
  const name = document.getElementById('username').value.trim();

  if (!name) {
    alert('Пожалуйста, введите имя');
    return;
  }

  localStorage.setItem('username', name);
  window.location.href = 'categories.html';
}
