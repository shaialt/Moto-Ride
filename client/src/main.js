// דף בית גלילה מהאמצע של כרטיסיות מתחלפות
document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".subcategory_wrapper_box");
    const content = document.querySelector(".subcategory_3d_box");
    const items = document.querySelectorAll(".subcategory");

    if (wrapper && content && items.length > 0) {
        const wrapperWidth = wrapper.clientWidth;

        // מוצאים את האלמנט האמצעי ביותר
        const middleIndex = Math.floor(items.length / 2);
        const middleItem = items[middleIndex];

        // מחשבים את המיקום של האלמנט האמצעי בתוך התוכן
        const middleItemOffset = middleItem.offsetLeft + (middleItem.offsetWidth / 2);

        // קובעים את הגלילה כך שהאלמנט האמצעי יהיה במרכז
        wrapper.scrollLeft = middleItemOffset - (wrapperWidth / 2);
    }
});

// קרוסלה לדף הבית
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

    resetTimeAnimation(); // איפוס האנימציה של פס הזמן
}

// הפעלת האנימציה של פס הזמן
resetTimeAnimation();

// פתיחת תפריט ניווט ראשי
let openMenue = document.querySelector('.right_nav_block .fa-solid');
openMenue.addEventListener('click', openMenueFunction);

function openMenueFunction (event){
    let navigation_menu = document.querySelector('.navigation_menu');
    navigation_menu.classList.toggle('navigation_menu_open_click');
    let overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
};

// סגירת תפריט ניווט ראשי
let closeMenue = document.querySelector('.navigation_menu_close_button');
closeMenue.addEventListener('click', closeMenueFunction);

function closeMenueFunction (event){
    let navigation_menu = document.querySelector('.navigation_menu');
    navigation_menu.classList.toggle('navigation_menu_open_click');
    let overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
};

// סגירת תפריט ניווט ראשי בעת לחיצה על קישור
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

// סגירה ופתיחה תפריט ניווט משני
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

