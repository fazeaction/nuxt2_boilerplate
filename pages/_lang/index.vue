<!--
    pages/_lang/index.vue
-->

<template>
    <div class="p-home">
        <div class="flexGrid">
            <div class="flexGrid__cell _1 _s">
                <h1 v-text="`Nuxt2 BurundangaStudio Boilerplate`" />
            </div>
            <div class="flexGrid__cell _s _aux3">
                <img-base />
            </div>
            <div class="flexGrid__cell _s _aux2">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p class="content" v-html="$t('p-home:base64:content')" />
                <a href="https://github.com/cmacmillanmarin/_base64.png" rel="noopener" target="_black" v-text="`👉🏾 Github Repo.`" />
            </div>
            <template v-for="(section , i) in page.sections">
                <section-component :key="i" :n="section.id" class="_s" />
            </template>
        </div>
        <organism-footer ref="footer" class="_s" />
    </div>
</template>

<script>

import {mapState, mapMutations} from "vuex";

import {Events, TRANSITION_ENTER_DONE} from "~/assets/js/controllers/Events";

import Head from "~/mixins/Head";
import LifecycleHooks from "~/mixins/LifecycleHooks";
import Transitions from "~/mixins/Transitions";

import ImgBase from "~/components/atoms/Image";
import SectionComponent from "~/components/atoms/Section";
import OrganismFooter from "~/components/organisms/Footer";

export default {
    name: "Index",
    components: {
        ImgBase,
        SectionComponent,
        OrganismFooter
    },
    mixins: [ Head, LifecycleHooks, Transitions ],
    computed: {
        ...mapState({
            page: state=>state.content.pages.home,
            head: state=>state.content.pages.home.head,
            vertical: state=>state.scroll.verticalScroll
        })
    },
    methods: {
        enter() {
            this.setScrollDirection(this.vertical);
            this.setScrollActive(true);
            this.$nextTick((_)=>{ this.setScrollTo(50); });
        },
        addListeners() {
            this.enterHandler = this.enter.bind(this);
            Events.addEventListener(TRANSITION_ENTER_DONE, this.enterHandler);
        },
        removeListeners() {
            Events.removeEventListener(TRANSITION_ENTER_DONE, this.enterHandler);
        },
        ...mapMutations({
            setScrollActive: "scroll/setActive",
            setScrollDirection: "scroll/setScrollDirection",
            setScrollTo: "scroll/updateScrollTo"
        })
    }
};

</script>

<style lang="scss" scoped>

    .p-home {
        width: 100vw;
        padding: $menuHeight 20px 20px;
        h1 {
            margin: 20px 0px;
        }
        h2 {
            margin: 10px 0px;
        }
        p, a {
            padding: 20px;
            &.content {
                @include respond-to("tablet-portrait") {
                    max-width: 50%;
                }
            }

        }
        .a-section {
            margin-top: 20px;
        }
        ._aux2 {
            width: 100%;
            @include respond-to("tablet-portrait") {
                width: 50%;
            }
        }
        ._aux3 {
            width: 100%;
            @include respond-to("tablet-portrait") {
                width: 33.333333%;
            }
        }
    }

</style>
