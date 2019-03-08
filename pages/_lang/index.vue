<!--
    pages/_lang/index.vue
-->

<template>
    <div class="p-home">
        <div class="flexGrid">
            <div class="flexGrid__cell _1"><h1 v-text="`Nuxt2 BurundangaStudio Boilerplate`" /></div>
            <div class="flexGrid__cell" :class="{ _1: isMobile, _3: !isMobile }">
                <img-base />
            </div>
            <div class="flexGrid__cell" :class="{ _1: isMobile, _2: !isMobile }">
                <p v-text="$t('p-home:base64:copy')" />
                <a href="https://github.com/cmacmillanmarin/base_64" rel="noopener" target="_black" v-text="`Github Repo.`" />
            </div>
            <section-component :n="1" />
            <section-component :n="2" />
            <section-component :n="3" />
        </div>
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    import ImgBase from "~/components/atoms/Image";
    import SectionComponent from "~/components/atoms/Section";

    export default {
        name: "index",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                breakpoint: state => state.device.breakpoint,
                head: state => state.content.pages.home.head
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
        components: {
            ImgBase,
            SectionComponent
        }
    }

</script>

<style lang="scss" scoped>

    .p-home {
        padding: 0 20px 20px;
        h1 {
            margin: 20px 0px;
        }
        h2 {
            margin: 10px 0px;
        }
        p, a {
            padding: 20px;
        }
    }

</style>
