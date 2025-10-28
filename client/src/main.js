/*
*   MOTO-RIDE CLIENT APPLICATION
*   ===========================
*   Main JavaScript file handling UI interactions, product management,
*   user authentication, and cart/wishlist functionality
 */


// =====================================================
//TODO CENTER SCROLL SUBCATEGORIES
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".subcategory_wrapper_box");
    const content = document.querySelector(".subcategory_3d_box");
    const items = document.querySelectorAll(".subcategory");

    if (wrapper && content && items.length > 0) {
        const wrapperWidth = wrapper.clientWidth;

        //? Find the most central element
        const middleIndex = Math.floor(items.length / 2);
        const middleItem = items[middleIndex];

        const middleItemOffset = middleItem.offsetLeft + (middleItem.offsetWidth / 2); // Calculate the position of the middle element within the content

        wrapper.scrollLeft = middleItemOffset - (wrapperWidth / 2); // Set the scroll so that the middle element is centered
    }
});

// =====================================================
//TODO CAROUSEL FUNCTIONALITY
// =====================================================

//? Carousel for home page
const nextBtn = document.querySelector('.next'),
      prevBtn = document.querySelector('.prev'),
      carousel = document.querySelector('.carousel');

let list = null,
    item = null,
    runningTime = null;

if (carousel) {
    list = carousel.querySelector('.list');
    item = carousel.querySelectorAll('.item');
    runningTime = carousel.querySelector('.time_running');
}

let timeRunning = 3000;
let timeAutoNext = 7000;

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlider('next');
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlider('prev');
    });
}

let runTimeOut;
let runNextAuto = null;

if (nextBtn) {
    runNextAuto = setTimeout(() => {
        if (nextBtn && typeof nextBtn.click === 'function') nextBtn.click();
    }, timeAutoNext);
}

function resetTimeAnimation(){
    if (!runningTime) return;
    runningTime.style.animation = 'none';
    runningTime.offsetHeight; // trigger reflow
    runningTime.style.animation = null;
    runningTime.style.animation = 'runningTime 7s linear 1 forwards';
}

function showSlider(type) {
    if (!list || !carousel) return;

    let sliderItemsDom = list.querySelectorAll('.carousel .list .item');
    if (!sliderItemsDom || sliderItemsDom.length === 0) return;

    if (type === 'next') {
        list.appendChild(sliderItemsDom[0]);
        carousel.classList.add('next');
    }
    else if (type === 'prev') {
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        carousel.classList.add('prev');
    }

    clearTimeout(runTimeOut);

    runTimeOut = setTimeout(() => {
        if (carousel) {
            carousel.classList.remove('next');
            carousel.classList.remove('prev');
        }
    }, timeRunning);

    if (runNextAuto) clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        if (nextBtn && typeof nextBtn.click === 'function') {
            nextBtn.click();
        }
    }, timeAutoNext);

    resetTimeAnimation(); // Reset the time bar animation
}

resetTimeAnimation(); // Start the time bar animation

// =====================================================
//TODO CATALOG FUNCTIONALITY
// =====================================================

//? Rotating catalogs animation
const rotatingCatalogs = document.querySelectorAll('.catalogs_box_card').forEach(card => {
    card.addEventListener('click', (event) => {
        const target = event.currentTarget;
        target.classList.toggle('flipped');
    });
});

// =====================================================
//TODO NAVIGATION MENU FUNCTIONALITY
// =====================================================

//^ ============ MAIN MENU CONTROLS ============
//? Open main navigation menu
let openMenue = document.querySelector('.right_nav_block .fa-solid');
openMenue.addEventListener('click', openMenueFunction);

function openMenueFunction (event){
    let navigation_menu = document.querySelector('.navigation_menu');
    navigation_menu.classList.toggle('navigation_menu_open_click');
    let overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
};

//? Close main navigation menu
let closeMenue = document.querySelector('.navigation_menu_close_button');
closeMenue.addEventListener('click', closeMenueFunction);

function closeMenueFunction (event){
    let navigation_menu = document.querySelector('.navigation_menu');
    navigation_menu.classList.toggle('navigation_menu_open_click');
    let overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
};

//? Close main navigation menu when clicking on a link
let switchPageCloseMenu = document.querySelectorAll('.navigation_menu a');
switchPageCloseMenu.forEach(item => {
    item.addEventListener('click', function(event){
        event.preventDefault();

        closeMenueFunction();

        setTimeout (() => {
            window.location.href = item.getAttribute('href');
        }, 300)

    });
});

//^ ============ CATALOG MENU CONTROLS ============
//? Open and close secondary navigation menu
let changeCatalogMenu = document.querySelector('.quick_menu_filter');
if(changeCatalogMenu)
    changeCatalogMenu.addEventListener('click', changeCatalogMenueFunction);

function changeCatalogMenueFunction(event) {
    let catalogMenu = document.querySelector('.catalog_menu');
    catalogMenu.classList.toggle('catalog_menu_open');
    let catalogOverlay = document.querySelector('.catalog_overlay');
    let footer = document.querySelector('footer');
    let header = document.querySelector('#category_header');
    header.classList.toggle('category_header');
    let filterBoxQuery = document.querySelector('#filter_box');
    filterBoxQuery.classList.toggle('filter_box_query');
    if (catalogMenu.classList == 'catalog_menu catalog_menu_open') {
        catalogOverlay.style.display = 'block';
        footer.style.position = 'fixed';
    }
    else {
        catalogOverlay.style.display = 'none';
        footer.style.position = 'static';
    }
}

// =====================================================
//! USER AUTHENTICATION FUNCTIONALITY
// =====================================================

