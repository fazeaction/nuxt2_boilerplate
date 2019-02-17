<!--
    pages/_lang/contact.vue
-->

<template>
    <div class="p-contact">
        <p v-text="head.title" />
    </div>
</template>

<script>

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    export default {
        name: "contact",
        mixins: [ Head, LifecycleHooks, Transitions ],
        async asyncData ({ app }) {
            return {
                head: {
                    title: app.i18n.t('p-contact:title'),
                    meta: {
                        description: app.i18n.t('p-contact:description')
                    }
                }
            };
        }
    }

</script>

<style lang="scss" scoped>

    .p-contact {
        padding: 20px;
    }

</style>
