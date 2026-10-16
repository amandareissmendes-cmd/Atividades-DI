/**
 * LUNA PRATA & JOIAS - Frontend Logic
 * Vanilla JavaScript implementation.
 */

// --- DADOS DOS PRODUTOS ---
const productsData = [
    {
        id: 1,
        name: 'Anel Solitário Prata',
        price: 129.90,
        originalPrice: null,
        category: 'Anéis',
        image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=400&q=80',
        description: 'Clássico anel solitário em prata 925 com zircônia central brilhante. Perfeito para marcar momentos inesquecíveis.',
        material: 'Prata 925',
        isNew: false,
        isBestSeller: true,
        isOnSale: false
    },
    {
        id: 2,
        name: 'Colar Ponto de Luz',
        price: 159.90,
        originalPrice: 189.90,
        category: 'Colares',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80',
        description: 'Colar delicado com uma zircônia pendente. O ponto de luz ideal para o uso diário.',
        material: 'Prata 925',
        isNew: false,
        isBestSeller: true,
        isOnSale: true
    },
    {
        id: 3,
        name: 'Brinco Argola Minimalista',
        price: 89.90,
        originalPrice: null,
        category: 'Brincos',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
        description: 'Argolas pequenas e discretas, polidas e super leves. Essenciais para qualquer porta-joias.',
        material: 'Prata 925',
        isNew: false,
        isBestSeller: false,
        isOnSale: false
    },
    {
        id: 4,
        name: 'Pulseira Elo Delicado',
        price: 119.90,
        originalPrice: null,
        category: 'Pulseiras',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
        description: 'Pulseira com elos finos e fecho ajustável. Combina com relógios e outras pulseiras.',
        material: 'Prata 925',
        isNew: true,
        isBestSeller: false,
        isOnSale: false
    },
    {
        id: 5,
        name: 'Colar Coração Rosé',
        price: 149.90,
        originalPrice: null,
        category: 'Colares',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80',
        description: 'Pingente de coração abaulado com banho rosé, acompanhado de corrente veneziana.',
        material: 'Prata 925 com banho Rosé Gold',
        isNew: true,
        isBestSeller: false,
        isOnSale: false
    },
    {
        id: 6,
        name: 'Anel Aparador Elegance',
        price: 99.90,
        originalPrice: 129.90,
        category: 'Anéis',
        image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=400&q=80',
        description: 'Meia aliança cravejada com mini zircônias. Excelente para usar como aparador de aliança.',
        material: 'Prata 925',
        isNew: false,
        isBestSeller: true,
        isOnSale: true
    },
    {
        id: 7,
        name: 'Brinco Gota Cristalina',
        price: 109.90,
        originalPrice: null,
        category: 'Brincos',
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
        description: 'Brincos em formato de gota com cristal facetado translúcido. Elegância pura.',
        material: 'Prata 925 e Cristal',
        isNew: false,
        isBestSeller: false,
        isOnSale: false
    },
    {
        id: 8,
        name: 'Pulseira Riviera Prata',
        price: 189.90,
        originalPrice: 229.90,
        category: 'Pulseiras',
        image: 'https://images.unsplash.com/photo-1573408301145-b98c41470ceb?auto=format&fit=crop&w=400&q=80',
        description: 'Clássica pulseira Riviera cravejada, possui fecho gaveta com trava de segurança.',
        material: 'Prata 925',
        isNew: false,
        isBestSeller: true,
        isOnSale: true
    }
];

// --- ESTADO LOCAL ---
let cart = JSON.parse(localStorage.getItem('luna_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('luna_favs')) || [];

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    renderProducts(productsData);
    updateCounters();
    setupEventListeners();
});

// --- UTILITÁRIOS ---
const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

const showToast = (message) => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    toastMsg.textContent = message;
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
};

