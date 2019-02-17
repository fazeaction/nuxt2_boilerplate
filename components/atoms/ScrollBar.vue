<!--
    components/atoms/ScrollBar.vue
-->

<template>
    <div class="a-scrollBar">
        <div ref="bar" class="bar" />
    </div>
</template>

<script>

    import { mapState } from "vuex";
    import LifecycleHooks from "~/mixins/LifecycleHooks";

    export default {
        name: "ScrollBar",
        mixins: [ LifecycleHooks ],
        computed: {
            ...mapState({
                scrollActive: state => state.scroll.active,
                scrollPoint: state => state.scroll.point,
                scrollHeight: state => state.scroll.height,
                viewportSize: state => state.device.viewportSize,
                resize: state => state.device.resize
            })
        },
        data() {
            return {
                journey: 0,
                st: 0
            }
        },
        watch: {
            scrollPoint() {
                const percentage = (this.scrollPoint % this.scrollHeight / (this.scrollHeight - this.viewportSize.h)).toFixed(2);
                this.$refs.bar.style.transform = `translate3d( 0, ${ this.journey * percentage }px, 0 )`;
                this.$refs.bar.style.opacity = 1;
                clearTimeout( this.st );
                this.st = setTimeout(() => {
                    this.$refs.bar.style.opacity = 0;  
                }, 500);
            },
            scrollActive() {
                this.setSize();
            },
            resize() {
                this.setSize();
            }
        },
        methods: {
            setSize() {
                const height = (this.viewportSize.h / this.scrollHeight) * this.viewportSize.h;
                this.$refs.bar.style.height = `${ height }px`;
                this.journey = this.viewportSize.h - height;
            }
        }
    }
</script>

<style lang="scss" scoped>

    .a-scrollBar {
        pointer-events: none;
        position: fixed;
        right: 0;
        top: 0;
        width: 8px;
        height: 100%;
        z-index: 10;
        .bar {
            will-change: transform, opacity;
            opacity: 0;
            position: absolute;
            top: 0;
            width: 100%;
            background: rgba(0,0,0,0.25);
            transition: opacity .5s ease-out;
        }
    }

</style>


