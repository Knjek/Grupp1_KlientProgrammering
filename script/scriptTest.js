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
        },

    }

}
Vue.createApp(app).mount("#app")


        //Från riktiga scriptet med mina kommentarer:
/*         
        async getBook() {
            let source_records = await getAuthorByOLID()
            let split = source_records[1].split(":")     //"amazon" och "4863895666" hamnar i split
            book = await getBookByISBN(split[1])        //"4863895666" skickas in i getBookby...
            console.log(book)                           //Skriver ut titel
        }, */