//?: השמה של אירוע שמרענן את הדפים
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

    // בדיקה אם כבר מחובר
    const loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
    const loggedUser = loggedUsers.find(user => user.isLoggedIn);
    if (loggedUser && window.location.href.includes('login.html')) {
        // אם כבר מחובר, ישר לפרופיל
        window.location.href = `${basePath}pages/profile.html`;
        return;
    }

    // התחברות משתמש
    const logInButton = document.querySelector('#log_in_button');
    if (logInButton) {
        logInButton.addEventListener('click', async () => {
            const userNameOrEmail = document.querySelector('#log_in_email_or_username').value.trim();
            const userPassword = document.querySelector('#log_in_password').value;

            // בדיקת שדות ריקים
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
                    loggedUsers.push({
                        name: user.name,
                        email: user.email,
                        isLoggedIn: true
                    });
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

    // התנתקות משתמש
    const signOutButton = document.querySelector('#sign_out');
    if (signOutButton) {    
        console.log(signOutButton);       // זה יודפס או כ־null אם לא קיים
        console.log(typeof signOutButton);
        signOutButton.addEventListener('click', (e) => {
            e.preventDefault();
            let loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];

            loggedUsers = loggedUsers.map(user => ({
                ...user,
                isLoggedIn: false
            }));

            localStorage.setItem('loggedInUsers', JSON.stringify(loggedUsers));

            console.log('After sign out:', loggedUsers); // לוודא בקונסול שהכל התעדכן

            window.location.href = `${basePath}pages/login.html`;
        });
    }
    
    //?: הכנסת מוצרים מתוך ג'ייסון לקטלוג אופנועים
    fetch(`${basePath}data/data.json`)
    .then(response => response.json())
    .then(data => {
        if (isGitHubPages) {
            data = data.map(item => {
            // תיקון תמונה ראשית
            item.image = fixPath(item.image, githubRepo);

            // תיקון לוגו
            item.logo = fixPath(item.logo, githubRepo);

            // תיקון כל התמונות במערך
            if (Array.isArray(item.images)) {
                item.images = item.images.map(img => fixPath(img, githubRepo));
            }
            return item;
        });
        }
        return data;
    })
    .then(products => {
        // בדיקת כמות מוצרים באתר
        let productsNumbersTotal = 0;
        products.forEach(() => productsNumbersTotal++);
        const total_products = document.querySelector('.total_products');
        if (total_products)
            total_products.textContent = `Discover ${productsNumbersTotal} exlusive motorcyles`;

        // סינון המוצרים לפי הפופולריות הגבוהה ביותר
        const topPopularProducts = products
            .sort((a, b) => b.popularity - a.popularity) // מיון מהגבוה לנמוך
            .slice(0, 4); // לקיחת רק 4 ראשונים

        // בניית כרטיסים רק עבור הפופולריים (לדף הבית)
        topPopularProducts.forEach(product => {
            createProductCardItemElement(product); // זו הפונקציה שלך שיוצרת את הכרטיס
        });

        // בודק אם זה דף מוצר לפי כתובת URL
        if (window.location.href.includes('product.html')) {
            const urlId = window.location.href.split('=')[2].split('&')[0];
            const product = products.find(p => p.id === urlId);
            if (product) {
                createProductPage(product);
            } else {
                console.warn('Not found product with id:', urlId);
            }
        } 
        // אם זה לא דף מוצר – יוצרים את כל כרטיסי הקטלוג (לדף קטלוג)
        else if (window.location.href.includes('catalog.html')) {
            // טעינת פילטרים מה-URL
            const urlFilters = getFiltersFromURL();
            updateFiltersFromURL(urlFilters);
            
            // סינון המוצרים
            const filteredProducts = filterProducts(products, urlFilters);
            console.log('Filtered products:', filteredProducts.length);
            
            // הצגת המוצרים המסוננים במיכל הקטלוג
            const catalogContainer = document.querySelector('#catalog');
            if (catalogContainer) catalogContainer.innerHTML = '';
            filteredProducts.forEach(product => {
                creator(product);
            });

            // פונקציה מרכזית להוספת אירועי סינון
            function setupFilterEvents() {
                // הוספת אירועים לכל הצ'קבוקסים - גם מסידבר רגיל וגם רספונסיבי
                const allCheckboxes = document.querySelectorAll('.filter_sidebar input[type="checkbox"][name], .filter_sidebar_responsive input[type="checkbox"][name]');
                allCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        // מסנכרן צ'קבוקסים בין הסיידבאר הרגיל לרספונסיבי
                        // מסנכרן לפני הסינון כדי שלא יישאר צ'קבוקס מקביל מסומן וימשיך לסנן
                        syncCheckboxes(checkbox);
                        // לאחר הסנכרון, מפעיל סינון עם מצב עדכני של כל הצ'קבוקסים
                        applyFilters(products);
                    });
                });

                // הוספת אירועים לשדות מחיר - גם רגיל וגם רספונסיבי
                const priceInputs = document.querySelectorAll('.filter_sidebar .price_input, .filter_sidebar_responsive .price_input');
                priceInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        // מסנכרן ערכי המחיר בין הסיידבאר הרגיל לרספונסיבי
                        // מסנכרן לפני הסינון כדי שערכי המינימום/מקסימום ייאספו נכון
                        syncPriceInputs(input);
                        // לאחר הסנכרון, מפעיל סינון עם ערכים עדכניים
                        applyFilters(products);
                    });
                });

                // כפתורי Reset - גם רגיל וגם רספונסיבי
                const resetBtns = document.querySelectorAll('.reset_button');
                resetBtns.forEach(resetBtn => {
                    resetBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('Resetting all filters');
                        
                        // ניקוי כל הצ'קבוקסים - גם רגיל וגם רספונסיבי
                        const allCheckboxes = document.querySelectorAll('.filter_sidebar input[type="checkbox"], .filter_sidebar_responsive input[type="checkbox"]');
                        allCheckboxes.forEach(cb => cb.checked = false);
                        
                        // ניקוי שדות מחיר - גם רגיל וגם רספונסיבי
                        const allPriceInputs = document.querySelectorAll('.filter_sidebar .price_input, .filter_sidebar_responsive .price_input');
                        allPriceInputs.forEach(input => input.value = '');
                        
                        // מעדכן את ה-URL ומציג מחדש
                        window.history.pushState({}, '', window.location.pathname);
                        
                        // מנקה ומציג את כל המוצרים
                        const container = document.querySelector('#catalog');
                        if (container) container.innerHTML = '';
                        
                        products.forEach(product => {
                            creator(product);
                        });
                    });
                });
            }

            // פונקציה לסנכרון צ'קבוקסים בין סידבר רגיל לרספונסיבי
            function syncCheckboxes(changedCheckbox) {
                const name = changedCheckbox.name;
                const value = changedCheckbox.value;
                const isChecked = changedCheckbox.checked;

                // מצא את הצ'קבוקס המקביל בסידבר האחר
                const allMatchingCheckboxes = document.querySelectorAll(`input[name="${name}"][value="${value}"]`);
                allMatchingCheckboxes.forEach(cb => {
                    if (cb !== changedCheckbox) {
                        cb.checked = isChecked;
                    }
                });
            }

            // פונקציה לסנכרון שדות מחיר בין סידבר רגיל לרספונסיבי
            function syncPriceInputs(changedInput) {
                const placeholder = changedInput.placeholder;
                const value = changedInput.value;

                // מצא את השדות המקבילים
                const allMatchingInputs = document.querySelectorAll(`.price_input[placeholder="${placeholder}"]`);
                allMatchingInputs.forEach(input => {
                    if (input !== changedInput) {
                        input.value = value;
                    }
                });
            }

            // הפעלת הפונקציה
            setupFilterEvents();
        }

        // סינון מוצרים לפי חיפוש
        const search = document.querySelector('#welcome_animation_input');
        search.addEventListener('input', function() {
            // מחק תיבת הצעות קודמת אם קיימת
            const existingSuggestions = document.querySelector('.suggestions_box');
            if (existingSuggestions) {
                existingSuggestions.remove();
            }

            const searchTerm = search.value.toLowerCase();
            let filteredProducts = []; // הגדרה בחוץ

            // טיפול בלחיצה על Enter
            search.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (filteredProducts.length > 0) {
                        // שמירת תוצאות החיפוש ב-localStorage
                        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
                        // מעבר לדף הקטלוג עם פרמטר חיפוש
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
            
                // נחזיר רק את השם של המוצרים לא את האובייקטים שלהם
                const filteredProductsNames = filteredProducts.map(product => product.name);
                console.log('Filtered products:', filteredProductsNames);
            }

            // יצירת תיבת הצעות
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

                // Add transition for smooth animation
                suggestionsBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // הוספת התוצאות לתיבה
                filteredProducts.forEach(product => {
                    const suggestion = document.createElement('div');
                    suggestion.style.padding = '10px';
                    suggestion.style.borderBottom = '1px solid #eee';
                    suggestion.style.cursor = 'pointer';
                    suggestion.style.display = 'flex';
                    suggestion.style.alignItems = 'center';
                    suggestion.style.justifyContent = 'space-between';

                    // הוספת שם המוצר
                    const textDiv = document.createElement('div');
                    textDiv.textContent = product.name;
                    textDiv.style.flex = '1';

                    // יצירת תמונה ממוזערת
                    const thumbnailImg = document.createElement('img');
                    thumbnailImg.src = product.image;
                    thumbnailImg.alt = product.name;
                    thumbnailImg.style.width = '40px';
                    thumbnailImg.style.height = '40px';
                    thumbnailImg.style.objectFit = 'cover';
                    thumbnailImg.style.marginLeft = '10px';
                    thumbnailImg.style.borderRadius = '4px';

                    // הוספת אירוע לחיצה לכל הצעה
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

                // הוספת תיבת ההצעות למיכל החיפוש
                const container = document.querySelector('.welcome_animation_box');
                if (container) {
                    container.style.position = 'relative';
                    container.appendChild(suggestionsBox);
                    // Trigger the animation
                    requestAnimationFrame(() => {
                        suggestionsBox.style.opacity = '1'; // Fade in
                        suggestionsBox.style.transform = 'translateY(0)'; // Move down to original position
                    });
                }
            }
        });
    })
    .catch(error => console.error('Error loading JSON:', error));

    // טעינת מועדפים ועגלה מהלוקאל סטורג' בכל דף
    loadWishlistFromLocalStorage();
    loadCartFromLocalStorage();
});

