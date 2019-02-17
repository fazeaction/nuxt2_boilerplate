<!--
    pages/_lang/contact.vue
-->

<template>
    <div class="p-contact">
        <p v-text="$t( head.title )" />
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    export default {
        name: "contact",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.contact.head
            })
        }
    }

</script>

<style lang="scss" scoped>

    .p-contact {
        padding: 20px;
    }

</style>
