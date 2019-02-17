<!--
    pages/_lang/about.vue
-->

<template>
    <div class="p-about">
        <p v-text="$t( head.title )" />
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    export default {
        name: "about",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.about.head
            })
        }
    }

</script>

<style lang="scss" scoped>

    .p-about {
        padding: 20px;
    }

</style>
