<!--
    pages/_lang/_page.vue
-->

<template>
    <div class="p-page">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="$route.params" />
        <organism-footer ref="footer" class="_s" />
    </div>
</template>

<script>

import {mapState, mapMutations} from "vuex";

import {Events, TRANSITION_ENTER_DONE} from "~/assets/js/controllers/Events";

import Head from "~/mixins/Head";
import LifecycleHooks from "~/mixins/LifecycleHooks";
import Transitions from "~/mixins/Transitions";

import OrganismFooter from "~/components/organisms/Footer";

export default {
    name: "Page",
    components: {
        OrganismFooter
    },
    mixins: [ Head, LifecycleHooks, Transitions ],
    computed: {
        ...mapState({
            vertical: state=>state.scroll.verticalScroll
        })
    },
    validate({params, store}) {
        return store.state.content.pages[ params.page ] !== undefined;
    },
    asyncData({params, store}) {
        return {
            head: store.state.content.pages[ params.page ].head
        };
    },
    methods: {
        enter() {
            this.setScrollDirection(this.vertical);
            this.setScrollActive(true);
        },
        addListeners() {
            this.enterHandler = this.enter.bind(this);
            Events.addEventListener(TRANSITION_ENTER_DONE, this.enterHandler);
        },
        removeListeners() {
            Events.removeEventListener(TRANSITION_ENTER_DONE, this.enterHandler);
        },
        ...mapMutations({
            setScrollActive: "scroll/setActive",
            setScrollDirection: "scroll/setScrollDirection"
        })
    }
};

</script>

<style lang="scss" scoped>

    .p-page {
        width: 100vw;
        padding: $menuHeight 20px 20px;
        p {
            padding: 20px 0 0;
        }
    }

</style>
