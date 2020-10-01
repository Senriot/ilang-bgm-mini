import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from "@/store/Store.ts";
import songActionSheet from "@/components/song-action-sheet"

Vue.config.productionTip = false
Vue.use(uView);
App.mpType = 'app'
Vue.component("song-action", songActionSheet)
const app = new Vue({
    ...App,
    store,
})
app.$mount()
