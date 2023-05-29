import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.scss' // import css
import * as bootstrap from 'bootstrap' // import js


const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')

