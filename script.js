const products = [
    {
        id: 1,
        name: "Nike Air Max",
        price: 1599.99,
        category: "running",
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
        images: [
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
            "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
        ],
    },
    {
        id: 2,
        name: "Adidas Ultraboost",
        price: 1799.99,
        category: "running",
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
        images:
            [
                "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
                "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
                "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
                "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb"
            ],
    },
    {
        id: 3,
        name: "Puma RS-X",
        price: 1290.99,
        category: "casual",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        images: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5"
        ],
    },
    {
        id: 4,
        name: "Jordan IV Retro High",
        price: 4999.99,
        category: "sport",
        image: "img1.jpg",
        images: [
            "img1.jpg",
            "img2.jpg",
            "img3.jpg",
            "img4.jpg"
        ],
        colors: ["grey-white", "green-black", "black-white", "white-mustard"]
    },
    {
        id: 5,
        name: "Skechers Daily Wear",
        price: 2499.99,
        category: "casual",
        image: "img1_1.jpg",
        images: [
            "img1_1.jpg",
            "img1_2.jpg",
            "img1_3.jpg",
            "img1_4.jpg"
        ],
        colors: ["mustard", "black", "brown", "blue"]
    },
    {
        id: 6,
        name: "Raya Skateboarding",
        price: 1999.99,
        category: "casual",
        image: "img2_1.jpg", // First image in attachments
        images: [
            "img2_1.jpg",
            "img2_1.jpg",
            "img2_1.jpg",
            "img2_1.jpg"
        ],
        colors: ["white-green"]
    }
    // Add more products as needed
];

// Filter and sort state
let filteredProducts = [...products];
let activeFilters = {
    categories: new Set(),
    maxPrice: 5000
};

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add cart icon click handler
document.querySelector('.cart-icon')?.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

const productColorImages = {
    4: { // Jordan IV
        'grey-white': 'img1.jpg',
        'green-black': 'img2.jpg',
        'black-white': 'img3.jpg',
        'white-mustard': 'img4.jpg'
    },
    5: { // Skechers
        'mustard': 'img1_1.jpg',
        'black': 'img1_2.jpg',
        'brown': 'img1_3.jpg',
        'blue': 'img1_4.jpg'
    }
};

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const selectedColor = document.querySelector('.color-btn.selected')?.dataset.color;
    const selectedSize = document.querySelector('.size-grid button.selected')?.dataset.size;
    
    if (product) {
        if (!selectedSize || !selectedColor) {
            alert('Please select both size and color');
            return;
        }
        
        const cartItem = {
            ...product,
            size: selectedSize,
            color: selectedColor,
            // Use color-specific image if available
            image: productColorImages[productId]?.[selectedColor] || product.image
        };
        
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.className = 'add-feedback';
        feedback.textContent = 'Added to cart!';
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const itemsCount = document.getElementById('items-count');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = 'PKR 0.00';
        itemsCount.textContent = '0';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="product-price">PKR ${item.price.toFixed(2)}</p>
                <p class="product-size-color">Size: ${item.size}, Color: ${item.color}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `PKR ${total.toFixed(2)}`;
    itemsCount.textContent = cart.length.toString();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function renderOrderSummary() {
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutItems = document.getElementById('checkout-items');
    
    if (!checkoutTotal || !checkoutItems) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    checkoutTotal.textContent = `PKR ${total.toFixed(2)}`;

    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name}</span>
            <span>PKR ${item.price.toFixed(2)}</span>
        </div>
    `).join('');
}

// Initialize products page
function initProductsPage() {
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const priceSlider = document.querySelector('.price-slider');
    const sortSelect = document.querySelector('.sort-select');

    // Event listeners
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });

    priceSlider?.addEventListener('input', (e) => {
        const value = e.target.value;
        updatePriceRange(value);
        activeFilters.maxPrice = Number(value);
        updateFilters();
    });

    sortSelect?.addEventListener('change', updateFilters);

    // Initial render
    renderProducts();
}

function updateFilters() {
    // Update category filters
    const selectedCategories = document.querySelectorAll('.filter-group input[type="checkbox"]:checked');
    activeFilters.categories = new Set([...selectedCategories].map(cb => cb.value));

    // Apply filters
    filteredProducts = products.filter(product => {
        const categoryMatch = activeFilters.categories.size === 0 || 
                            activeFilters.categories.has(product.category);
        const priceMatch = product.price <= activeFilters.maxPrice;
        return categoryMatch && priceMatch;
    });

    // Apply sorting
    const sortMethod = document.querySelector('.sort-select').value;
    switch(sortMethod) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }

    renderProducts();
}

function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-aos="fade-up">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">PKR ${product.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</p>
                <a href="product-detail.html?id=${product.id}" class="view-product-btn">
                    <i class="fas fa-eye"></i>
                    View Product
                </a>
            </div>
        </div>
    `).join('');
}