//TODO: פונקציה ראשית של כל מה שפועל אחרי קבלת הנתונים
function creator (product){
    const currentPath = window.location.pathname;

    // אם אנחנו בדף הקטלוג
    if (currentPath.includes('catalog.html')) {
        //!: קריאה לפונקציה שיוצרת את המוצר בקטלוג
        createCatalogProductCardItemElement(product);
    }

    //!: השמה של איבנט על האייקונים שבתוך המוצר להוספה למועדפים
    const allProducts = document.querySelectorAll('.product_super_box').forEach( product => {
    const heart = product.querySelector('.add_to_wishlist');
    if(heart)
        heart.addEventListener('click', saveToWishlist);

    const cart = product.querySelector('.add_to_cart');
    if(cart)
        cart.addEventListener('click', saveToCart);
    });

    //!: קריאה לפונקציה שמעדכנת מצב מועדפים ועגלה לאחר קבלת תשובה מהשרת
    updateWishlistHearts();
    updatecarts();
}

//TODO: פונקציה ליצירת כרטיסיות מוצר בדף בית
function createProductCardItemElement(product){
    //TOP PRODUCT SUPER BOX (MAIN DIV)
    const topProductSuperBox = document.createElement('div');
    topProductSuperBox.classList.add('top_product_super_box');
    topProductSuperBox.id = product.id;
    topProductSuperBox.setAttribute('data-stock', product.stock || 1);
    if (product.status) {
        topProductSuperBox.style.setProperty(`--${product.status}`, 'true');
    }

    //BOX DIV
    const box = document.createElement('div');
    box.classList.add('box');
    const boxText = document.createElement('p');
    boxText.textContent = 'Moto-Ride 🏍️';
    box.appendChild(boxText);

    //PRODUCT BOX DIV
    const productBox = document.createElement('div');
    productBox.classList.add('product_box');

    //PRODUCT IMG DIV
    const productImgBox = document.createElement('div');
    productImgBox.classList.add('product_img_box');
    const productImg = document.createElement('img');
    productImg.src = product.image;
    productImg.classList.add('product_img');
    productImgBox.appendChild(productImg);

    //PRODUCT LOGO DIV
    const productLogoBox = document.createElement('div');
    productLogoBox.classList.add('product_logo_box');
    const productLogoImg = document.createElement('img');
    productLogoImg.src = product.logo;
    productLogoImg.classList.add('product_logo_img');

    //ICONS DIV OF PRODUCT LOGO DIV
    const iconsDiv = document.createElement('div');
    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-solid', 'fa-heart', 'add_to_wishlist');
    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'add_to_cart');
    iconsDiv.appendChild(heartIcon);
    iconsDiv.appendChild(cartIcon);

    productLogoBox.appendChild(productLogoImg);
    productLogoBox.appendChild(iconsDiv);

    //CENTER DIV
    const center = document.createElement('div');
    center.classList.add('center');

    //PRODUCT NAME BOX ARTICLE OF CENTER DIV
    const productNameBox = document.createElement('article');
    productNameBox.classList.add('product_name_box');
    const productName = document.createElement('h3');
    productName.classList.add('product_name');
    productName.textContent = product.name;
    productNameBox.appendChild(productName);

    //DESCRIBE BOX ARTICLE OF CENTER DIV
    const describeBox = document.createElement('article');
    describeBox.classList.add('describe_box');
    const describe = document.createElement('p');
    describe.classList.add('describe');
    describe.textContent = product.description;
    describeBox.appendChild(describe);

    //BUY BOX ARTICLE OF CENTER DIV
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

    //BUTTON OF BUY BOX ARTICLE OF CENTER DIV
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

    //CENTER DIV BUILD
    center.appendChild(productNameBox);
    center.appendChild(describeBox);
    center.appendChild(buyBox);

    //NEW POPULAR DIV + CURVE DIV
    const newPopular = document.createElement('div');
    newPopular.classList.add('new_popular');
    const curve = document.createElement('div');
    curve.classList.add('curve');

    //PRODUCT BOX DIV BUILD
    productBox.appendChild(productImgBox);
    productBox.appendChild(productLogoBox);
    productBox.appendChild(center);
    productBox.appendChild(newPopular);
    productBox.appendChild(curve);

    //TOP PRODUCT SUPER BOX BUILD
    topProductSuperBox.appendChild(box);
    topProductSuperBox.appendChild(productBox);

    //BUILD ON HOME PAGE
    const container = document.querySelector('#top_products');
    if (container)
        container.appendChild(topProductSuperBox);
}

