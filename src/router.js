import Vue from 'vue'
import Router from 'vue-router'
import status from './views/status'
import hora from './views/hora'
import porPessoa from './views/porPessoa'
import valorPrint from './views/valorPrint'
import valor from './views/valor'

const routes = [
    {
        path: '/status/:estab/:periodo',
        component: status,
        name: 'status',
    },
    {
        path: '/extra/:estab/:periodo',
        component: hora,
        name: 'extra',
    },
    {
        path: '/porPessoa/:estab/:periodo',
        component: porPessoa,
        name: 'porPessoa',
    },
    {
        path: '/valor/:estab/:periodo',
        component: valor,
        name: 'valor',
    },
    {
        path: '/valor/print/:estab/:periodo',
        component: valorPrint,
        name: 'valorPrint',
    }
]
Vue.use(Router)

export default new Router({
    routes
})