// --- RENDERIZAÇÃO DE PRODUTOS ---
const renderProducts = (products) => {
    const grid = document.getElementById('products-grid');
    const noProductsMsg = document.getElementById('no-products-msg');
    grid.innerHTML = '';

    if (products.length === 0) {
        noProductsMsg.classList.remove('hidden');
        return;
    } else {
        noProductsMsg.classList.add('hidden');
    }

    products.forEach(product => {
        const isFav = favorites.includes(product.id);
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        
        let badges = '';
        if (product.isNew) badges += `<span class="bg-luna-pink-light text-luna-pink-dark text-[10px] font-bold px-2 py-1 rounded absolute top-2 left-2 uppercase">Novo</span>`;
        if (hasDiscount) badges += `<span class="bg-luna-black text-white text-[10px] font-bold px-2 py-1 rounded absolute top-2 left-2 uppercase">Promo</span>`;

        const card = document.createElement('div');
        card.className = 'group bg-white rounded-xl overflow-hidden shadow-sm border border-luna-silver-light transition hover:shadow-md relative flex flex-col';
        
        card.innerHTML = `
            ${badges}
            <button onclick="toggleFavButton(${product.id}, this)" class="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:text-luna-pink-dark transition z-10" aria-label="Favoritar">
                <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-luna-pink-dark text-luna-pink-dark' : 'text-luna-gray'} transition-colors"></i>
            </button>
            <div class="h-48 md:h-56 overflow-hidden cursor-pointer" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            </div>
            <div class="p-4 flex flex-col flex-1">
                <span class="text-[10px] text-luna-silver uppercase tracking-wider mb-1">${product.category}</span>
                <h3 class="font-playfair font-bold text-sm md:text-base text-luna-black mb-2 cursor-pointer line-clamp-2" onclick="openProductModal(${product.id})">${product.name}</h3>
                
                <div class="mt-auto flex items-end gap-2 mb-3">
                    <span class="font-bold text-luna-black">${formatPrice(product.price)}</span>
                    ${hasDiscount ? `<span class="text-xs line-through text-luna-silver mb-0.5">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                
                <button onclick="addToCart(${product.id})" class="w-full border border-luna-black text-luna-black py-2 rounded-lg text-xs font-bold uppercase hover:bg-luna-black hover:text-white transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="shopping-bag" class="w-3 h-3"></i> Adicionar
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
};

// --- BUSCA E FILTROS ---
const filterAndSortProducts = () => {
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    const categoryVal = document.getElementById('filter-category').value;
    const sortVal = document.getElementById('sort-items').value;

    let filtered = productsData.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchVal);
        const matchCategory = categoryVal === 'all' || p.category === categoryVal;
        return matchSearch && matchCategory;
    });

    if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortVal === 'alpha') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderProducts(filtered);
};

const filterByCategory = (category) => {
    document.getElementById('filter-category').value = category;
    document.getElementById('search-input').value = '';
    filterAndSortProducts();
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
};

const clearFilters = () => {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('sort-items').value = 'default';
    renderProducts(productsData);
};

// --- CARRINHO DE COMPRAS ---
const toggleCart = () => {
    const panel = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('global-overlay');
    
    if (panel.classList.contains('translate-x-full')) {
        renderCartItems();
        panel.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        panel.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }
};

const addToCart = (productId) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCounters();
    renderCartItems();
    showToast(`${product.name} adicionado à sacola!`);
};

const updateCartQuantity = (productId, delta) => {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        updateCounters();
        renderCartItems();
    }
};

const removeCartItem = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCounters();
    renderCartItems();
};

const saveCart = () => localStorage.setItem('luna_cart', JSON.stringify(cart));

