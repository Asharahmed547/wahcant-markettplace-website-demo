// Enhanced Product Catalog
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "tech",
    price: 350000,
    originalPrice: 399999,
    img: "https://images.unsplash.com/photo-1696446706463-7c1b7a7a3b1a",
    rating: 4.8,
    reviews: 342,
    badge: "Hot"
  },
  {
    id: 2,
    name: "Gaming Laptop RTX 4090",
    category: "tech",
    price: 250000,
    originalPrice: 299999,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    rating: 4.7,
    reviews: 256,
    badge: "Sale"
  },
  {
    id: 3,
    name: "Premium Running Sneakers",
    category: "fashion",
    price: 12000,
    originalPrice: 15999,
    img: "https://images.unsplash.com/photo-1528701800489-20be3c8c7b0b",
    rating: 4.6,
    reviews: 189,
    badge: null
  },
  {
    id: 4,
    name: "Gourmet Burger Meal Combo",
    category: "food",
    price: 500,
    originalPrice: 799,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    rating: 4.5,
    reviews: 421,
    badge: null
  },
  {
    id: 5,
    name: "Wireless Headphones Pro",
    category: "tech",
    price: 25000,
    originalPrice: 35999,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    rating: 4.9,
    reviews: 512,
    badge: "New"
  },
  {
    id: 6,
    name: "Designer Casual Watch",
    category: "fashion",
    price: 8500,
    originalPrice: 12999,
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f",
    rating: 4.4,
    reviews: 278,
    badge: null
  },
  {
    id: 7,
    name: "Organic Coffee Beans (500g)",
    category: "food",
    price: 750,
    originalPrice: 1099,
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4",
    rating: 4.7,
    reviews: 334,
    badge: null
  },
  {
    id: 8,
    name: "4K Webcam with Mic",
    category: "tech",
    price: 18000,
    originalPrice: 24999,
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    rating: 4.3,
    reviews: 156,
    badge: null
  }
];

let filteredProducts = [...products];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  if (!notification) return;
  
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(price).replace('PKR', 'Rs');
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '★'.repeat(fullStars);
  if (hasHalf) stars += '☆';
  return stars;
}

function calculateDiscount(original, current) {
  return Math.round(((original - current) / original) * 100);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cart.length;
}

