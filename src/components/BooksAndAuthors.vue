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

        async setup() {
            console.log("using setup")
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

        async run() {
            console.log("using run")

            // this should only run once when under 100
            if (this.listStore.listOfBooksAndAuthors.length < 50 && this.pageNumber >= 10) {
                console.log("fetching more books and authors")
                this.pageNumber = 0
                this.fetchListOfBooksAndAuthors()
            }
            // wait a second before changing authors so the player can see the change of colors
            await this.delay(1000)

            const fourBooksAndAuthors = []
            console.log("Number of books and authors stored: " + this.listStore.listOfBooksAndAuthors.length)
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
                // console.log(BookAndAuthor[0] + " by " + BookAndAuthor[1])
                uniqueElements.add(BookAndAuthor[1])
            }
            // printing out list-sizes
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
            return false
        },

        delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

        // will load books and authors in the background. when the first 100 is loaded
        // program switches to use run() instead of setup()
        async fetchListOfBooksAndAuthors() {
            while (this.pageNumber < 10) {
                this.pageNumber++
                const trendingYearlyList = await getTrendingYearly(this.pageNumber)
                this.listStore.add(trendingYearlyList)

                if(!this.isFetchLoaded) {
                    this.isFetchLoaded = true
                    console.log("isFetchLoaded: " + this.isFetchLoaded)
                }
                console.log("Loaded page no. " + this.pageNumber)
            }
        },

        persist() {
            localStorage.listOfBooksAndAuthors = JSON.stringify(this.listStore.listOfBooksAndAuthors)
            console.log('persisted to local storage')
        },

    },
    async created() {
        console.log("created called")
        if (localStorage.listOfBooksAndAuthors) {
            this.listStore.listOfBooksAndAuthors = JSON.parse(localStorage.listOfBooksAndAuthors)
            console.log('pushing from local storage')
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
    mounted() {
        console.log("mounted called")
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
                <h1 class="center-content"> {{ heading }}</h1>
                <p class="center-content">You have a maximum of ten guesses.</p>
                <BookTitle class="center-content" :title="book" />
                <div class="center-content">
                        <AuthorName v-for="sets in shuffledList" :key="sets[0] + sets[1]" :name="sets[1]" :value="sets[1]"
                        :disabled="loading" class="my-2 col-12 col-md-6 col-lg-3 border" @click.once="validate"/>
                </div>
                <div class="my-2">
                    <p class="center-content">
                        Your score is: {{ score }}
                    </p>
                    <p class="center-content" v-if="threeView">Wrong guesses: {{ wrongGuesses }}</p>
                </div>
            </div>
        </div>
        <div class="center-content" v-if="loading">
            <h2>{{ msg }}</h2>
            <PageLoader></PageLoader>
        </div>
        <div class="center-content m-2" v-if="error">
            <ErrorHandler  :msg="errorMsg" />
        </div>
        <div v-if="tenGuesses">
            <GuessHandler class="center-content" :msg="msg" :guesses="guesses" :score="score" />
        </div>
    </div>
</template>