//TODO: פונקציה ליצירת כרטיסיות מוצר בקטלוג
function createCatalogProductCardItemElement(product){
        //PRODUCT SUPER BOX (MAIN DIV)
        const productSuperBox = document.createElement('div');
        productSuperBox.classList.add('product_super_box');
        productSuperBox.id = product.id;
        productSuperBox.setAttribute('data-stock', product.stock || 1);
        if (product.status) {
            productSuperBox.style.setProperty(`--${product.status}`, 'true');
        }

        //BOX DIV
        const box = document.createElement('div');
        box.classList.add('box');
        const boxText = document.createElement('p');
        boxText.textContent = 'Moto-Ride 🏍️';
        box.appendChild(boxText);

        //PRODUCT BOX DIV
        const productBox = document.createElement('div');
        productBox.classList.add('product_box');

        //PRODUCT IMG DIV
        const productImgBox = document.createElement('div');
        productImgBox.classList.add('product_img_box');
        const productImg = document.createElement('img');
        productImg.src = product.image;
        productImg.classList.add('product_img');
        productImgBox.appendChild(productImg);

        //PRODUCT LOGO DIV
        const productLogoBox = document.createElement('div');
        productLogoBox.classList.add('product_logo_box');
        const productLogoImg = document.createElement('img');
        productLogoImg.src = product.logo;
        productLogoImg.classList.add('product_logo_img');

        //ICONS DIV OF PRODUCT LOGO DIV
        const iconsDiv = document.createElement('div');
        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'add_to_wishlist');
        const cartIcon = document.createElement('i');
        cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'add_to_cart');
        iconsDiv.appendChild(heartIcon);
        iconsDiv.appendChild(cartIcon);

        productLogoBox.appendChild(productLogoImg);
        productLogoBox.appendChild(iconsDiv);

        //CENTER DIV
        const center = document.createElement('div');
        center.classList.add('center');

        //PRODUCT NAME BOX ARTICLE OF CENTER DIV
        const productNameBox = document.createElement('article');
        productNameBox.classList.add('product_name_box');
        const productName = document.createElement('h3');
        productName.classList.add('product_name');
        productName.textContent = product.name;
        productNameBox.appendChild(productName);

        //DESCRIBE BOX ARTICLE OF CENTER DIV
        const describeBox = document.createElement('article');
        describeBox.classList.add('describe_box');
        const describe = document.createElement('p');
        describe.classList.add('describe');
        describe.textContent = product.description;
        describeBox.appendChild(describe);

        //BUY BOX ARTICLE OF CENTER DIV
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

        //BUTTON OF BUY BOX ARTICLE OF CENTER DIV
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

        //CENTER DIV BUILD
        center.appendChild(productNameBox);
        center.appendChild(describeBox);
        center.appendChild(buyBox);

        //NEW POPULAR DIV + CURVE DIV
        const newPopular = document.createElement('div');
        newPopular.classList.add('new_popular');
        const curve = document.createElement('div');
        curve.classList.add('curve');

        //PRODUCT BOX DIV BUILD
        productBox.appendChild(productImgBox);
        productBox.appendChild(productLogoBox);
        productBox.appendChild(center);
        productBox.appendChild(newPopular);
        productBox.appendChild(curve);

        //PRODUCT SUPER BOX BUILD
        productSuperBox.appendChild(box);
        productSuperBox.appendChild(productBox);

        // הוספת המוצר למיכל בדף קטלוג
        if (window.location.href.includes('catalog.html')){
            const container = document.querySelector('#catalog');
            if(container) {
                container.appendChild(productSuperBox);
            }
        }
}

