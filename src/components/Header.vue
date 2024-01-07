<template>
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Accueil</router-link></li>
          <li>
            Blog
            <ul>
              <li><router-link to="/blog">Liste des articles</router-link></li>
              <!-- Ajoutez d'autres liens ici -->
            </ul>
          </li>
          <li>
            Guild Wars 2
            <ul>
              <li><router-link to="/GuildWars">index</router-link></li>
              <!-- Ajoutez d'autres liens ici -->
            </ul>
          </li>
          <li><router-link to="/Portfolio">Portofolio</router-link></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    // Options du composant
  };
  </script>
  
  <style>
  /* Styles spécifiques au composant Header */
  </style>
  