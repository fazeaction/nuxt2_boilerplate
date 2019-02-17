<!--
    components/molecule/List.vue
-->

<template>
    <ul class="m-list">
        <li v-for="(button, i) in data" :key="i" class="item">
            <atom-button :data="button" class="button" />
        </li>
    </ul>
</template>

<script>

    import AtomButton from "~/components/atoms/Button";

    export default {
        name: "List",
        props: {
            data: {
                type: Array,
                default: () => []
            }
        },
        components: {
            AtomButton
        }
    }

</script>

<style lang="scss" scoped>

    .m-list {
        .item {
            display: inline-block;
            padding: 0 10px 0 0;
            &:last-child {
                padding: 0;
            }
            @include respond-to("mobile-landscape") {
                padding: 0 5px 0 0;
            }
        }
    }

</style>
