<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const modalMenu = ref(null);

const links = [
    {
        to: 'Home',
        title: 'Accueil',
        children: [],
    },
    {
        to: false,
        title: 'Guild Wars 2',
        children: [
            {
                to: 'GuildWarsLexique',
                title: 'Lexique',
                children: [],
            },
            {
                to: 'GuildWarsApiCharacters',
                title: 'API',
                children: [],
            },
            {
                to: 'GuildWarsInventoryManager',
                title: 'Vide ton sac',
                children: [],
            },
        ],
    },
    {
        to: 'Blog',
        title: 'Blog',
        children: [],
    },
    {
        to: 'Portfolio',
        title: 'Portfolio',
        children: [],
    },
    {
        to: 'Contact',
        title: 'Contact',
        children: [],
    },
    {
        to: 'Login',
        title: 'Connexion',
        children: [],
    },
];

const openModalMenu = () => {
    modalMenu.value.showModal();
};
</script>

<template>
    <header class="bg-base-100">
        <nav class="p-4 hidden md:flex flex-start gap-4">
            <div v-for="(link, k) in links" :key="k">
                <RouterLink v-if="!link.children.length" :to="{ name: link.to }" class="btn">
                    {{ link.title }}
                </RouterLink>
                <div class="dropdown" v-else>
                    <div tabindex="0" role="button" class="btn btn-primary">{{ link.title }}</div>
                    <ul
                        class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-auto whitespace-nowrap min-w-52">
                        <li v-for="(child, i) in link.children" :key="i">
                            <RouterLink :to="{ name: child.to }">{{ child.title }}</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <button class="btn btn-ghost m-4 block md:hidden" @click="openModalMenu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd"
                    d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clip-rule="evenodd" />
            </svg>
        </button>

        <dialog ref="modalMenu" class="modal">
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <ul class="menu menu-lg mt-2">
                    <li v-for="(link, k) in links" :key="k">
                        <RouterLink v-if="!link.children.length" :to="{ name: link.to }" @click="modalMenu.close()">
                            {{ link.title }}
                        </RouterLink>
                        <h2 v-if="link.children.length" class="menu-title text-lg">{{ link.title }}</h2>
                        <ul v-if="link.children.length">
                            <li v-for="(child, i) in link.children" :key="i">
                                <RouterLink :to="{ name: child.to }" @click="modalMenu.close()">
                                    {{ child.title }}
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </header>
</template>

<style scoped>
header>nav>div>a:not(.router-link-active) {
    @apply btn-primary;
}

header>nav>div>a.router-link-active {
    @apply btn-secondary;
}
</style>