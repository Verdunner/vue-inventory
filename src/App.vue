<template>
    <div class="inventory">
        <div class="inventory__main">
            <!-- Левая панель -->
            <aside class="inventory__info">
                <h2 class="inventory__title">Инвентарь</h2>
                <p class="inventory__description">
                    Здесь отображаются предметы, которые у вас есть.
                </p>
            </aside>

            <!-- Правая панель (сетка инвентаря) -->
            <section class="inventory__items">
                <div
                    v-for="item in store.items"
                    :key="item.id"
                    class="inventory__slot"
                >
                    {{ item.name }}
                </div>
            </section>
        </div>

        <!-- Поп-ап уведомление -->
        <div class="inventory__popup">
            <p class="inventory__popup-text">Вы добавили новый предмет!</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInventoryStore } from '@/store/inventory';
// import type { InventoryItem } from '@/store/inventory';

const store = useInventoryStore();
const message = ref('Hello, Inventory App!');
</script>

<style scoped lang="scss">
* {
    box-sizing: border-box;
}
.inventory {
    width: 850px;
    height: 660px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    padding: 32px;
    background: #f5f5f5;
    border-radius: 12px;
    border: 1px solid red;

    &__main {
        display: flex;
        margin-bottom: 24px;
        border: 1px solid greenyellow;
    }
}

/* Левая панель */
.inventory__info {
    width: 235px;
    height: 500px;
    background: #ddd;
    padding: 16px;
    margin-right: 24px;
    border-radius: 8px;
    border: 1px solid red;
}

.inventory__title {
    font-size: 20px;
    font-weight: bold;
}

.inventory__description {
    font-size: 14px;
    color: #555;
}

/* Сетка инвентаря */
.inventory__items {
    width: 525px;
    height: 500px;
    display: flex;
    background: #eee;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid red;
}

.inventory__slot {
    width: 105px;
    height: 100px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* Поп-ап уведомление */
.inventory__popup {
    width: 785px;
    height: 72px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid red;
}

.inventory__popup-text {
    font-size: 16px;
}
</style>