// Update price range display in filter
function updatePriceRange(value) {
    document.querySelector('.price-range').textContent = 
        `PKR ${Number(value).toLocaleString('en-US')}`;
}

// Update price slider event listener
function initProductsPage() {
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const priceSlider = document.querySelector('.price-slider');
    const sortSelect = document.querySelector('.sort-select');

    // Event listeners
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });

    priceSlider?.addEventListener('input', (e) => {
        const value = e.target.value;
        updatePriceRange(value);
        activeFilters.maxPrice = Number(value);
        updateFilters();
    });

    sortSelect?.addEventListener('change', updateFilters);

    // Initial render
    renderProducts();
}

function updateFilters() {
    // Update category filters
    const selectedCategories = document.querySelectorAll('.filter-group input[type="checkbox"]:checked');
    activeFilters.categories = new Set([...selectedCategories].map(cb => cb.value));

    // Apply filters
    filteredProducts = products.filter(product => {
        const categoryMatch = activeFilters.categories.size === 0 || 
                            activeFilters.categories.has(product.category);
        const priceMatch = product.price <= activeFilters.maxPrice;
        return categoryMatch && priceMatch;
    });

    // Apply sorting
    const sortMethod = document.querySelector('.sort-select').value;
    switch(sortMethod) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }

    renderProducts();
}

