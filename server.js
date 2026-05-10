const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let users = [];
let orders = [];

let products = [
  {
    id: 1,
    name: "Luxury Perfume",
    price: 45,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
    description: "Elegant long-lasting perfume for daily use.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 80,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    description: "Modern smartwatch with fitness tracking.",
  },
  {
    id: 3,
    name: "Headphones",
    price: 60,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    description: "High-quality wireless headphones.",
  },
  {
    id: 4,
    name: "Backpack",
    price: 35,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    description: "Stylish backpack for school and travel.",
  },
];

app.get("/", (req, res) => {
  res.send("E-commerce Backend is running");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
  };

  users.push(newUser);

  res.json({
    message: "Account created successfully",
    user: newUser,
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    user,
  });
});

app.post("/orders", (req, res) => {
  const { userEmail, items, total } = req.body;

  const newOrder = {
    id: orders.length + 1,
    userEmail,
    items,
    total,
    date: new Date().toLocaleString(),
  };

  orders.push(newOrder);

  res.json({
    message: "Order placed successfully",
    order: newOrder,
  });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});