async function getBookByISBN(isbn) {
    const resp = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    return json.title
}

async function getAuthorByOLID() {
    const resp = await fetch(`https://openlibrary.org/authors/OL23919A.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()
    
    return json.source_records
}

async function getBioByOLID() {
    const resp = await fetch(`https://openlibrary.org/authors/OL23919A.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()
    
    return json.bio
}

const app = {
    data() {
        return {
            book: "",
            bio: ""
        }
    },
    methods: {
        async getBook() {
            let source_records = await getAuthorByOLID()
            let split = source_records[1].split(":")     
            book = await getBookByISBN(split[1])        
            console.log(book)                           
        },

        async getBio() {
            this.bio = await getBioByOLID()
        } 
    }
}
Vue.createApp(app).mount("#app")