function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-aos="fade-up">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">PKR ${product.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</p>
                <a href="product-detail.html?id=${product.id}" class="view-product-btn">
                    <i class="fas fa-eye"></i>
                    View Product
                </a>
            </div>
        </div>
    `).join('');
}

// Add product details object for different products
const productDetails = {
    1: {
        name: "Nike Air Max",
        price: 1599.99,
        description: "Experience unmatched comfort and style with the Nike Air Max. Featuring advanced cushioning technology and premium materials.",
        features: [
            "Air cushioning system",
            "Breathable mesh upper",
            "Durable rubber outsole",
            "Premium comfort lining"
        ],
        rating: 4.5
    },
    2: {
        name: "Adidas Ultraboost",
        price: 1799.99,
        description: "Revolutionary comfort and energy return with Adidas Ultraboost. Features BOOST technology and Primeknit upper for an adaptive, energized ride.",
        features: [
            "BOOST midsole technology",
            "Primeknit+ adaptive upper",
            "Continental™ Rubber outsole",
            "Responsive cushioning",
            "Sock-like fit"
        ],
        rating: 4.8
    },
    3: {
        name: "Puma RS-X",
        price: 1299.99,
        description: "The Puma RS-X combines retro-inspired design with modern comfort technology. Bold chunky silhouette with premium materials.",
        features: [
            "Running System technology",
            "Mesh and textile upper",
            "Chunky platform sole",
            "EVA midsole cushioning",
            "Rubber outsole for grip"
        ],
        rating: 4.4
    },
    4: {
        name: "Jordan IV Retro High",
        price: 4999.99,
        description: "The iconic Jordan IV Retro High returns with premium materials and classic colorways. A true basketball heritage masterpiece.",
        features: [
            "Premium leather and suede upper",
            "Visible Air cushioning unit",
            "Classic wing eyelets",
            "Rubber outsole with herringbone pattern",
            "Signature Jumpman branding"
        ],
        rating: 5
    },
    5: {
        name: "Skechers Daily Wear",
        price: 2499.99,
        description: "Experience all-day comfort with Skechers Daily Wear. These versatile sneakers combine memory foam technology with contemporary design.",
        features: [
            "Memory Foam cushioning",
            "Breathable mesh fabric",
            "Flexible sole design",
            "Shock absorbing midsole",
            "Easy slip-on design"
        ],
        rating: 4.5
    },
    6: {
        name: "Raya Skateboarding",
        price: 1999.99,
        description: "Built for skateboarding enthusiasts, featuring durable design with extra grip and protection for your skating adventures.",
        features: [
            "Enhanced grip sole",
            "Reinforced stitching",
            "Impact protection",
            "Board feel design",
            "Durable canvas upper"
        ],
        rating: 4.3
    }
};

const productReviews = {
    4: [
        { name: "M. Sharif", rating: 5, comment: "Best Jordan IVs I've owned!", date: "2024-01-15" },
        { name: "Abdullah", rating: 4, comment: "Great quality, runs slightly large", date: "2024-01-10" }
    ],
    5: [
        { name: "Ali", rating: 5, comment: "Super comfortable for daily use", date: "2024-01-12" },
        { name: "Huzaifa Shah", rating: 4, comment: "Good value for money", date: "2024-01-08" }
    ],
    6: [
        { name: "123", rating: 4, comment: "Perfect for skateboarding", date: "2024-01-14" }
    ],
    2: [
        { name: "Hamza K.", rating: 5, comment: "Best running shoes I've ever owned!", date: "2024-01-18" },
        { name: "Sarah A.", rating: 5, comment: "Perfect fit and super comfortable", date: "2024-01-16" },
        { name: "Usman M.", rating: 4, comment: "Great for long runs", date: "2024-01-14" }
    ],
    3: [
        { name: "Bilal R.", rating: 4, comment: "Stylish and comfortable", date: "2024-01-17" },
        { name: "Fatima S.", rating: 5, comment: "Love the retro look!", date: "2024-01-15" }
    ]
};

function addReview(productId, name, rating, comment) {
    const review = {
        name,
        rating: Number(rating),
        comment,
        date: new Date().toISOString().split('T')[0]
    };

    if (!productReviews[productId]) {
        productReviews[productId] = [];
    }

    productReviews[productId].unshift(review);
    const reviewsContainer = document.querySelector('.reviews-section .reviews-list');
    if (reviewsContainer) {
        reviewsContainer.insertAdjacentHTML('afterbegin', `
            <div class="review-card">
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${generateRatingStars(review.rating)}
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `);
    }
}

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    const details = productDetails[productId];
    
    if (product && details && document.querySelector('.product-detail')) {
        document.title = `${details.name} | SneakrHub`;
        document.querySelector('.main-image img').src = product.image;
        document.querySelector('.product-info-detail h1').textContent = details.name;
        document.querySelector('.price').textContent = `PKR ${details.price.toFixed(2)}`;
        document.querySelector('.description p').textContent = details.description;
        
        // Update features
        const featuresList = document.querySelector('.features ul');
        featuresList.innerHTML = details.features.map(feature => `<li>${feature}</li>`).join('');
        
        // Update rating with actual review count
        const reviews = productReviews[productId] || [];
        const rating = document.querySelector('.rating');
        rating.innerHTML = generateRatingStars(details.rating) + 
            `<span>(${reviews.length} reviews)</span>`;

        // Update thumbnails if product has multiple images
        if (product.images) {
            const thumbnailGrid = document.querySelector('.thumbnail-grid');
            thumbnailGrid.innerHTML = product.images.map(img => `
                <img src="${img}" alt="${details.name}" onclick="updateMainImage(this.src)">
            `).join('');
        }

        // Add size selection handler
        const sizeButtons = document.querySelectorAll('.size-grid button');
        sizeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
                product.selectedSize = e.target.dataset.size;
            });
        });

        // Add color selection handler
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                colorButtons.forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
                product.selectedColor = e.target.dataset.color;
                handleColorSelection(product, e.target);
            });
        });

        // Update add to cart function to include size and color
        const addToCartBtn = document.querySelector('.add-to-cart-large');
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                if (!product.selectedSize || !product.selectedColor) {
                    alert('Please select both size and color');
                    return;
                }
                addToCart(product.id);
            };
        }

        // Update color options with proper gradient handling
        const colorGrid = document.querySelector('.color-grid');
        if (colorGrid && product.colors) {
            colorGrid.innerHTML = product.colors.map(color => {
                const style = color.includes('-') ? 
                    `background: ${getColorCode(color)}` : 
                    `background-color: ${getColorCode(color)}`;
                    
                return `
                    <button class="color-btn" data-color="${color}" 
                        style="${style}"></button>
                `;
            }).join('');

            // Add click handlers for new color buttons
            colorGrid.querySelectorAll('.color-btn').forEach(button => {
                button.addEventListener('click', () => {
                    colorGrid.querySelectorAll('.color-btn').forEach(btn => 
                        btn.classList.remove('selected'));
                    button.classList.add('selected');
                    product.selectedColor = button.dataset.color;
                });
            });
        }

        // Add reviews section
        const reviewsSection = document.querySelector('.reviews-section');
        if (reviewsSection && productReviews[productId]) {
            renderReviews(productId, reviewsSection);
        }
    }
}

function renderReviews(productId, container) {
    const reviews = productReviews[productId] || [];
    const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
    
    container.innerHTML = `
        <h3>Customer Reviews</h3>
        <div class="average-rating">
            <span>${averageRating.toFixed(1)}</span>
            ${generateRatingStars(averageRating)}
            <span>(${reviews.length} reviews)</span>
        </div>
        <div class="reviews-list">
            ${reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <span class="reviewer-name">${review.name}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-rating">
                        ${generateRatingStars(review.rating)}
                    </div>
                    <p class="review-comment">${review.comment}</p>
                </div>
            `).join('')}
        </div>
        <form class="review-form" onsubmit="handleReviewSubmit(event, ${productId})">
            <h4>Add a Review</h4>
            <input type="text" name="name" placeholder="Your Name" required>
            <select name="rating" required>
                <option value="">Select Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
            </select>
            <textarea name="comment" placeholder="Your Review" required></textarea>
            <button type="submit" class="submit-review">Submit Review</button>
        </form>
    `;
}

