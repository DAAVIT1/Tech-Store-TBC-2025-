// TechStore JavaScript - სრული ფუნქციონალი

// Global variables
let currentUser = null;
let cart = [];
let messages = [];
let products = [];
let users = [
    { username: 'admin', password: 'admin123', email: 'admin@techstore.ge', phone: '555123456', role: 'admin' },
    { username: 'user', password: 'user123', email: 'user@techstore.ge', phone: '555123457', role: 'user' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Load initial data
    loadInitialProducts();
    updateCartDisplay();
    showPage('home');
    
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

// Load initial products
function loadInitialProducts() {
    products = [
        { id: 1, name: 'iPhone 15 Pro', price: 3499, category: 'phones', description: 'უახლესი Apple-ის ფლაგმანი 128GB მეხსიერებით', image: 'fas fa-mobile-alt' },
        { id: 2, name: 'Samsung Galaxy S24', price: 2799, category: 'phones', description: 'ძლიერი Android ტელეფონი 256GB-ით', image: 'fas fa-mobile-alt' },
        { id: 3, name: 'MacBook Air M2', price: 3199, category: 'laptops', description: 'Apple-ის ლეპტოპი M2 ჩიპით, 8GB RAM, 256GB SSD', image: 'fas fa-laptop' },
        { id: 4, name: 'Dell XPS 13', price: 2599, category: 'laptops', description: 'ფორმირება: Intel i7, 16GB RAM, 512GB SSD', image: 'fas fa-laptop' },
        { id: 5, name: 'AirPods Pro', price: 699, category: 'accessories', description: 'უკაბელო ყურსასმენები ნოიზ-კანსელაციით', image: 'fas fa-headphones' },
        { id: 6, name: 'Power Bank 20000mAh', price: 149, category: 'accessories', description: 'მაღალი ხარისხის პორტატული დატენვა', image: 'fas fa-battery-full' }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
        }
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleAddProduct);
    }

    // Filter buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-outline-primary')) {
            document.querySelectorAll('.btn-outline-primary').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// Page navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update page title
    updatePageTitle(pageName);
    
    // Load page-specific content
    switch(pageName) {
        case 'products':
            loadProducts();
            break;
        case 'cart':
            loadCart();
            break;
        case 'contact':
            loadMessages();
            break;
    }
}

// Update page title
function updatePageTitle(pageName) {
    const titles = {
        'home': 'მთავარი - TechStore',
        'products': 'პროდუქცია - TechStore',
        'about': 'ჩვენ შესახებ - TechStore',
        'contact': 'კონტაქტი - TechStore',
        'cart': 'კალათა - TechStore',
        'login': 'შესვლა - TechStore',
        'register': 'რეგისტრაცია - TechStore'
    };
    
    document.title = titles[pageName] || 'TechStore - ტექნიკის მაღაზია';
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserInterface();
        showPage('home');
        showNotification('წარმატებით შეხვედით!', 'success');
    } else {
        showNotification('არასწორი მომხმარებლის სახელი ან პაროლი!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (username.length < 3) {
        showNotification('მომხმარებლის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('პაროლები არ ემთხვევა!', 'error');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        showNotification('ეს მომხმარებლის სახელი უკვე დაკავებულია!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        username: username,
        email: email,
        phone: phone,
        password: password,
        role: 'user'
    };
    
    users.push(newUser);
    showNotification('წარმატებით დარეგისტრირდით! ახლა შეგიძლიათ შევიდეთ.', 'success');
    showPage('login');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showPage('home');
    showNotification('წარმატებით გახვედით!', 'success');
}

function updateUserInterface() {
    const userInfo = document.getElementById('userInfo');
    const adminPanel = document.getElementById('adminPanel');
    const authDropdown = document.getElementById('authDropdown');
    const authText = document.getElementById('authText');
    const addProductSection = document.getElementById('addProductSection');
    
    if (currentUser) {
        userInfo.style.display = 'block';
        document.getElementById('currentUser').textContent = currentUser.username;
        authText.textContent = currentUser.username;
        
        // Update dropdown menu
        authDropdown.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                <i class="fas fa-user"></i> ${currentUser.username}
            </a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="showPage('profile')">პროფილი</a></li>
                <li><a class="dropdown-item" href="#" onclick="logout()">გასვლა</a></li>
            </ul>
        `;
        
        // Show admin panel if user is admin
        if (currentUser.role === 'admin') {
            adminPanel.style.display = 'block';
            addProductSection.style.display = 'block';
        } else {
            adminPanel.style.display = 'none';
            addProductSection.style.display = 'none';
        }
    } else {
        userInfo.style.display = 'none';
        adminPanel.style.display = 'none';
        addProductSection.style.display = 'none';
        authText.textContent = 'ავტორიზაცია';
        
        // Reset dropdown menu
        authDropdown.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                <i class="fas fa-user"></i> ავტორიზაცია
            </a>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="showPage('login')">შესვლა</a></li>
                <li><a class="dropdown-item" href="#" onclick="showPage('register')">რეგისტრაცია</a></li>
            </ul>
        `;
    }
}

// Product management
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4 product-item';
    col.setAttribute('data-category', product.category);
    
    col.innerHTML = `
        <div class="card product-card">
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="price">${product.price} ლარი</p>
                <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price})">
                    <i class="fas fa-cart-plus"></i> კალათაში დამატება
                </button>
                ${currentUser && currentUser.role === 'admin' ? `
                    <button class="btn btn-danger btn-sm ms-2" onclick="removeProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return col;
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function showAddProductForm() {
    document.getElementById('addProductForm').style.display = 'block';
}

function hideAddProductForm() {
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('productForm').reset();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;
    
    const categoryIcons = {
        'phones': 'fas fa-mobile-alt',
        'laptops': 'fas fa-laptop',
        'accessories': 'fas fa-headphones'
    };
    
    const newProduct = {
        id: products.length + 1,
        name: name,
        price: price,
        category: category,
        description: description,
        image: categoryIcons[category] || 'fas fa-box'
    };
    
    products.push(newProduct);
    loadProducts();
    hideAddProductForm();
    showNotification('პროდუქტი წარმატებით დაემატა!', 'success');
}

function removeProduct(productId) {
    if (confirm('დარწმუნებული ხართ, რომ გსურთ ამ პროდუქტის წაშლა?')) {
        products = products.filter(p => p.id !== productId);
        loadProducts();
        showNotification('პროდუქტი წარმატებით წაიშალა!', 'success');
    }
}

// Cart functionality
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    updateCartDisplay();
    showNotification(`${name} კალათაში დაემატა!`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    loadCart();
    showNotification('პროდუქტი კალათიდან წაიშალა!', 'success');
}

function updateCartQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        updateCartDisplay();
        loadCart();
    }
}

