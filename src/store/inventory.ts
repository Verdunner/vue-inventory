import { defineStore } from 'pinia';

import { InventoryItem } from '@/types';

const defaultItems: InventoryItem[] = [
    { id: 1, img: 'item1', count: 6, position: 1 },
    { id: 2, img: 'item2', count: 3, position: 2 },
    { id: 3, img: 'item3', count: 8, position: 3 },
];

const STORAGE_KEY = 'inventory';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items:
            (JSON.parse(
                localStorage.getItem(STORAGE_KEY) || 'null'
            ) as InventoryItem[]) || defaultItems,
    }),
    actions: {
        addItem(item: InventoryItem) {
            this.items.push(item);
            this.saveToLocalStorage();
        },
        removeItem(id: number) {
            this.items = this.items.filter((item) => item.id !== id);
            this.saveToLocalStorage();
        },
        updatePosition(id: number, position: number) {
            const item = this.items.find((item) => item.id === id);
            if (item) {
                item.position = position;
                this.saveToLocalStorage();
            }
        },
        swapPositions(id1: number, id2: number) {
            const item1 = this.items.find((item) => item.id === id1);
            const item2 = this.items.find((item) => item.id === id2);

            if (item1 && item2) {
                [item1.position, item2.position] = [
                    item2.position,
                    item1.position,
                ];
            }
        },
        saveToLocalStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        },
    },
});
