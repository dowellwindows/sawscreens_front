import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/SignIn.vue'
//import Dashboard from '../views/Dashboard.vue'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import saw from '@/components/saw/Saw.vue'
import joblist from '@/components/saw/joblist/sawjobs.vue'
import jobdetails from '@/components/saw/jobdetails/jobdetails.vue'
import profilecutting from '@/components/saw/pcutting/pcutting.vue'
import sawschedules from '@/components/dbtables/sawschedules/sawschedules.vue'
import sawbars from '@/components/dbtables/sawbars/sawbars.vue'
import sawcuts from '@/components/dbtables/sawcuts/sawcuts.vue'
import sawstatus from '@/components/dbtables/sawstatus/sawstatus.vue'
import sawflags from '@/components/dbtables/sawflags/sawflags.vue'
import cutlist from '@/components/saw/cutlist/cutlist.vue'
import sscutlist from '@/components/dbtables/sawschedules/cutlist/cutlist.vue'
import jscutlist from '@/components/dbtables/summary/cutlist/cutlist.vue'
import user from '@/components/users/user.vue'
import UserList from '@/components/users/userlist/UserList.vue'
import profile from '@/components/users/profile/profile.vue'
import cutdata from '@/components/charts/cutdate.vue'
import dailycuts from '@/components/charts/dailycuts.vue'
import sawprints from '@/components/dbtables/sawprints/sawprints.vue'
import jobsummary from '@/components/dbtables/summary/jobsummary.vue'
import screensummary from '@/components/dbtables/summary/screensummary.vue'
import transfrdjobs from '@/components/dbtables/transfrdjobs/transfrdjobs.vue'
import transfrsaw from '@/components/dbtables/transfrsaw/transfrsaw.vue'
import tjcutlist from '@/components/dbtables/transfrdjobs/cutlist/cutlist.vue'


Vue.use(VueRouter)
const routes = [

  { path: '/',   name: 'dashboard',   component: Dashboard ,meta: { requiresAuth: true  }, } ,
  { path: '/login',   name: 'login',   component: Login  } ,
//  { path: '/dashboard',   name: 'dashboard',   component: Dashboard,meta: { requiresAuth: true  }, } ,
  { path: '/user',name:'user', component: user,meta: { requiresAuth: true }},
  { path: '/userlist',name:'userlist', component: UserList,meta: { requiresAuth: true }},
  { path: '/profile',name:'profile', component: profile,meta: { requiresAuth: true }},
  //{ path: '/userlist',name:'userlist', component: userlist,meta: { requiresAuth: true }},
  { path: '/sawschedules',name:'sawschedules', component: sawschedules,meta: { requiresAuth: true }},
  { path: '/sawbars',name:'sawbars', component: sawbars,meta: { requiresAuth: true }},
  { path: '/sawcuts',name:'sawcuts', component: sawcuts,meta: { requiresAuth: true }},
  { path: '/sawstatus',name:'sawstatus', component: sawstatus,meta: { requiresAuth: true }},
  { path: '/sawflags',name:'sawflags', component: sawflags,meta: { requiresAuth: true }},
  { path: '/sawprints',name:'sawprints', component: sawprints,meta: { requiresAuth: true }},
  { path: '/saw',name:'saw', component: saw,meta: { requiresAuth: true }},
  { path: '/saw/joblist',name:'joblist', component: joblist,meta: { requiresAuth: true }},
  { path: '/saw/jobdetails',name:'jobdetails', component: jobdetails,meta: { requiresAuth: true }},
  { path: '/saw/profilecutting',name:'profilecutting', component: profilecutting,meta: { requiresAuth: true }},
  { path: '/saw/cutlist',name:'cutlist', component: cutlist,meta: { requiresAuth: true }},
  { path: '/saw/sscutlist',name:'sscutlist', component: sscutlist, props: true,meta: { requiresAuth: true }},
  { path: '/saw/jscutlist',name:'jscutlist', component: jscutlist, props: true,meta: { requiresAuth: true }},
  { path: '/cutdata',name:'cutdata', component: cutdata,meta: { requiresAuth: true }},
  { path: '/dailycuts',name:'dailycuts', component: dailycuts,meta: { requiresAuth: true }},
  { path: '/summary/jobs',name:'jobsummary', component: jobsummary,meta: { requiresAuth: true }},
  { path: '/summary/screens',name:'screens', component: screensummary,meta: { requiresAuth: true }},
  { path: '/transfrdjobs',name:'transfrdjobs', component: transfrdjobs,meta: { requiresAuth: true }},
  { path: '/transfrsaw',name:'transfrsaw', component: transfrsaw,meta: { requiresAuth: true }},
  { path: '/saw/tjcutlist',name:'tjcutlist', component: tjcutlist, props: true,meta: { requiresAuth: true }},
  { path: '/404', component: () => import('@/views/App404.vue'),meta: { requiresAuth: true  }, },
  
  { path: '*', redirect: '/404' },
]

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) { return savedPosition }
  else {  
    return { x: 0, y: 0 }  
}
}
const router = new VueRouter({
  mode: 'history', base: process.env.BASE_URL, scrollBehavior, 
  routes
})

export default router
