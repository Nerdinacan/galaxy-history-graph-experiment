import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import HistoryEditor from '@/components/History/HistoryEditor';

Vue.use(Router)

const routes = [
    { 
        name: 'home', 
        path: '/', 
        component: Home
    },
    { 
        name: 'history', 
        path: '/history/:id/:jobless?', 
        component: HistoryEditor, 
        props: router => ({ 
            id: router.params.id, 
            jobless: !!router.params.jobless
        })
    }
];

export default new Router({ routes })
