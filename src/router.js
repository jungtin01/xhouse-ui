import Vue from 'vue'
import Router from 'vue-router'
//import page
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
//import component
import Profile from '@/components/profile/Profile'
import HouseManagement from '@/components/houses/HouseManagement'
import UserManagement from '@/components/users/UserManagement'
import HouseDetails from '@/components/houses/HouseDetails'
import StatisticManagement from '@/components/statistics/StatisticManagement'


Vue.use(Router)
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {path: '/', component: Login},
        {path: '/dashboard', component: Dashboard, children: [
            { path: 'profile', component: Profile,
                meta:{
                    breadcrumb:[
                        {text:'Trang chủ',href:'',disabled:true},
                        {text:'Trang cá nhân',href:'/dashboard/profile',disabled:false}
                    ]
                }
            },
            {
                path: 'houses', component: HouseManagement,
                meta: {
                    breadcrumb: [
                        {text: 'Trang chủ', href: '', disabled: true},
                        {text: 'căn hộ', href: '/dashboard/houses', disabled: false}
                    ]
                }
            },
            {
                path: 'houses/:id', component: HouseDetails,
                meta: {
                    breadcrumb: [
                        {text: 'Trang chủ', href: '', disabled: true},
                        {text: 'Căn hộ', href: '/dashboard/houses', disabled: true},
                        {text: 'Chi tiết', href: '/dashboard/houses/:id', disabled: false}
                    ]
                }
            },
            {
                path: 'users', component: UserManagement,
                meta: {
                    breadcrumb: [
                        {text: 'Trang chủ', href: '', disabled: true},
                        {text: 'Người dùng', href: '/dashboard/users', disabled: false}
                    ]
                }
            },
            {
                path: 'statistics', component: StatisticManagement
            }
        ]},
        { path: '*', redirect: '/' }
    ]
})