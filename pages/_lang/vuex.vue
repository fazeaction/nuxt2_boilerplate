<!--
    pages/_lang/vuex.vue
-->

<template>
    <div class="p-vuex">
        <div class="_s">
            <h2 v-text="$t('p-vuex:name')" />
            <p class="content" v-html="$t('p-vuex:content')" />
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
            <h2 v-text="$t('p-vuex:images:title')" />
            <pre v-html="images" />
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
                images: state => state.images,
                scroll: state => state.scroll,
                horizontal: state => state.scroll.horizontalScroll
            })
        },
        methods: {
            enter() {
                this.setScrollDirection( this.horizontal );
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
            SectionComponent
        }
    }

</script>

<style lang="scss" scoped>

    .p-vuex {
        padding: $menuHeight 20px 20px;
        white-space: nowrap;
        display: inline-block;
        > div {
            margin: 20px 100px 0 0;
            display: inline-block;
            vertical-align: top;
            white-space: wrap;
            &:last-child {
                margin-right: 0;
            }
            .content {
                display: block;
                width: 250px;
                padding-top: 20px;
                white-space: normal;
            }
        }
        .a-section {
            width: 33vw;
        }
    }

</style>
