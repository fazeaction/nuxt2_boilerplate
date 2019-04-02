<!--
    pages/_lang/vuex.vue
-->

<template>
    <div class="p-vuex">
        <div class="_s">
            <h2 v-text="$t('p-vuex:title')" />
            <p v-text="$t('p-vuex:description')" />
        </div>
        <div class="_s">
            <h2 v-text="$t('p-vuex:device:title')" />
            <pre v-html="device" />
        </div>
        <div class="_s">
            <h2 v-text="$t('p-vuex:scroll:title')" />
            <pre v-html="scroll" />
        </div>
        <div class="_s">
            <h2 v-text="$t('p-vuex:mouse:title')" />
            <pre v-html="mouse" />
        </div>
        <div class="_s">
            <h2 v-text="$t('p-vuex:lang:title')" />
            <pre v-html="lang" />
        </div>
        <section-component :n="1" class="_s" />
        <section-component :n="2" class="_s" />
        <section-component :n="3" class="_s" />
    </div>
</template>

<script>

    import { mapState, mapMutations } from "vuex";

    import { Events, TRANSITION_ENTER_DONE } from "~/assets/js/controllers/Events";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    import SectionComponent from "~/components/atoms/Section";

    export default {
        name: "vuex",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.vuex.head,
                device: state => state.device,
                lang: state => state.lang,
                mouse: state => state.mouse,
                scroll: state => state.scroll,
                horizontal: state => state.scroll.horizontalScroll
            })
        },
        methods: {
            enter() {
                this.setScrollDirection( this.horizontal );
                this.setScrollActive( true );
                this.setScrollTo( 50 );
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
            SectionComponent
        }
    }

</script>

<style lang="scss" scoped>

    .p-vuex {
        padding: $menuHeight 20px 20px;
        white-space: nowrap;
        display: inline-block;
        min-height: 100vh;
        > div {
            margin: 20px 0px;
            display: inline-block;
            vertical-align: top;
            width: 33.333333vw;
        }
    }

</style>
