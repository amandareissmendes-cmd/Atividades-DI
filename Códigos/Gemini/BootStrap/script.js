// --- DADOS DOS PRODUTOS ---
const products = [
    { id: 1, name: 'Anel Solitário Prata', price: 129.90, oldPrice: null, category: 'Anéis', img: 'https://images.unsplash.com/photo-1605100804763-247f661259cb?w=400&q=80', isNew: false, isPromo: false, available: true, desc: 'Clássico e atemporal. Anel solitário em Prata 925 com zircônia central brilhante. Perfeito para marcar momentos inesquecíveis.' },
    { id: 2, name: 'Colar Ponto de Luz', price: 159.90, oldPrice: null, category: 'Colares', img: 'https://images.unsplash.com/photo-1599643478524-fb524fa0a8a7?w=400&q=80', isNew: false, isPromo: false, available: true, desc: 'Corrente veneziana delicada com pingente ponto de luz em zircônia. O toque de brilho essencial para o dia a dia.' },
    { id: 3, name: 'Brinco Argola Minimalista', price: 89.90, oldPrice: 119.90, category: 'Brincos', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', isNew: true, isPromo: true, available: true, desc: 'Argolas lisas em Prata 925. Design leve, confortável e versátil, combinando com qualquer estilo.' },
    { id: 4, name: 'Pulseira Elo Delicado', price: 119.90, oldPrice: null, category: 'Pulseiras', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', isNew: false, isPromo: false, available: true, desc: 'Pulseira com elos finos e corações vazados. Uma joia romântica e cheia de charme.' },
    { id: 5, name: 'Colar Coração Rosé', price: 149.90, oldPrice: 189.90, category: 'Colares', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80', isNew: true, isPromo: true, available: true, desc: 'Colar em prata com banho de ouro rosé e pingente de coração cravejado. Elegância em tons quentes.' },
    { id: 6, name: 'Anel Aparador Elegance', price: 99.90, oldPrice: null, category: 'Anéis', img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b4a?w=400&q=80', isNew: false, isPromo: false, available: true, desc: 'Meia aliança cravejada com microzircônias. Ideal para usar como aparador de aliança ou compor mix de anéis.' },
    { id: 7, name: 'Brinco Gota Cristalina', price: 109.90, oldPrice: null, category: 'Brincos', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80', isNew: true, isPromo: false, available: false, desc: 'Brinco em formato de gota com pedra cristal. Sofisticado para eventos noturnos. (Esgotado no momento)' },
    { id: 8, name: 'Pulseira Riviera Prata', price: 189.90, oldPrice: 229.90, category: 'Pulseiras', img: 'https://images.unsplash.com/photo-1573408301145-b98c4af06bf1?w=400&q=80', isNew: false, isPromo: true, available: true, desc: 'A clássica pulseira Riviera em Prata 925 cravejada ponta a ponta. Luxo e brilho incomparáveis.' }
];

// --- ESTADO DA APLICAÇÃO ---
let cart = JSON.parse(localStorage.getItem('luna_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('luna_favs')) || [];
let appliedDiscount = 0;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    renderProducts(products, 'productList');
    renderNewArrivals();
    updateCartUI();
    updateFavUI();
    setupFilters();
    setupForms();
});

// --- UTILITÁRIOS ---
const formatMoney = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const getProductById = (id) => products.find(p => p.id === parseInt(id));

// --- RENDERIZAÇÃO DE PRODUTOS ---
function generateProductCard(product) {
    const isFav = favorites.includes(product.id);
    const favIcon = isFav ? 'bi-heart-fill text-danger' : 'bi-heart text-muted';
    const oldPriceHtml = product.oldPrice ? `<small class="text-muted text-decoration-line-through me-2">${formatMoney(product.oldPrice)}</small>` : '';
    const badgesHtml = `
        <div class="product-badges">
            ${product.isPromo ? '<span class="badge bg-danger">Oferta</span>' : ''}
            ${product.isNew ? '<span class="badge bg-dark">Novo</span>' : ''}
            ${!product.available ? '<span class="badge bg-secondary">Esgotado</span>' : ''}
        </div>
    `;

    return `
        <div class="col">
            <div class="card h-100 product-card border-0 bg-white">
                ${badgesHtml}
                <button class="fav-btn-card" onclick="toggleFav(${product.id}, event)" aria-label="Favoritar">
                    <i class="bi ${favIcon} fs-5" id="fav-icon-${product.id}"></i>
                </button>
                <div class="product-img-wrapper" onclick="openModal(${product.id})" style="cursor:pointer">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}" loading="lazy">
                </div>
                <div class="card-body d-flex flex-column text-center p-3">
                    <small class="text-muted mb-1" style="font-size: 0.75rem;">${product.category}</small>
                    <h5 class="card-title product-card-title mb-2">${product.name}</h5>
                    <div class="text-warning mb-2 small">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
                    </div>
                    <div class="mt-auto mb-3">
                        ${oldPriceHtml}
                        <span class="fw-bold text-pink-dark fs-5">${formatMoney(product.price)}</span>
                    </div>
                    <button class="btn btn-outline-luna w-100 btn-sm" onclick="addToCart(${product.id})" ${!product.available ? 'disabled' : ''}>
                        ${product.available ? '<i class="bi bi-bag-plus me-1"></i> Adicionar' : 'Indisponível'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts(items, containerId) {
    const container = document.getElementById(containerId);
    const noResults = document.getElementById('noResultsMsg');
    
    if(!container) return;

    if (items.length === 0) {
        container.innerHTML = '';
        if(noResults) noResults.classList.remove('d-none');
    } else {
        if(noResults) noResults.classList.add('d-none');
        container.innerHTML = items.map(generateProductCard).join('');
    }
}

function renderNewArrivals() {
    const newItems = products.filter(p => p.isNew).slice(0, 4);
    renderProducts(newItems, 'newArrivalsList');
}

// --- FILTROS E BUSCA ---
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const catFilter = document.getElementById('catFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortSelect = document.getElementById('sortSelect');

    const triggerFilter = () => applyFilters();

    if(searchInput) searchInput.addEventListener('input', triggerFilter);
    if(catFilter) catFilter.addEventListener('change', triggerFilter);
    if(priceFilter) priceFilter.addEventListener('change', triggerFilter);
    if(sortSelect) sortSelect.addEventListener('change', triggerFilter);
}

function applyFilters() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cat = document.getElementById('catFilter').value;
    const price = document.getElementById('priceFilter').value;
    const sort = document.getElementById('sortSelect').value;

    let filtered = products.filter(p => {
        const matchName = p.name.toLowerCase().includes(term);
        const matchCat = cat === 'Todos' || p.category === cat;
        let matchPrice = true;
        if (price === 'low') matchPrice = p.price <= 100;
        else if (price === 'mid') matchPrice = p.price > 100 && p.price <= 150;
        else if (price === 'high') matchPrice = p.price > 150;
        return matchName && matchCat && matchPrice;
    });

    if (sort === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'nameAsc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(filtered, 'productList');
}

function setCategoryFilter(catName) {
    const catFilter = document.getElementById('catFilter');
    if(catFilter) {
        catFilter.value = catName;
        applyFilters();
    }
}

function setPromoFilter() {
    setCategoryFilter('Todos');
    // Força mostrar os com desconto (lógica simplificada para a navegação)
    const filtered = products.filter(p => p.isPromo);
    renderProducts(filtered, 'productList');
    document.getElementById('filtros').scrollIntoView({behavior: 'smooth'});
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('catFilter').value = 'Todos';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('sortSelect').value = 'default';
    applyFilters();
}

// --- CARRINHO DE COMPRAS ---
function addToCart(id) {
    const prod = getProductById(id);
    if (!prod || !prod.available) return;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.qtd += 1;
    } else {
        cart.push({ ...prod, qtd: 1 });
    }
    saveCart();
    updateCartUI();
    
    // Mostra o offcanvas
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    offcanvas.show();
}

function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qtd += delta;
        if (item.qtd < 1) removeFromCart(id);
        else { saveCart(); updateCartUI(); }
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('luna_cart', JSON.stringify(cart));
}

function applyCoupon() {
    const cupom = document.getElementById('cupomInput').value.trim().toUpperCase();
    if (cupom === 'LUNA10') {
        appliedDiscount = 0.10; // 10%
        alert('Cupom aplicado com sucesso!');
    } else {
        appliedDiscount = 0;
        alert('Cupom inválido ou expirado.');
    }
    updateCartUI();
}

function updateCartUI() {
    const countBadge = document.getElementById('cartCount');
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountEl = document.getElementById('cartDiscount');

    // Contador Header
    const totalItems = cart.reduce((acc, item) => acc + item.qtd, 0);
    countBadge.textContent = totalItems;

    // Lista de Itens
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center text-muted mt-5"><i class="bi bi-bag-x fs-1 mb-3 d-block"></i>Sua sacola está vazia.</div>`;
        subtotalEl.textContent = 'R$ 0,00';
        totalEl.textContent = 'R$ 0,00';
        discountRow.classList.add('d-none');
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="d-flex gap-3 mb-3 border-bottom pb-3">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="flex-grow-1">
                <h6 class="mb-1 small fw-bold">${item.name}</h6>
                <div class="text-pink-dark small mb-2">${formatMoney(item.price)}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="input-group input-group-sm" style="width: 90px;">
                        <button class="btn btn-outline-secondary qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                        <input type="text" class="form-control text-center px-0" value="${item.qtd}" readonly>
                        <button class="btn btn-outline-secondary qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-link text-danger p-0 small text-decoration-none" onclick="removeFromCart(${item.id})"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');

    // Valores
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qtd), 0);
    subtotalEl.textContent = formatMoney(subtotal);

    if (appliedDiscount > 0) {
        const descValue = subtotal * appliedDiscount;
        discountRow.classList.remove('d-none');
        discountEl.textContent = `- ${formatMoney(descValue)}`;
        totalEl.textContent = formatMoney(subtotal - descValue);
    } else {
        discountRow.classList.add('d-none');
        totalEl.textContent = formatMoney(subtotal);
    }
}

// --- FAVORITOS ---
function toggleFav(id, event) {
    if(event) event.stopPropagation(); // Evita abrir o modal se clicar no card
    
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('luna_favs', JSON.stringify(favorites));
    updateFavUI();
    
    // Atualiza grids ativos sem recarregar
    applyFilters();
    renderNewArrivals();
}

function updateFavUI() {
    document.getElementById('favCount').textContent = favorites.length;
    
    const container = document.getElementById('favItemsContainer');
    if(!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-muted"><i class="bi bi-heartbreak fs-1 mb-2 d-block"></i>Você ainda não tem favoritos.</div>`;
        return;
    }

    const favProducts = products.filter(p => favorites.includes(p.id));
    container.innerHTML = favProducts.map(item => `
        <div class="d-flex align-items-center gap-3 p-3 border-bottom">
            <img src="${item.img}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius:4px;">
            <div class="flex-grow-1">
                <h6 class="mb-0 small fw-bold">${item.name}</h6>
                <span class="text-pink-dark small">${formatMoney(item.price)}</span>
            </div>
            <div class="d-flex flex-column gap-2">
                <button class="btn btn-sm btn-primary-luna" onclick="addToCart(${item.id})"><i class="bi bi-bag-plus"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="toggleFav(${item.id})"><i class="bi bi-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// --- MODAL PRODUTO ---
function openModal(id) {
    const p = getProductById(id);
    if (!p) return;

    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalCategory').textContent = p.category;
    document.getElementById('modalName').textContent = p.name;
    document.getElementById('modalPrice').textContent = formatMoney(p.price);
    document.getElementById('modalDesc').textContent = p.desc;
    
    const oldPriceEl = document.getElementById('modalOldPrice');
    if (p.oldPrice) {
        oldPriceEl.textContent = formatMoney(p.oldPrice);
        oldPriceEl.classList.remove('d-none');
    } else {
        oldPriceEl.classList.add('d-none');
    }

    // Botões modal
    const addBtn = document.getElementById('modalAddBtn');
    if(p.available) {
        addBtn.disabled = false;
        addBtn.innerHTML = '<i class="bi bi-bag-plus me-2"></i>Adicionar à sacola';
        addBtn.onclick = () => {
            addToCart(p.id);
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        };
    } else {
        addBtn.disabled = true;
        addBtn.innerHTML = 'Indisponível';
    }

    const favBtn = document.getElementById('modalFavBtn');
    const isFav = favorites.includes(p.id);
    favBtn.innerHTML = `<i class="bi ${isFav ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>`;
    favBtn.onclick = () => {
        toggleFav(p.id);
        const updatedFav = favorites.includes(p.id);
        favBtn.innerHTML = `<i class="bi ${updatedFav ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>`;
    };

    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// --- CHECKOUT DEMONSTRATIVO ---
function openCheckout() {
    if (cart.length === 0) {
        alert("Sua sacola está vazia.");
        return;
    }
    
    const totalTxt = document.getElementById('cartTotal').textContent;
    document.getElementById('checkoutTotal').textContent = totalTxt;
    
    // Esconde offcanvas e mostra modal
    bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas')).hide();
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
    }
    
    alert('Pedido simulado com sucesso! Lembre-se, este é um projeto demonstrativo e nenhum dado ou pagamento real foi processado.');
    cart = [];
    saveCart();
    updateCartUI();
    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
});

// --- FORMULÁRIOS (VALIDAÇÃO BS5) ---
function setupForms() {
    // Newsletter
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                document.getElementById('newsAlert').classList.remove('d-none');
                this.reset();
                this.classList.remove('was-validated');
                return;
            }
            this.classList.add('was-validated');
        });
    }

    // Contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                document.getElementById('contactAlert').classList.remove('d-none');
                this.reset();
                this.classList.remove('was-validated');
                return;
            }
            this.classList.add('was-validated');
        });
    }
}
