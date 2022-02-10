import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import vuetify from './plugins/vuetify';
import {initialize} from './store/helper';
import '@/styles/index.scss';

require ('@/plugins/Sweetalert');

require('@/store/subscriber')  
import moment from 'moment'

Vue.prototype.moment = moment
//axios.defaults.baseURL='http://127.0.0.1:8000/api'
axios.defaults.baseURL=process.env.VUE_APP_API_URL
//axios.defaults.baseURL='//uat.oms.dowell.com.au/api'

Vue.config.productionTip = false
initialize(store, router);

store.dispatch('auth/attempt',localStorage.getItem('token'))
.then(()=>{
      new Vue({ router,store,vuetify, render: h => h(App)
      }).$mount('#app')
})

