import { defineConfig } from 'vite';

// מגדירים את הקונפיגורציה של Vite
export default defineConfig({
  root: '.', // ספריית השורש של הפרויקט שלך (נקודת ההתחלה של Vite)
  base: '/Moto-Ride/', // בסיס כל הנתיבים בקבצים שנוצרים – חשוב כשמעלים ל-GitHub Pages
  publicDir: 'public', // ספריית הקבצים הסטטיים שלא עוברים עיבוד, כמו תמונות או קבצי JSON

  build: {
    outDir: 'build', // הספרייה הסופית שבה יישמרו כל הקבצים לאחר ה-build
    emptyOutDir: true, // מנקה את הספרייה לפני הבנייה כדי למנוע קבצים ישנים
    assetsDir: 'assets', // תיקיית משנה ב-build שבה יישמרו קבצי נכסים כמו תמונות, CSS, JS

    rollupOptions: {
      input: {
        // כאן מגדירים את כל הדפים הפרויקטיים ש-Vite צריך להכין
        main: 'index.html',          // דף הבית
        catalog: 'pages/catalog.html', // דף קטלוג
        contact: 'pages/contact.html', // דף צור קשר
        cart: 'pages/cart.html',       // דף עגלה
        wishlist: 'pages/wishlist.html', // דף מועדפים
        login: 'pages/login.html',       // דף התחברות
        product: 'pages/product.html'    // דף מוצר
      },
    },
  },
});