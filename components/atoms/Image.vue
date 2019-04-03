 <!--
    components/atoms/Image.vue
-->

<template>
    <div class="a-image" :class="{ cover }">
        <img ref="img" v-if="!svg" :src="src" :alt="$t( image.alt )" />
        <object v-else type="image/svg+xml" :data="image.src" :aria-label="$t( image.alt )" :alt="$t( image.alt )" />
        <p class="label" v-html="`<strong>src</strong>: ${ src }`" />
    </div>
</template>

<script>

    import { mapState, mapMutations } from "vuex";
    import { getPathOf, cleanPath, getCoverSizeFrom, loadAsset } from "~/assets/js/utils";
    import LifecycleHooks from "~/mixins/LifecycleHooks";

    export default {
        name: "ImageBase",
        mixins: [ LifecycleHooks ],
        computed: {
            ...mapState({
                images: state => state.content.images,
                sufix: state => state.device.assetSufix,
                resize: state => state.device.resize,
                loadedImages: state => state.images.loaded
            })
        },
        props: {
            data: {
                type: String,
                default: () => {
                    return "placeholder-image"
                }
            },
            cover: {
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        data() {
            return {
                src: "",
                path: "",
                loaded: false,
                size: { w: 0, h: 0 },
                elBounding: undefined,
                svg: false,
                si: undefined
            }
        },
        watch: {
            data() {
                this.setInitValue();
                this.init();
            },
            sufix() {
                if ( this.svg ) return;
                this.load( getPathOf( this.image.src, this.sufix ));
            },
            resize() {
                this.setSize();
            }
        },
        methods: {
            setInitValue() {
                this.image = this.images[ this.data ];
                this.svg = this.image.src.includes('svg');
            },
            init() {
                this.load( this.svg ? this.image.src : getPathOf( this.image.src, this.sufix ));
                this.setSize();
            },
            async load( path ) {
                if (!this.loadedImages[ cleanPath(path) ]) {
                    const img = await loadAsset(path);
                    this.pushImage({ key: cleanPath(path), image: img });
                    this.src = path;
                } else {
                    this.src = this.loadedImages[ cleanPath(path) ].src
                }
                this.$nextTick( this.imageLoaded );
            },
            async imageLoaded() {
                this.setSize();
                await this.$nextTick();
                if (!this.loaded) this.$emit("image-loaded");
                this.loaded = true;
            },
            isLoaded() {
                return loaded;
            },
            isPortrait() {
                return this.image.size[this.sufix].h >= this.image.size[this.sufix].w;
            },
            getBounding() {
                return this.elBounding;
            },
            setSize() {
                const imageSize = this.image.size[ this.sufix ];
                this.elBounding = this.$el.getBoundingClientRect();
                if ( this.cover ) {
                    const maxWidth = this.elBounding.width;
                    const maxHeight = this.elBounding.height;
                    this.size = getCoverSizeFrom( imageSize.w, imageSize.h, 0, maxWidth, maxHeight );
                } else {
                    this.size.w = this.elBounding.width;
                    this.size.h = this.size.w * imageSize.h / imageSize.w;
                }
                this.size.w = Math.ceil( this.size.w );
                this.size.h = Math.ceil( this.size.h );
                this.$refs.img.style.width = `${ this.size.w }px`;
                this.$refs.img.style.height = `${ this.size.h }px`;
            },
            ...mapMutations({
                pushImage: "images/pushImage"
            })
        }
    }
</script>

<style lang="scss" scoped>

    .a-image {
        position: relative;
        width: 100%;
        font-size: 0;
        &.cover {
            height: 100%;
            overflow: hidden;
            img {
                position: absolute;
                @include centerXY();
            }
        }
        img, object {
            border: 1px solid $lightGrey;
            width: 100%;
            display: block;
            margin: 0;
            padding: 0;
        }
        .label {
            margin: 20px auto;
            font-size: 13px;
            text-align: center;
        }
    }
</style>
