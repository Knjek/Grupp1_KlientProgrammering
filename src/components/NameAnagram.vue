<script>
import ReadFile from "../data/ReadFile.js"
import { getBookAndAuthorByISBN, getTrendingYearly } from "../data/misc.js"
import PageLoader from "./PageLoader.vue"
import ErrorHandler from "./ErrorHandler.vue"

import { mapStores } from 'pinia'
import { useListStore } from "@/stores/listStore"

export default {
    name: "NameAnagram",
    data() {
        return {
            shuffledAuthorName: "",
            correctSpelledAuthorName: "",
            count: 0,
            userGuess: "",
            wrongGuesses: 0,
            error: false,
            errorMsg: "",
            loading: true,
            show: false,
            msg: ""
        }
    },
    components: {
        PageLoader,
        ErrorHandler,
    },
    methods: {
        async getISBNList() {
            //Program reads our text file and creates a list containing all the isbn numbers
            this.isbn = await ReadFile.makeList()
        },

        async setup() {
            try {
                if (localStorage.listOfBooksAndAuthors) {
                    this.listStore.listOfBooksAndAuthors = JSON.parse(localStorage.listOfBooksAndAuthors)
                }

                if (this.listStore.listOfBooksAndAuthors < 50) {
                    await this.getISBNList()
                    fetchToStore()
                    this.randomIndex = Math.floor(Math.random() * this.isbn.length)
                    this.titleAuthor = await (getBookAndAuthorByISBN([this.isbn[this.randomIndex]]))
                }
                else {
                    this.randomIndex = Math.floor(Math.random() * this.listStore.listOfBooksAndAuthors.length)
                    let checkBookAndAuthor = this.listStore.listOfBooksAndAuthors[this.randomIndex]
                    while (checkBookAndAuthor === "<unknown>") {
                        this.listStore.remove(randomIndex)
                        this.randomIndex++
                    }
                    this.titleAuthor = checkBookAndAuthor
                }

                console.log(this.titleAuthor[1])
                this.correctSpelledAuthorName = this.titleAuthor[1].toUpperCase().replace(/[\s.()]/g, '')
                console.log(this.correctSpelledAuthorName)

                if (this.correctSpelledAuthorName.includes(",")) {
                    this.names = this.correctSpelledAuthorName.split(",");
                    this.swappedNames = this.names[1] + this.names[0];
                    console.log(this.swappedNames)
                    this.shuffledAuthorName = this.shuffleWord(this.swappedNames)
                    console.log(this.shuffledAuthorName)
                }
                else {
                    this.shuffledAuthorName = this.shuffleWord(this.correctSpelledAuthorName)
                    console.log(this.shuffledAuthorName)
                }
            } catch (Error) {
                this.errorMsg = Error.message
                this.loading = false
                this.show = false
                this.error = true
            }
            this.loading = false
            this.show = true

        },

        shuffleWord(correctSpelledAuthorName) {
            let shuffledWord = "";
            let charArray = correctSpelledAuthorName.split("");
            while (charArray.length > 0) {
                let randomIndex = Math.floor(Math.random() * charArray.length);
                shuffledWord += charArray[randomIndex];
                charArray.splice(randomIndex, 1);
            }
            return shuffledWord;
        },

        async validate() {
            this.loading = true
            
            if (this.userGuess !== undefined && this.userGuess !== "") {

                if (this.userGuess.toUpperCase().replace(/[\s.]/g, '') === this.correctSpelledAuthorName) {
                    this.count++
                    this.msg = "Aweseome dude!"
                }
                else {
                    this.wrongGuesses++
                    this.msg = "U suck..."
                }
            }
            else {
                this.msg = "You have to guess something, come on!"
            }

            this.userGuess = this.placeholder
            await this.setup()
        },

        async fetchToStore() {
            const trendingYearlyList = await getTrendingYearly(1)
            this.listStore.add(trendingYearlyList)
            this.persist()
        },

        persist() {
            localStorage.listOfBooksAndAuthors = JSON.stringify(this.listStore.listOfBooksAndAuthors)
            console.log('persisted to local storage')
        },
    },
    async mounted() {
        await this.setup()
    },
    computed: {
        ...mapStores(useListStore)
    }
}
</script>

<template>
    <div class="anagram">
        <div v-if="show" align="center">
            <h3>{{ shuffledAuthorName }}</h3>
            <p>Guess the author name!</p>
            <input type="text" placeholder="Write the name here" v-model="userGuess">
            <input type="button" value="Check if correct" @click="validate">
            <p>Correct guesses: {{ count }}</p>
            <p>Wrong guesses: {{ wrongGuesses }}</p>
            <h2 :style="{ color: msg === 'Aweseome dude!' ? 'green' : 'red' }">{{ msg }}</h2>
        </div>
        <div v-if="loading">
            <PageLoader align="center" />
        </div>
        <div v-if="error">
            <ErrorHandler align="center" :msg="errorMsg" />
        </div>
    </div>
</template>