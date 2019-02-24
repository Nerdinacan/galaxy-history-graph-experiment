import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import HistoryView from '@/views/HistoryView';

Vue.use(Router)

const routes = [
    { 
        name: 'home', 
        path: '/', 
        component: Home
    },
    // { 
    //     name: 'randomhistory', 
    //     path: '/history/random/:datasetcount', 
    //     component: HistoryView
    // },
    { 
        name: 'history', 
        path: '/history/:id', 
        component: HistoryView
    }
];

export default new Router({ routes })
