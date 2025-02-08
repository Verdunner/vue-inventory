<template>
    <div class="app">
        <div class="inventory">
            <div class="inventory__main">
                <!-- Левая панель -->
                <aside class="inventory__info">
                    <div class="inventory__info-upper">
                        <img
                            class="inventory__info-image"
                            src="/no-image.png"
                            alt="no image"
                        />
                        <h2 class="inventory__info-title">
                            <Skeleton
                                v-if="isLoading"
                                width="100%"
                                height="100%"
                            />
                            <template v-else>Название списка</template>
                        </h2>
                        <p class="inventory__info-descr">
                            <Skeleton
                                v-if="isLoading"
                                width="155px"
                                height="10px"
                                margin-bottom="16px"
                            />
                            <Skeleton
                                v-if="isLoading"
                                width="190px"
                                height="10px"
                                margin-bottom="16px"
                            />
                            <Skeleton
                                v-if="isLoading"
                                width="170px"
                                height="10px"
                                margin-bottom="16px"
                            />
                            <Skeleton
                                v-if="isLoading"
                                width="160px"
                                height="10px"
                                margin-bottom="16px"
                            />
                            <Skeleton
                                v-if="isLoading"
                                width="140px"
                                height="10px"
                            />
                            <template v-else>Описание списка</template>
                        </p>
                    </div>
                    <span class="inventory__info-meta">
                        <Skeleton v-if="isLoading" width="80px" height="10px" />
                        <template v-else>Дата создания</template>
                        <!-- <template>Дата создания</template> -->
                    </span>
                </aside>

                <!-- Правая панель (сетка инвентаря) -->
                <section class="inventory__items">
                    <!-- Слоты с товарами -->
                    <div
                        v-for="(slot, index) in slots"
                        :key="index"
                        class="inventory__items-item"
                        :class="{
                            'inventory__items-item--filled': !slot.empty,
                            'inventory__items-item--empty': slot.empty,
                            'inventory__items-item--draggable':
                                !isModalOpen && !slot.empty,
                            'inventory__items-item--dragged':
                                draggedIndex === index,
                        }"
                        :draggable="!isModalOpen"
                        @dragstart="handleDragStart(slot, index, $event)"
                        @dragover.prevent
                        @drop="handleDrop(index)"
                        @click="toggleOpenModal(slot.item)"
                    >
                        <img
                            v-show="!slot.empty"
                            class="inventory__items-item-image"
                            :src="`/${slot.item?.img}.png`"
                            alt="no image"
                        />
                        <div
                            class="inventory__items-item-count"
                            v-show="!slot.empty"
                        >
                            {{ slot.item?.count }}
                        </div>
                    </div>
                    <!-- Модальное окно -->
                    <Transition name="modal">
                        <div v-if="isModalOpen" class="inventory__modal">
                            <div class="inventory__modal-main">
                                <button
                                    @click="toggleOpenModal(null)"
                                    class="inventory__modal-close"
                                >
                                    <img src="/close.svg" alt="Закрыть" />
                                </button>

                                <div class="inventory__modal-image-wrapper">
                                    <img
                                        class="inventory__modal-image-pic"
                                        :src="
                                            selectedItem
                                                ? `/${selectedItem.img}.png`
                                                : '/no-image.png'
                                        "
                                        alt="no image"
                                    />
                                </div>

                                <div class="inventory__modal-text">
                                    <h3 class="inventory__modal-title">
                                        <Skeleton
                                            v-if="isLoading"
                                            width="100%"
                                            height="100%"
                                        />
                                        <template v-else>
                                            Название товара
                                        </template>
                                    </h3>
                                    <p class="inventory__modal-descr">
                                        <Skeleton
                                            v-if="isLoading"
                                            width="211px"
                                            height="10px"
                                            margin-bottom="16px"
                                        />
                                        <Skeleton
                                            v-if="isLoading"
                                            width="211px"
                                            height="10px"
                                            margin-bottom="16px"
                                        />
                                        <Skeleton
                                            v-if="isLoading"
                                            width="211px"
                                            height="10px"
                                            margin-bottom="16px"
                                        />
                                        <Skeleton
                                            v-if="isLoading"
                                            width="180px"
                                            height="10px"
                                            margin-bottom="16px"
                                        />
                                        <Skeleton
                                            v-if="isLoading"
                                            width="80px"
                                            height="10px"
                                        />
                                        <template v-else
                                            >Описание товара</template
                                        >
                                    </p>
                                </div>
                            </div>
                            <div class="inventory__modal-bottom">
                                <button
                                    v-if="!isModalDeleteMode"
                                    @click="isModalDeleteMode = true"
                                    class="inventory__modal-delete-btn"
                                >
                                    Удалить предмет
                                </button>
                                <div
                                    v-else
                                    class="inventory__modal-delete-menu"
                                >
                                    <input
                                        v-model="itemsToDelete"
                                        type="number"
                                        class="inventory__modal-input"
                                        placeholder="Введите количество"
                                    />
                                    <div class="inventory__modal-btns">
                                        <button
                                            @click="isModalDeleteMode = false"
                                            class="inventory__modal-btns-btn inventory__modal-btns-btn--cancel"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            @click="deleteItems(itemsToDelete)"
                                            class="inventory__modal-btns-btn"
                                        >
                                            Подтвердить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </section>
            </div>

            <!-- Поп-ап уведомление -->
            <div class="inventory__popup" v-if="isPopupVisible">
                <p class="inventory__popup-message">
                    <Skeleton v-if="isLoading" width="700px" height="36px" />
                    <template v-else>Вы добавили новый предмет!</template>
                    <!-- Вы добавили новый предмет! -->
                </p>
                <button class="inventory__popup-close">
                    <img src="/close.svg" alt="Закрыть" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useInventoryStore } from '@/store/inventory';
