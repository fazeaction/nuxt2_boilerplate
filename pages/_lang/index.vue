<!--
    pages/_lang/index.vue
-->

<template>
    <div class="p-index">
        <img-base />
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    import ImgBase from "~/components/atoms/Image";

    export default {
        name: "index",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.home.head
            })
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