//TODO: פונקציה ששומרת בזיכרון את פרטי המוצר הנבחר לעגלה וצובעת באדום את הלב
function saveToWishlist(event){
    // שינוי מצב הלב בקטלוג של הוספה והסרה של המוצר
    const heartIconClick = event.currentTarget;
    if(heartIconClick.classList.contains('add_to_wishlist_click'))
        heartIconClick.classList.remove('add_to_wishlist_click');
    else
        heartIconClick.classList.add('add_to_wishlist_click');

    // מציאת כרטיס המוצר
    const productBox = heartIconClick.closest('.product_super_box');
    if (!productBox) return;

    // שליפת נתונים מתוך הכרטיס הנבחר
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

    // מבנה הנתונים לשמירה
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

//TODO: עדכון צבע הלבבות לאחר יצירת הכרטיסים בהתאם ללוקאל סטורג לאחר רענון
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

//TODO: פונקציה ששולפת מהזיכרון את הנתונים של המוצרים ומזמנת פונקציה שבונה אותם במועדפים
function loadWishlistFromLocalStorage() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.querySelector('#wish_chosen_products_list_ul');
    if (!container) {
        console.warn('Container for wishlist not found!');
        return; // יוצא מהפונקציה כדי לא לגרום לשגיאה
    }
    
    container.innerHTML = ''; // מנקה את הרשימה לפני טעינה למניעת שכפוליות

    if (wishlist.length === 0) {
        return;
    }

    wishlist.forEach(product => {
        createWishlistItemElement(product);
    });

    //TODO: קריאה לפונקציה שנותנת לכולם לאחר השליפה מהזיכרון איבנט למחיקת מוצר
    addWishlistDeleteEventListeners();

    // מעדכן את הטקסט בכותרת אחרי שינוי
    const headerParagraph = document.querySelector('.wish_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + wishlist.length + ' items in your wishlist.';
    }
}

//TODO: פונקציה ליצירת כרטיסיות מוצר למועדפים
function createWishlistItemElement(wishlistProductData) {
    const wishlistListItem = document.createElement('li');
    wishlistListItem.setAttribute('data-id', wishlistProductData.id); // להוספה אם תצטרך בעתיד

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

    // הרכבה
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

//TODO: לאחר יצירת כל פריט במועדפים פונקציה שמוסיפה אירוע למחיקת פריטים
function addWishlistDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.wish_delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteWishlistItem);
    });
}

//TODO: הפונקציה שמוחקת את הפריט במועדפים מהדום הזיכרון (והקטלוג כבר נשען על הזיכרון)
function handleDeleteWishlistItem(event) {
    // האלמנט שנלחץ
    const deleteBtn = event.currentTarget;

    // האלמנט של רשימת הפריט (הורה ל-wishlistListItem)
    const listItem = deleteBtn.closest('li');

    if (!listItem) return;

    // מזהה הפריט מתוך data-id
    const productId = listItem.getAttribute('data-id');

    // 1. הסרה מה-DOM
    listItem.remove();

    // 2. הסרה מ-localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

        // מעדכן את הטקסט בכותרת אחרי שינוי
    const headerParagraph = document.querySelector('.wish_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + wishlist.length + ' items in your wishlist.';
    }
}

//TODO: פונקציה ששומרת בזיכרון את פרטי המוצר הנבחר למועדפים וצובעת באדום את העגלה
function saveToCart(event){
    // שינוי מצב הלב בקטלוג של הוספה והסרה של המוצר
    const cartIconClick = event.currentTarget;
    if(cartIconClick.classList.contains('add_to_cart_click'))
        cartIconClick.classList.remove('add_to_cart_click');
    else
        cartIconClick.classList.add('add_to_cart_click');

    // מציאת כרטיס המוצר
    const productBox = cartIconClick.closest('.product_super_box');
    if (!productBox) return;

    // שליפת נתונים מתוך הכרטיס הנבחר
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

    // מבנה הנתונים לשמירה
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

//TODO: עדכון צבע העגלות לאחר יצירת הכרטיסים בהתאם ללוקאל סטורג
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

//TODO: פונקציה ששולפת מהזיכרון את הנתונים של המוצרים ומזמנת פונקציה שבונה אותם בעגלה
function loadCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('#chosen_products_list_ul');
    if (!container) {
        console.warn('Container for cart not found!');
        return; // יוצא מהפונקציה כדי לא לגרום לשגיאה
    }
    
    container.innerHTML = ''; // מנקה את הרשימה לפני טעינה למניעת שכפוליות

    if (cart.length === 0) {
        return;
    }

    cart.forEach(product => {
        createCartItemElement(product);
    });

    //TODO: הוספת מאזינים אחרי יצירת האלמנטים
    addCartDeleteEventListeners();
    addCartQuantityEventListeners();

    //TODO: מעדכן את הכמות מוצרים בכותרת
    const headerParagraph = document.querySelector('.cart_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + cart.length + ' items in your wishlist.';
    }

    //TODO: מעדכן את המחיר הסופי לפני משלוח
    updateCartSubtotalAndTotal()
}

