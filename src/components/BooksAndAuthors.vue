<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN, shuffle, getTrendingYearly } from "../data/misc.js"
import BookTitle from "./BookTitle.vue"
import AuthorName from "./AuthorName.vue"
import PageLoader from "./PageLoader.vue"
import ErrorHandler from "./ErrorHandler.vue"
import GuessHandler from "./GuessHandler.vue"

import { mapStores } from 'pinia'
import { useListStore } from "@/stores/listStore"


export default {
    /**
     * Component for showing one book title and 4 different author names.
     */
    name: "BookAndAuthor",
    props: {
        threeView: {
            type: Boolean,
            required: true,
            default: false
        },
        timerView: {
            type: Boolean,
            required: true,
            default: false
        },
        heading: {
            type: String,
            default: "Guess the author"
        },
        timerCount: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isbn: [],
            shuffledList: [],
            book: "",
            correctAuthor: "",
            score: 0,
            maxGuesses: 100,
            guesses: 0,
            loading: true,
            show: false,
            error: false,
            errorMsg: "",
            tenGuesses: false,
            wrongGuesses: 0,
            msg: "",
            isFetchLoaded: false,
            pageNumber: 0,
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

        /**
         * Uses a text file of 100 isbn and fetching each one, instead of fetching a bulk from the api.
         * Should be used while waiting for bulk fetch to complete.
         * Implements a delay of 1 second for the player to be able to see their last result.
         */
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
                    let randomIndex = Math.floor(Math.random() * this.isbn.length)
                    const newBookAuthor = await getBookAndAuthorByISBN(this.isbn[randomIndex])
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

        /**
         * Runs when there is data in listStore. 
         * Much faster than setup.
         * Implements a delay of 1 second for the player to be able to see their last result.
         */
        async run() {
            // this should only run once when under 100
            if (this.listStore.listOfBooksAndAuthors.length < 50 && this.pageNumber >= 10) {
                this.pageNumber = 0
                this.fetchListOfBooksAndAuthors()
            }
            // wait a second before changing authors so the player can see the change of colors
            await this.delay(1000)

            const fourBooksAndAuthors = []
            for (let i = 0; i < 4; i++) {
                let randomIndex = Math.floor(Math.random() * this.listStore.listOfBooksAndAuthors.length)
                fourBooksAndAuthors.push(this.listStore.listOfBooksAndAuthors[randomIndex])
                //This removes the book and author from the list so it won't come again.  
                this.listStore.remove(randomIndex)
            }

            while (this.containsDuplicate(fourBooksAndAuthors)) {
                // Almost same code as above... refactor?
                let randomIndex = Math.floor(Math.random() * this.listStore.listOfBooksAndAuthors.length)
                const newBookAuthor = this.listStore.listOfBooksAndAuthors[randomIndex]
                fourBooksAndAuthors.push(newBookAuthor)
            }
            this.persist()
            this.book = fourBooksAndAuthors[0][0]
            this.correctAuthor = fourBooksAndAuthors[0][1]
            this.shuffledList = shuffle(fourBooksAndAuthors)
            this.loading = false
            this.show = true
        },

        /**
         * Gets called when user presses button.
         * Checks if the pressed button is the correct one and changes it's color.
         * Starts next load.
         * @param {Event} evt 
         */
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
            if (this.listStore.listOfBooksAndAuthors.length > 20) {
                await this.run()
            } else {
                await this.setup()
            }

            evt.target.classList.remove('btn-danger', 'btn-success')

            // props for a different ruleset
            if (this.threeView) {
                if (this.wrongGuesses >= 3) {
                    this.hundredGuesses = true
                    this.show = false
                    this.msg = "You got three strikes, you're out!"
                }
            }

            if (this.guesses === this.maxGuesses) {
                this.hundredGuesses = true
                this.show = false
                this.msg = "You have used all your guesses."
            }
        },

        /**
         * Checks for duplicates and removes them from the list.
         * @param {Array} fourBooksAndAuthors list of lists, four lists of book titles and author names.
         */
        containsDuplicate(fourBooksAndAuthors) {
            const uniqueElements = new Set();
            for (const BookAndAuthor of fourBooksAndAuthors) {
                uniqueElements.add(BookAndAuthor[1])
            }
            if (Number(uniqueElements.size) !== Number(fourBooksAndAuthors.length)) {
                for (const name of uniqueElements) {
                    let count = 0
                    for (let i = 0; i < fourBooksAndAuthors.length; i++) {
                        if (name === fourBooksAndAuthors[i][1]) {
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

        /**
         * Waits for the set amount of time.
         * @param {number} time in milliseconds.
         */
        delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

        /**
         *  Will load books and authors in the background. when the first 100 is loaded
         *  program switches to use run() instead of setup()
         */
        async fetchListOfBooksAndAuthors() {
            while (this.pageNumber < 10) {
                this.pageNumber++
                const trendingYearlyList = await getTrendingYearly(this.pageNumber)
                this.listStore.add(trendingYearlyList)

                if (!this.isFetchLoaded) {
                    this.isFetchLoaded = true
                }
            }
        },

        persist() {
            localStorage.listOfBooksAndAuthors = JSON.stringify(this.listStore.listOfBooksAndAuthors)
        },

    },
    async created() {
        if (localStorage.listOfBooksAndAuthors) {
            this.listStore.listOfBooksAndAuthors = JSON.parse(localStorage.listOfBooksAndAuthors)
            await this.getISBNList()
        }
        let load
        if (this.listStore.listOfBooksAndAuthors.length < 50) {
            load = this.fetchListOfBooksAndAuthors()
            await this.getISBNList()
            await this.setup()
        } else {
            await this.run()
        }
        this.loading = false
        await load
    },
    beforeUnmount() {
        // an way to stop fetchListOfBooksAndAuthors() from running
        this.pageNumber = 10
    },
    computed: {
        ...mapStores(useListStore)
    }
}
</script>

<template>
    <div class="quiz" id="home">
        <div v-if="show" class="container">
            <div class="row">
                <h3 class="center-content"> {{ heading }}</h3>
                <p class="center-content">You have a maximum of {{ maxGuesses }} guesses.</p>
                <p class="center-content" v-if="timerView"> <strong>Guess before your time runs out!</strong></p>
                <p class="center-content" v-if="threeView"><strong>3 wrong guesses and you're out!</strong></p>
                <BookTitle class="center-content" :title="book" />
                <div class="center-content guess-buttons">
                        <AuthorName v-for="sets in shuffledList" :key="sets[0] + sets[1]" :name="sets[1]" :value="sets[1]"
                        :disabled="loading" class="my-2 col-12 col-md-6 col-lg-3 border" @click.once="validate"/>
                </div>
                <div class="my-2">
                    <p class="center-content">
                        Your score is: {{ score }}
                    </p>
                    <div class="center-content" v-if="threeView">
                        <p>Wrong guesses: {{ wrongGuesses }}</p>
                    </div>
                    <div class="center-content" v-if="timerView">
                        <p id="counter">{{ timerCount }} seconds left </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="center-content loader" v-if="loading">
            <h2>{{ msg }}</h2>
            <PageLoader></PageLoader>
        </div>
        <div class="center-content error m-2" v-if="error">
            <ErrorHandler  :msg="errorMsg" />
        </div>
        <div v-if="hundredGuesses">
            <GuessHandler class="center-content" :msg="msg" :guesses="guesses" :score="score" />
        </div>
    </div>
</template>

