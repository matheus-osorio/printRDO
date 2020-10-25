import Vue from 'vue'
import Router from 'vue-router'
import status from './views/status'
import hora from './views/hora'
import valor from './views/valor'

const routes = [
    {
        path: '/status/:periodo/:estab',
        component: status,
        name: 'status',
    },
    {
        path: '/extra/:periodo/:estab',
        component: hora,
        name: 'extra',
    },
    {
        path: '/valor/:periodo/:estab',
        component: valor,
        name: 'valor',
    }
]
Vue.use(Router)

export default new Router({
    routes
})