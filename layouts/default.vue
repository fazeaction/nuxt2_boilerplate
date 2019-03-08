<!--
    layouts/default.vue
-->

<template>
    <div class="__content">
        <div ref="scroll" class="__scroll" v-if="loaded">
            <organism-header class="_s" ref="header" />
            <nuxt class="_s" ref="page" />
            <organism-footer class="_s" ref="footer" />
            <scroll-bar />
        </div>
    </div>
</template>

<script>

    import { mapState, mapMutations, mapActions } from "vuex";

    import LifecycleHooks from "~/mixins/LifecycleHooks";

    import ScrollBar from "~/components/atoms/ScrollBar";
    import OrganismHeader from "~/components/organisms/Header";
    import OrganismFooter from "~/components/organisms/Footer";

    import { Events, TRANSITION_ENTER_DONE, TRANSITION_LEAVE_DONE } from "~/assets/js/controllers/Events";

    export default {
        name: "default",
        middleware: "i18n",
        mixins: [ LifecycleHooks ],
        computed: {
            ...mapState({
                loaded: state => state.loaded,
                lang: state => state.lang.locale,
                scrollPoint: state => state.scroll.point,
                scrollActive: state => state.scroll.active,
                verticalScroll: state => state.scroll.vertical,
                updateScroll: state => state.scroll.update,
                breakpoint: state => state.device.breakpoint,
                viewportSize: state => state.device.viewportSize,
                resize: state => state.device.resize
            })
        },
        watch: {
            loaded() {
                this.$nextTick( this.appStart );
            },
            updateScroll() {
                this.scroll.resize();
            },
            scrollActive() {
                this.scrollActive ? this.scroll.enableScroll() : this.scroll.disableScroll();
            },
            async breakpoint() {
                await this.$nextTick();
                this.scroll.resize();
            },
            resize() {
                this.setSize();
            }
        },
        methods: {
            appStart() {
                this.scroll = new Scroll({
                    section: this.$refs.scroll,
                    native: false,
                    skew: false,
                    ease: 0
                });
                this.setScrollDomEl( this.$refs.scroll );
                this.scroll.vs._emitter.on("scrolling", this.setScrollPoint);
                this.scroll.vs._emitter.on("direction", this.setDirection);
                this.scroll.vs._emitter.on("vertical", this.setVertical);
                this.scroll.vs._emitter.on("size", this.setHeight);
                this.scroll.init();
                this.setScrollActive( true );
            },
            entered() {
                this.scroll.reset();
                this.setScrollActive( true );
            },
            reset() {
                this.scroll.scrollTo( 0 );
                this.setScrollActive( false );
            },
            setSize() {
                console.log( `Viewport Size: ${ this.viewportSize.w, this.viewportSize.h }` );
            },
            scrolling() {
                console.log( `Scroll value: ${ this.scrollPoint }` );
            },
            addListeners() {
                this.enterHandler = this.entered.bind(this);
                this.leaveHandler = this.reset.bind(this);
                Events.addEventListener(TRANSITION_ENTER_DONE, this.enterHandler);
                Events.addEventListener(TRANSITION_LEAVE_DONE, this.leaveHandler);
            },
            removeListeners() {
                Events.removeEventListener(TRANSITION_ENTER_DONE, this.enterHandler);
                Events.removeEventListener(TRANSITION_LEAVE_DONE, this.leaveHandler);
            },
            ...mapActions({
                setContent: "setContent"
            }),
            ...mapMutations({
                setScrollActive: "scroll/setActive",
                setScrollDomEl: "scroll/setDomEl",
                setScrollPoint: "scroll/setPoint",
                setDirection: "scroll/setDirection",
                setVertical: "scroll/setVertical",
                setHeight: "scroll/setHeight"
            })
        },
        components: {
            ScrollBar,
            OrganismHeader,
            OrganismFooter
        }
    }

</script>

<style lang="scss" scoped>

    .l-default {
        width: 100%;
        height: 100%;
        .__content {
            position: relative;
            opacity:1;
            z-index: 1;
        }
    }

</style>

