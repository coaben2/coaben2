<template>
  <div>
    <h1>Importer un Fichier CSV</h1>
    <form @submit.prevent="uploadFile">
      <input type="file" @change="onFileChange" />
      <button type="submit">Importer</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'UploadView',
  setup() {
    const file = ref(null);

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const uploadFile = async () => {
      if (!file.value) return;

      const formData = new FormData();
      formData.append('file', file.value);

      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    };

    return { onFileChange, uploadFile };
  },
};
</script>

<style scoped>
/* Ajoutez ici vos styles spécifiques à la vue */
</style> 