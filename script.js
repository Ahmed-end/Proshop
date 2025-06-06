// Show checkout form
function showCheckoutForm() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('cartActions').style.display = 'none';
}

// Complete purchase
function completePurchase() {
    const form = document.getElementById('shippingForm');
    if (!form.checkValidity()) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        items: [...cart],
        total: cartTotal
    };
    
    // In a real app, you would send this data to your server here
    console.log('Purchase data:', formData);
    
    alert(`Thank you for your purchase, ${formData.name}! Your order total is $${cartTotal.toFixed(2)}. A confirmation has been sent to ${formData.email}.`);
    
    // Clear cart
    cart = [];
    cartTotal = 0;
    updateCartUI();
    toggleCart();
    form.reset();
    
    // Reset checkout view
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('cartActions').style.display = 'block';
}
