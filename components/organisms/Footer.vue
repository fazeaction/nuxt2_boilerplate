<!--
    components/organisms/Footer.vue
-->

<template>
    <footer class="o-footer">
        <div class="flexGrid _horizontal">
            <div class="flexGrid__cell _3 _alignLeft">
                <p>Burundanga Studio.<br>MIT License.</p>
            </div>
            <div class="flexGrid__cell _3 _alignCenter">
                <p v-text="$t('o-footer:visited-pages') + counter" />
                <a @click="resetCounter" v-text="$t('o-footer:clear-history')" />
            </div>
            <div class="flexGrid__cell _3 _alignRight _end">
                <ul>
                    <li v-for="(lang, i) in langs" :key="i">
                        <a :href="`${ baseUrl }/${ lang }`" v-text="lang" />
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>

    import { mapState, mapMutations } from "vuex";

    export default {
        name: "Footer",
        computed: {
            ...mapState({
                langs: state => state.lang.locales,
                counter: state => state.counter
            })
        },
        data() {
            return {
                baseUrl: process.env.baseUrl
            }
        },
        watch: {
            $route() {
                this.incrementCounter();
            }
        },
        methods: {
            ...mapMutations({
                incrementCounter: "increment",
                resetCounter: "reset"
            })
        }
    }

</script>

<style lang="scss" scoped>

    .o-footer {
        padding: 20px 20px 50px;
        border-top: 1px solid $lightGrey;
        width: 100vw;
        p, a {
            font-size: 12px;
        }
        a {
            cursor: pointer;
            text-transform: uppercase;
        }
    }

</style>
