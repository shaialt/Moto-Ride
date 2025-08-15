import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig({
  root: '.',
  base: './', // חשוב כדי שהנתיבים יהיו יחסיים גם בבילד
  publicDir: 'public', // כל התמונות נשמרות במבנה המקורי
  plugins: [
    createHtmlPlugin({
      minify: true
    })
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        catalog: path.resolve(__dirname, 'pages/catalog.html'),
        contact: path.resolve(__dirname, 'pages/contact.html'),
        cart: path.resolve(__dirname, 'pages/cart.html'),
        wishlist: path.resolve(__dirname, 'pages/wishlist.html'),
        login: path.resolve(__dirname, 'pages/login.html'),
        product: path.resolve(__dirname, 'pages/product.html')
      }
    }
  }
});
