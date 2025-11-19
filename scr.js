function continueToCategories() {
  const name = document.getElementById("username").value.trim();
  if (name.length === 0) return;

  // Кодовое слово для входа в админку
  const ADMIN_CODE = "admin123";  

  if (name === ADMIN_CODE) {
    window.location.href = "admin.html";
    return;
  }

  // Обычный пользователь
  localStorage.setItem("username", name);
  window.location.href = "categories.html";
}


  // ============ ПЕРЕВОД И ЯЗЫКИ ===============

  const translations = {
    ru: {
      placeholder: "Введите имя",
      continueBtn: "Продолжить",
      chooseLang: "Выбрать язык",
    },
    en: {
      placeholder: "Enter your name",
      continueBtn: "Continue",
      chooseLang: "Choose a language",
    },
    kg: {
      placeholder: "Атыңызды жазыңыз",
      continueBtn: "Улантуу",
      chooseLang: "Тилди танданыз",
    }
  };

  function setLanguage(lang) {
    localStorage.setItem("language", lang);
    updateUI(); // обновляем текст на этой странице
  }

  function updateUI() {
    const lang = localStorage.getItem("language") || "ru";
    const t = translations[lang];

    document.getElementById("username").placeholder = t.placeholder;
    document.querySelector(".btn-main").textContent = t.continueBtn;
    document.getElementById("chooseLangTitle").textContent = t.chooseLang;
  }

  // применяем язык сразу при загрузке
  updateUI();