//?: Event assignment that refreshes the pages
document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'shaialt';
    const githubRepo = 'Moto-Ride';
    const isGitHubPages = window.location.hostname === `${githubUsername}.github.io`;
    const basePath = isGitHubPages ? `/${githubRepo}/` : '/';

    function fixPath(path, repo) {
        if (path && path.startsWith('/')) {
            return `/${repo}${path}`;
        }
        return path;
    }

    // =====================================================
    //TODO USER AUTHENTICATION FUNCTIONALITY
    // =====================================================

    //^ ============ LOGIN STATUS CHECK ============
    //? Check if already logged in
    const loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
    const currentUser = loggedUsers.find(user => user.isLoggedIn === true);
    if (currentUser && window.location.href.includes('login.html')) {
        window.location.href = `${basePath}pages/profile.html`;
        return;
    }

    //^ ============ USER LOGIN ============
    //? User login
    const logInButton = document.querySelector('#log_in_button');
    if (logInButton) {
        logInButton.addEventListener('click', async () => {
            const userNameOrEmail = document.querySelector('#log_in_email_or_username').value.trim();
            const userPassword = document.querySelector('#log_in_password').value;

            //? Check empty fields
            if (!userNameOrEmail || !userPassword) {
                alert('Please fill in all fields.');
                return;
            }

            try {
                const response = await fetch(`${basePath}data/users.json`);
                const users = await response.json();

                const user = users.find(user =>
                    (user.email === userNameOrEmail || user.name === userNameOrEmail) &&
                    user.password === userPassword
                );

                if (user) {
                    let loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
                    
                    //? Check if user already exists in array
                    const existingUserIndex = loggedUsers.findIndex(loggedUser => 
                        loggedUser.email === user.email || loggedUser.name === user.name
                    );
                    
                    //? If user exists, update their login status
                    if (existingUserIndex !== -1) {
                        loggedUsers[existingUserIndex].isLoggedIn = true;
                    } 
                    
                    else {
                        //? If user doesn't exist, add them to array
                        loggedUsers.push({
                            name: user.name,
                            email: user.email,
                            isLoggedIn: true
                        });
                    }

                    //? Ensure only one user is logged in at any given time
                    loggedUsers = loggedUsers.map(loggedUser => ({
                        ...loggedUser,
                        isLoggedIn: loggedUser.email === user.email || loggedUser.name === user.name
                    }));

                    localStorage.setItem('loggedInUsers', JSON.stringify(loggedUsers));

                    alert('Login successful! Welcome ' + user.name);
                    window.location.href = `${basePath}pages/profile.html`;
                } 
                else {
                    alert('Invalid username/email or password.');
                }

            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Could not load users. Please try again later.');
            }
        });
    }

    //^ ============ USER LOGOUT ============
    //? User logout
    const signOutButton = document.querySelector('#sign_out');
    if (signOutButton) {    
        console.log(signOutButton);       // This will print null if it doesn't exist
        console.log(typeof signOutButton);
        signOutButton.addEventListener('click', (e) => {
            e.preventDefault();
            let loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];

            loggedUsers = loggedUsers.map(user => ({
                ...user,
                isLoggedIn: false
            }));

            localStorage.setItem('loggedInUsers', JSON.stringify(loggedUsers));

            console.log('After sign out:', loggedUsers); // Check in console that everything was updated

            window.location.href = `${basePath}pages/login.html`;
        });
    }
    
    // =====================================================
    //TODO FETCH PRODUCTS AND INITIALIZE CATALOG
    // =====================================================

    //^ ============ DATA PATH FIXING ============
    //? Insert products from JSON to motorcycle catalog
    fetch(`${basePath}data/data.json`)
    .then(response => response.json())
    .then(data => {
        if (isGitHubPages) {
            data = data.map(item => {
            
            item.image = fixPath(item.image, githubRepo); // Fix main image

            
            item.logo = fixPath(item.logo, githubRepo); // Fix logo

            //? Fix all images in array
            if (Array.isArray(item.images)) {
                item.images = item.images.map(img => fixPath(img, githubRepo));
            }
            return item;
        });
        }
        return data;
    })
    .then(products => {
        //^ ============ PRODUCT COUNTER ============
        //? Check number of products on the site
        let productsNumbersTotal = 0;
        products.forEach(() => productsNumbersTotal++);
        const total_products = document.querySelector('.total_products');
        if (total_products)
            total_products.textContent = `Discover ${productsNumbersTotal} exlusive motorcyles`;

        //^ ============ POPULAR PRODUCTS ============
        //? Filter products by highest popularity
        const topPopularProducts = products
            .sort((a, b) => b.popularity - a.popularity) // Sort from high to low
            .slice(0, 4); // Take only first 4

        //? Build cards only for popular products (for home page)
        topPopularProducts.forEach(product => {
            createProductCardItemElement(product); // This is your function that creates the card
        });

        //^ ============ PAGE ROUTING ============
        //? Check if it's a product page by URL address
        if (window.location.href.includes('product.html')) {
            const urlId = window.location.href.split('=')[2].split('&')[0];
            const product = products.find(p => p.id === urlId);
            if (product) {
                createProductPage(product);
            } else {
                console.warn('Not found product with id:', urlId);
            }
        } 
        //^ ============ CATALOG INITIALIZATION ============
        //? If it's not a product page - create all catalog cards (for catalog page)
        else if (window.location.href.includes('catalog.html')) {
            //? Load filters from URL
            const urlFilters = getFiltersFromURL();
            updateFiltersFromURL(urlFilters);
            
            //? Filter products
            const filteredProducts = filterProducts(products, urlFilters);
            console.log('Filtered products:', filteredProducts.length);
            
            //? Display filtered products in catalog container
            const catalogContainer = document.querySelector('#catalog');
            if (catalogContainer) catalogContainer.innerHTML = '';
            filteredProducts.forEach(product => {
                creator(product);
            });

            //^ ============ FILTER EVENTS SETUP ============
            //? Central function to add filter events
            function setupFilterEvents() {
                //? Add events to all checkboxes - both regular sidebar and responsive
                const allCheckboxes = document.querySelectorAll('.filter_sidebar input[type="checkbox"][name], .filter_sidebar_responsive input[type="checkbox"][name]');
                allCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        //? Sync checkboxes between regular and responsive sidebar
                        //? Sync before filtering so no parallel checkbox remains checked and continues filtering
                        syncCheckboxes(checkbox);
                        //? After sync, trigger filtering with updated state of all checkboxes
                        applyFilters(products);
                    });
                });

                //? Add events to price fields - both regular and responsive
                const priceInputs = document.querySelectorAll('.filter_sidebar .price_input, .filter_sidebar_responsive .price_input');
                priceInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        //? Sync price values between regular and responsive sidebar
                        //? Sync before filtering so min/max values are collected correctly
                        syncPriceInputs(input);
                        //? After sync, trigger filtering with updated values
                        applyFilters(products);
                    });
                });

                //? Reset buttons - both regular and responsive
                const resetBtns = document.querySelectorAll('.reset_button');
                resetBtns.forEach(resetBtn => {
                    resetBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('Resetting all filters');
                        
                        //? Clear all checkboxes - both regular and responsive
                        const allCheckboxes = document.querySelectorAll('.filter_sidebar input[type="checkbox"], .filter_sidebar_responsive input[type="checkbox"]');
                        allCheckboxes.forEach(cb => cb.checked = false);
                        
                        //? Clear price fields - both regular and responsive
                        const allPriceInputs = document.querySelectorAll('.filter_sidebar .price_input, .filter_sidebar_responsive .price_input');
                        allPriceInputs.forEach(input => input.value = '');
                        
                        window.history.pushState({}, '', window.location.pathname); // Update URL and display again
                        
                        //? Clear and display all products
                        const container = document.querySelector('#catalog');
                        if (container) container.innerHTML = '';
                        
                        products.forEach(product => {
                            creator(product);
                        });
                    });
                });
            }

            //? Function to sync checkboxes between regular and responsive sidebar
            function syncCheckboxes(changedCheckbox) {
                const name = changedCheckbox.name;
                const value = changedCheckbox.value;
                const isChecked = changedCheckbox.checked;

                //? Find the parallel checkbox in the other sidebar
                const allMatchingCheckboxes = document.querySelectorAll(`input[name="${name}"][value="${value}"]`);
                allMatchingCheckboxes.forEach(cb => {
                    if (cb !== changedCheckbox) {
                        cb.checked = isChecked;
                    }
                });
            }

            //? Function to sync price fields between regular and responsive sidebar
            function syncPriceInputs(changedInput) {
                const placeholder = changedInput.placeholder;
                const value = changedInput.value;

                //? Find the parallel fields
                const allMatchingInputs = document.querySelectorAll(`.price_input[placeholder="${placeholder}"]`);
                allMatchingInputs.forEach(input => {
                    if (input !== changedInput) {
                        input.value = value;
                    }
                });
            }

            setupFilterEvents(); // Activate the function
        }

        // =====================================================
        //TODO SEARCH FUNCTIONALITY
        // =====================================================

        //^ ============ SEARCH INPUT HANDLING ============
        //? Filter products by search
        const search = document.querySelector('#welcome_animation_input');
        search.addEventListener('input', function() {
            //? Delete previous suggestions box if exists
            const existingSuggestions = document.querySelector('.suggestions_box');
            if (existingSuggestions) {
                existingSuggestions.remove();
            }

            const searchTerm = search.value.toLowerCase();
            let filteredProducts = []; // Define outside

            //? Handle Enter key press
            search.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (filteredProducts.length > 0) {
                        //? Save search results in localStorage
                        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
                        //? Navigate to catalog page with search parameter
                        window.location.href = `./pages/catalog.html?search=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });
            
            if (searchTerm.length >= 2) {
                filteredProducts = products.filter(product => {
                    return product.manufacturer.toLowerCase().includes(searchTerm) || 
                        product.name.toLowerCase().includes(searchTerm) || 
                        product.description.toLowerCase().includes(searchTerm);
                });
            
                //? Return only product names not their objects
                const filteredProductsNames = filteredProducts.map(product => product.name);
                console.log('Filtered products:', filteredProductsNames);
            }

            //^ ============ SEARCH SUGGESTIONS ============
            //? Create suggestions box
            if (filteredProducts.length > 0) {
                const suggestionsBox = document.createElement('div');
                suggestionsBox.classList.add('suggestions_box');
                suggestionsBox.style.width = '100%';
                suggestionsBox.style.height = 'auto';
                suggestionsBox.style.maxHeight = '300px';
                suggestionsBox.style.backgroundColor = 'white';
                suggestionsBox.style.position = 'absolute';
                suggestionsBox.style.top = '90%';
                suggestionsBox.style.left = '0';
                suggestionsBox.style.zIndex = '997';
                suggestionsBox.style.border = '1px solid #601E1E';
                suggestionsBox.style.borderTop = '1px solid white';
                suggestionsBox.style.borderBottomLeftRadius = '6px';
                suggestionsBox.style.borderBottomRightRadius = '6px';
                suggestionsBox.style.overflowY = 'auto';
                suggestionsBox.style.opacity = '0'; // Start hidden
                suggestionsBox.style.transform = 'translateY(-10px)'; // Start slightly above
                suggestionsBox.style.scrollbarWidth = 'thin';

                //? Add transition for smooth animation
                suggestionsBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                //? Add results to box
                filteredProducts.forEach(product => {
                    const suggestion = document.createElement('div');
                    suggestion.style.padding = '10px';
                    suggestion.style.borderBottom = '1px solid #eee';
                    suggestion.style.cursor = 'pointer';
                    suggestion.style.display = 'flex';
                    suggestion.style.alignItems = 'center';
                    suggestion.style.justifyContent = 'space-between';

                    //? Add product name
                    const textDiv = document.createElement('div');
                    textDiv.textContent = product.name;
                    textDiv.style.flex = '1';

                    //? Create thumbnail image
                    const thumbnailImg = document.createElement('img');
                    thumbnailImg.src = product.image;
                    thumbnailImg.alt = product.name;
                    thumbnailImg.style.width = '40px';
                    thumbnailImg.style.height = '40px';
                    thumbnailImg.style.objectFit = 'cover';
                    thumbnailImg.style.marginLeft = '10px';
                    thumbnailImg.style.borderRadius = '4px';

                    //? Add click event to each suggestion
                    suggestion.addEventListener('click', () => {
                        const urlParams = new URLSearchParams();
                        urlParams.append('category', product.category);
                        urlParams.append('id', product.id);
                        urlParams.append('name', product.name);
                        window.location.href = `pages/product.html?${urlParams.toString()}`;
                    });

                    suggestion.appendChild(textDiv);
                    suggestion.appendChild(thumbnailImg);
                    suggestionsBox.appendChild(suggestion);
                });

                //? Add suggestions box to search container
                const container = document.querySelector('.welcome_animation_box');
                if (container) {
                    container.style.position = 'relative';
                    container.appendChild(suggestionsBox);
                    //? Trigger the animation
                    requestAnimationFrame(() => {
                        suggestionsBox.style.opacity = '1'; // Fade in
                        suggestionsBox.style.transform = 'translateY(0)'; // Move down to original position
                    });
                }
            }
        });
    })
    .catch(error => console.error('Error loading JSON:', error));

    //? Load favorites and cart from localStorage on every page
    loadWishlistFromLocalStorage();
    loadCartFromLocalStorage();
});

//^ ============ PRODUCT CREATION MANAGER ============
//? Main function for everything that runs after receiving data
function creator (product){
    const currentPath = window.location.pathname;

    //? If we are on the catalog page
    if (currentPath.includes('catalog.html')) {
        //? Call function that creates the product in catalog
        createCatalogProductCardItemElement(product);
    }

    //? Assign event to icons inside product for adding to favorites
    const allProducts = document.querySelectorAll('.product_super_box').forEach( product => {
    const heart = product.querySelector('.add_to_wishlist');
    if(heart)
        heart.addEventListener('click', saveToWishlist);

    const cart = product.querySelector('.add_to_cart');
    if(cart)
        cart.addEventListener('click', saveToCart);
    });

    //? Call function that updates favorites and cart status after receiving response from server
    updateWishlistHearts();
    updatecarts();
}

// =====================================================
//TODO PRODUCT CARD CREATION
// =====================================================

//^ ============ HOME PAGE CARDS ============
//? Function to create product cards on home page
function createProductCardItemElement(product){
    //? TOP PRODUCT SUPER BOX (MAIN DIV)
    const topProductSuperBox = document.createElement('div');
    topProductSuperBox.classList.add('top_product_super_box');
    topProductSuperBox.id = product.id;
    topProductSuperBox.setAttribute('data-stock', product.stock || 1);
    if (product.status) {
        topProductSuperBox.style.setProperty(`--${product.status}`, 'true');
    }

    //? BOX DIV
    const box = document.createElement('div');
    box.classList.add('box');
    const boxText = document.createElement('p');
    boxText.textContent = 'Moto-Ride 🏍️';
    box.appendChild(boxText);

    //? PRODUCT BOX DIV
    const productBox = document.createElement('div');
    productBox.classList.add('product_box');

    //? PRODUCT IMG DIV
    const productImgBox = document.createElement('div');
    productImgBox.classList.add('product_img_box');
    const productImg = document.createElement('img');
    productImg.src = product.image;
    productImg.classList.add('product_img');
    productImgBox.appendChild(productImg);

    //? PRODUCT LOGO DIV
    const productLogoBox = document.createElement('div');
    productLogoBox.classList.add('product_logo_box');
    const productLogoImg = document.createElement('img');
    productLogoImg.src = product.logo;
    productLogoImg.classList.add('product_logo_img');

    //? ICONS DIV OF PRODUCT LOGO DIV
    const iconsDiv = document.createElement('div');
    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-solid', 'fa-heart', 'add_to_wishlist');
    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'add_to_cart');
    iconsDiv.appendChild(heartIcon);
    iconsDiv.appendChild(cartIcon);

    productLogoBox.appendChild(productLogoImg);
    productLogoBox.appendChild(iconsDiv);

    //? CENTER DIV
    const center = document.createElement('div');
    center.classList.add('center');

    //? PRODUCT NAME BOX ARTICLE OF CENTER DIV
    const productNameBox = document.createElement('article');
    productNameBox.classList.add('product_name_box');
    const productName = document.createElement('h3');
    productName.classList.add('product_name');
    productName.textContent = product.name;
    productNameBox.appendChild(productName);

    //? DESCRIBE BOX ARTICLE OF CENTER DIV
    const describeBox = document.createElement('article');
    describeBox.classList.add('describe_box');
    const describe = document.createElement('p');
    describe.classList.add('describe');
    describe.textContent = product.description;
    describeBox.appendChild(describe);

    //? BUY BOX ARTICLE OF CENTER DIV
    const buyBox = document.createElement('article');
    buyBox.classList.add('buy_box');
    const priceContainer = document.createElement('div');
    const originalPriceBox = document.createElement('div');
    originalPriceBox.classList.add('original_price_box');
    const originalPrice = document.createElement('h4');
    originalPrice.classList.add('original_price');
    originalPrice.textContent = product.originalPrice;
    const discount = document.createElement('p');
    discount.classList.add('discount');
    discount.textContent = product.discount;
    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);
    const finalPrice = document.createElement('h2');
    finalPrice.textContent = product.finalPrice;
    priceContainer.appendChild(originalPriceBox);
    priceContainer.appendChild(finalPrice);

    //? BUTTON OF BUY BOX ARTICLE OF CENTER DIV
    const productBuyButtonLink = document.createElement('a');
    productBuyButtonLink.href = `product.html?category=${encodeURIComponent(product.category)}&id=${product.id}&name=${encodeURIComponent(product.name)}`;
    productBuyButtonLink.classList.add('a_button');
    const productBuyButton = document.createElement('button');
    productBuyButton.classList.add('button');
    const bagIcon = document.createElement('i');
    bagIcon.classList.add('fa-solid', 'fa-bag-shopping');
    productBuyButton.appendChild(bagIcon);
    productBuyButtonLink.appendChild(productBuyButton);


    buyBox.appendChild(priceContainer);
    buyBox.appendChild(productBuyButtonLink);

    //? CENTER DIV BUILD
    center.appendChild(productNameBox);
    center.appendChild(describeBox);
    center.appendChild(buyBox);

    //? NEW POPULAR DIV + CURVE DIV
    const newPopular = document.createElement('div');
    newPopular.classList.add('new_popular');
    const curve = document.createElement('div');
    curve.classList.add('curve');

    //? PRODUCT BOX DIV BUILD
    productBox.appendChild(productImgBox);
    productBox.appendChild(productLogoBox);
    productBox.appendChild(center);
    productBox.appendChild(newPopular);
    productBox.appendChild(curve);

    //? TOP PRODUCT SUPER BOX BUILD
    topProductSuperBox.appendChild(box);
    topProductSuperBox.appendChild(productBox);

    //? BUILD ON HOME PAGE
    const container = document.querySelector('#top_products');
    if (container)
        container.appendChild(topProductSuperBox);
}

//^ ============ CATALOG PAGE CARDS ============
//? Function to create product cards in catalog
function createCatalogProductCardItemElement(product){
        //? PRODUCT SUPER BOX (MAIN DIV)
        const productSuperBox = document.createElement('div');
        productSuperBox.classList.add('product_super_box');
        productSuperBox.id = product.id;
        productSuperBox.setAttribute('data-stock', product.stock || 1);
        if (product.status) {
            productSuperBox.style.setProperty(`--${product.status}`, 'true');
        }

        //? BOX DIV
        const box = document.createElement('div');
        box.classList.add('box');
        const boxText = document.createElement('p');
        boxText.textContent = 'Moto-Ride 🏍️';
        box.appendChild(boxText);

        //? PRODUCT BOX DIV
        const productBox = document.createElement('div');
        productBox.classList.add('product_box');

        //? PRODUCT IMG DIV
        const productImgBox = document.createElement('div');
        productImgBox.classList.add('product_img_box');
        const productImg = document.createElement('img');
        productImg.src = product.image;
        productImg.classList.add('product_img');
        productImgBox.appendChild(productImg);

        //? PRODUCT LOGO DIV
        const productLogoBox = document.createElement('div');
        productLogoBox.classList.add('product_logo_box');
        const productLogoImg = document.createElement('img');
        productLogoImg.src = product.logo;
        productLogoImg.classList.add('product_logo_img');

        //? ICONS DIV OF PRODUCT LOGO DIV
        const iconsDiv = document.createElement('div');
        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'add_to_wishlist');
        const cartIcon = document.createElement('i');
        cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'add_to_cart');
        iconsDiv.appendChild(heartIcon);
        iconsDiv.appendChild(cartIcon);

        productLogoBox.appendChild(productLogoImg);
        productLogoBox.appendChild(iconsDiv);

        //? CENTER DIV
        const center = document.createElement('div');
        center.classList.add('center');

        //? PRODUCT NAME BOX ARTICLE OF CENTER DIV
        const productNameBox = document.createElement('article');
        productNameBox.classList.add('product_name_box');
        const productName = document.createElement('h3');
        productName.classList.add('product_name');
        productName.textContent = product.name;
        productNameBox.appendChild(productName);

        //? DESCRIBE BOX ARTICLE OF CENTER DIV
        const describeBox = document.createElement('article');
        describeBox.classList.add('describe_box');
        const describe = document.createElement('p');
        describe.classList.add('describe');
        describe.textContent = product.description;
        describeBox.appendChild(describe);

        //? BUY BOX ARTICLE OF CENTER DIV
        const buyBox = document.createElement('article');
        buyBox.classList.add('buy_box');
        const priceContainer = document.createElement('div');
        const originalPriceBox = document.createElement('div');
        originalPriceBox.classList.add('original_price_box');
        const originalPrice = document.createElement('h4');
        originalPrice.classList.add('original_price');
        originalPrice.textContent = product.originalPrice;
        const discount = document.createElement('p');
        discount.classList.add('discount');
        discount.textContent = product.discount;
        originalPriceBox.appendChild(originalPrice);
        originalPriceBox.appendChild(discount);
        const finalPrice = document.createElement('h2');
        finalPrice.textContent = product.finalPrice;
        priceContainer.appendChild(originalPriceBox);
        priceContainer.appendChild(finalPrice);

        //? BUTTON OF BUY BOX ARTICLE OF CENTER DIV
        const productBuyButtonLink = document.createElement('a');
        productBuyButtonLink.href = `product.html?category=${encodeURIComponent(product.category)}&id=${product.id}&name=${encodeURIComponent(product.name)}`;
        productBuyButtonLink.classList.add('a_button');
        const productBuyButton = document.createElement('button');
        productBuyButton.classList.add('button');
        const bagIcon = document.createElement('i');
        bagIcon.classList.add('fa-solid', 'fa-bag-shopping');
        productBuyButton.appendChild(bagIcon);
        productBuyButtonLink.appendChild(productBuyButton);


        buyBox.appendChild(priceContainer);
        buyBox.appendChild(productBuyButtonLink);

        //? CENTER DIV BUILD
        center.appendChild(productNameBox);
        center.appendChild(describeBox);
        center.appendChild(buyBox);

        //? NEW POPULAR DIV + CURVE DIV
        const newPopular = document.createElement('div');
        newPopular.classList.add('new_popular');
        const curve = document.createElement('div');
        curve.classList.add('curve');

        //? PRODUCT BOX DIV BUILD
        productBox.appendChild(productImgBox);
        productBox.appendChild(productLogoBox);
        productBox.appendChild(center);
        productBox.appendChild(newPopular);
        productBox.appendChild(curve);

        //? PRODUCT SUPER BOX BUILD
        productSuperBox.appendChild(box);
        productSuperBox.appendChild(productBox);

        //? Add product to container in catalog page
        if (window.location.href.includes('catalog.html')){
            const container = document.querySelector('#catalog');
            if(container) {
                container.appendChild(productSuperBox);
            }
        }
}

// =====================================================
//TODO WISHLIST AND CART MANAGEMENT
// =====================================================

//^ ============ WISHLIST OPERATIONS ============
//? Function that saves selected product details to memory for wishlist and colors the heart red
function saveToWishlist(event){
    //? Change heart state in catalog for adding and removing product
    const heartIconClick = event.currentTarget;
    if(heartIconClick.classList.contains('add_to_wishlist_click'))
        heartIconClick.classList.remove('add_to_wishlist_click');
    else
        heartIconClick.classList.add('add_to_wishlist_click');

    //? Find product card
    const productBox = heartIconClick.closest('.product_super_box');
    if (!productBox) return;

    //? Extract data from selected card
    const productId = productBox.id;
    const name = productBox.querySelector('.product_name')?.textContent.trim();
    const description = productBox.querySelector('.describe')?.textContent.trim();
    const image = productBox.querySelector('.product_img')?.src;
    const logo = productBox.querySelector('.product_logo_img')?.src;
    const originalPrice = productBox.querySelector('.original_price')?.textContent.trim();
    const discount = productBox.querySelector('.discount')?.textContent.trim();
    const finalPrice = productBox.querySelector('h2')?.textContent.trim();
    const stock = parseInt(productBox.dataset.stock) || 1;
    const buyLink = productBox.querySelector('.a_button')?.href;

    if (!productId || !name) return;

    //? Data structure for saving
    const wishlistProductData = {
        id: productId,
        name,
        description,
        image,
        logo,
        originalPrice,
        discount,
        finalPrice,
        stock,
        buyLink
    };

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if (heartIconClick.classList.contains('add_to_wishlist_click')) {
        if (existingIndex === -1) {
            wishlist.push(wishlistProductData);
        }
    } 
    
    else {
        if (existingIndex !== -1) {
            wishlist.splice(existingIndex, 1);
        }
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

//^ ============ WISHLIST UI UPDATES ============
//? Update heart colors after creating cards according to localStorage after refresh
function updateWishlistHearts() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist.forEach(savedItem => {
    const productBox = document.getElementById(savedItem.id);
    if (productBox) {
      const heart = productBox.querySelector('.add_to_wishlist');
      if (heart) {
        heart.classList.add('add_to_wishlist_click');
      }
    }
  });
}

//^ ============ WISHLIST LOADING ============
//? Function that extracts product data from memory and calls function to build them in favorites
function loadWishlistFromLocalStorage() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.querySelector('#wish_chosen_products_list_ul');
    if (!container) {
        console.warn('Container for wishlist not found!');
        return; // Exit function to avoid causing error
    }
    
    container.innerHTML = ''; // Clear list before loading to prevent duplicates

    if (wishlist.length === 0) {
        return;
    }

    wishlist.forEach(product => {
        createWishlistItemElement(product);
    });

    //? Call function that gives everyone after extraction from memory an event to delete product
    addWishlistDeleteEventListeners();

    //? Update text in header after change
    const headerParagraph = document.querySelector('.wish_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + wishlist.length + ' items in your wishlist.';
    }
}

//^ ============ WISHLIST CARD CREATION ============
//? Function to create product cards for favorites
function createWishlistItemElement(wishlistProductData) {
    const wishlistListItem = document.createElement('li');
    wishlistListItem.setAttribute('data-id', wishlistProductData.id); // For addition if needed in future

    const wishlistProductWrapper = document.createElement('div');
    wishlistProductWrapper.classList.add('wish_chosen_product_list');

    const wishlistDeleteIcon = document.createElement('i');
    wishlistDeleteIcon.classList.add('wish_delete', 'fa-solid', 'fa-heart');

    const wishlistImageBox = document.createElement('div');
    wishlistImageBox.classList.add('wish_chosen_product_img_box');

    const wishlistImageLink = document.createElement('a');
    wishlistImageLink.href = `catalog.html#${wishlistProductData.id}`;

    const wishlistImage = document.createElement('img');
    wishlistImage.src = wishlistProductData.image;
    wishlistImage.alt = wishlistProductData.name;

    const wishlistContentBox = document.createElement('article');
    wishlistContentBox.classList.add('wish_chosen_product_content_box');

    const wishlistPriceBox = document.createElement('div');
    wishlistPriceBox.classList.add('wish_chosen_product_price');

    const wishlistOriginalPriceBox = document.createElement('div');
    wishlistOriginalPriceBox.classList.add('original_price_box');

    const wishlistOriginalPrice = document.createElement('h4');
    wishlistOriginalPrice.classList.add('original_price');
    wishlistOriginalPrice.textContent = wishlistProductData.originalPrice;

    const wishlistDiscount = document.createElement('p');
    wishlistDiscount.classList.add('discount');
    wishlistDiscount.textContent = wishlistProductData.discount;

    const wishlistFinalPrice = document.createElement('h2');
    wishlistFinalPrice.textContent = wishlistProductData.finalPrice;

    const wishlistTitleBox = document.createElement('div');
    wishlistTitleBox.classList.add('wish_product_title');

    const wishlistProductName = document.createElement('h3');
    wishlistProductName.classList.add('wish_product_name');
    wishlistProductName.textContent = wishlistProductData.name;

    const wishlistDescription = document.createElement('p');
    wishlistDescription.classList.add('wish_describe');
    wishlistDescription.textContent = wishlistProductData.description;

    const wishlistButtonsBox = document.createElement('div');
    wishlistButtonsBox.classList.add('wish_product_buttons');

    const wishlistAddToCartButton = document.createElement('button');
    wishlistAddToCartButton.textContent = 'Add to cart';

    const wishlistBuyNowButtonLink = document.createElement('a');
    const wishlistBuyNowButton = document.createElement('button');
    wishlistBuyNowButtonLink.href = wishlistProductData.buyLink;
    wishlistBuyNowButton.textContent = 'Buy now';
    wishlistBuyNowButton.classList.add('buy_now_button');

    //? Assembly
    wishlistImageLink.appendChild(wishlistImage);
    wishlistImageBox.appendChild(wishlistImageLink);

    wishlistOriginalPriceBox.appendChild(wishlistOriginalPrice);
    wishlistOriginalPriceBox.appendChild(wishlistDiscount);
    wishlistPriceBox.appendChild(wishlistOriginalPriceBox);
    wishlistPriceBox.appendChild(wishlistFinalPrice);

    wishlistTitleBox.appendChild(wishlistProductName);
    wishlistTitleBox.appendChild(wishlistDescription);

    wishlistButtonsBox.appendChild(wishlistAddToCartButton);
    wishlistBuyNowButtonLink.appendChild(wishlistBuyNowButton);
    wishlistButtonsBox.appendChild(wishlistBuyNowButtonLink);

    wishlistContentBox.appendChild(wishlistPriceBox);
    wishlistContentBox.appendChild(wishlistTitleBox);
    wishlistContentBox.appendChild(wishlistButtonsBox);

    wishlistProductWrapper.appendChild(wishlistDeleteIcon);
    wishlistProductWrapper.appendChild(wishlistImageBox);
    wishlistProductWrapper.appendChild(wishlistContentBox);

    wishlistListItem.appendChild(wishlistProductWrapper);

    document.querySelector('#wish_chosen_products_list_ul').appendChild(wishlistListItem);
}

//^ ============ WISHLIST DELETE EVENTS ============
//? After creating each item in favorites, function that adds event to delete items
function addWishlistDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.wish_delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteWishlistItem);
    });
}

