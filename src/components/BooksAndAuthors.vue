<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN, shuffle } from "../data/misc.js"
import BookTitle from "./BookTitle.vue"
import AuthorName from "./AuthorName.vue"
import PageLoader from "./PageLoader.vue"
import ErrorHandler from "./ErrorHandler.vue"

export default {
    name: "BookAndAuthor",
    data() {
        return {
            isbn: [],
            shuffledList: [],
            book: "",
            correctAuthor: "",
            count: 0,
            loading: true,
            show: true,
            error: false,
            errorMsg: "",
        }
    },
    components: {
        BookTitle,
        AuthorName,
        PageLoader,
        ErrorHandler,
    },
    methods: {
        async getISBNList() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
        },
        async setup() {
            /*Temporary list so we can manipulate (i.e. removing an isbn from the list after it's been
             added to the other list we want to display (with 4 authors & 4 books) This way we won't
             add any duplicates) */
            let allPromises = []
            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * this.isbn.length)
                allPromises.push(getBookAndAuthorByISBN([this.isbn[randomIndex]]))
                //This removes the isbn we just added  
                this.isbn.splice(randomIndex, 1)
            }
            let fourBooksAndAuthors = []
            try {
                fourBooksAndAuthors = await Promise.all(allPromises)
       
                // Check if the author or book already exist in the list
                while (this.containsDuplicate(fourBooksAndAuthors)) {
                    // Almost same code as above... refactor?
                    let randomIndex = Math.floor(Math.random() * this.isbn.length)
                    const newBookAuthor = await getBookAndAuthorByISBN([this.isbn[randomIndex]])
                    fourBooksAndAuthors.push(newBookAuthor)
                }
            } catch (Error) {
                this.errorMsg = Error.message
                this.loading = false
                this.show = false
                this.error = true
            }
            this.book = fourBooksAndAuthors[0][0]
            this.correctAuthor = fourBooksAndAuthors[0][1]
            this.shuffledList = shuffle(fourBooksAndAuthors)
        },
        async validate(evt) {
            this.show = false
            this.loading = true
            if (evt.target.value === this.correctAuthor) {
                this.count++
                await this.setup()
            } else {
                await this.setup()
            }
            this.loading = false
            this.show = true
        },
        containsDuplicate(fourBooksAndAuthors) {
            const uniqueElements = new Set();
            for (const BookAndAuthor of fourBooksAndAuthors) {
                console.log(BookAndAuthor[1])
                uniqueElements.add(BookAndAuthor[1])
            }
            console.log(fourBooksAndAuthors.length)
            console.log(uniqueElements.size)
            if (Number(uniqueElements.size) !== Number(fourBooksAndAuthors.length)) {
                for (const name of uniqueElements) {
                    let count = 0
                    for (let i = 0; i < fourBooksAndAuthors.length; i++) {
                        if (name === fourBooksAndAuthors[i][1]) {
                            console.log("replacing author")
                            count++
                            if (count > 1) {
                                fourBooksAndAuthors.splice(i, 1)
                            }
                        }
                    }

                }
                return true
            }
            return false
        },
    },
    async created() {
        await this.getISBNList()
        await this.setup()
        this.loading = false
    },
}

</script>

<template>
    <div>
        <div v-if="loading">
            <PageLoader />
        </div>
        <div v-if="show">
            <h1>guess!</h1>
            <BookTitle :title="book" />
            <br><br><br>
            <AuthorName v-for="sets in shuffledList" :key="sets.author" :name="sets[1]" :value="sets[1]"
                @click="validate" />
            <br>
            Your score is: {{ count }}
        </div>
        <div v-if="error">
            <ErrorHandler :msg="errorMsg" />
        </div>
    </div>
</template>
