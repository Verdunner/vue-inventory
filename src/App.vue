<template>
    <div class="app">
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
                        v-for="(slot, index) in slots"
                        :key="index"
                        class="inventory__item"
                        :class="{
                            'inventory__item--filled': !slot.empty,
                            'inventory__item--empty': slot.empty,
                        }"
                        draggable="true"
                        @dragstart="handleDragStart(slot, index)"
                        @dragover.prevent
                        @drop="handleDrop(index)"
                    >
                        {{ slot.item?.name }}
                    </div>
                </section>
            </div>

            <!-- Поп-ап уведомление -->
            <div class="inventory__popup">
                <p class="inventory__popup-message">
                    Вы добавили новый предмет!
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInventoryStore } from '@/store/inventory';
import { InventoryItem, Slot } from '@/types';

const store = useInventoryStore();
const MAX_SLOTS = 25;

const slots = computed<Slot[]>(() => generateSlots());

function generateSlots(): Slot[] {
    const allSlots: Slot[] = Array.from({ length: MAX_SLOTS }, () => ({
        empty: true,
        item: null,
    }));

    store.items.forEach((item) => {
        const adjustedPosition = item.position - 1;
        if (adjustedPosition >= 0 && adjustedPosition < MAX_SLOTS) {
            allSlots[adjustedPosition] = { empty: false, item };
        }
    });

    return allSlots;
}

const draggedItem = ref<InventoryItem | null>(null);
const draggedIndex = ref<number | null>(null);

function handleDragStart(slot: Slot, index: number) {
    if (slot.empty || !slot.item) return;
    draggedItem.value = slot.item;
    draggedIndex.value = index;
}

function handleDrop(index: number) {
    if (!draggedItem.value || draggedIndex.value === null) return;

    const targetSlot = slots.value[index];

    if (!targetSlot.empty && targetSlot.item) {
        store.swapPositions(draggedItem.value.id, targetSlot.item.id);
    } else {
        store.updatePosition(draggedItem.value.id, index + 1);
    }

    draggedItem.value = null;
    draggedIndex.value = null;
}
</script>

<style scoped lang="scss">
.app {
    width: 100vw;
    height: 100vh;
    background: #1d1d1d;
}
.inventory {
    box-sizing: border-box;
    width: 850px;
    height: 660px;
    margin: auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    background: #1d1d1d;
    border-radius: 12px;
    border: 1px solid red;

    &__main {
        display: flex;
        margin-bottom: 24px;
        outline: 1px solid greenyellow;
    }

    &__info {
        box-sizing: border-box;
        width: 235px;
        height: 500px;
        background: #4d4d4d;
        padding: 16px;
        margin-right: 24px;
        border-radius: 8px;
        border: 1px solid red;
    }

    &__title {
        font-size: 20px;
        font-weight: bold;
    }

    &__description {
        font-size: 14px;
    }

    &__items {
        width: 525px;
        height: 500px;
        display: flex;
        flex-wrap: wrap;
        background: #4d4d4d;
        border-radius: 8px;
        outline: 2px solid red;
    }

    &__item {
        box-sizing: border-box;
        width: 105px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: grab;

        &--empty {
            border-style: dashed;
        }
    }

    &__popup {
        width: 785px;
        height: 72px;
        background: rgba(0, 0, 0, 0.8);
        color: #4d4d4d;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid red;

        &-message {
            font-size: 16px;
        }
    }
}
</style>
