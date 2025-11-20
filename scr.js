function continueToCategories() {
  const name = document.getElementById("username").value.trim();
  if (name.length === 0) return;

  const ADMIN_CODE = "admin123";

  if (name === ADMIN_CODE) {
    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: name })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          localStorage.setItem("admin_token", data.token);

          window.location.href = "admin.html";
        } else {
          alert("Неверный админ-код");
        }
      });

    return;
  }

  localStorage.setItem("username", name);
  window.location.href = "categories.html";
}



  

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
    updateUI();
  }

  function updateUI() {
    const lang = localStorage.getItem("language") || "ru";
    const t = translations[lang];

    document.getElementById("username").placeholder = t.placeholder;
    document.querySelector(".btn-main").textContent = t.continueBtn;
    document.getElementById("chooseLangTitle").textContent = t.chooseLang;
  }

  
  updateUI();