//? Function that deletes the item in favorites from DOM and memory (catalog already relies on memory)
function handleDeleteWishlistItem(event) {
    //? The element that was clicked
    const deleteBtn = event.currentTarget;

    //? The list item element (parent to wishlistListItem)
    const listItem = deleteBtn.closest('li');

    if (!listItem) return;

    //? Item identifier from data-id
    const productId = listItem.getAttribute('data-id');

    //? 1. Remove from DOM
    listItem.remove();

    //? 2. Remove from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

        //? Update header text after change
    const headerParagraph = document.querySelector('.wish_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + wishlist.length + ' items in your wishlist.';
    }
}

//^ ============ CART OPERATIONS ============
//? Function that saves selected product details to memory for favorites and colors the cart red
function saveToCart(event){
    //? Change heart state in catalog for adding and removing product
    const cartIconClick = event.currentTarget;
    if(cartIconClick.classList.contains('add_to_cart_click'))
        cartIconClick.classList.remove('add_to_cart_click');
    else
        cartIconClick.classList.add('add_to_cart_click');

    //? Find product card
    const productBox = cartIconClick.closest('.product_super_box');
    if (!productBox) return;

    //? Extract data from selected card
    const productId = productBox.id;
    const name = productBox.querySelector('.product_name')?.textContent.trim();
    const description = productBox.querySelector('.describe')?.textContent.trim();
    const image = productBox.querySelector('.product_img')?.src;
    const logo = productBox.querySelector('.product_logo_img')?.src;
    const originalPrice = productBox.querySelector('.original_price')?.textContent.trim();
    const discount = productBox.querySelector('.discount')?.textContent.trim();
    const finalPriceText = productBox.querySelector('h2')?.textContent.trim() || '0';

    const finalPrice = parsePriceToNumber(finalPriceText);

    const stock = parseInt(productBox.dataset.stock) || 1;
    let quantity = 1;
    const buyLink = productBox.querySelector('.a_button')?.href;

    if (!productId || !name) return;

    //? Data structure for saving
    const cartProductData = {
        id: productId,
        name,
        description,
        image,
        logo,
        originalPrice,
        discount,
        finalPrice,
        stock,
        quantity,
        buyLink
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id === productId);

    if (cartIconClick.classList.contains('add_to_cart_click')) {
        if (existingIndex === -1) {
            cart.push(cartProductData);
        }
    } 
    
    else {
        if (existingIndex !== -1) {
            cart.splice(existingIndex, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// =====================================================
//TODO CART MANAGEMENT
// =====================================================

//^ ============ CART UI UPDATES ============
//? Update cart colors after creating cards according to localStorage
function updatecarts() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach(savedItem => {
    const productBox = document.getElementById(savedItem.id);
    if (productBox) {
      const cart = productBox.querySelector('.add_to_cart');
      if (cart) {
        cart.classList.add('add_to_cart_click');
      }
    }
  });
}

//^ ============ CART LOADING ============
//? Function that extracts product data from memory and calls function to build them in cart
function loadCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('#chosen_products_list_ul');
    if (!container) {
        console.warn('Container for cart not found!');
        return; // Exit function to avoid causing error
    }
    
    container.innerHTML = ''; // Clear list before loading to prevent duplicates

    if (cart.length === 0) {
        return;
    }

    cart.forEach(product => {
        createCartItemElement(product);
    });

    //? Add listeners after creating elements
    addCartDeleteEventListeners();
    addCartQuantityEventListeners();

    //? Update product quantity in header
    const headerParagraph = document.querySelector('.cart_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + cart.length + ' items in your wishlist.';
    }

    //? Update final price before shipping
    updateCartSubtotalAndTotal()
}

//^ ============ CART CARD CREATION ============
//? Function to build new cart item
function createCartItemElement(cartProductData) {
    //? Create <li> box that will contain the product
    const cartListItem = document.createElement('li');
    cartListItem.setAttribute('data-id', cartProductData.id); // For addition if needed in future

    //? Create general product box in cart
    const cartProductBox = document.createElement('div');
    cartProductBox.classList.add('chosen_product_list');

    //? Add data-price with price per unit (number)
    cartProductBox.dataset.price = cartProductData.finalPrice;

    //? Create delete product from cart button
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('cart_delete', 'fa-solid', 'fa-xmark');

    //? Create product image box
    const imageBox = document.createElement('div');
    imageBox.classList.add('chosen_product_img_box');

    //? Create link to purchase page or additional info
    const productLink = document.createElement('a');
    productLink.href = `catalog.html#${cartProductData.id}`; // If no link exists, prevents breaking

    //? Create product image
    const productImage = document.createElement('img');
    productImage.src = cartProductData.image;
    productImage.alt = '';

    //? Connect image to link and box
    productLink.appendChild(productImage);
    imageBox.appendChild(productLink);

    //? Create product details list (name, price, quantity, total price)
    const detailsList = document.createElement('ul');

    //? Product name
    const nameItem = document.createElement('li');
    nameItem.textContent = cartProductData.name;

    //? Price per unit
    const pricePerItem = document.createElement('li');
    pricePerItem.classList.add('cart_price_per_item')
    pricePerItem.textContent = `${cartProductData.finalPrice.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
   
    //? Quantity box for selecting number of units
    const quantityItem = document.createElement('li');
    let quantity = parseInt(cartProductData.quantity);
    if (!quantity || quantity < 1) quantity = 1; // Fix invalid quantity

    //? Save back to object
    cartProductData.quantity = quantity;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = quantity;
    quantityInput.min = 1;
    quantityInput.classList.add('chosen_product_input');

    //? Prevent entering invalid characters (phone keyboard/browser)
    quantityInput.addEventListener('keydown', function (e) {
        if (e.key === '-' || e.key === '.' || e.key === 'e') {
            e.preventDefault();
        }
    });

    quantityItem.appendChild(quantityInput);

    //? Total price (price per unit * quantity)
    const totalItem = document.createElement('li');
    totalItem.classList.add('cart_item_total_price');
    const totalPrice = cartProductData.finalPrice;
    totalItem.textContent = `${(cartProductData.finalPrice * quantity).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
    //? Connect all info rows to list
    detailsList.appendChild(nameItem);
    detailsList.appendChild(pricePerItem);
    detailsList.appendChild(quantityItem);
    detailsList.appendChild(totalItem);

    //? Connect delete icon, image and list to main box
    cartProductBox.appendChild(deleteIcon);
    cartProductBox.appendChild(imageBox);
    cartProductBox.appendChild(detailsList);

    //? Add box to <li>
    cartListItem.appendChild(cartProductBox);

    document.querySelector('#chosen_products_list_ul').appendChild(cartListItem);
}

//^ ============ CART DELETE EVENTS ============
//? After creating each item in cart, function that adds event to delete items
function addCartDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.cart_delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteCartItem);
    });
}

