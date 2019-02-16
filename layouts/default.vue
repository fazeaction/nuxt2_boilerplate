<!--
    layouts/default.vue
-->

<template>
    <div class="l-default">
        <organism-header ref="header" />
        <div ref="scroll" class="__content">
            <nuxt class="page" ref="page" />
            <organism-footer class="footer" ref="footer" />
        </div>
    </div>
</template>

<script>

    import { mapState, mapMutations } from "vuex";

    import LifecycleHooks from "~/mixins/LifecycleHooks";

    import OrganismHeader from "~/components/organisms/Header";
    import OrganismFooter from "~/components/organisms/Footer";

    export default {
        name: "default",
        middleware: "i18n",
        mixins: [LifecycleHooks],
        computed: {
            ...mapState({
                scrollPoint: state => state.scroll.point,
                scrollActive: state => state.scroll.active,
                verticalScroll: state => state.scroll.vertical,
                breakpoint: state => state.device.breakpoint,
                viewportSize: state => state.device.viewportSize,
                resize: state => state.device.resize
            })
        },
        data() {
            return {
                ready: false
            }
        },
        watch: {
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
            init() {
                this.scroll = new Scroll({
                    section: this.$refs.scroll,
                    native: false,
                    skew: false,
                    ease: 0
                });
                this.setScrollDomEl(this.$refs.scroll);
                this.scroll.vs._emitter.on("scrolling", this.setScrollPoint);
                this.scroll.vs._emitter.on("direction", this.setDirection);
                this.scroll.vs._emitter.on("elasticity", this.setElasticity);
                this.scroll.vs._emitter.on("vertical", this.setVertical);
                this.scroll.init();
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
                console.log( this.viewportSize.w, this.viewportSize.h );
            },
            scrolling() {
                console.log( this.scrollPoint );
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
            ...mapMutations({
                setScrollActive: "scroll/setActive",
                setScrollDomEl: "scroll/setDomEl",
                setScrollPoint: "scroll/setPoint",
                setDirection: "scroll/setDirection",
                setVertical: "scroll/setVertical"
            })
        },
        components: {
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
            &.horizontal {
                display: inline-block;
            }
            .page {
                min-height: 50vh;
            }
        }
    }

</style>

