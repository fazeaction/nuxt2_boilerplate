<!--
    layouts/error.vue
-->

<template>
    <div class="l-error">
        <p>Error</p>
    </div>
</template>

<script>

import LifecycleHooks from "~/mixins/LifecycleHooks";

export default {
    mixins: [ LifecycleHooks ],
    methods: {
        setInitValue() {
            console.log("ERROR"); //
        }
    }
};
</script>

<style lang="scss" scoped>

    .l-error {
        padding: 110px 20px 20px;
        text-align: center;
    }

</style>
