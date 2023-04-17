import ReadFile from './ReadFile.js'

async function getBookByISBN(isbn) {
    const resp = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()

    let bookAndAuthor = []

    bookAndAuthor.push(json.title)

    // needs to do check if author olid doesn't work
    // this is a workaround
    let worksOLID = json.works[0].key
    let authorOLID =  await getWorkbyOLID(worksOLID) //json.authors[0].author.key
    
    let authorName = await getAuthorByOLID(authorOLID)
    bookAndAuthor.push(authorName)

    return bookAndAuthor
}

async function getWorkbyOLID(worksOLID) {
    const resp = await fetch(`https://openlibrary.org${worksOLID}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()
    
    return json.authors[0].author.key
}

async function getAuthorByOLID(authorOLID) {
    const resp = await fetch(`https://openlibrary.org${authorOLID}.json`)

    if (!resp.ok) {
        throw new Error("Something went wrong when fetching data.")
    }

    const json = await resp.json()
    
    return json.personal_name
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
            bio: "",
            isbn: []
        }
    },
    methods: {
        async setup() {
            for (let i = 0; i < 4; i++) {
                let booksAndAuthors = []
                booksAndAuthors.push(await getBookByISBN(this.isbn[i]))
                console.log(booksAndAuthors)
            }
        },
        async getBook(isbn) {   
            book = await getBookByISBN(isbn)        
            console.log(book)                           
        },
        async getBio() {
            this.bio = await getBioByOLID()
        },
        async getISBN() {
            this.isbn = await ReadFile.makeList()
        }
    },
    // components: {
    // },
    // template: `<div>
    // </div>`,
    async created() {
        await this.getISBN()
        await this.setup()
    },
    mounted() {
    }
}

Vue.createApp(app).mount("#app")

