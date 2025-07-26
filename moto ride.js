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

// הכנסת מוצרים מתוך ג'ייסון לקטלוג אופנועים
fetch('../assets/products.json')
  .then(response => response.json())
  .then(products => {
    products.forEach(product => {
      //?: קריאה לפונקציה ראשית לאחר קבלת התשובה מהשרת
      creator(product);
    });
  })
  .catch(error => console.error('Error loading JSON:', error));

//TODO: פונקציה ראשית של כל מה שפועל אחרי קבלת הנתונים
function creator (product){
    //!: קריאה לפונקציה שיוצרת את המוצר
    createProductCardItemElement(product);

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

//TODO: עדכון צבע הלבבות לאחר יצירת הכרטיסים בהתאם ללוקאל סטורג
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

//TODO: פונקציה ליצירת כרטיסיות מוצר
function createProductCardItemElement(product){
        //PRODUCT SUPER BOX (MAIN DIV)
        const productSuperBox = document.createElement('div');
        productSuperBox.classList.add('product_super_box');
        productSuperBox.id = product.id;
        if (product.status) {
            productSuperBox.style.setProperty(`--${product.status}`, 'true');
        }

        //BOX DIV
        const box = document.createElement('div');
        box.classList.add('box');
        const boxText = document.createElement('p');
        boxText.textContent = 'Moto & Ride 🏍️';
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
        const productBuyButton = document.createElement('button');
        productBuyButton.classList.add('button');
        const productBuyButtonLink = document.createElement('a');
        productBuyButtonLink.href = product.buyLink;
        productBuyButtonLink.classList.add('a_button');
        const bagIcon = document.createElement('i');
        bagIcon.classList.add('fa-solid', 'fa-bag-shopping');
        productBuyButtonLink.appendChild(bagIcon);
        productBuyButton.appendChild(productBuyButtonLink);


        buyBox.appendChild(priceContainer);
        buyBox.appendChild(productBuyButton);

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

        if (product.category == 'motorcycles'){
            const container = document.querySelector('#motorcycles_catalog');
            if(container)
                container.appendChild(productSuperBox);
        }

    
        if (product.category == 'gear & protection'){
            const container = document.querySelector('#gear_&_protection');
            if(container)
                container.appendChild(productSuperBox);
        }

        if (product.category == 'parts & accessories'){
            const container = document.querySelector('#parts_&_accessories');
            if(container)
                container.appendChild(productSuperBox);
        }

        if (product.category == 'upgrades'){
            const container = document.querySelector('#upgrades');
            if(container)
                container.appendChild(productSuperBox);
        }
}

//TODO: פונקציה ששומרת בזיכרון את פרטי המוצר הנבחר לעגלה וצובעת באדום את הלב
function saveToWishlist(event){
    // שינוי מצב הלב בקטלוג של הוספה והסרה של המוצר
    const heartIconClick = event.currentTarget;
    heartIconClick.classList.toggle('add_to_wishlist_click');

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
    const buyLink = productBox.querySelector('.a_button')?.href;

    if (!productId || !name) return;

    // מבנה הנתונים לשמירה
    const productData = {
        id: productId,
        name,
        description,
        image,
        logo,
        originalPrice,
        discount,
        finalPrice,
        buyLink
    };

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if (heartIconClick.classList.contains('add_to_wishlist_click')) {
        if (existingIndex === -1) {
            wishlist.push(productData);
        }
    } 
    
    else {
        if (existingIndex !== -1) {
            wishlist.splice(existingIndex, 1);
        }
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

//TODO: פונקציה ששומרת בזיכרון את פרטי המוצר הנבחר למועדפים וצובעת באדום את העגלה
function saveToCart(event){
    // שינוי מצב הלב בקטלוג של הוספה והסרה של המוצר
    const cartIconClick = event.currentTarget;
    cartIconClick.classList.toggle('add_to_cart_click');

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
    const finalPrice = productBox.querySelector('h2')?.textContent.trim();
    const buyLink = productBox.querySelector('.a_button')?.href;

    if (!productId || !name) return;

    // מבנה הנתונים לשמירה
    const productData = {
        id: productId,
        name,
        description,
        image,
        logo,
        originalPrice,
        discount,
        finalPrice,
        buyLink
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id === productId);

    if (cartIconClick.classList.contains('add_to_cart_click')) {
        if (existingIndex === -1) {
            cart.push(productData);
        }
    } 
    
    else {
        if (existingIndex !== -1) {
            cart.splice(existingIndex, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

//TODO: פונקציה ליצירת כרטיסיות מוצר למועדפים
function createWishlistItemElement(event) {
    // יצירת פריט רשימה
    const wishlistListItem = document.createElement('li');

    // יצירת קופסה כוללת לפריט wishlist
    const wishlistProductWrapper = document.createElement('div');
    wishlistProductWrapper.classList.add('wish_chosen_product_list');

    // יצירת אייקון לב להסרת פריט מה־wishlist
    const wishlistDeleteIcon = document.createElement('i');
    wishlistDeleteIcon.classList.add('wish_delete', 'fa-solid', 'fa-heart');

    // קופסה לתמונה
    const wishlistImageBox = document.createElement('div');
    wishlistImageBox.classList.add('wish_chosen_product_img_box');

    // קישור לתמונה
    const wishlistImageLink = document.createElement('a');
    wishlistImageLink.href = '../motorcycle catalog/motorcycles.html#6';

    // יצירת התמונה
    const wishlistImage = document.createElement('img');
    wishlistImage.src = '../images/product/kawasaki product/h2 sx.png';
    wishlistImage.alt = '';

    // קופסה למידע על המוצר
    const wishlistContentBox = document.createElement('article');
    wishlistContentBox.classList.add('wish_chosen_product_content_box');

    // קופסה למחיר
    const wishlistPriceBox = document.createElement('div');
    wishlistPriceBox.classList.add('wish_chosen_product_price');

    // קופסה למחיר המקורי וההנחה
    const wishlistOriginalPriceBox = document.createElement('div');
    wishlistOriginalPriceBox.classList.add('original_price_box');
    const wishlistOriginalPrice = document.createElement('h4');
    wishlistOriginalPrice.classList.add('original_price');
    wishlistOriginalPrice.textContent = '29,642.47 $';
    const wishlistDiscount = document.createElement('p');
    wishlistDiscount.classList.add('discount');
    wishlistDiscount.textContent = '-10%';
    const wishlistFinalPrice = document.createElement('h2');
    wishlistFinalPrice.textContent = '26,678.22 $';

    // קופסה לשם ותיאור המוצר
    const wishlistTitleBox = document.createElement('div');
    wishlistTitleBox.classList.add('wish_product_title');
    const wishlistProductName = document.createElement('h3');
    wishlistProductName.classList.add('wish_product_name');
    wishlistProductName.textContent = 'Ninja h2 sx';
    const wishlistDescription = document.createElement('p');
    wishlistDescription.classList.add('wish_describe');
    wishlistDescription.textContent = 'A high-performance sport bike from Kawasaki, featuring a 998cc supercharged engine that';

    // קופסה לכפתורים
    const wishlistButtonsBox = document.createElement('div');
    wishlistButtonsBox.classList.add('wish_product_buttons');
    const wishlistAddToCartButton = document.createElement('button');
    wishlistAddToCartButton.textContent = 'Add to cart';
    const wishlistBuyNowButton = document.createElement('button');
    wishlistBuyNowButton.textContent = 'Buy now';

    // הרכבת התמונה
    wishlistImageLink.appendChild(wishlistImage);
    wishlistImageBox.appendChild(wishlistImageLink);

    // הרכבת תיבת המחיר
    wishlistOriginalPriceBox.appendChild(wishlistOriginalPrice);
    wishlistOriginalPriceBox.appendChild(wishlistDiscount);
    wishlistPriceBox.appendChild(wishlistOriginalPriceBox);
    wishlistPriceBox.appendChild(wishlistFinalPrice);

    // הרכבת תיבת הכותרת
    wishlistTitleBox.appendChild(wishlistProductName);
    wishlistTitleBox.appendChild(wishlistDescription);

    // הרכבת כפתורים
    wishlistButtonsBox.appendChild(wishlistAddToCartButton);
    wishlistButtonsBox.appendChild(wishlistBuyNowButton);

    // הרכבת תיבת התוכן
    wishlistContentBox.appendChild(wishlistPriceBox);
    wishlistContentBox.appendChild(wishlistTitleBox);
    wishlistContentBox.appendChild(wishlistButtonsBox);

    // הרכבת הכל לתוך הקופסה הראשית
    wishlistProductWrapper.appendChild(wishlistDeleteIcon);
    wishlistProductWrapper.appendChild(wishlistImageBox);
    wishlistProductWrapper.appendChild(wishlistContentBox);

    // הכנסת הכל ל־li
    wishlistListItem.appendChild(wishlistProductWrapper);

    // הכנסת כרטיס מועדפים לתוך הדום

     
}

//TODO: פונקציה לבניית פריט עגלה חדש
function createCartItemElement(product) {
    // יצירת תיבת <li> שתכיל את המוצר
    const listItem = document.createElement('li');

    // יצירת תיבת המוצר הכללית בעגלה
    const cartProductBox = document.createElement('div');
    cartProductBox.classList.add('chosen_product_list');

    // יצירת כפתור מחיקת מוצר מהעגלה
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('delete_product', 'fa-solid', 'fa-xmark');

    // יצירת תיבת תמונת המוצר
    const imageBox = document.createElement('div');
    imageBox.classList.add('chosen_product_img_box');

    // יצירת קישור לדף רכישה או מידע נוסף
    const productLink = document.createElement('a');
    productLink.href = product.buyLink || '#'; // במידה ואין קישור, מונע שבירה

    // יצירת תמונת המוצר
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;

    // חיבור התמונה לקישור והתיבה
    productLink.appendChild(productImage);
    imageBox.appendChild(productLink);

    // יצירת רשימת פרטי המוצר (שם, מחיר, כמות, מחיר כולל)
    const detailsList = document.createElement('ul');

    // שם המוצר
    const nameItem = document.createElement('li');
    nameItem.textContent = product.name;

    // מחיר ליחידה
    const pricePerItem = document.createElement('li');
    pricePerItem.textContent = `${product.finalPrice} $`;

    // תיבת כמות לבחירת מספר יחידות
    const quantityItem = document.createElement('li');
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = product.quantity || 1; // אם אין כמות, שים 1 כברירת מחדל
    quantityInput.min = 1;
    quantityInput.classList.add('chosen_product_input');
    quantityItem.appendChild(quantityInput);

    // מחיר כולל (מחיר ליחידה * כמות)
    const totalItem = document.createElement('li');
    const totalPrice = (parseFloat(product.finalPrice) * (product.quantity || 1)).toFixed(2);
    totalItem.textContent = `${totalPrice} $`;

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
    listItem.appendChild(cartProductBox);

}