// ===== PRODUCT RENDERING =====
function renderProducts(productsToRender = products) {
  const productDiv = document.getElementById("products");
  if (!productDiv) return;
  
  productDiv.innerHTML = "";
  
  if (productsToRender.length === 0) {
    productDiv.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
        <i class="fas fa-inbox" style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;"></i>
        <h3 style="color: #1e293b;">No products found</h3>
        <p>Try adjusting your filters or search</p>
      </div>
    `;
    return;
  }
  
  productsToRender.forEach(product => {
    const discount = calculateDiscount(product.originalPrice, product.price);
    const isInCart = cart.includes(product.id);
    
    const card = document.createElement("div");
    card.className = "card";
    
    card.innerHTML = `
      <div class="card-image">
        <img src="${product.img}" alt="${product.name}" />
        ${product.badge ? `<span class="card-badge ${product.badge === 'Sale' ? 'discount' : ''}">${product.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${product.category}</div>
        <h3 class="card-title">${product.name}</h3>
        <div class="card-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="count">${product.reviews} reviews</span>
        </div>
        <div class="card-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          <span class="price-original">${formatPrice(product.originalPrice)}</span>
          <span style="color: #ef4444; font-weight: 600; font-size: 12px;">${discount}% off</span>
        </div>
        <div class="card-actions">
          <button class="card-btn add-to-cart" onclick="addToCart(${product.id})">
            <i class="fas fa-shopping-cart"></i> ${isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button class="card-btn wishlist-btn-card" onclick="toggleWishlist(${product.id})">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;
    
    productDiv.appendChild(card);
  });
}

// ===== CART MANAGEMENT =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!cart.includes(id)) {
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    showNotification(`✓ ${product.name} added to cart!`);
    renderProducts(filteredProducts);
  } else {
    showNotification("Item already in cart", "warning");
  }
}

function removeFromCart(id) {
  const index = cart.indexOf(id);
  if (index > -1) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    renderCart();
    showNotification("Item removed from cart");
  }
}

function updateQuantity(id, quantity) {
  quantity = parseInt(quantity) || 1;
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  
  const currentCount = cart.filter(item => item === id).length;
  const difference = quantity - currentCount;
  
  if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      cart.push(id);
    }
  } else if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      const index = cart.indexOf(id);
      if (index > -1) cart.splice(index, 1);
    }
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function toggleWishlist(id) {
  const btn = event.target.closest('.wishlist-btn-card');
  if (btn) {
    btn.classList.toggle('active');
    showNotification("Added to wishlist");
  }
}

// ===== CART PAGE RENDERING =====
function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const itemCount = document.getElementById("itemCount");
  
  if (!cartItemsDiv) return;
  
  cartItemsDiv.innerHTML = "";
  
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = "block";
    return;
  }
  
  if (emptyCart) emptyCart.style.display = "none";
  if (itemCount) itemCount.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;
  
  // Group cart items by product
  const cartGroups = {};
  cart.forEach(id => {
    cartGroups[id] = (cartGroups[id] || 0) + 1;
  });
  
  Object.entries(cartGroups).forEach(([id, quantity]) => {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) return;
    
    const item = document.createElement("div");
    item.className = "cart-item";
    
    item.innerHTML = `
      <div class="cart-item-image">
        <img src="${product.img}" alt="${product.name}" />
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${product.name}</div>
        <div class="cart-item-category">${product.category}</div>
        <div class="cart-item-price">${formatPrice(product.price)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity - 1})">−</button>
          <input type="number" class="quantity-input" value="${quantity}" min="1" onchange="updateQuantity(${product.id}, this.value)">
          <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity + 1})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Remove">
        <i class="fas fa-trash"></i>
      </button>
    `;
    
    cartItemsDiv.appendChild(item);
  });
  
  updateCartSummary();
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, id) => {
    const product = products.find(p => p.id === id);
    return sum + (product?.price || 0);
  }, 0);
  
  const shipping = subtotal > 5000 ? 0 : 300;
  const tax = Math.round(subtotal * 0.17);
  const total = subtotal + shipping + tax;
  
  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("shipping").textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
  document.getElementById("tax").textContent = formatPrice(tax);
  document.getElementById("total").textContent = formatPrice(total);
}

// ===== FILTERING & SORTING =====
function filterAndSort() {
  const sortSelect = document.getElementById("sortSelect");
  const categorySelect = document.getElementById("categorySelect");
  
  let result = [...products];
  
  // Filter by category
  if (categorySelect?.value !== "all") {
    result = result.filter(p => p.category === categorySelect.value);
  }
  
  // Sort
  if (sortSelect) {
    switch (sortSelect.value) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.reverse();
        break;
    }
  }
  
  filteredProducts = result;
  renderProducts(filteredProducts);
}

function resetFilters() {
  const sortSelect = document.getElementById("sortSelect");
  const categorySelect = document.getElementById("categorySelect");
  
  if (sortSelect) sortSelect.value = "featured";
  if (categorySelect) categorySelect.value = "all";
  
  filteredProducts = [...products];
  renderProducts(filteredProducts);
}

// ===== SEARCH FUNCTIONALITY =====
function handleSearch(query) {
  if (!query.trim()) {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }
  renderProducts(filteredProducts);
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  // Home page setup
  if (document.getElementById("products")) {
    renderProducts();
    updateCartBadge();
    
    const sortSelect = document.getElementById("sortSelect");
    const categorySelect = document.getElementById("categorySelect");
    const resetBtn = document.getElementById("resetBtn");
    const searchInput = document.getElementById("searchInput");
    const shopBtn = document.getElementById("shopBtn");
    
    if (sortSelect) sortSelect.addEventListener("change", filterAndSort);
    if (categorySelect) categorySelect.addEventListener("change", filterAndSort);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);
    if (searchInput) searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
    if (shopBtn) shopBtn.addEventListener("click", () => document.querySelector(".products-section").scrollIntoView({ behavior: "smooth" }));
  }
  
  // Cart page setup
  if (document.getElementById("cartItems")) {
    renderCart();
    updateCartBadge();
    
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          showNotification("Your cart is empty", "error");
          return;
        }
        showNotification("Processing checkout... (Demo Mode)");
      });
    }
  }
  
  // Checkout button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showNotification("Your cart is empty", "error");
        return;
      }
      showNotification("✓ Thank you for your order!");
    });
  }
});