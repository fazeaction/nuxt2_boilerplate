<!--
    pages/_lang/about.vue
-->

<template>
    <div class="p-about pageLayout">
        <p v-text="head.title" />
    </div>
</template>

<script>

    import Head from "~/mixins/Head";
    import Transitions from "~/mixins/Transitions";

    export default {
        name: "about",
        mixins: [ Head, Transitions ],
        async asyncData ({ app }) {
            return {
                head: {
                    title: app.i18n.t('p-about:title'),
                    meta: {
                        description: app.i18n.t('p-about:description')
                    }
                }
            };
        },
    }

</script>

<style lang="scss" scoped>

    .p-about {
        padding: 20px;
        text-align: left;
        .title {
            font-weight: bold;
            padding-bottom: 10px;
        }
        .person {
            padding-bottom: 5px;
        }
    }

</style>
