// Replace YOUR_DISCORD_WEBHOOK_URL with your actual Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1381570573980930141/Tt-RECOhTyjH9NtM5o6AtTk7MwbEdD36CN7aRY2LUsxQW2hne1op6RuDY-odag5wIgrW';

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
                <p>EGP ${item.price.toFixed(2)} × ${item.quantity}</p>
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
    cartTotalElement.textContent = `Total: EGP ${cartTotal.toFixed(2)}`;
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

// Enhanced checkout function with Discord integration
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Hide cart modal and show checkout modal
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('checkoutModal').style.display = 'block';
    
    // Populate order summary
    populateOrderSummary();
}

// Populate order summary in checkout modal
function populateOrderSummary() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    
    // Clear existing items
    checkoutItemsContainer.innerHTML = '';
    
    // Add each item
    cart.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('checkout-item');
        
        itemElement.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>EGP ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        
        checkoutItemsContainer.appendChild(itemElement);
    });
    
    // Update total
    checkoutTotalElement.textContent = `Total: EGP ${cartTotal.toFixed(2)}`;
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Submit order to Discord webhook
async function submitOrder() {
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.querySelector('.checkout-btn');
    
    // Get form data
    const formData = new FormData(form);
    const customerName = formData.get('customerName');
    const customerEmail = formData.get('customerEmail');
    const customerPhone = formData.get('customerPhone');
    const deliveryAddress = formData.get('deliveryAddress');
    const additionalNotes = formData.get('additionalNotes') || 'None';
    
    // Disable submit button and show loading state
    submitBtn.textContent = 'Processing Order...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Create order summary text
    let orderItems = '';
    cart.forEach((item, index) => {
        orderItems += `${index + 1}. ${item.name} × ${item.quantity} - EGP ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // Create Discord embed message
    const discordMessage = {
        embeds: [{
            title: "🛒 New Order from ProShop",
            color: 0x00ff00, // Green color
            fields: [
                {
                    name: "👤 Customer Information",
                    value: `**Name:** ${customerName}\n**Email:** ${customerEmail}\n**Phone:** ${customerPhone}`,
                    inline: false
                },
                {
                    name: "📍 Delivery Address",
                    value: `${deliveryAddress}`,
                    inline: false
                },
                {
                    name: "🛍️ Order Items",
                    value: `\`\`\`\n${orderItems}\`\`\``,
                    inline: false
                },
                {
                    name: "💰 Total Amount",
                    value: `**EGP ${cartTotal.toFixed(2)}**`,
                    inline: true
                },
                {
                    name: "📝 Additional Notes",
                    value: additionalNotes,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "ProShop Order System"
            }
        }]
    };
    
    try {
        // Send to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });
        
        if (response.ok) {
            // Success
            alert('🎉 Order placed successfully! We will contact you soon to confirm your order.');
            
            // Clear cart and close modal
            cart = [];
            cartTotal = 0;
            updateCartUI();
            closeCheckout();
            
            // Reset form
            form.reset();
        } else {
            throw new Error('Failed to send order');
        }
    } catch (error) {
        console.error('Error sending order:', error);
        alert('❌ Sorry, there was an error processing your order. Please try again or contact us directly.');
    } finally {
        // Re-enable submit button
        submitBtn.textContent = 'Place Order';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    
    if (event.target === checkoutModal) {
        closeCheckout();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Set home page as active if no hash
    if (!window.location.hash) {
        showPage('home');
    }
    
    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitOrder();
        });
    }
});
