async function getBookByISBN() {
    const resp = await fetch("https://openlibrary.org/isbn/9780140328721.json")

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    return json.title
}

const app = {
    data() {
        return {
            book: ""
        }
    },
    methods: {
        async getBook() {
            book = await getBookByISBN()
            console.log(book)
        }
    }
}
Vue.createApp(app).mount("#app")
