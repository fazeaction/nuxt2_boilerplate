<!--
    pages/_lang/contact.vue
-->

<template>
    <div class="p-contact">
        <p v-text="$t( head.title )" />
        <organism-footer class="_s" ref="footer" />
    </div>
</template>

<script>

    import { mapState, mapMutations } from "vuex";

    import { Events, TRANSITION_ENTER_DONE } from "~/assets/js/controllers/Events";

    import Head from "~/mixins/Head";
    import LifecycleHooks from "~/mixins/LifecycleHooks";
    import Transitions from "~/mixins/Transitions";

    import OrganismFooter from "~/components/organisms/Footer";

    export default {
        name: "contact",
        mixins: [ Head, LifecycleHooks, Transitions ],
        computed: {
            ...mapState({
                head: state => state.content.pages.contact.head,
                vertical: state => state.scroll.verticalScroll
            })
        },
        methods: {
            enter() {
                this.setScrollDirection( this.vertical );
                this.setScrollActive( true );
            },
            addListeners() {
                this.enterHandler = this.enter.bind( this );
                Events.addEventListener( TRANSITION_ENTER_DONE, this.enterHandler );
            },
            removeListeners() {
                Events.removeEventListener( TRANSITION_ENTER_DONE, this.enterHandler );
            },
            ...mapMutations({
                setScrollActive: "scroll/setActive",
                setScrollDirection: "scroll/setScrollDirection"
            })
        },
        components: {
            OrganismFooter
        }
    }

</script>

<style lang="scss" scoped>

    .p-contact {
        width: 100vw;
        padding: $menuHeight 20px 20px;
        p {
            padding: 20px 0 0;
        }
    }

</style>