function updateCartDisplay() {
    const cartBadge = document.querySelector('.badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
}

function loadCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted">კალათა ცარიელია</p>';
        totalPrice.textContent = '0';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                <div>
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">${item.price} ლარი</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${index}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${index}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="fw-bold">${itemTotal} ლარი</div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    totalPrice.textContent = total;
}

function checkout() {
    if (cart.length === 0) {
        showNotification('კალათა ცარიელია!', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('შეკვეთის გასაფორმებლად გთხოვთ შეხვიდეთ სისტემაში!', 'error');
        showPage('login');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`დარწმუნებული ხართ, რომ გსურთ შეკვეთის გაფორმება ${total} ლარად?`)) {
        cart = [];
        updateCartDisplay();
        loadCart();
        showNotification('შეკვეთა წარმატებით გაფორმდა! ჩვენ დაგიკავშირდებით მალე.', 'success');
        showPage('home');
    }
}

// Contact functionality
function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    const newMessage = {
        id: messages.length + 1,
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toLocaleString('ka-GE')
    };
    
    messages.push(newMessage);
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    showNotification('თქვენი მესიჯი წარმატებით გაიგზავნა!', 'success');
    loadMessages();
}

function loadMessages() {
    const messagesDisplay = document.getElementById('messagesDisplay');
    
    if (messages.length === 0) {
        messagesDisplay.innerHTML = '<p class="text-muted">შეტყობინებები არ არის</p>';
        return;
    }
    
    let messagesHTML = '';
    messages.forEach(msg => {
        messagesHTML += `
            <div class="message-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between">
                    <strong>${msg.name}</strong>
                    <small class="text-muted">${msg.date}</small>
                </div>
                <div class="mt-1">
                    <strong>თემა:</strong> ${msg.subject}
                </div>
                <div class="mt-1">
                    <strong>მესიჯი:</strong> ${msg.message}
                </div>
                <div class="mt-1">
                    <strong>ელფოსტა:</strong> ${msg.email}
                </div>
            </div>
        `;
    });
    
    messagesDisplay.innerHTML = messagesHTML;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} notification`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Smooth scrolling and animations
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Search functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Focus on search if it exists
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Add loading states
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.className = 'loading-spinner';
    loading.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">იტვირთება...</span>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// Initialize tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
    
    // Initialize Bootstrap popovers
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => {
        new bootstrap.Popover(popover);
    });
});

// Performance optimization
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle resize events
        adjustLayoutForMobile();
    }, 250);
});

function adjustLayoutForMobile() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Mobile-specific adjustments
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}