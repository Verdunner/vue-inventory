<template>
    <div class="skeleton" :style="{ width, height, marginBottom }"></div>
</template>

<script setup lang="ts">
defineProps<{
    width: string;
    height: string;
    marginBottom?: string;
}>();
</script>

<style scoped>
.skeleton {
    margin: 0 auto;
    border-radius: 4px;
    background: linear-gradient(90deg, #333 25%, #3c3c3c 50%, #333 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>
