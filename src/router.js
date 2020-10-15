import Vue from 'vue'
import Router from 'vue-router'


const routes = [
    {
        path: '/:mes/:ano/:estab'
    }
]

Vue.use(Router)

export default new Router({
    routes
})