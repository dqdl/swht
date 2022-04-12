import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import naive from 'naive-ui'
import store from "./store";
import './assets/style/reset.css'
import './assets/style/public.postcss'

const app = createApp(App)
app.use(naive)
app.use(router)
app.use(store)

app.mount('#app')
