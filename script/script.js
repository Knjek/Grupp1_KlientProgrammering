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

async function readFile() {
    const resp = await fetch("assets/isbn.txt")

    if (!resp.ok) {
        throw new Error("Something wrong when reading from file.. " + resp.status)
    }

    let text = await resp.text()

    return text
}

async function makeList() {
    let text = await readFile()
    let list = text.split("\n")
    return list
}

const app = {
    data() {
        return {
            book: "",
            bio: "",
            isbn: []
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
        },
        async getISBN() {
            this.isbn = await makeList()
        }
    },
    created() {
        this.getISBN()
    }
}
Vue.createApp(app).mount("#app")

