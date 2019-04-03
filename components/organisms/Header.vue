<!--
    components/organisms/Header.vue
-->

<template>
    <header class="o-header">
        <div class="flexGrid _horizontal">
            <div class="flexGrid__cell _2 _alignLeft">
                <nuxt-link :to="{ name: `lang` }">
                    <atom-logo />
                </nuxt-link>
            </div>
            <div class="flexGrid__cell _2 _alignRight _end">
                <molecule-list :data="data.nav" />
            </div>
        </div>
    </header>
</template>

<script>

    import { mapState } from "vuex";

    import AtomLogo from "~/components/atoms/Logo";
    import MoleculeList from "~/components/molecules/List";

    export default {
        name: "Header",
        computed: {
            ...mapState({
                data: state => state.content.header,
                breakpoint: state => state.device.breakpoint
            })
        },
        watch: {
            breakpoint() {
                console.log(`Breakpoint header listener! New breakpoint :: ${this.breakpoint}`);
            }
        },
        components: {
            AtomLogo,
            MoleculeList
        }
    }

</script>

<style lang="scss" scoped>

    .o-header {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 10;
        border-bottom: 1px solid;
        border-color: lime;
        background: white;
        padding: 20px;
        height: $menuHeight;

        @include respond-to("mobile-landscape") {
            border-color: $lightGrey;
        }

        @include respond-to("tablet-portrait") {
            border-color: lime;
        }

        @include respond-to("desktop") {
            border-color: $lightGrey;
        }

        @include respond-to("desktop-medium") {
            border-color: lime;
        }

        @include respond-to("desktop-large") {
            border-color: $lightGrey;
        }

        .m-list {
            margin-top: 5px;
        }

        .a-logo {
            width: 45px;
        }

        p {
            font-size: 10px;
        }
    }

</style>
