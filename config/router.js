//
// assets/js/core

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const Home = () => import("~/pages/_lang/index").then(m => m.default || m);
const Page = () => import("~/pages/_lang/_page").then(m => m.default || m);
const Vuex = () => import("~/pages/_lang/vuex").then(m => m.default || m);
const Contact = () => import("~/pages/_lang/contact").then(m => m.default || m);

export function createRouter() {
    return new Router({
        mode: "history",
        routes: [
        {
            path: "/:lang",
            name: "home",
            component: Home
        },
        {
            path: "/:lang/contact",
            name: "contact",
            component: Contact,
            alias: [
                "/:lang/contacto"
            ]
        },
        {
            path: "/:lang/vuex",
            name: "vuex",
            component: Vuex
        },
        {
            path: "/:lang/:page",
            name: "page",
            component: Page
        }]
    })
}
