<!--
    pages/_lang/vuex.vue
-->

<template>
    <div class="p-vuex">
        <div class="flexGrid">
            <div class="flexGrid__cell _1"><h2 v-text="$t('p-vuex:title')" /></div>
            <div class="flexGrid__cell" :class="{ _1: isMobile, _3: !isMobile }">
                <h2 v-text="$t('p-vuex:device:title')" />
                <pre v-html="device" />
            </div>
            <div class="flexGrid__cell" :class="{ _1: isMobile, _3: !isMobile }">
                <h2 v-text="$t('p-vuex:mouse:title')" />
                <pre v-html="mouse" />
            </div>
            <div class="flexGrid__cell" :class="{ _1: isMobile, _3: !isMobile }">
                <h2 v-text="$t('p-vuex:scroll:title')" />
                <pre v-html="scroll" />
            </div>
        </div>
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    export default {
        name: "vuex",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.vuex.head,
                device: state => state.device,
                mouse: state => state.mouse,
                scroll: state => state.scroll
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
                    this.isMobile = this.device.breakpoint.includes("mobile");
                },
                immediate: true
            }
        }
    }

</script>

<style lang="scss" scoped>

    .p-vuex {
        padding: 20px;
    }

</style>
