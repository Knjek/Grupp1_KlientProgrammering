<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN, shuffle } from "../data/misc.js"
import BookTitle from "./BookTitle.vue"
import AuthorName from "./AuthorName.vue"

export default {
    name: "BookAndAuthor",
    data() {
        return {
            isbn: [],
            shuffledList: [],
            book: "",
            correctAuthor: "",
            count: 0
        }
    },
    components: {
        BookTitle,
        AuthorName,
    },
    methods: {
        async setup() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
            /*Temporary list so we can manipulate (i.e. removing an isbn from the list after it's been
             added to the other list we want to display (with 4 authors & 4 books) This way we won't
             add any duplicates) */
            let fourBooksAndAuthors = []
            let allPromises = []
            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * this.isbn.length)
                allPromises.push(getBookAndAuthorByISBN([this.isbn[randomIndex]]))
                //This removes the isbn we just added  
                this.isbn.splice(randomIndex, 1)
            }
            console.log(allPromises)
            fourBooksAndAuthors = await Promise.all(allPromises)
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
        <BookTitle :title="book" />
        <br><br><br>
        <AuthorName v-for="sets in shuffledList" :key="sets.author" :name="sets[1]" :value="sets[1]" @click="validate" />
        <br>
        Your score is: {{ count }}
    </div>
</template>