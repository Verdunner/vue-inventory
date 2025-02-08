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
                    <!-- Слоты с товарами -->
                    <div
                        v-for="(slot, index) in slots"
                        :key="index"
                        class="inventory__item"
                        :class="{
                            'inventory__item--filled': !slot.empty,
                            'inventory__item--empty': slot.empty,
                            'inventory__item--draggable':
                                !isModalOpen && !slot.empty,
                        }"
                        :draggable="!isModalOpen"
                        @dragstart="handleDragStart(slot, index)"
                        @dragover.prevent
                        @drop="handleDrop(index)"
                        @click="toggleOpenModal(slot.item)"
                    >
                        {{ slot.item?.name }}
                    </div>
                    <!-- Модальное окно -->
                    <Transition name="modal">
                        <div
                            v-if="isModalOpen"
                            class="inventory__modal"
                            @click.self="toggleOpenModal(null)"
                        >
                            <div class="inventory__modal-content">
                                <h3>{{ selectedItem?.name }}</h3>
                                <p>Описание товара</p>
                                <button
                                    class="inventory__modal-btn"
                                    @click="toggleOpenModal(null)"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </Transition>
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
const isModalOpen = ref(false);
const selectedItem = ref<InventoryItem | null>(null);

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
    if (slot.empty || !slot.item || isModalOpen.value) return;
    draggedItem.value = slot.item;
    draggedIndex.value = index;
}

function handleDrop(index: number) {
    if (!draggedItem.value || draggedIndex.value === null || isModalOpen.value)
        return;

    const targetSlot = slots.value[index];

    if (!targetSlot.empty && targetSlot.item) {
        store.swapPositions(draggedItem.value.id, targetSlot.item.id);
    } else {
        store.updatePosition(draggedItem.value.id, index + 1);
    }

    draggedItem.value = null;
    draggedIndex.value = null;
}

function toggleOpenModal(item: InventoryItem | null) {
    if (!isModalOpen.value) {
        if (!item) return;
        selectedItem.value = item;
        isModalOpen.value = true;
    } else {
        selectedItem.value = null;
        isModalOpen.value = false;
    }
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
        background: #262626;
        padding: 16px;
        margin-right: 24px;
        border-radius: 12px;
        border: 1px solid #4d4d4d;
    }

    &__title {
        font-size: 20px;
        font-weight: bold;
    }

    &__description {
        font-size: 14px;
    }

    &__items {
        position: relative;
        overflow: hidden;
        width: 525px;
        height: 500px;
        display: flex;
        flex-wrap: wrap;
        background: #262626;
        border-radius: 12px;
        outline: 2px solid red;
    }

    &__item {
        box-sizing: border-box;
        width: 105px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #4d4d4d;
        user-select: none;

        &--draggable {
            cursor: grab;

            &:hover {
                background-color: #2f2f2f;
            }
        }
    }

    &__modal {
        box-sizing: border-box;
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        width: 250px;
        height: 500px;
        background-color: #333;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        padding: 16px;
        color: white;

        &-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        &-btn {
            background-color: #444;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 16px;
        }
    }

    &__popup {
        width: 785px;
        height: 72px;
        background: #262626;
        color: #4d4d4d;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid #4d4d4d;

        &-message {
            font-size: 16px;
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
    transform: translateX(0);
    opacity: 1;
}
</style>
