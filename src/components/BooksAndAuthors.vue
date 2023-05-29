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
        },
        
    },
    data() {
        return {
            isbn: [],
            listOfBooksAndAuthors: [],
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

            //seems like there are no more than 8 pages
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
                    let randomIndex = Math.floor(Math.random() * this.listOfBooksAndAuthors.length)
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
            if (this.listOfBooksAndAuthors.length < 50 && this.pageNumber >= 10) {
                console.log("fetching more books and authors")
                this.pageNumber = 0
                this.fetchListOfBooksAndAuthors()
            }
            // wait a second before changing authors so the player can see the change of colors
            await this.delay(1000)

            const fourBooksAndAuthors = []
            console.log("Number of books and authors stored: " + this.listOfBooksAndAuthors.length)
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
            if (this.listOfBooksAndAuthors.length > 50) {     
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
                this.listOfBooksAndAuthors.push(...trendingYearlyList)

                if(!this.isFetchLoaded) {
                    this.isFetchLoaded = true
                    console.log("isFetchLoaded: " + this.isFetchLoaded)
                }
                console.log("Loaded page no. " + this.pageNumber)
            }
        },

        persist() {
            localStorage.listOfBooksAndAuthors = JSON.stringify(this.listOfBooksAndAuthors)
            console.log('persisted to local storage')
        },

    },
    async created() {
        console.log("created called")
        if (localStorage.listOfBooksAndAuthors) {
            this.listOfBooksAndAuthors = JSON.parse(localStorage.listOfBooksAndAuthors)
            console.log('pushing from local storage')
        }
        let load
        if (this.listOfBooksAndAuthors.length === 0) {
            load = this.fetchListOfBooksAndAuthors()
            await this.getISBNList()
            await this.setup()
        } else {
            await this.run()
        }
        this.loading = false
        await load
    },
    mounted() {
        console.log("mounted called")
    },
}
</script>

<template>
    <div class="quiz">
        <div v-if="show" class="container">
            <div class="row">
                <h1 class="center-content"> {{ heading }}</h1>
                <p class="center-content">You have a maximum of ten guesses.</p>
                <BookTitle class="center-content" :title="book" />
                <div class="center-content">
                    <div class="btn-group big">
                        <!-- should be button group or radio button to not be able to click all buttons 
                        class="my-2 col-12 col-md-6 col-lg-3 border" -->
                        <AuthorName v-for="sets in shuffledList" :key="sets[0] + sets[1]" :name="sets[1]" :value="sets[1]"
                         class="m-2" @click.once="validate" />
                    </div>
                    <div class="btn-group medium">
                        <AuthorName :name="shuffledList[0][1]" :value="shuffledList[0][1]" class="m-2" @click.once="validate" />
                        <AuthorName :name="shuffledList[1][1]" :value="shuffledList[1][1]" class="m-2" @click.once="validate" />
                    </div>
                    <div class="btn-group medium">
                        <AuthorName :name="shuffledList[2][1]" :value="shuffledList[2][1]" class="m-2" @click.once="validate" />
                        <AuthorName :name="shuffledList[3][1]" :value="shuffledList[3][1]" class="m-2" @click.once="validate" />
                    </div>
                    <div class="btn-group-vertical small">
                        <AuthorName v-for="sets in shuffledList" :key="sets[0] + sets[1]" :name="sets[1]" :value="sets[1]"
                         class="m-2" @click.once="validate" />
                    </div>
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

<<<<<<< HEAD
=======
<style>
.center-content {
    text-align: center;
}

.center-content>* {
    text-align: center;
}

</style>
>>>>>>> main
