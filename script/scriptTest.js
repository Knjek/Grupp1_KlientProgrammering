async function getBooksByAuthor() {

const resp = await fetch("https://openlibrary.org/search/authors.json?q=j%20k%20rowling")
    const json = await resp.json()
    return json.docs[0].key
}

const app = {
    data() {
        return {
            book: ""
        }
    },

    methods: {
        async getBook() {
            book = await getBooksByAuthor()
            console.log(book)
        }
    }

}
Vue.createApp(app).mount("#app")