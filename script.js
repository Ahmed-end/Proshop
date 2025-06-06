// Initialize cart
let cart = [];
let cartTotal = 0;

// Create particles for background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100 + 100; // Start below viewport
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation duration
        const duration = Math.random() * 10 + 10;
        
        // Random delay
        const delay = Math.random() * 5;
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Add item to cart
function addToCart(name, price) {
    // Check if item already in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Update cart total
    cartTotal += price;
    
    // Update UI
    updateCartUI();
    
    // Show success animation
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 500);
}

// Remove item from cart
function removeFromCart(index) {
    // Update total
    cartTotal -= cart[index].price * cart[index].quantity;
    
    // Remove item
    cart.splice(index, 1);
    
    // Update UI
    updateCartUI();
}

// Update quantity of item in cart
function updateQuantity(index, change) {
    const item = cart[index];
    
    // Update quantity
    const newQuantity = item.quantity + change;
    
    // Ensure quantity is at least 1
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    // Update total
    cartTotal += item.price * change;
    
    // Update quantity
    item.quantity = newQuantity;
    
    // Update UI
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
    
    // Update cart modal if open
    const cartModal = document.getElementById('cartModal');
    if (cartModal.style.display === 'block') {
        renderCartItems();
    }
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    // Add each item
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        itemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div>
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Update total
    cartTotalElement.textContent = `Total: $${cartTotal.toFixed(2)}`;
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    } else {
        cartModal.style.display = 'block';
        renderCartItems();
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Thank you for your purchase! Total: $${cartTotal.toFixed(2)}`);
    
    // Clear cart
    cart = [];
    cartTotal = 0;
    updateCartUI();
    toggleCart();
}

// Close cart when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Set home page as active if no hash
    if (!window.location.hash) {
        showPage('home');
    }
    
    // Handle form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});
