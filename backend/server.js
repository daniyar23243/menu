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
      [2, "Фраппе", "Frappe", "Фраппе", 200, "images/frappe.png", 0, "Освежающий холодный кофе со льдом, легкой сладостью и воздушной пеной. Отличный выбор для жаркой погоды. Объём: 350 мл", "Refreshing iced coffee with light sweetness and smooth foam. A perfect choice for hot days. Volume: 350 ml", "Муздак кофе, жумшак таттуулук жана көбүк менен. Ысык күндөргө эң идеалдуу суусундук. Көлөмү: 350 мл"],
      [2, "Мохито", "Mojito", "Мохито", 220, "images/mohito.png", 0, "Свежий цитрусово-мятный напиток с лаймом, мятой и газированной водой. Легкий, бодрящий и очень ароматный. Объём: 400 мл", "Fresh citrus-mint drink with lime, mint, and sparkling water. Light, refreshing, and very aromatic. Volume: 400 ml", "Лайм, жалбыз жана газдалган суу кошулган сергитүүчү суусундук. Жеңил, даамдуу жана жыты күчтүү. Көлөмү: 400 мл"],

      [3, "Чизкейк", "Cheesecake", "Чизкейк", 250, "images/cheesecake.png", 0, "Нежный десерт с кремовой текстурой на хрустящей основе, украшенный свежими ягодами. Лёгкий, сладкий и идеально сбалансированный. Вес: 130 г", "A delicate dessert with a creamy texture on a crunchy base, topped with fresh berries. Light, sweet, and perfectly balanced. Weight: 130 g", "Кремдүү текстурасы бар, хрустящий негизге жасалган назик десерт. Жаңы жемиштер менен кооздолгон. Салмагы: 130 г"],
      [3, "Эклер", "Eclair", "Эклер", 180, "images/eclair.png", 0, "Пышное заварное тесто, наполненное ванильным кремом и покрытое шоколадной глазурью. Классический нежный десерт. Вес: 90 г", "Soft choux pastry filled with vanilla cream and topped with chocolate glaze. A classic gentle dessert. Weight: 90 g", "Ванилдүү крем менен толтурулган, шоколад глазурь менен капталган жумшак эклер. Классикалык таттуу десерт. Салмагы: 90 г"],

      [1, "Американо", "Americano", "Американо", 150, "images/americano.png", 0, "Классический чёрный кофе с насыщенным вкусом и мягкой горчинкой. Отлично бодрит и подходит для любого времени дня. Объём: 250 мл", "Classic black coffee with a rich taste and smooth bitterness. Energizing and perfect for any time of day. Volume: 250 mlClassic black coffee with a rich taste and smooth bitterness. Energizing and perfect for any time of day. Volume: 250 ml", "Классикалык кара кофе, каныккан даам жана жумшак ачуу ноталар менен. Күндүн каалаган убагына ылайыктуу. Көлөмү: 250 мл"],
      [1, "Капучино", "Cappuccino", "Капучино", 180, "images/capuccino.png", 0, "Нежный кофе с густой молочной пеной. Идеальный баланс эспрессо и молока, мягкий и ароматный. Объём: 300 мл", "Smooth coffee with thick milk foam. Perfect balance of espresso and milk, soft and aromatic. Volume: 300 ml", "Коюу сүт көбүгү бар жумшак кофе. Эспрессо менен сүттүн мыкты айкалышы. Көлөмү: 300 мл"],
      [1, "Латте", "Latte", "Латте", 180, "images/latte.png", 0, "Легкий кофейный напиток с большим количеством молока. Мягкий вкус и нежная текстура, подходит для любителей сладости. Объём: 350 мл", "Light coffee drink with plenty of milk. Gentle taste and smooth texture, great for those who prefer mild coffee. Volume: 350 ml", "Сүтү көп болгон жеңил кофе. Жумшак даам жана назик текстура. Көлөмү: 350 мл"],

      [4, "Сендвич", "Sandwich", "Сэндвич", 230, "images/sandwich.png", 0, "Сытный сэндвич из свежего хлеба с ветчиной, сыром, овощами и лёгким соусом. Отлично подходит для быстрого перекуса. Вес: 220 г", "A hearty sandwich made with fresh bread, ham, cheese, vegetables, and a light sauce. Perfect for a quick snack. Weight: 220 g", "Жаңы нан, ветчина, сыр жана жашылчалар менен жасалган тоймок сэндвич. Тез тамактанууга эң ылайыктуу. Салмагы: 220 г"],
      [4, "Тост", "Toast", "Тост", 160, "images/toast.png", 0, "Хрустящие золотистые тосты, приготовленные из ароматного хлеба. Подаются с лёгкой начинкой или как самостоятельный перекус. Вес: 120 г", "Crispy golden toasts made from aromatic bread. Served with a light filling or as a standalone snack. Weight: 120 g", "Жыттуу нандан жасалган, кытырак алтын түстөгү тосттор. Жеңил толтурулуш менен же өзүнчө тамак кылып жесе болот. Салмагы: 120 г"]
    ];

    initialItems.forEach(item => {
      db.run(
        `INSERT INTO items ( category_id, name_ru, name_en, name_kg, price, image_url, is_hidden, description_ru, description_en, description_kg)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
  const { category_id, name_ru, name_en, name_kg, price, image_url, description_ru, description_en, description_kg} = req.body;

  db.run(
    `INSERT INTO items 
     (category_id, name_ru, name_en, name_kg, price, image_url, description_ru, description_en, description_kg) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [category_id, name_ru, name_en, name_kg, price, image_url, description_ru, description_en, description_kg],
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
