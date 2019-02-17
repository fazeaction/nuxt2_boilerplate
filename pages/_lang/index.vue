<!--
    pages/_lang/index.vue
-->

<template>
    <div class="p-index">
        <img-base />
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    import ImgBase from "~/components/atoms/Image";

    export default {
        name: "index",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                content: state => state.content
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
        components: {
            ImgBase
        }
    }

</script>

<style lang="scss" scoped>

    .p-index {
        padding: 20px;
    }

</style>
