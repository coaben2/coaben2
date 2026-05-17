<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="mb-6">
      <router-link to="/faq" class="btn btn-ghost btn-sm mb-4">
        <i class="fas fa-arrow-left mr-2"></i>
        Retour à la liste
      </router-link>
    </div>

    <div class="alert alert-info">
      <i class="fas fa-info-circle mr-3 text-lg"></i>
      <div>
        <h2 class="font-bold text-lg mb-3">Comment soumettre une question ?</h2>
        <p class="mb-4">
          Les questions FAQ sont gérées manuellement par l'administrateur. Pour soumettre une question, veuillez l'envoyer par email à :
        </p>
        <a href="mailto:coaben2@gmail.com?subject=Question%20FAQ" class="btn btn-primary gap-2 mb-4">
          <i class="fas fa-envelope"></i>
          coaben2@gmail.com
        </a>
        <p class="text-sm text-gray-500">
          Votre question sera examinée et une réponse sera publiée si elle est pertinente pour la communauté.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

