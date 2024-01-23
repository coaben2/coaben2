<script setup>
import { ref } from 'vue';
import portfolio from '@/data/portfolio.json';

const gridSize = ref(4);
const currentModalPicture = ref(null);
const modalPicture = ref(null);

const handleOpenModal = (src) => {
  currentModalPicture.value = src;
  modalPicture.value.showModal();
};
</script>

<template>
  <div class="container mx-auto my-6">
    <h1 class="mb-4">Portfolio</h1>
    <div class="mb-4 hidden sm:block">
      <input type="range" min="3" max="6" v-model="gridSize" class="range range-sm" />
    </div>
    <div class="grid gap-4 grid-cols-1" :class="[`sm:grid-cols-${gridSize}`]">
      <div
        v-for="picture in portfolio"
        :key="picture.id"
        class="aspect-square w-full cursor-pointer"
        @click="handleOpenModal(picture.src)"
      >
        <img
          :src="`/img/${picture.src}`"
          :alt="picture.alt || `Image ${picture.id}`"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>

    <dialog class="modal" ref="modalPicture">
      <div class="modal-box p-0 overflow-hidden">
        <form method="dialog">
          <button for="picture" class="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
        </form>
        <img :src="`/img/${currentModalPicture}`" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
