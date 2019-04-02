<!--
    pages/_lang/index.vue
-->

<template>
    <div class="p-home">
        <div class="flexGrid">
            <div class="flexGrid__cell _1 _s"><h1 v-text="`Nuxt2 BurundangaStudio Boilerplate`" /></div>
            <div class="flexGrid__cell _s" :class="{ _1: isMobile, _3: !isMobile }">
                <img-base />
            </div>
            <div class="flexGrid__cell _s" :class="{ _1: isMobile, _2: !isMobile }">
                <p class="content" v-html="$t('p-home:base64:content')" />
                <a href="https://github.com/cmacmillanmarin/_base64.png" rel="noopener" target="_black" v-text="`Github Repo.`" />
            </div>
            <section-component :n="1" class="_s first-section" />
            <section-component :n="2" class="_s" />
            <section-component :n="3" class="_s" />
        </div>
        <organism-footer class="_s" ref="footer" />
    </div>
</template>

<script>

    import { mapState, mapMutations } from "vuex";

    import { Events, TRANSITION_ENTER_DONE } from "~/assets/js/controllers/Events";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    import ImgBase from "~/components/atoms/Image";
    import SectionComponent from "~/components/atoms/Section";
    import OrganismFooter from "~/components/organisms/Footer";

    export default {
        name: "index",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.home.head,
                breakpoint: state => state.device.breakpoint,
                vertical: state => state.scroll.verticalScroll
            })
        },
        data() {
            return {
                isMobile: false
            }
        },
        watch: {
            breakpoint: {
                handler: function() {
                    this.isMobile = this.breakpoint.includes("mobile");
                },
                immediate: true
            }
        },
        methods: {
            enter() {
                this.setScrollDirection( this.vertical );
                this.setScrollActive( true );
                this.$nextTick( _ => { this.setScrollTo( 50 ) });
            },
            addListeners() {
                this.enterHandler = this.enter.bind( this );
                Events.addEventListener( TRANSITION_ENTER_DONE, this.enterHandler );
            },
            removeListeners() {
                Events.removeEventListener( TRANSITION_ENTER_DONE, this.enterHandler );
            },
            ...mapMutations({
                setScrollActive: "scroll/setActive",
                setScrollDirection: "scroll/setScrollDirection",
                setScrollTo: "scroll/updateScrollTo"
            })
        },
        components: {
            ImgBase,
            SectionComponent,
            OrganismFooter
        }
    }

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
        .first-section {
            margin-top: 40px;
        }
    }

</style>
