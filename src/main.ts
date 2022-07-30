import { createApp } from "vue"

import "@/api/interceptor"
import "@/assets/style/global.less"
import "@arco-design/web-vue/dist/arco.css"

import App from "./App.vue"
import router from "./router"
import store from "./store"

const app = createApp(App)
app.use(router)
app.use(store)
app.mount("#app")
