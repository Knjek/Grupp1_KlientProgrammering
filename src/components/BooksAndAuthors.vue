<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN, shuffle, getTrendingYearly } from "../data/misc.js"
import BookTitle from "./BookTitle.vue"
import AuthorName from "./AuthorName.vue"
import PageLoader from "./PageLoader.vue"
import ErrorHandler from "./ErrorHandler.vue"
import GuessHandler from "./GuessHandler.vue"


export default {
    name: "BookAndAuthor",
    props: {
        threeView: {
            type: Boolean,
            required: true,
            default: false
        },
        heading: {
            type: String,
            default: "Guess the author"
        }
    },
    data() {
        return {
            isbn: [],
            listOfBooksAndAuthors: [],
            shuffledList: [],
            book: "",
            correctAuthor: "",
            score: 0,
            maxGuesses: 10,
            guesses: 0,
            loading: true,
            show: false,
            error: false,
            errorMsg: "",
            tenGuesses: false,
            wrongGuesses: 0,
            msg: "",
            fetchLoad: false,
        }
    },
    components: {
        BookTitle,
        AuthorName,
        PageLoader,
        ErrorHandler,
        GuessHandler,
    },
    methods: {
        async getISBNList() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
        },

        async setup() {
            const allPromises = []
            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * this.isbn.length)
                allPromises.push(getBookAndAuthorByISBN(this.isbn[randomIndex]))
                //This removes the book and author from the list so it won't come again.  
                this.isbn.splice(randomIndex, 1)
            }
            await this.delay(1000)
            let fourBooksAndAuthors = []

            try {
                fourBooksAndAuthors = await Promise.all(allPromises)

                // Check if the author or book already exist in the list
                while (this.containsDuplicate(fourBooksAndAuthors)) {
                    // Almost same code as above... refactor?
                    let randomIndex = Math.floor(Math.random() * this.listOfBooksAndAuthors.length)
                    const newBookAuthor = this.listOfBooksAndAuthors[randomIndex]
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
            this.loading = false
            this.show = true
        },

        async run() {
            // wait a second before changing authors so the player can see the change of colors
            await this.delay(1000)

            const fourBooksAndAuthors = []
            console.log(this.listOfBooksAndAuthors.length)
            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * this.listOfBooksAndAuthors.length)
                fourBooksAndAuthors.push(this.listOfBooksAndAuthors[randomIndex])
                //This removes the book and author from the list so it won't come again.  
                this.listOfBooksAndAuthors.splice(randomIndex, 1)
            }

            while (this.containsDuplicate(fourBooksAndAuthors)) {
                // Almost same code as above... refactor?
                let randomIndex = Math.floor(Math.random() * this.listOfBooksAndAuthors.length)
                const newBookAuthor = this.listOfBooksAndAuthors[randomIndex]
                fourBooksAndAuthors.push(newBookAuthor)
            }
            this.book = fourBooksAndAuthors[0][0]
            this.correctAuthor = fourBooksAndAuthors[0][1]
            this.shuffledList = shuffle(fourBooksAndAuthors)
            this.loading = false
            this.show = true
        },

        async validate(evt) {
            this.loading = true

            // comparing the target button with correct answer
            if (evt.target.value === this.correctAuthor) {
                this.guesses++;
                this.score++
                this.msg = "Great!"
                evt.target.classList.add('btn-success')
            } else {
                this.guesses++;
                this.wrongGuesses++
                this.msg = "Noooo!"
                evt.target.classList.add('btn-danger')
            }

            // if the bigger fetch from the api is still not done, use the smaller local one (setup)
            if (this.fetchLoad) {
                await this.run()
            } else {
                await this.setup()
            }

            evt.target.classList.remove('btn-danger', 'btn-success')

            if (this.threeView) {
                if (this.wrongGuesses >= 3) {
                    this.tenGuesses = true
                    this.show = false
                    this.msg = "You got three strikes, you're out!"
                }
            }

            if (this.guesses === this.maxGuesses) {
                this.tenGuesses = true
                this.show = false
                this.msg = "You have used all your guesses."
            }
        },

        containsDuplicate(fourBooksAndAuthors) {
            const uniqueElements = new Set();
            for (const BookAndAuthor of fourBooksAndAuthors) {
                console.log(BookAndAuthor[1])
                uniqueElements.add(BookAndAuthor[1])
            }
            console.log(fourBooksAndAuthors.length + " authors in list")
            console.log(uniqueElements.size + " unique authors")
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
        },

        delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

    },
    async created() {
        const trendingYearlyList = getTrendingYearly(1)
        await this.getISBNList()
        await this.setup()
        this.loading = false
        this.listOfBooksAndAuthors = await trendingYearlyList
        this.fetchLoad = true
    },
}
</script>

<template>
    <div>
        <div v-if="show" class="container">
            <div class="row">
                <h1 align="center"> {{ heading }}</h1>
                <p align="center">You have a maximum of ten guesses.</p>
                <BookTitle align="center" :title="book" />
                <div>
                    <AuthorName v-for="sets in shuffledList" :key="sets.author_name" :name="sets[1]" :value="sets[1]"
                        class="my-2 col-12 col-md-6 col-lg-3 border" @click="validate" />
                </div>
                <div class="my-2">
                    <p align="center">
                        Your score is: {{ score }}
                    </p>
                    <p align="center" v-if="threeView">Wrong guesses: {{ wrongGuesses }}</p>
                </div>
            </div>
        </div>
        <div v-if="loading">
            <h2>{{ msg }}</h2>
            <PageLoader align="center"></PageLoader>
        </div>
        <div v-if="error">
            <ErrorHandler align="center" :msg="errorMsg" />
        </div>
        <div v-if="tenGuesses">
            <GuessHandler :msg="msg" :guesses="guesses" :score="score" />
        </div>
    </div>
</template>

<style>
.center-content {
    text-align: center;
}
</style>
