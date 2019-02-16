<!--
    layouts/error.vue
-->

<template>
    <div class="l-error">
        <p>Error</p>
    </div>
</template>

<script>

    import { mapState } from "vuex";

    import LifecycleHooks from "~/mixins/LifecycleHooks";

    export default {
        mixins: [ LifecycleHooks ],
        methods: {
            setInitValue() {
                console.log("ERROR")
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
