<!--
    components/atoms/Section.vue
-->

<template>
    <div class="a-section">
        <p v-text="n" />
    </div>
</template>

<script>

    export default {
        name: "Section",
        props: {
            n: String
        }
    }

</script>

<style lang="scss" scoped>

    .a-section {
        position: relative;
        display: block;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 25vh;
        border: 1px solid $lightGrey;
        p {
            position: absolute;
            @include centerXY();
        }
    }

</style>


