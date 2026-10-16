// Dados Fictícios de Produtos
const productsData = [
    { id: 1, name: "Anel Solitário Prata", price: 129.90, oldPrice: 159.90, category: "anel", img: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", tag: "Oferta", isNew: false },
    { id: 2, name: "Colar Ponto de Luz", price: 159.90, oldPrice: null, category: "colar", img: "https://images.unsplash.com/photo-1599643478514-4a4e0f695905?auto=format&fit=crop&w=400&q=80", tag: "Mais Vendido", isNew: false },
    { id: 3, name: "Brinco Argola Minimalista", price: 89.90, oldPrice: null, category: "brinco", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80", tag: "", isNew: false },
    { id: 4, name: "Pulseira Elo Delicado", price: 119.90, oldPrice: null, category: "pulseira", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80", tag: "", isNew: false },
    { id: 5, name: "Colar Coração Rosé", price: 149.90, oldPrice: null, category: "colar", img: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", tag: "Novidade", isNew: true },
    { id: 6, name: "Anel Aparador Elegance", price: 99.90, oldPrice: 119.90, category: "anel", img: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=400&q=80", tag: "Oferta", isNew: false },
    { id: 7, name: "Brinco Gota Cristalina", price: 109.90, oldPrice: null, category: "brinco", img: "https://images.unsplash.com/photo-1535632787358-4bfb56e80bfa?auto=format&fit=crop&w=400&q=80", tag: "Lançamento", isNew: true },
    { id: 8, name: "Pulseira Riviera Prata", price: 189.90, oldPrice: null, category: "pulseira", img: "https://images.unsplash.com/photo-1573408301145-b98c41829e05?auto=format&fit=crop&w=400&q=80", tag: "", isNew: true }
];

// Estado da Aplicação
let cart = JSON.parse(localStorage.getItem('luna_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('luna_favs')) || [];

// Elementos DOM
const productsContainer = document.getElementById('products-container');
const newArrivalsContainer = document.getElementById('new-arrivals-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const categorySelect = document.getElementById('category-select');
const clearFiltersBtn = document.getElementById('clear-filters');
const noResultsMsg = document.getElementById('no-results');

const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const favCount = document.getElementById('fav-count');

const productModal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');

// Formatar Preço
const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Exibir Toast
const showToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// Renderizar Produtos
const renderProducts = (products, container) => {
    container.innerHTML = '';
    if (products.length === 0 && container === productsContainer) {
        noResultsMsg.classList.remove('hidden');
        return;
    }
    noResultsMsg.classList.add('hidden');

    products.forEach(product => {
        const isFav = favorites.includes(product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img" onclick="openModal(${product.id})">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
                <div class="product-badges">
                    ${product.tag ? `<span class="badge-tag">${product.tag}</span>` : ''}
                </div>
            </div>
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id}, this)" aria-label="Favoritar">
                <i class="ph ${isFav ? 'ph-heart-fill' : 'ph-heart'}"></i>
            </button>
            <div class="product-info">
                <h3 class="product-title" onclick="openModal(${product.id})">${product.name}</h3>
                <div class="stars">★★★★★</div>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <button class="btn btn-outline add-to-cart" onclick="addToCart(${product.id})">Adicionar à sacola</button>
            </div>
        `;
        container.appendChild(card);
    });
};

// Filtros e Ordenação
const applyFilters = () => {
    let filtered = productsData;
    
    // Busca
    const term = searchInput.value.toLowerCase();
    if (term) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }
    
    // Categoria
    const cat = categorySelect.value;
    if (cat !== 'all') {
        filtered = filtered.filter(p => p.category === cat);
    }
    
    // Ordenação
    const sort = sortSelect.value;
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(filtered, productsContainer);
};

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
categorySelect.addEventListener('change', applyFilters);
clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    sortSelect.value = 'default';
    categorySelect.value = 'all';
    applyFilters();
});

// Filtro via links de categoria da Home
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const filter = card.getAttribute('data-filter');
        // Mapeamento simples de plural para singular no select
        const map = { 'aneis': 'anel', 'colares': 'colar', 'brincos': 'brinco', 'pulseiras': 'pulseira' };
        categorySelect.value = map[filter] || 'all';
        applyFilters();
    });
});

// Carrinho de Compras
const updateCartUI = () => {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center mt-1">Sua sacola está vazia.</p>';
    } else {
        cart.forEach(item => {
            const product = productsData.find(p => p.id === item.id);
            total += product.price * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <span class="cart-item-price">${formatPrice(product.price)}</span>
                    <div class="cart-item-controls">
                        <div class="qty-selector" style="margin: 0;">
                            <button class="qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${product.id})">Remover</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }
    cartTotalPrice.textContent = formatPrice(total);
    localStorage.setItem('luna_cart', JSON.stringify(cart));
};

const addToCart = (id, qty = 1) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, qty });
    }
    updateCartUI();
    showToast('Adicionado à sacola!');
};

const updateQty = (id, delta) => {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty < 1) removeFromCart(id);
        else updateCartUI();
    }
};

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

// Favoritos
const updateFavUI = () => {
    favCount.textContent = favorites.length;
    localStorage.setItem('luna_favs', JSON.stringify(favorites));
};

const toggleFavorite = (id, btnElement) => {
    const index = favorites.indexOf(id);
    const icon = btnElement.querySelector('i');
    if (index === -1) {
        favorites.push(id);
        btnElement.classList.add('active');
        icon.classList.replace('ph-heart', 'ph-heart-fill');
        showToast('Adicionado aos favoritos!');
    } else {
        favorites.splice(index, 1);
        btnElement.classList.remove('active');
        icon.classList.replace('ph-heart-fill', 'ph-heart');
    }
    updateFavUI();
};

// Modais
const openModal = (id) => {
    const product = productsData.find(p => p.id === id);
    let qty = 1;
    
    modalBody.innerHTML = `
        <div class="modal-img">
            <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="product-price" style="font-size: 1.5rem; margin-bottom: 1rem;">
                <span class="price-current">${formatPrice(product.price)}</span>
            </div>
            <p>Peça delicada e elegante, desenvolvida com materiais de alta qualidade. Ideal para complementar o seu visual ou presentear alguém especial. (Descrição demonstrativa).</p>
            <ul style="margin: 1rem 0; color: var(--color-text); list-style: inside;">
                <li>Material: Prata 925</li>
                <li>Garantia: 1 ano</li>
            </ul>
            <div class="qty-selector">
                <button class="qty-btn" id="modal-qty-minus">-</button>
                <span id="modal-qty">1</span>
                <button class="qty-btn" id="modal-qty-plus">+</button>
            </div>
            <button class="btn btn-primary w-100 mb-1" id="modal-add-btn">Adicionar à sacola</button>
        </div>
    `;

    document.getElementById('modal-qty-minus').onclick = () => { if (qty > 1) { qty--; document.getElementById('modal-qty').textContent = qty; } };
    document.getElementById('modal-qty-plus').onclick = () => { qty++; document.getElementById('modal-qty').textContent = qty; };
    document.getElementById('modal-add-btn').onclick = () => { addToCart(product.id, qty); productModal.classList.remove('active'); };

    productModal.classList.add('active');
};

document.querySelector('.close-modal').onclick = () => productModal.classList.remove('active');
window.onclick = (e) => { if (e.target === productModal) productModal.classList.remove('active'); }
window.onkeydown = (e) => { if (e.key === 'Escape') productModal.classList.remove('active'); }

// Sidebar Toggle
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
};
cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);
document.getElementById('continue-shopping').addEventListener('click', toggleCart);

// Menu Mobile
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const navMenu = document.getElementById('nav-menu');

menuBtn.onclick = () => navMenu.classList.add('active');
closeMenuBtn.onclick = () => navMenu.classList.remove('active');
navMenu.querySelectorAll('a').forEach(link => {
    link.onclick = () => navMenu.classList.remove('active');
});

// Accordion FAQ
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        item.classList.toggle('active');
    });
});

// Formulários Demonstrativos
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('news-msg');
    msg.textContent = 'Inscrição demonstrativa realizada com sucesso!';
    msg.classList.remove('hidden');
    msg.style.color = '#28a745';
    e.target.reset();
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('contact-msg');
    msg.textContent = 'Mensagem de demonstração enviada!';
    msg.classList.remove('hidden');
    msg.style.color = '#28a745';
    e.target.reset();
});

// Inicialização
document.getElementById('current-year').textContent = new Date().getFullYear();
renderProducts(productsData, productsContainer);
renderProducts(productsData.filter(p => p.isNew), newArrivalsContainer);
updateCartUI();
updateFavUI();