//TODO: פונקציה לבניית פריט עגלה חדש
function createCartItemElement(cartProductData) {
    // יצירת תיבת <li> שתכיל את המוצר
    const cartListItem = document.createElement('li');
    cartListItem.setAttribute('data-id', cartProductData.id); // להוספה אם תצטרך בעתיד

    // יצירת תיבת המוצר הכללית בעגלה
    const cartProductBox = document.createElement('div');
    cartProductBox.classList.add('chosen_product_list');

    // הוספת data-price עם המחיר ליחידה (מספר)
    cartProductBox.dataset.price = cartProductData.finalPrice;

    // יצירת כפתור מחיקת מוצר מהעגלה
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('cart_delete', 'fa-solid', 'fa-xmark');

    // יצירת תיבת תמונת המוצר
    const imageBox = document.createElement('div');
    imageBox.classList.add('chosen_product_img_box');

    // יצירת קישור לדף רכישה או מידע נוסף
    const productLink = document.createElement('a');
    productLink.href = `catalog.html#${cartProductData.id}`; // במידה ואין קישור, מונע שבירה

    // יצירת תמונת המוצר
    const productImage = document.createElement('img');
    productImage.src = cartProductData.image;
    productImage.alt = '';

    // חיבור התמונה לקישור והתיבה
    productLink.appendChild(productImage);
    imageBox.appendChild(productLink);

    // יצירת רשימת פרטי המוצר (שם, מחיר, כמות, מחיר כולל)
    const detailsList = document.createElement('ul');

    // שם המוצר
    const nameItem = document.createElement('li');
    nameItem.textContent = cartProductData.name;

    // מחיר ליחידה
    const pricePerItem = document.createElement('li');
    pricePerItem.classList.add('cart_price_per_item')
    pricePerItem.textContent = `${cartProductData.finalPrice.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
   
    // תיבת כמות לבחירת מספר יחידות
    const quantityItem = document.createElement('li');
    let quantity = parseInt(cartProductData.quantity);
    if (!quantity || quantity < 1) quantity = 1; // תיקון כמות לא חוקית

    // שמירה חוזרת לאובייקט
    cartProductData.quantity = quantity;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = quantity;
    quantityInput.min = 1;
    quantityInput.classList.add('chosen_product_input');

    //TODO: מונע הכנסת תווים לא חוקיים (מקלדת בטלפון/דפדפן)
    quantityInput.addEventListener('keydown', function (e) {
        if (e.key === '-' || e.key === '.' || e.key === 'e') {
            e.preventDefault();
        }
    });

    quantityItem.appendChild(quantityInput);

    // מחיר כולל (מחיר ליחידה * כמות)
    const totalItem = document.createElement('li');
    totalItem.classList.add('cart_item_total_price');
    const totalPrice = cartProductData.finalPrice;
    totalItem.textContent = `${(cartProductData.finalPrice * quantity).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
    // חיבור כל שורות המידע לרשימה
    detailsList.appendChild(nameItem);
    detailsList.appendChild(pricePerItem);
    detailsList.appendChild(quantityItem);
    detailsList.appendChild(totalItem);

    // חיבור אייקון המחיקה, התמונה והרשימה לקופסה הראשית
    cartProductBox.appendChild(deleteIcon);
    cartProductBox.appendChild(imageBox);
    cartProductBox.appendChild(detailsList);

    // הוספת הקופסה ל־<li>
    cartListItem.appendChild(cartProductBox);

    document.querySelector('#chosen_products_list_ul').appendChild(cartListItem);
}

//TODO: לאחר יצירת כל פריט בעגלה פונקציה שמוסיפה אירוע למחיקת פריטים
function addCartDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.cart_delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteCartItem);
    });
}

//TODO: הפונקציה שמוחקת את הפריט בעגלה מהדום הזיכרון (והקטלוג כבר נשען על הזיכרון)
function handleDeleteCartItem(event) {
    // האלמנט שנלחץ
    const deleteBtn = event.currentTarget;

    // האלמנט של רשימת הפריט (הורה ל-wishlistListItem)
    const listItem = deleteBtn.closest('li');

    if (!listItem) return;

    // מזהה הפריט מתוך data-id
    const productId = listItem.getAttribute('data-id');

    // 1. הסרה מה-DOM
    listItem.remove();

    // 2. הסרה מ-localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));

    //TODO: מעדכן את הכמות מוצרים לאחר מחיקת מוצרים
    const headerParagraph = document.querySelector('.cart_header p');
    if (headerParagraph) {
        headerParagraph.textContent = 'You have: ' + cart.length + ' items in your wishlist.';
    }

    //TODO: מעדכן את המחיר הסופי לפני משלוח במחיקת מוצרים
    updateCartSubtotalAndTotal()
}

