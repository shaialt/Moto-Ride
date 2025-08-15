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
    // החלף ל־username ו־repo שלך
    const githubUsername = 'shaialt';
    const githubRepo = 'Moto-Ride';

    // בודק אם אנחנו ב־GitHub Pages לפי ה-hostname (אפשר להתאים לפי הצורך)
    const isGitHubPages = window.location.hostname === `${githubUsername}.github.io`;

    // מגדיר את בסיס הנתיב לפי הסביבה:
    // אם GitHub Pages: /repo-name/
    // אחרת (לייב סרבר מקומי או סביבה אחרת): ../
    const basePath = isGitHubPages ? `/${githubRepo}/` : '/client/';

    //?: הכנסת מוצרים מתוך ג'ייסון לקטלוג אופנועים
    fetch(`${basePath}public/data/data.json`)
    .then(response => response.json())
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
            products.forEach(product => {
                creator(product);
            });
        }
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

        if (window.location.href.includes('catalog.html')){
            const urlParams = new URLSearchParams(window.location.search);
            const urlCategory = urlParams.get('category'); // שולף את הקטגוריה מה-URL
            
            if (product.category === urlCategory){
                const container = document.querySelector('#catalog');
                if(container)
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
    const quantity = 1;
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
    // תמונה ראשית בדף מוצר
    const mainImage = document.createElement('img');
    mainImage.classList.add('main_image');
    mainImage.src = product.image;
    document.querySelector('#product_page_main_img').appendChild(mainImage);
    
    // תמונה ראשונה בדף מוצר
    const firstImage = document.createElement('img');
    firstImage.classList.add('product_page_first_img');
    firstImage.src = product.images[0];
    document.querySelector('#product_page_first_second_img_box').appendChild(firstImage);

    // תמונה שניה בדף מוצר
    const secondImage = document.createElement('img');
    secondImage.classList.add('product_page_second_img');
    secondImage.src = product.images[1];
    document.querySelector('#product_page_second_second_img_box').appendChild(secondImage);

    // תמונה שלשית בדף מוצר
    const thirdImage = document.createElement('img');
    thirdImage.classList.add('product_page_third_img');
    thirdImage.src = product.images[2];
    document.querySelector('#product_page_third_second_img_box').appendChild(thirdImage);

    // תמונה רביעית בדף מוצר
    const fourthImage = document.createElement('img');
    fourthImage.classList.add('product_page_fourth_img');
    fourthImage.src = product.images[3];
    document.querySelector('#product_page_fourth_second_img_box').appendChild(fourthImage);

    // שם מוצר
    const productName = document.querySelector('#product_page_name');
    productName.textContent = product.name;

    // מחיר מוצר
    const productOriginalPrice = document.querySelector('#original_price');
    productOriginalPrice.textContent = product.originalPrice;
    const productDiscount = document.querySelector('#discount');
    productDiscount.textContent = product.discount;
    const productFinalPrice = document.querySelector('#final_price');
    productFinalPrice.textContent = product.finalPrice;

    // תיאור מוצר
    const productDescription = document.querySelector('#product_page_describe');
    productDescription.textContent = product.description;
}