import { InventoryItem, Slot } from '@/types';
import Skeleton from '@/components/Skeleton.vue';

const store = useInventoryStore();
const MAX_SLOTS = 25;

const slots = computed<Slot[]>(() => generateSlots());
const isModalOpen = ref(false);
const isLoading = ref(true);
const isPopupVisible = ref(true);
const isModalDeleteMode = ref(false);
const itemsToDelete = ref(0);
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

function handleDragStart(slot: Slot, index: number, event: DragEvent) {
    if (slot.empty || !slot.item || isModalOpen.value) return;
    draggedItem.value = slot.item;
    draggedIndex.value = index;

    const element = event.target as HTMLElement;
    element.classList.add('.inventory__items-item--dragged');
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

    document.querySelectorAll('.inventory__items-item').forEach((el) => {
        el.classList.remove('.inventory__items-item--dragged');
    });
}

function toggleOpenModal(item: InventoryItem | null) {
    if (!isModalOpen.value) {
        if (!item) return;
        selectedItem.value = item;
        isModalOpen.value = true;
    } else {
        selectedItem.value = null;
        isModalOpen.value = false;
        isModalDeleteMode.value = false;
    }
}

function deleteItems(quantity: number) {
    if (!selectedItem.value || quantity < 1) return;

    const itemIndex = store.items.findIndex(
        (item) => item.id === selectedItem.value?.id
    );
    if (itemIndex === -1) return;

    const item = store.items[itemIndex];

    if (quantity >= item.count) {
        store.items.splice(itemIndex, 1);
    } else {
        item.count -= quantity;
    }

    toggleOpenModal(null);
}

