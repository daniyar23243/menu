
  const translations = {
    ru: { menu: "Меню", currency: "сом", language: "Язык" },
    en: { menu: "Menu", currency: "som", language: "Language" },
    kg: { menu: "Меню", currency: "сом", language: "Тил" }
  };

  
  function updateUI() {
    const lang = localStorage.getItem("language") || "ru";
    document.getElementById("menuTitle").textContent = translations[lang].menu;
    document.querySelector(".lang-btn").textContent = `🌐 ${translations[lang].language}`;
  }

  
  function toggleLanguageMenu() {
    document.getElementById("langMenu").classList.toggle("show");
  }

  function setLanguage(lang) {
    localStorage.setItem("language", lang);
    toggleLanguageMenu();
    updateUI();
    loadItems();
  }

  
  function loadItems() {
    const categoryId = localStorage.getItem("category_id");
    const lang = localStorage.getItem("language") || "ru";

    const nameField =
      lang === "ru" ? "name_ru" :
      lang === "en" ? "name_en" :
      lang === "kg" ? "name_kg" : "name_ru";

    fetch(`http://localhost:3000/categories/${categoryId}/items`)
      .then(res => res.json())
      .then(items => {
        const container = document.querySelector(".items-container");
        container.innerHTML = "";

        items.forEach(item => {
          const div = document.createElement("div");
          div.classList.add("item-card");

          div.innerHTML = `
            <img src="${item.image_url}">
            <div class="item-info">
              <p class="item-name">${item[nameField]}</p>
              <p class="item-price">${item.price} ${translations[lang].currency}</p>
              <p class="item-description">${item["description_" + lang] || ""}</p>
            </div>
          `;

          container.appendChild(div);
        });
      });
  }

  
  function goBack() {
    window.location.href = "categories.html";
  }

  
  updateUI();
  loadItems();