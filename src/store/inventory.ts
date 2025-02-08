import { defineStore } from 'pinia';

export interface InventoryItem {
    id: number;
    name: string;
    position: number;
}

const defaultItems: InventoryItem[] = [
    { id: 1, name: 'Меч', position: 1 },
    { id: 2, name: 'Щит', position: 2 },
    { id: 3, name: 'Зелье', position: 3 },
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
        addItem(item: { id: number; name: string; position: number }) {
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
        saveToLocalStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        },
    },
});