watch(isModalDeleteMode, (newValue) => {
    if (!newValue) itemsToDelete.value = 0;
});
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

    &__main {
        display: flex;
        margin-bottom: 24px;
    }

    &__info {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 235px;
        height: 500px;
        background: #262626;
        padding: 16px;
        margin-right: 24px;
        border-radius: 12px;
        border: 1px solid #4d4d4d;

        &-upper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &-image {
            width: 208px;
            height: 240px;
            border-radius: 8px;
        }
        &-title {
            width: 190px;
            height: 26px;
            margin-bottom: 25px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
        &-descr {
            width: 190px;
            height: auto;
            max-height: 115px;
            margin: 0;
            margin-bottom: 25px;
            font-size: 14px;
        }

        &-meta {
            font-size: 12px;
        }
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
        border: 1px solid #4d4d4d;

        &-item {
            box-sizing: border-box;
            position: relative;
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
                &:active {
                    background-color: #2f2f2f;
                }
            }
            &--dragged {
                opacity: 0;
            }

            &-image {
                width: 54px;
                height: 54px;
                margin: 0 auto;
                border-radius: 0%;
            }

            &-count {
                box-sizing: border-box;
                position: absolute;
                right: 0;
                bottom: 0;
                width: 16px;
                height: 16px;
                font-size: 10px;
                color: #4d4d4d;
                padding: 3px 0 0 6px;
                outline: 1px solid #4d4d4d;
                border-top-left-radius: 12px;
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
        background: rgba(#262626, 0.8);
        backdrop-filter: blur(0.5px);
        border: 2px solid #4d4d4d;
        border-top-left-radius: 12px;
        border-bottom-right-radius: 12px;

        &-main {
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            padding: 15px;
        }

        &-close {
            all: unset;
            position: absolute;
            top: 14px;
            right: 14px;

            &:hover {
                cursor: pointer;
            }
        }

        &-image {
            &-wrapper {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                width: 220px;
                height: 190px;
                margin-bottom: 16px;
                border-bottom: 1px solid #4d4d4d;
            }
            &-pic {
                width: 130px;
                max-height: 130px;
            }
        }
        &-text {
            box-sizing: border-box;
            padding-bottom: 24px;
            border-bottom: 1px solid #4d4d4d;
        }
        &-title {
            width: 210px;
            height: 30px;
            margin: 0;
            margin-bottom: 24px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
        &-descr {
            width: 210px;
            height: auto;
            max-height: 115px;
            margin: 0;
            font-size: 14px;
        }

        &-bottom {
            box-sizing: border-box;
            position: absolute;
            z-index: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            width: 248px;
            padding-top: 25px;
            background: #262626;
            border-right: 1px solid #4d4d4d;
            border-bottom-right-radius: 12px;
        }
        &-delete-btn {
            all: unset;
            width: 220px;
            height: 40px;
            margin: 0 auto 18px;
            text-align: center;
            background-color: #ce6d6d;
            color: #fff;
            font-size: 14px;
            border-radius: 8px;

            &:hover {
                cursor: pointer;
            }
        }

        &-delete-menu {
            box-sizing: border-box;
            width: 252px;
            height: 133px;
            padding: 20px 21px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-top: 1px solid #4d4d4d;
        }

        &-input {
            all: unset;
            box-sizing: border-box;
            width: 210px;
            height: 40px;
            margin-bottom: 20px;
            padding: 0 12px;
            font-size: 14px;
            border: 1px solid #4d4d4d;
            border-radius: 8px;
            transition: border 0.5s ease;

            &:focus {
                border: 1px solid #fff;
            }
        }
        &-btns {
            width: 210px;
            height: 33px;
            &-btn {
                all: unset;
                width: 112px;
                height: 100%;
                margin: 0;
                text-align: center;
                background-color: #ce6d6d;
                color: #fff;
                font-size: 14px;
                border-radius: 5px;
                box-shadow: 0 0 20px rgba(206, 109, 109, 1);
                transition: color 0.5s ease, background-color 0.5s ease;

                &:hover {
                    cursor: pointer;
                    background-color: #4d4d4d;
                }

                &--cancel {
                    width: 88px;
                    margin-right: 10px;
                    background-color: #fff;
                    color: #000;

                    &:hover {
                        cursor: pointer;
                        color: #fff;
                    }
                }
            }
        }
    }

    &__popup {
        box-sizing: border-box;
        position: relative;
        width: 785px;
        height: 72px;
        padding: 18px;
        padding-right: 68px;
        background: #262626;
        color: #4d4d4d;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        border: 1px solid #4d4d4d;

        &-message {
            width: 100%;
            text-align: center;
            font-size: 16px;
        }

        &-close {
            all: unset;
            position: absolute;
            top: 14px;
            right: 14px;

            &:hover {
                cursor: pointer;
            }
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