//? Function that deletes the item in cart from DOM and memory (catalog already relies on memory)
function handleDeleteCartItem(event) {
    //? The element that was clicked
    const deleteBtn = event.currentTarget;

    //? The list item element (parent to wishlistListItem)
    const listItem = deleteBtn.closest('li');

    if (!listItem) return;

    //? Item identifier from data-id
    const productId = listItem.getAttribute('data-id');

    //? 1. Remove from DOM
    listItem.remove();

    //? 2. Remove from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));

    //? Update product quantity after deleting products
    const headerParagraph = document.querySelector('.cart_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + cart.length + ' items in your wishlist.';
    }

    //? Update final price before shipping when deleting products
    updateCartSubtotalAndTotal()
}

//^ ============ CART QUANTITY MANAGEMENT ============
//? Assign event to quantity that user wants
function addCartQuantityEventListeners() {
    const quantityInputs = document.querySelectorAll('.chosen_product_input');
    quantityInputs.forEach(input => {
        input.addEventListener('input', cartQuantity);
    });
}

//? Function that changes the price of the product in cart
function cartQuantity(event) {
    const quantityInput = event.currentTarget;
    const quantityValue = Number(quantityInput.value);

    //? Fix invalid value - if empty, zero, or less than 1, set to 1
    if (!quantityValue || quantityValue < 1) {
        quantityValue = 1;
        quantityInput.value = quantityValue; // Return field to valid value
    }

    const productBox = quantityInput.closest('.chosen_product_list');

    if (!productBox) return;

    //? Read price from data-price
    const pricePerItem = Number(productBox.dataset.price);
    const totalPricePerItemElement = productBox.querySelector('.cart_item_total_price');

    if (!isNaN(pricePerItem) && totalPricePerItemElement) {
        const total = quantityValue * pricePerItem;
    totalPricePerItemElement.textContent = `${total.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
    }

    //? Update localStorage
    const listItem = quantityInput.closest('li[data-id]');
    if (!listItem) return;
    const productId = listItem.getAttribute('data-id');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cart[productIndex].quantity = quantityValue;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    //? Update final price before shipping when changing quantity
    updateCartSubtotalAndTotal()
}

// =====================================================
//TODO UTILITY FUNCTIONS
// =====================================================

//? Function that converts price with commas, dots and dollar sign
function parsePriceToNumber(priceString) {
    if (!priceString) return 0;

    //? Remove characters that are not digits, dot or comma
    let cleaned = priceString.replace(/[^\d.,]/g, '');

    if (cleaned.includes('.') && cleaned.includes(','))
    {
        //? If there's both dot and comma, comma is thousands - remove it
        cleaned = cleaned.replace(/,/g, '');
    } 
    
    else 
        if (cleaned.includes(',') && !cleaned.includes('.')) {
            //? If there are only commas and no dot, replace commas with dots (for decimal case with comma)
            cleaned = cleaned.replace(/,/g, '.');
        }

    const number = parseFloat(cleaned);

    return isNaN(number) ? 0 : number;
}

//^ ============ CART CALCULATIONS ============
//? Function that handles total price
function updateCartSubtotalAndTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
        const price = parseFloat(item.finalPrice) || 0;
        subtotal += quantity * price;
    });

    const subtotalElement = document.querySelector('.subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
    }

    const totalElement = document.querySelector('.total');
    totalElement.textContent =  subtotalElement.textContent;
}

// =====================================================
//TODO PRODUCT PAGE CREATION
// =====================================================

//? Function to build product page - outside fetch
function createProductPage(product) {
    //? Display main image on product page
    const mainImage = document.createElement('img');
    mainImage.classList.add('main_image');
    mainImage.src = product.image;
    document.querySelector('#product_page_main_img').appendChild(mainImage);
    
    //? First image on product page
    const firstImage = document.createElement('img');
    firstImage.classList.add('product_page_first_img');
    firstImage.src = product.images[0];
    document.querySelector('#product_page_first_second_img_box').appendChild(firstImage);

    //? Add second image on product page
    const secondImage = document.createElement('img');
    secondImage.classList.add('product_page_second_img');
    secondImage.src = product.images[1];
    document.querySelector('#product_page_second_second_img_box').appendChild(secondImage);

    //? Add third image on product page
    const thirdImage = document.createElement('img');
    thirdImage.classList.add('product_page_third_img');
    thirdImage.src = product.images[2];
    document.querySelector('#product_page_third_second_img_box').appendChild(thirdImage);

    //? Add fourth image on product page
    const fourthImage = document.createElement('img');
    fourthImage.classList.add('product_page_fourth_img');
    fourthImage.src = product.images[3];
    document.querySelector('#product_page_fourth_second_img_box').appendChild(fourthImage);

    //? Display product name
    const productName = document.querySelector('#product_page_name');
    productName.textContent = product.name;

    //? Display product price
    const productOriginalPrice = document.querySelector('#original_price');
    productOriginalPrice.textContent = product.originalPrice;
    const productDiscount = document.querySelector('#discount');
    productDiscount.textContent = product.discount;
    const productFinalPrice = document.querySelector('#final_price');
    productFinalPrice.textContent = product.finalPrice;

    //? Display product description
    const productDescription = document.querySelector('#product_page_describe');
    productDescription.textContent = product.description;
}

// =====================================================
//TODO USER INTERFACE FUNCTIONALITY  
// =====================================================

const switchToSignIn = document.querySelector('#switch_to_sign_in');
if (switchToSignIn)
switchToSignIn.addEventListener('click', () => {
    document.querySelector('.log_in_hello_box').style.transform = 'translateX(12.5%)';
});

const switchToSignUp = document.querySelector('#switch_to_sign_up');
if (switchToSignUp)
switchToSignUp.addEventListener('click', () => {
    document.querySelector('.log_in_hello_box').style.transform = 'translateX(-87.5%)';
});

// =====================================================
//TODO PRODUCT FILTERING SYSTEM
// =====================================================

//^ ============ FILTER LOGIC ============
//? Filter products by filters
function filterProducts(products, filters) {
    return products.filter(product => {
    //? Filter by brand
        if (filters.brands.length > 0 && !filters.brands.includes(product.manufacturer)) {
            return false;
        }

    //? Filter by status
        if (filters.statuses.length > 0 && !filters.statuses.includes(product.status)) {
            return false;
        }

    //? Filter by type
        if (filters.types.length > 0 && !filters.types.includes(product.type)) {
            return false;
        }

    //? Filter by price
        if (filters.minPrice || filters.maxPrice) {
            const priceField = product.finalPrice || product.originalPrice;
            if (priceField) {
                const price = parsePriceToNumber(priceField);
                if (filters.minPrice && price < filters.minPrice) {
                    return false;
                }
                if (filters.maxPrice && price > filters.maxPrice) {
                    return false;
                }
            }
        }

        return true;
    });
}

//^ ============ URL HANDLING ============
//? Read filters from URL
function getFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
        brands: urlParams.get('brand') ? urlParams.get('brand').split(',') : [],
        statuses: urlParams.get('status') ? urlParams.get('status').split(',') : [],
        types: urlParams.get('type') ? urlParams.get('type').split(',') : [],
        minPrice: urlParams.get('minPrice') ? parseFloat(urlParams.get('minPrice')) : null,
        maxPrice: urlParams.get('maxPrice') ? parseFloat(urlParams.get('maxPrice')) : null
    };
}

//? Update URL with filters
function updateURLWithFilters(filters) {
    const params = new URLSearchParams();
    
    if (filters.brands.length > 0) {
        params.set('brand', filters.brands.join(','));
    }
    if (filters.statuses.length > 0) {
        params.set('status', filters.statuses.join(','));
    }
    if (filters.types.length > 0) {
        params.set('type', filters.types.join(','));
    }
    if (filters.minPrice) {
        params.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
        params.set('maxPrice', filters.maxPrice);
    }

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.pushState({}, '', newURL);
}

//^ ============ FILTER COLLECTION ============
//? Collect filters from form
function collectFilters() {
    const brands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
        .map(cb => cb.value);
    
    const statuses = Array.from(document.querySelectorAll('input[name="status"]:checked'))
        .map(cb => cb.value);
    
    const types = Array.from(document.querySelectorAll('input[name="type"]:checked'))
        .map(cb => cb.value);
    
    //? Read price values from existing inputs
    const priceInputs = document.querySelectorAll('.price_input');
    const minPrice = priceInputs[0]?.value || null;
    const maxPrice = priceInputs[1]?.value || null;

    return {
        brands,
        statuses,
        types,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null
    };
}

//^ ============ FILTER URL SYNC ============
//? Update checkboxes according to URL
function updateFiltersFromURL(filters) {
    //? Update marked brands
    filters.brands.forEach(brand => {
        const checkbox = document.querySelector(`input[name="brand"][value="${brand}"]`);
        if (checkbox) checkbox.checked = true;
    });

    //? Update marked statuses
    filters.statuses.forEach(status => {
        const checkbox = document.querySelector(`input[name="status"][value="${status}"]`);
        if (checkbox) checkbox.checked = true;
    });

    //? Update marked types
    filters.types.forEach(type => {
        const checkbox = document.querySelector(`input[name="type"][value="${type}"]`);
        if (checkbox) checkbox.checked = true;
    });

    //? Update price range
    const priceInputs = document.querySelectorAll('.price_input');
    if (filters.minPrice && priceInputs[0]) {
        priceInputs[0].value = filters.minPrice;
    }
    if (filters.maxPrice && priceInputs[1]) {
        priceInputs[1].value = filters.maxPrice;
    }
}

//^ ============ FILTER APPLICATION ============
//? Activate filtering on every change
function applyFilters(allProducts) {
    const filters = collectFilters();
    console.log('Applying filters:', filters);
    
    updateURLWithFilters(filters);
    const filtered = filterProducts(allProducts, filters);
    console.log('Results:', filtered.length);
    
    //? Clear container
    //? Render to #catalog (which also has the products_list class)
    const container = document.querySelector('#catalog');
    if (!container) {
        console.error('Container #catalog not found!');
        return;
    }
    
    container.innerHTML = '';
    
    //? Display filtered products
    filtered.forEach(product => {
        creator(product);
    });
}