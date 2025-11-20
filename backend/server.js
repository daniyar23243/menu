const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

db.get("SELECT COUNT(*) AS count FROM categories", (err, result) => {
  if (!err && result.count === 0) {
    const initialCategories = [
      [1, "Горячие напитки", "Hot drinks", "Ысык ичимдиктер", "images/hot.png"],
      [2, "Холодные напитки", "Cold drinks", "Муздак ичимдиктер", "images/cold.png"],
      [3, "Десерты", "Desserts", "Десерттер", "images/desserts.png"],
      [4, "Закуски", "Snacks", "Закускалар", "images/snacks.png"]
    ];

    initialCategories.forEach(cat => {
      db.run(
        `INSERT INTO categories (id, name_ru, name_en, name_kg, image_url) VALUES (?, ?, ?, ?, ?)`,
        cat
      );
    });

    console.log("Начальные категории добавлены!");
  }
});
db.get("SELECT COUNT(*) AS count FROM items", (err, result) => {
  if (!err && result.count === 0) {
    
    const initialItems = [
      [2, "Фраппе", "Frappe", "Фраппе", 200, "images/frappe.png"],
      [2, "Мохито", "Mojito", "Мохито", 220, "images/mohito.png"],

      [3, "Чизкейк", "Cheesecake", "Чизкейк", 250, "images/cheesecake.png"],
      [3, "Эклер", "Eclair", "Эклер", 180, "images/eclair.png"],

      [1, "Американо", "Americano", "Американо", 150, "images/americano.png"],
      [1, "Капучино", "Cappuccino", "Капучино", 180, "images/capuccino.png"],
      [1, "Латте", "Latte", "Латте", 180, "images/latte.png"],

      [4, "Сендвич", "Sandwich", "Сэндвич", 230, "images/sandwich.png"],
      [4, "Тост", "Toast", "Тост", 160, "images/toast.png"]
    ];

    initialItems.forEach(item => {
      db.run(
        `INSERT INTO items ( category_id, name_ru, name_en, name_kg, price, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        item
      );
    });

    console.log("Начальные позиции меню добавлены!");
  }
});


app.get('/categories', (req, res) => {
  db.all("SELECT * FROM categories WHERE is_hidden = 0", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});


app.get('/categories/:id/items', (req, res) => {
  db.all(
    "SELECT * FROM items WHERE category_id = ? AND is_hidden = 0",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});


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

app.delete('/categories/:id', (req, res) => {
  db.run("DELETE FROM categories WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


app.delete('/items/:id', (req, res) => {
  db.run("DELETE FROM items WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.patch('/categories/:id/toggle', (req, res) => {
  db.run(
    "UPDATE categories SET is_hidden = NOT is_hidden WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.patch('/items/:id/toggle', (req, res) => {
  db.run(
    "UPDATE items SET is_hidden = NOT is_hidden WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.get('/admin/categories', (req, res) => {
  db.all("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.get('/admin/categories/:id/items', (req, res) => {
  db.all(
    "SELECT * FROM items WHERE category_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

app.use(express.json());

const ADMIN_CODE = "admin123";
const ADMIN_TOKEN = "SUPER_SECRET_ADMIN_TOKEN";

app.post("/admin/login", (req, res) => {
  const { code } = req.body;

  if (code === ADMIN_CODE) {
    return res.json({ ok: true, token: ADMIN_TOKEN });
  }

  return res.status(401).json({ ok: false, error: "Wrong admin code" });
});

const path = require("path");

app.get("/admin.html", (req, res) => {
  const token = req.headers["x-admin-token"];

  if (token !== ADMIN_TOKEN) {
    return res.status(403).send("Access Denied");
  }

  res.sendFile(path.join(__dirname, "admin.html"));
});
