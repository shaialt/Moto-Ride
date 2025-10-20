  import { defineConfig } from 'vite';

  export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'build',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        catalog: 'pages/catalog.html',
        contact: 'pages/contact.html',
        cart: 'pages/cart.html',
        wishlist: 'pages/wishlist.html',
        login: 'pages/login.html',
        product: 'pages/product.html',
        profile: 'pages/profile.html'
      },
    },
  },
});