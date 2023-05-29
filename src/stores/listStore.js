import { defineStore } from 'pinia'

export const useListStore = defineStore('list', {
    state: () => ({
        listOfBooksAndAuthors: []
    }),
    actions: {
        add(list) {
            this.listOfBooksAndAuthors.push(...list)
        },
        remove(index) {
            this.listOfBooksAndAuthors.splice(index, 1)
        }
    }
})