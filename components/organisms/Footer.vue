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
                        <a :href="`${ baseUrl }/${ lang + pathUrl }`" v-text="lang" />
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>

    import { mapState, mapMutations } from "vuex";

    import { Events, TRANSITION_LEAVE, TRANSITION_ENTER_DONE } from "~/assets/js/controllers/Events";

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
                baseUrl: process.env.baseUrl,
                pathUrl: ""
            }
        },
        watch: {
            $route: {
                handler: function() {
                    this.pathUrl = "";
                    const parts = this.$route.path.split("/");
                    for ( let i = 2; i < parts.length; i++ ) this.pathUrl += `/${ parts[ i] }`;
                },
                immediate: true
            }
        },
        methods: {
            enter() {
                TweenLite.to(
                    this.$el,
                    .5,
                    {
                        opacity: 1,
                        ease: Power3.easeOut,
                        onComplete: () => {
                            done();
                            Events.dispatchEvent( TRANSITION_ENTER_DONE );
                        }
                    }
                )
            },
            leave() {
                TweenLite.to(
                    this.$el,
                    .25,
                    {
                        opacity: 0,
                        ease: Power3.easeOut,
                        onComplete: () => {
                            done();
                            Events.dispatchEvent( TRANSITION_LEAVE_DONE );
                        }
                    }
                )
            },
            addListeners() {
                this.enterHandler = this.enter.bind( this );
                this.leaveHandler = this.leave.bind( this );
                Events.addEventListener( TRANSITION_LEAVE, this.leaveHandler );
                Events.addEventListener( TRANSITION_ENTER_DONE, this.enterHandler );
            },
            removeListeners() {
                Events.removeEventListener( TRANSITION_LEAVE, this.leaveHandler );
                Events.removeEventListener( TRANSITION_ENTER_DONE, this.enterHandler );
            },
            ...mapMutations({
                resetCounter: "reset"
            })
        }
    }

</script>

<style lang="scss" scoped>

    .o-footer {
        margin: 20px 0 0;
        padding: 20px 0;
        border-top: 1px solid $lightGrey;
        width: 100%;
        p, a {
            font-size: 12px;
        }
        a {
            cursor: pointer;
            text-transform: uppercase;
        }
    }

</style>
