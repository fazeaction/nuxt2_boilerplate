<!--
    components/atoms/Button.vue
-->

<template>
    <nuxt-link class="a-button" :to="data.route" v-text="$t( data.label )" />
</template>

<script>

export default {
    name: "Button",
    props: {
        data: {
            type: Object,
            default: ()=>data // eslint-disable-line
        }
    }
};

</script>

<style lang="scss" scoped>

    .a-button {
        background: none;
        @include respond-to("mobile-landscape") {
            font-size: 12px;
        }
    }

</style>
