<!--
    pages/_lang/index.vue
-->

<template>
    <div class="p-index pageLayout">
        <p v-text="head.title" />
    </div>
</template>

<script>

    import { mapState } from "vuex";
    import { TweenLite } from "gsap";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";

    export default {
        name: "index",
        mixins: [ Head, LifecycleHooks ],
        computed: {
            ...mapState({
                lang: state => state.lang.locale
            })
        },
        async asyncData({ app }) {
            return {
                head: {
                    title: app.i18n.t('p-index:title'),
                    meta: {
                        description: app.i18n.t('p-index:description')
                    }
                }
            }
        },
        methods: {},
        transition: {

            css: false,
            appear: true,
            mode: "out-in",
            routeName: "",

            enter(el, done) {

                TweenLite.to(el.querySelector("p"), 1, { rotation: 360, opacity: 1, onComplete: done })
            },
            enterCancelled(el) { TweenLite.killTweensOf(el); },
            beforeEnter(el) { this.routeName = this.$route.name },
            leave(el, done) {

                this.routeName !== this.$route.name
                    ? TweenLite.to(el.querySelector("p"), 1, { rotation: -360, opacity: 0, onComplete: done })
                    : done();
            },
            leaveCancelled(el) { TweenLite.killTweensOf(el) },
        }
    }

</script>

<style lang="scss" scoped>

    .p-index {
        p {
            display: inline-block;
            opacity: 0;
            will-change: opacity, transform;
            transform-origin: center;
        }
    }

</style>
