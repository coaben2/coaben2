<script setup>
import { markdownContent, attributes } from '@/data/posts/divinity-s-reach.md';
</script>

<template>
    <div class="container max-w-2xl mx-auto bg-black bg-opacity-75 p-6 pb-2 md:rounded-lg md:my-6">
        <h1 class="mb-4">{{ attributes.title }}</h1>
        <div class="post" v-html="markdownContent"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            markdownContent: ``,
        };
    },
};
</script>

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