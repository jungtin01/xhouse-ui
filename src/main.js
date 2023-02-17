import Vue from 'vue'
import App from './App.vue'
import router from './router'
import mixin from './mixin'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
var firebaseConfig = {
  apiKey: "AIzaSyBgyupNDWcXa26_SrK2vwHrGmAFOATE6Dc",
  authDomain: "xrentalhouse-852c3.firebaseapp.com",
  databaseURL: "https://xrentalhouse-852c3.firebaseio.com",
  projectId: "xrentalhouse-852c3",
  storageBucket: "xrentalhouse-852c3.appspot.com",
  messagingSenderId: "780603949287",
  appId: "1:780603949287:web:d34eac5ba42ad9f1832242",
  measurementId: "G-970DXTR5FK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/']

  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token') != null
  
  if (authRequired && !loggedIn) {
    return next('/') //chua login -> ve trang login
  } else if (!authRequired && loggedIn) {
    const userRole = JSON.parse(localStorage.getItem('user')).userRole
    if (userRole === 10) {
      return next('/dashboard/users') //login roi, nhung vao lai login -> qua dashboard
    } else {
      return next('/dashboard/houses') //login roi, nhung vao lai login -> qua dashboard
    }
  }
  // } else if (loggedIn) {
  //   localStorage.removeItem('token')
  //   return next('/')
  // }
  next()
})

new Vue({
  router,
  mixin,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
