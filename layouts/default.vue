<!--
    layouts/default.vue
-->

<template>
    <div class="__content">
        <div class="__loaded" v-if="loaded">
            <organism-header ref="header" />
            <div ref="scroll" class="__scroll">
                <nuxt ref="page" />
            </div>
            <scroll-bar />
        </div>
    </div>
</template>

<script>

    import { mapState, mapMutations, mapActions } from "vuex";

    import LifecycleHooks from "~/mixins/LifecycleHooks";

    import ScrollBar from "~/components/atoms/ScrollBar";
    import OrganismHeader from "~/components/organisms/Header";

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
                scrollTo: state => state.scroll.scrollTo,
                scrollProgress: state => state.scroll.progress,
                verticalScroll: state => state.scroll.vertical,
                updateScroll: state => state.scroll.update,
                breakpoint: state => state.device.breakpoint,
                viewportSize: state => state.device.viewportSize,
                resize: state => state.device.resize
            })
        },
        watch: {
            $route() {
                this.incrementCounter();
            },
            loaded() {
                this.$nextTick( this.appStart );
            },
            updateScroll() {
                this.scroll.resize();
            },
            scrollTo() {
                this.scrollTo > 0 && this.scroll.scrollTo( this.scrollTo, true );
                this.setScrollTo( -1 );
            },
            scrollProgress() {
                this.setOnTop( this.scrollProgress == 0 );
                this.setOnBottom( this.scrollProgress == 1 );
            },
            verticalScroll() {
                if ( this.verticalScroll ) {
                    this.scroll.vertical();
                    this.$refs.scroll.classList.remove("horizontal");
                } else {
                    this.scroll.horizontal();
                    this.$refs.scroll.classList.add("horizontal");
                }
            },
            scrollActive() {
                this.scrollActive ? this.scroll.enableScroll() : this.scroll.disableScroll();
            },
            async breakpoint() {
                await this.$nextTick();
                this.scroll.resize();
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
                this.scroll.vs._emitter.on("size", this.setHeight);
                this.scroll.init();
            },
            entered() {
                this.scroll.reset();
            },
            reset() {
                this.scroll.scrollTo( 0 );
                this.setScrollActive( false );
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
                setScrollTo: "scroll/updateScrollTo",
                setDirection: "scroll/setDirection",
                setHeight: "scroll/setHeight",
                setOnTop: "scroll/setOnTop",
                setOnBottom: "scroll/setOnBottom",
                incrementCounter: "increment"
            })
        },
        components: {
            ScrollBar,
            OrganismHeader
        }
    }

</script>

<style lang="scss" scoped>

    .__content {
        width: 100%;
        height: 100%;
        .__scroll {
            position: relative;
            opacity:1;
            z-index: 1;
            &.horizontal {
                display: inline-block;
            }
        }
    }

</style>

