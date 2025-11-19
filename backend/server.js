const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Авто-добавление категорий при пустой таблице
db.get("SELECT COUNT(*) AS count FROM categories", (err, result) => {
  if (!err && result.count === 0) {
    const initialCategories = [
      ["Горячие напитки", "Hot drinks", "Ысык ичимдиктер", "images/hot.png"],
      ["Холодные напитки", "Cold drinks", "Муздак ичимдиктер", "images/cold.png"],
      ["Десерты", "Desserts", "Десерттер", "images/desserts.png"],
      ["Закуски", "Snacks", "Закускалар", "images/snacks.png"]
    ];

    initialCategories.forEach(cat => {
      db.run(
        `INSERT INTO categories (name_ru, name_en, name_kg, image_url) VALUES (?, ?, ?, ?)`,
        cat
      );
    });

    console.log("Начальные категории добавлены!");
  }
});
// ===== ДОБАВЛЕНИЕ ПОЗИЦИЙ ПРИ ПЕРВОМ ЗАПУСКЕ =====
db.get("SELECT COUNT(*) AS count FROM items", (err, result) => {
  if (!err && result.count === 0) {
    
    const initialItems = [
      // Холодные напитки (cat: 1)
      [3, "Фраппе", "Frappe", "Фраппе", 200, "images/cold/frappe.png"],
      [3, "Мохито", "Mojito", "Мохито", 220, "images/cold/mojito.png"],

      // Десерты (cat: 2)
      [2, "Чизкейк", "Cheesecake", "Чизкейк", 250, "images/desserts/cheesecake.png"],
      [2, "Эклер", "Eclair", "Эклер", 180, "images/desserts/eclair.png"],

      // Горячие напитки (cat: 3)
      [3, "Американо", "Americano", "Американо", 150, "images/hot/americano.png"],
      [3, "Капучино", "Cappuccino", "Капучино", 180, "images/hot/cappuccino.png"],
      [3, "Латте", "Latte", "Латте", 180, "images/hot/latte.png"],

      // Закуски (cat: 4)
      [4, "Сендвич", "Sandwich", "Сэндвич", 230, "images/snacks/sandwich.png"],
      [4, "Тост", "Toast", "Тост", 160, "images/snacks/toast.png"]
    ];

    initialItems.forEach(item => {
      db.run(
        `INSERT INTO items (category_id, name_ru, name_en, name_kg, price, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        item
      );
    });

    console.log("Начальные позиции меню добавлены!");
  }
});


// Получить все категории
app.get('/categories', (req, res) => {
  db.all("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// Получить позиции категории
app.get('/categories/:id/items', (req, res) => {
  db.all(
    "SELECT * FROM items WHERE category_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// Добавить категорию
app.post('/categories', (req, res) => {
  const { name_ru, name_en, name_kg, image_url } = req.body;

  db.run(
    "INSERT INTO categories (name_ru, name_en, name_kg, image_url) VALUES (?, ?, ?, ?)",
    [name_ru, name_en, name_kg, image_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Добавить позицию
app.post('/items', (req, res) => {
  const { category_id, name_ru, name_en, name_kg, price, image_url } = req.body;

  db.run(
    `INSERT INTO items 
     (category_id, name_ru, name_en, name_kg, price, image_url) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [category_id, name_ru, name_en, name_kg, price, image_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Удалить категорию
app.delete('/categories/:id', (req, res) => {
  db.run("DELETE FROM categories WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Удалить позицию
app.delete('/items/:id', (req, res) => {
  db.run("DELETE FROM items WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
