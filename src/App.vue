<template>
    <div class="app">
        <h1>{{ message }}</h1>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('Hello, Inventory App!');
</script>

<style scoped lang="scss">
.app {
    text-align: center;
    margin-top: 50px;
}
</style>
