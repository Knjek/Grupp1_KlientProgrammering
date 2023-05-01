<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN, shuffle } from "../data/misc.js"
import Book from "./Book.vue"
import Author from "./Author.vue"

export default {
    name: "BookAndAuthor",
    data() {
        return {
            isbn: [],
            setOfFour: [],
            book: "",
            correctAuthor: "",
            count: 0
        }
    },
    components: {
        ReadFile,
        Book,
        Author,
    },
    methods: {
        async setup() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
            /*Temporary list so we can manipulate (i.e. removing an isbn from the list after it's been
             added to the other list we want to display (with 4 authors & 4 books) This way we won't
             add any duplicates) */
            let fourBooksAndAuthors = []

            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * this.isbn.length)
                let bookAndAuthor = await getBookAndAuthorByISBN([this.isbn[randomIndex]])
                fourBooksAndAuthors.push(bookAndAuthor)
                //This removes the isbn we just added  
                this.isbn.splice(randomIndex, 1)
            }
            this.book = fourBooksAndAuthors[0][0]
            this.correctAuthor = fourBooksAndAuthors[0][1]
            this.shuffledList = shuffle(fourBooksAndAuthors)
        },
        async validate(evt) {
            if (evt.target.value === this.correctAuthor) {
                this.count++
                await this.setup()
            }
        },
    },
    async created() {
        await this.setup()
    },
}
</script>

<template>
    <div>
        <h1>guess!</h1>
        <Book :title="book" />
        <br><br><br>
        <Author v-for="sets in shuffledList" :name="sets[1]" :value="sets[1]" @click="validate" />
        <br>
        Your score is: {{ count }}
    </div>
</template>
