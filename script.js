const API_URL = "https://codealpha-ecommercestore-9y47.onrender.com";

const productsContainer = document.getElementById("productsContainer");

if (productsContainer) {
  fetch(`${API_URL}/products`)
    .then((response) => response.json())
    .then((products) => {
      productsContainer.innerHTML = "";

      products.forEach((product) => {
        productsContainer.innerHTML += `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            
            <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p class="price">$${product.price}</p>

              <a href="product-details.html?id=${product.id}">
                <button class="product-btn">View Details</button>
              </a>
            </div>
          </div>
        `;
      });
    })
    .catch((error) => {
      productsContainer.innerHTML = "<p>Failed to load products.</p>";
      console.log(error);
    });
}const productDetails = document.getElementById("productDetails");

if (productDetails) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch(`${API_URL}/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      productDetails.innerHTML = `
        <div class="product-card details-card">
          <img src="${product.image}" alt="${product.name}">

          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>

            <button class="product-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    });
}

function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart successfully!");
}const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("totalPrice");

if (cartContainer) {
  displayCart();
}

function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<h2>Your cart is empty</h2>";
    totalPrice.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartContainer.innerHTML += `
      <div class="product-card">
        <img src="${item.image}" alt="${item.name}">

        <div class="product-info">
          <h3>${item.name}</h3>

          <p>Price: $${item.price}</p>

          <p>Quantity: ${item.quantity}</p>

          <button class="product-btn" onclick="removeFromCart(${index})">
            Remove
          </button>
        </div>
      </div>
    `;
  });

  totalPrice.innerHTML = `Total: $${total}`;
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();
}
function checkout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let user = JSON.parse(localStorage.getItem("user"));

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  if (!user) {
    alert("Please login before checkout");
    window.location.href = "login.html";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
  });

  fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userEmail: user.email,
      items: cart,
      total: total,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      localStorage.removeItem("cart");
      displayCart();
    })
    .catch(() => {
      alert("Order failed");
    });
}function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (name === "" || email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      window.location.href = "login.html";
    })
    .catch(() => {
      alert("Signup failed");
    });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful");
        window.location.href = "index.html";
      } else {
        alert(data.message);
      }
    })
    .catch(() => {
      alert("Login failed");
    });
}
