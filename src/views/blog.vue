<template>
    <div>
      <Header />
      <!-- Contenu de la page -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  
  export default {
    components: {
      Header,
      Footer,
    },
    // Autres options de la page
  };
  </script>
  
  <style>
  /* Styles spécifiques au blog */
  </style>
  