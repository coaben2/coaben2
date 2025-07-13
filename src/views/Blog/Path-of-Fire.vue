<script setup>
import { html, attributes } from '@/data/posts/Path-of-exile.md';
</script>

<template>
    <div class="container max-w-2xl mx-auto bg-black bg-opacity-75 p-6 pb-2 md:rounded-lg md:my-6">
        <h1 class="mb-4">{{ attributes.title }}</h1>
        <div class="post" v-html="html"></div>
    </div>
</template>

<style scoped>
.post {
    @apply text-lg;
}

.post :deep(h2),
.post :deep(h3),
.post :deep(h4),
.post :deep(h5),
.post :deep(h6),
.post :deep(p) {
    @apply mb-4;
}

.post :deep(img) {
    @apply w-full rounded;
}

.post :deep(section) {
    @apply mb-12;
}
</style>