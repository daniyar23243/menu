  const token = localStorage.getItem("admin_token");

  if (!token) {
    window.location.href = "index.html";
  }

function loadCategories() {
  fetch("http://localhost:3000/admin/categories")
    .then(res => res.json())
    .then(data => {
      
      const select = document.getElementById("categorySelect");
      select.innerHTML = "";
      data.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name_ru;
        select.appendChild(option);
      });

      const list = document.getElementById("categoryList");
      list.innerHTML = "<h2>Категории</h2>";

      data.forEach(cat => {
        const div = document.createElement("div");
        div.classList.add("admin-item");
        div.innerHTML = `
          <span>${cat.name_ru}</span>
          <button class = "${cat.is_hidden ? "tglb1" : "tglb"}" onclick="toggleCategory(${cat.id})">
            ${cat.is_hidden ? "Показать" : "Скрыть"}
          </button>
          <button onclick="deleteCategory(${cat.id})">Удалить</button>
        `;
        list.appendChild(div);
      });
    });
}

function addCategory() {
  const body = {
    name_ru: cat_ru.value,
    name_en: cat_en.value,
    name_kg: cat_kg.value,
    image_url: cat_img.value
  };

  fetch("http://localhost:3000/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(() => {
    alert("Категория добавлена!");
    loadCategories();
  });
}

function deleteCategory(id) {
  if (!confirm("Удалить категорию?")) return;

  fetch(`http://localhost:3000/categories/${id}`, {
    method: "DELETE"
  }).then(() => {
    alert("Категория удалена");
    loadCategories();
    loadItems(); 
  });
}


function loadItems() {
  fetch("http://localhost:3000/admin/categories")
    .then(res => res.json())
    .then(async categories => {
      const list = document.getElementById("itemsList");
      list.innerHTML = "<h2>Товары</h2>";

      for (const cat of categories) {
        const title = document.createElement("h3");
        title.textContent = cat.name_ru;
        list.appendChild(title);

        const items = await fetch(`http://localhost:3000/admin/categories/${cat.id}/items`)
          .then(r => r.json());

        items.forEach(item => {
          const div = document.createElement("div");
          div.classList.add("admin-item");
          div.innerHTML = `
            <span>${item.name_ru} — ${item.price} сом</span>
            <button class = "${item.is_hidden ? "tglb1" : "tglb"}" onclick="toggleItem(${item.id})">
              ${item.is_hidden ? "Показать" : "Скрыть"}
            </button>
            <button onclick="deleteItem(${item.id})">Удалить</button>
          `;
          list.appendChild(div);
        });
      }
    });
}

function addItem() {
  const desc_ru = document.getElementById("desc_ru");
  const desc_en = document.getElementById("desc_en");
  const desc_kg = document.getElementById("desc_kg");
  console.log(desc_ru.value, desc_en.value, desc_kg);
  const body = {
    category_id: categorySelect.value,
    name_ru: item_ru.value,
    name_en: item_en.value,
    name_kg: item_kg.value,
    description_ru: desc_ru.value,
    description_en: desc_en.value,
    description_kg: desc_kg.value,
    price: item_price.value,
    image_url: item_img.value
  };
  

  fetch("http://localhost:3000/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(() => {
    alert("Товар добавлен!");
    loadItems();
  });
}


function deleteItem(id) {
  if (!confirm("Удалить товар?")) return;

  fetch(`http://localhost:3000/items/${id}`, {
    method: "DELETE"
  }).then(() => {
    alert("Товар удалён");
    loadItems();
  });
}

function toggleCategory(id) {
  fetch(`http://localhost:3000/categories/${id}/toggle`, {
    method: "PATCH"
  }).then(() => {
    loadCategories();
    loadItems();
  });
}
function toggleItem(id) {
  fetch(`http://localhost:3000/items/${id}/toggle`, {
    method: "PATCH"
  }).then(() => {
    loadItems();
  });
}

loadCategories();
loadItems();