function handleReviewSubmit(event, productId) {
    event.preventDefault();
    const form = event.target;
    const newReview = {
        name: form.name.value,
        rating: Number(form.rating.value),
        comment: form.comment.value,
        date: new Date().toISOString().split('T')[0]
    };
    
    if (!productReviews[productId]) {
        productReviews[productId] = [];
    }
    
    productReviews[productId].unshift(newReview);
    renderReviews(productId, document.querySelector('.reviews-section'));
    form.reset();
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    return stars;
}

function updateMainImage(src) {
    const mainImage = document.querySelector('.main-image img');
    if (mainImage) {
        mainImage.src = src;
    }
}

function getColorCode(colorName) {
    const colorMap = {
        // Jordan IV colors
        'grey-white': 'linear-gradient(45deg, #808080, #ffffff)',
        'green-black': 'linear-gradient(45deg, #006400, #000000)',
        'black-white': 'linear-gradient(45deg, #000000, #ffffff)',
        'white-mustard': 'linear-gradient(45deg, #ffffff, #ffdb58)',
        // Skechers colors
        'mustard': '#ffdb58',
        'black': '#000000',
        'brown': '#8b4513',
        'blue': '#0000ff',
        // Raya colors
        'white-green': 'linear-gradient(45deg, #ffffff, #008000)'
    };
    return colorMap[colorName] || colorName;
}

// Add to DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
    updateCartCount();
    renderCart();
    renderOrderSummary();
    loadProductDetails();

    // Cart icon click handler
    document.querySelector('.cart-icon')?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Checkout button click handler
    document.querySelector('.checkout-button')?.addEventListener('click', (e) => {
        if (cart.length === 0) {
            e.preventDefault();
            alert('Your cart is empty. Add some items before checking out.');
            return;
        }
        window.location.href = 'checkout.html';
    });
});

async function handleCheckout(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const orderData = {
        orderID: generateOrderID(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        customerInfo: Object.fromEntries(formData),
        date: new Date().toISOString()
    };

    try {
        // Store order locally first
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Try to send email notification (optional)
        try {
            await sendOrderNotification(orderData);
        } catch (emailError) {
            console.warn('Email notification failed:', emailError);
            // Continue with order processing even if email fails
        }

        // Clear cart and show confirmation
        localStorage.removeItem('cart');
        cart = [];
        showOrderConfirmation(orderData);
        
    } catch (error) {
        console.error('Order processing failed:', error);
        alert('There was an error processing your order. Please try again.');
    }
}

function generateOrderID() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

async function sendOrderNotification(orderData) {
    try {
        const subtotal = orderData.total;
        const shipping = 150;
        const total = subtotal + shipping;

        const templateParams = {
            order_id: orderData.orderID,
            cust_name: orderData.customerInfo.fullName,
            cust_address: orderData.customerInfo.address,
            cust_city: orderData.customerInfo.city,
            cust_phone: orderData.customerInfo.phone,
            size: orderData.items.map(item => item.size || 'N/A').join(', '),
            color: orderData.items.map(item => item.color || 'N/A').join(', '),
            name: orderData.items.map(item => item.name).join(', '),
            email: orderData.customerInfo.email,
            units: cart.length,
            price: `PKR ${subtotal.toFixed(2)}`,
            cost: `PKR ${total.toFixed(2)}`,
            orders: orderData.items.map(item => `${item.name} - PKR ${item.price}`).join('\n')
        };

        const response = await emailjs.send(
            "service_hrfiesg",
            "template_7g2oty7",
            templateParams
        );

        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
}

function showOrderConfirmation(orderData) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <i class="fas fa-check-circle"></i>
            <h2>Order Confirmed!</h2>
            <p>Order ID: ${orderData.orderID}</p>
            <p>Total Amount: PKR${orderData.total.toFixed(2)}</p>
            <p>We'll contact you shortly at ${orderData.customerInfo.phone}</p>
            <button onclick="window.location.href='index.html'">Continue Shopping</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleCheckoutClick() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some items before checking out.');
        return;
    }
    window.location.href = 'checkout.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
    updateCartCount();
    renderCart();
    renderOrderSummary();
    loadProductDetails();

    // Cart icon click handler
    document.querySelector('.cart-icon')?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Checkout button click handler
    document.querySelector('.checkout-button')?.addEventListener('click', (e) => {
        if (cart.length === 0) {
            e.preventDefault();
            alert('Your cart is empty. Add some items before checking out.');
            return;
        }
        window.location.href = 'checkout.html';
    });
});
