<script setup>
import InstagramIcon from '@/components/icons/InstagramIcon.vue';
import TwitchIcon from '@/components/icons/TwitchIcon.vue';
import YoutubeIcon from '@/components/icons/YoutubeIcon.vue';
import GitHubIcon from '@/components/icons/GitHubIcon.vue';
</script>

<template>
    <footer class="p-4 bg-base-100 flex gap-4 justify-between items-center">
        <div class="text-sm">&copy; Coaben</div>
        <ul class="social">
            <li>
                <a href="https://github.com/coaben2" target="_blank" rel="nofollow">
                    <GitHubIcon />
                </a>
            </li>
            <li>
                <a href="https://www.youtube.com/@coaben" target="_blank" rel="nofollow">
                    <YoutubeIcon />
                </a>
            </li>
            <li>
                <a href="https://www.instagram.com/coaben2" target="_blank" rel="nofollow">
                    <InstagramIcon />
                </a>
            </li>
            <li>
                <a href="https://www.twitch.tv/coaben" target="_blank" rel="nofollow">
                    <TwitchIcon />
                </a>
            </li>
        </ul>
    </footer>
</template>

<style scoped>
.social {
    @apply flex gap-2;
}

.social li a {
    @apply btn btn-circle;
}

.social li a svg {
    @apply w-5 h-5;
}
</style>