document.getElementById("usernameText").textContent =
      "Здравствуйте, " + (localStorage.getItem("username") || "") + "!";

    function goBack() {
      window.location.href = "index.html";
    }

    function selectCategory(category) {
      localStorage.setItem("category", category);
      window.location.href = "menu.html";
    }

    function toggleLanguageMenu() {
      const menu = document.getElementById("langMenu");
      menu.classList.toggle("show");
    }

    function setLanguage(lang) {
  localStorage.setItem("language", lang);
  toggleLanguageMenu(); 
  updateUI(); 
  loadCategories(); 
    }

    
function loadCategories() {
  fetch("http://localhost:3000/categories")
    .then(res => res.json())
    .then(categories => {
      const container = document.querySelector(".categories-container");
      container.innerHTML = "";

      const lang = localStorage.getItem("language") || "ru";

      const nameField =
        lang === "ru" ? "name_ru" :
        lang === "en" ? "name_en" :
        lang === "kg" ? "name_kg" : "name_ru";

      categories.forEach(cat => {
        const div = document.createElement("div");
        div.classList.add("category-card");

        div.innerHTML = `
          <img src="${cat.image_url}" alt="">
          <p>${cat[nameField]}</p>
        `;

        div.onclick = () => {
          localStorage.setItem("category_id", cat.id);
          window.location.href = "menu.html";
        };

        container.appendChild(div);
      });
    });
}
    const translations = {
  ru: {
    greeting: "Здравствуйте",
    chooseCategory: "Выберите категорию",
    language: "Язык",
  },
  en: {
    greeting: "Hello",
    chooseCategory: "Choose a category",
    language: "Language",
  },
  kg: {
    greeting: "Саламатсызбы",
    chooseCategory: "Категорияны тандаңыз",
    language: "Тил",
  }
};
  function updateUI() {
  const lang = localStorage.getItem("language") || "ru";

  
  const username = localStorage.getItem("username") || "";
  document.getElementById("usernameText").textContent =
    `${translations[lang].greeting}, ${username}!`;

  
  document.querySelector(".title").textContent =
    translations[lang].chooseCategory;

  
  document.querySelector(".lang-btn").textContent =
    `🌐 ${translations[lang].language}`;
}
    updateUI();

    loadCategories();