//TODO: השמה של איבנט על הכמות שהמשתמש רוצה
function addCartQuantityEventListeners() {
    const quantityInputs = document.querySelectorAll('.chosen_product_input');
    quantityInputs.forEach(input => {
        input.addEventListener('input', cartQuantity);
    });
}

//TODO: פונקציה שמשנה את המחיר של המוצר בעגלה
function cartQuantity(event) {
    const quantityInput = event.currentTarget;
    const quantityValue = Number(quantityInput.value);

    // תיקון ערך לא חוקי - אם ריק, אפס, או פחות מ-1, נקבע ל-1
    if (!quantityValue || quantityValue < 1) {
        quantityValue = 1;
        quantityInput.value = quantityValue; // מחזיר את השדה לערך חוקי
    }

    const productBox = quantityInput.closest('.chosen_product_list');

    if (!productBox) return;

    // קריאת המחיר מה-data-price
    const pricePerItem = Number(productBox.dataset.price);
    const totalPricePerItemElement = productBox.querySelector('.cart_item_total_price');

    if (!isNaN(pricePerItem) && totalPricePerItemElement) {
        const total = quantityValue * pricePerItem;
    totalPricePerItemElement.textContent = `${total.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
    }

    // עדכון localStorage
    const listItem = quantityInput.closest('li[data-id]');
    if (!listItem) return;
    const productId = listItem.getAttribute('data-id');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cart[productIndex].quantity = quantityValue;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    //TODO: מעדכן את המחיר הסופי לפני משלוח בשינוי כמות
    updateCartSubtotalAndTotal()
}

//TODO: פונקציה שממירה את המחיר עם פסיקים ונקודות וסימן דולר
function parsePriceToNumber(priceString) {
    if (!priceString) return 0;

    // הסרת תווים שאינם ספרות, נקודה או פסיק
    let cleaned = priceString.replace(/[^\d.,]/g, '');

    if (cleaned.includes('.') && cleaned.includes(','))
    {
        // אם יש גם נקודה וגם פסיק, הפסיק הוא אלפים - נסיר אותו
        cleaned = cleaned.replace(/,/g, '');
    } 
    
    else 
        if (cleaned.includes(',') && !cleaned.includes('.')) {
            // אם יש רק פסיקים ונקודה לא קיימת, נחליף פסיקים בנקודות (למקרה של עשרוני עם פסיק)
            cleaned = cleaned.replace(/,/g, '.');
        }

    const number = parseFloat(cleaned);

    return isNaN(number) ? 0 : number;
}

//TODO: פונקציה שמטפלת במחיר כולל
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

//TODO: פונקציה לבניית דף מוצר – מחוץ לפטש
function createProductPage(product) {
    // אני מציג תמונה ראשית בדף המוצר
    const mainImage = document.createElement('img');
    mainImage.classList.add('main_image');
    mainImage.src = product.image;
    document.querySelector('#product_page_main_img').appendChild(mainImage);
    
    // תמונה ראשונה בדף מוצר
    const firstImage = document.createElement('img');
    firstImage.classList.add('product_page_first_img');
    firstImage.src = product.images[0];
    document.querySelector('#product_page_first_second_img_box').appendChild(firstImage);

    // אני מוסיף תמונה שנייה בדף המוצר
    const secondImage = document.createElement('img');
    secondImage.classList.add('product_page_second_img');
    secondImage.src = product.images[1];
    document.querySelector('#product_page_second_second_img_box').appendChild(secondImage);

    // אני מוסיף תמונה שלישית בדף המוצר
    const thirdImage = document.createElement('img');
    thirdImage.classList.add('product_page_third_img');
    thirdImage.src = product.images[2];
    document.querySelector('#product_page_third_second_img_box').appendChild(thirdImage);

    // אני מוסיף תמונה רביעית בדף המוצר
    const fourthImage = document.createElement('img');
    fourthImage.classList.add('product_page_fourth_img');
    fourthImage.src = product.images[3];
    document.querySelector('#product_page_fourth_second_img_box').appendChild(fourthImage);

    // אני מציג את שם המוצר
    const productName = document.querySelector('#product_page_name');
    productName.textContent = product.name;

    // אני מציג את מחיר המוצר
    const productOriginalPrice = document.querySelector('#original_price');
    productOriginalPrice.textContent = product.originalPrice;
    const productDiscount = document.querySelector('#discount');
    productDiscount.textContent = product.discount;
    const productFinalPrice = document.querySelector('#final_price');
    productFinalPrice.textContent = product.finalPrice;

    // אני מציג את תיאור המוצר
    const productDescription = document.querySelector('#product_page_describe');
    productDescription.textContent = product.description;
}

//TODO: אני מנהל כאן פונקציות הקשורות למשתמשים
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

/*
// אני רושם משתמש חדש
const registerButton = document.querySelector('#sign_in_button');
if (registerButton) {
    registerButton.addEventListener('click', registerUser);
    function registerUser() {
        const userName = document.querySelector('#sign_in_name').value.trim();
        const userEmail = document.querySelector('#sign_in_email').value.trim();
        const userPassword = document.querySelector('#sign_in_password').value;
        if (!userName || !userEmail || !userPassword) {
            alert('Please fill in all fields.');
            return;
        }
        if (userPassword.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        if (userPassword.search(/[0-9]/) === -1) {
            alert('Password must contain at least one number.');
            return;
        }
        if (userPassword.search(/[A-Z]/) === -1) {
            alert('Password must contain at least one uppercase letter.');
        }
        if (userPassword.search(/[a-z]/) === -1) {
            alert('Password must contain at least one lowercase letter.');
            return
        }
        if(userPassword.search(/[!@#$%^&*(),.?":{}|<>]/) === -1) {
            alert('Password must contain at least one special character.');
            return;
        }
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({
            name: userName,
            email: userEmail,
            password: userPassword
        });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! You can now log in.');
        window.location.href = './pages/profile.html';
    }
}

// אני מתחבר עם משתמש קיים
const logInButton = document.querySelector('#log_in_button');
if (logInButton) {
    logInButton.addEventListener('click', logIn);
    function logIn() {
        const userNameOrEmail = document.querySelector('#log_in_email_or_username').value.trim();
        const userPassword = document.querySelector('#log_in_password').value;
        if (!userNameOrEmail || !userPassword) {
            alert('Please fill in all fields.');
            return;
        }

        // בדיקת פרטי המשתמש בזיכרון
        if (localStorage.getItem('users')) {
            let users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(user => {
                return (user.email === userNameOrEmail || user.name === userNameOrEmail) && user.password === userPassword
            });

            if (user) {
                alert('Login successful!');
                window.location.href = './pages/profile.html';
            }
            else {
                alert('Invalid username/email or password.');
            }
        }
        else {
            alert('No users found. Please register first.');
            return;
        }
    }
}
*/

//TODO: אני מסנן מוצרים לפי הפילטרים
function filterProducts(products, filters) {
    return products.filter(product => {
    // אני מסנן לפי מותג
        if (filters.brands.length > 0 && !filters.brands.includes(product.manufacturer)) {
            return false;
        }

    // אני מסנן לפי סטטוס
        if (filters.statuses.length > 0 && !filters.statuses.includes(product.status)) {
            return false;
        }

    // אני מסנן לפי סוג
        if (filters.types.length > 0 && !filters.types.includes(product.type)) {
            return false;
        }

    // אני מסנן לפי מחיר
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

//TODO: אני קורא את הפילטרים מה-URL
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

//TODO: אני מעדכן את ה-URL עם הפילטרים
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

//TODO: אני אוסף את הפילטרים מהטופס
function collectFilters() {
    const brands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
        .map(cb => cb.value);
    
    const statuses = Array.from(document.querySelectorAll('input[name="status"]:checked'))
        .map(cb => cb.value);
    
    const types = Array.from(document.querySelectorAll('input[name="type"]:checked'))
        .map(cb => cb.value);
    
    // אני קורא את ערכי המחירים מהאינפוטים הקיימים
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

//TODO: אני מעדכן את הצ'קבוקסים לפי ה-URL
function updateFiltersFromURL(filters) {
    // אני מעדכן את המותגים המסומנים
    filters.brands.forEach(brand => {
        const checkbox = document.querySelector(`input[name="brand"][value="${brand}"]`);
        if (checkbox) checkbox.checked = true;
    });

    // אני מעדכן את הסטטוסים המסומנים
    filters.statuses.forEach(status => {
        const checkbox = document.querySelector(`input[name="status"][value="${status}"]`);
        if (checkbox) checkbox.checked = true;
    });

    // אני מעדכן את הסוגים המסומנים
    filters.types.forEach(type => {
        const checkbox = document.querySelector(`input[name="type"][value="${type}"]`);
        if (checkbox) checkbox.checked = true;
    });

    // אני מעדכן את טווח המחירים
    const priceInputs = document.querySelectorAll('.price_input');
    if (filters.minPrice && priceInputs[0]) {
        priceInputs[0].value = filters.minPrice;
    }
    if (filters.maxPrice && priceInputs[1]) {
        priceInputs[1].value = filters.maxPrice;
    }
}

//TODO: אני מפעיל את הסינון בכל שינוי
function applyFilters(allProducts) {
    const filters = collectFilters();
    console.log('Applying filters:', filters);
    
    updateURLWithFilters(filters);
    const filtered = filterProducts(allProducts, filters);
    console.log('Results:', filtered.length);
    
    // אני מנקה את המיכל
    // אני מרנדר אל #catalog (שהוא גם עם המחלקה products_list)
    const container = document.querySelector('#catalog');
    if (!container) {
        console.error('Container #catalog not found!');
        return;
    }
    
    container.innerHTML = '';
    
    // אני מציג את המוצרים המסוננים
    filtered.forEach(product => {
        creator(product);
    });
}