const renderCartItems = () => {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-luna-gray">
                <i data-lucide="shopping-bag" class="w-12 h-12 mb-4 text-luna-silver"></i>
                <p>Sua sacola está vazia.</p>
            </div>
        `;
        document.getElementById('cart-subtotal').textContent = 'R$ 0,00';
        document.getElementById('cart-total').textContent = 'R$ 0,00';
        lucide.createIcons();
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'flex gap-4 border-b border-luna-silver-light pb-4';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
            <div class="flex-1 flex flex-col">
                <div class="flex justify-between items-start">
                    <h4 class="text-sm font-bold text-luna-black line-clamp-2">${item.name}</h4>
                    <button onclick="removeCartItem(${item.id})" class="text-luna-silver hover:text-red-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
                <span class="text-sm text-luna-gray mt-1">${formatPrice(item.price)}</span>
                <div class="mt-auto flex items-center gap-3 bg-gray-100 w-fit rounded px-2 py-1">
                    <button onclick="updateCartQuantity(${item.id}, -1)" class="text-luna-gray hover:text-luna-black">-</button>
                    <span class="text-xs font-medium w-4 text-center">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)" class="text-luna-gray hover:text-luna-black">+</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    // Para fins demonstrativos, não há desconto aplicado no total geral
    document.getElementById('cart-total').textContent = formatPrice(subtotal);
    lucide.createIcons();
};

// --- FAVORITOS ---
const toggleFavorites = () => {
    const panel = document.getElementById('fav-sidebar');
    const overlay = document.getElementById('global-overlay');
    
    if (panel.classList.contains('translate-x-full')) {
        renderFavItems();
        panel.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        panel.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }
};

const toggleFavButton = (productId, btnEl) => {
    const index = favorites.indexOf(productId);
    const icon = btnEl.querySelector('i');
    
    if (index === -1) {
        favorites.push(productId);
        icon.classList.add('fill-luna-pink-dark', 'text-luna-pink-dark');
        icon.classList.remove('text-luna-gray');
        showToast("Adicionado aos favoritos!");
    } else {
        favorites.splice(index, 1);
        icon.classList.remove('fill-luna-pink-dark', 'text-luna-pink-dark');
        icon.classList.add('text-luna-gray');
    }
    
    saveFavorites();
    updateCounters();
};

const saveFavorites = () => localStorage.setItem('luna_favs', JSON.stringify(favorites));

const renderFavItems = () => {
    const container = document.getElementById('fav-items');
    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-luna-gray">
                <i data-lucide="heart" class="w-12 h-12 mb-4 text-luna-silver"></i>
                <p>Você não possui favoritos.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    favorites.forEach(id => {
        const product = productsData.find(p => p.id === id);
        if(!product) return;

        const div = document.createElement('div');
        div.className = 'flex gap-4 border-b border-luna-silver-light pb-4 items-center';
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
                <h4 class="text-sm font-bold text-luna-black">${product.name}</h4>
                <span class="text-xs text-luna-gray block mt-1">${formatPrice(product.price)}</span>
                <button onclick="addToCart(${product.id})" class="text-[10px] uppercase font-bold text-luna-pink-dark mt-2 hover:underline">Adicionar à sacola</button>
            </div>
            <button onclick="removeFavorite(${product.id})" class="text-luna-silver hover:text-red-500 p-2"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
};

const removeFavorite = (productId) => {
    favorites = favorites.filter(id => id !== productId);
    saveFavorites();
    updateCounters();
    renderFavItems();
    filterAndSortProducts(); // Recarrega grid para atualizar ícones
};

// --- CONTADORES E UTILITÁRIOS GLOBAIS ---
const updateCounters = () => {
    const cartEl = document.getElementById('cart-count');
    const favEl = document.getElementById('fav-count');

    const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cartTotal > 0) {
        cartEl.textContent = cartTotal;
        cartEl.classList.remove('hidden');
    } else {
        cartEl.classList.add('hidden');
    }

    if (favorites.length > 0) {
        favEl.textContent = favorites.length;
        favEl.classList.remove('hidden');
    } else {
        favEl.classList.add('hidden');
    }
};

const closeAllSidebars = () => {
    const cartPanel = document.getElementById('cart-sidebar');
    const favPanel = document.getElementById('fav-sidebar');
    const overlay = document.getElementById('global-overlay');

    cartPanel.classList.add('translate-x-full');
    favPanel.classList.add('translate-x-full');
    
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    document.body.style.overflow = '';
};

// --- MODAL DE PRODUTO ---
let currentProductModalId = null;

const openProductModal = (productId) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    currentProductModalId = productId;
    
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-price').textContent = formatPrice(product.price);
    
    const oldPriceEl = document.getElementById('modal-old-price');
    if (product.originalPrice) {
        oldPriceEl.textContent = formatPrice(product.originalPrice);
        oldPriceEl.classList.remove('hidden');
    } else {
        oldPriceEl.classList.add('hidden');
    }

    document.getElementById('modal-desc').textContent = product.description;
    document.getElementById('modal-material').textContent = product.material;

    const favBtn = document.getElementById('modal-fav-btn');
    const icon = favBtn.querySelector('i');
    if (favorites.includes(productId)) {
        icon.classList.add('fill-luna-pink-dark', 'text-luna-pink-dark');
        icon.classList.remove('text-luna-gray');
    } else {
        icon.classList.remove('fill-luna-pink-dark', 'text-luna-pink-dark');
        icon.classList.add('text-luna-gray');
    }

    // Handlers reatribuídos para evitar múltiplos disparos
    document.getElementById('modal-add-btn').onclick = () => {
        addToCart(productId);
        closeProductModal();
    };

    favBtn.onclick = () => toggleFavButton(productId, favBtn);

    const modal = document.getElementById('product-modal');
    const content = document.getElementById('product-modal-content');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
};

const closeProductModal = () => {
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('product-modal-content');
    
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
};

// --- CHECKOUT DEMONSTRATIVO ---
const openCheckout = () => {
    if (cart.length === 0) {
        showToast("Seu carrinho está vazio.");
        return;
    }
    
    closeAllSidebars();
    
    const total = document.getElementById('cart-total').textContent;
    document.getElementById('checkout-total-val').textContent = total;
    
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
};

const closeCheckout = () => {
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
    
    // Limpar carrinho no demonstrativo
    cart = [];
    saveCart();
    updateCounters();
    document.body.style.overflow = '';
};

// --- LISTENERS E EVENTOS ---
const setupEventListeners = () => {
    // Menu Mobile
    const btnMenu = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    btnMenu.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Fechar menu mobile ao clicar em link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });

    // Busca e Filtros
    document.getElementById('search-input').addEventListener('input', filterAndSortProducts);
    document.getElementById('filter-category').addEventListener('change', filterAndSortProducts);
    document.getElementById('sort-items').addEventListener('change', filterAndSortProducts);

    // FAQ Accordion
    document.querySelectorAll('.faq-btn').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const expanded = button.getAttribute('aria-expanded') === 'true' || false;
            
            button.setAttribute('aria-expanded', !expanded);
            if (!expanded) {
                content.classList.add('open');
            } else {
                content.classList.remove('open');
            }
        });
    });

    // Newsletter Submit (Demonstrativo)
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = document.getElementById('news-msg');
        msg.textContent = "Inscrição realizada! (Modo Demonstrativo)";
        msg.classList.remove('hidden');
        msg.classList.add('text-green-600');
        e.target.reset();
        setTimeout(() => msg.classList.add('hidden'), 4000);
    });

    // Contact Submit (Demonstrativo)
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = document.getElementById('contact-form-msg');
        msg.textContent = "Mensagem enviada com sucesso! Sem backend real.";
        msg.classList.remove('hidden', 'text-red-600');
        msg.classList.add('text-green-600', 'block');
        e.target.reset();
        setTimeout(() => msg.classList.add('hidden'), 4000);
    });

    // Escape Key to close modals/sidebars
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllSidebars();
            const prodModal = document.getElementById('product-modal');
            if (!prodModal.classList.contains('hidden')) closeProductModal();
            
            const checkModal = document.getElementById('checkout-modal');
            if (!checkModal.classList.contains('hidden')) closeCheckout();
        }
    });
};
