<!--
    components/atoms/Logo.vue
-->

<template>
    <img class="a-logo" src="img/logo.jpg" :alt="$t('o-header:assets:logo:alt')" />
</template>

<script>

    export default {
        name: "Logo"
    }

</script>

<style lang="scss" scoped>

    .a-logo {
        display: block;
        margin: 0;
        padding: 0;
    }

</style>


