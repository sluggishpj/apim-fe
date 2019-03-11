import 'iview/dist/styles/iview.css'
import { Button, Message } from 'iview'
import Vue from 'vue'
import router from './router/index'
import store from './store/index'
import App from './App.vue'

Vue.component('Button', Button)
Vue.prototype.$Message = Message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
