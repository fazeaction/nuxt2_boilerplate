require("dotenv").config({
    path: "./config/env/" + process.env.ENV_FILE
});

const Config = require("." + process.env.CONFIG);
const Manifest = require("." + process.env.MANIFEST);

const routes = [];
Manifest.langs.forEach((lang)=>{
    Manifest.routes.forEach((route)=>{
        routes.push(`/${lang}/${route}`);
    });
});

export default {

    env: {
        preview: process.env.SPA,
        generate: process.env.GENERATE,
        baseTitle: Manifest.head.baseTitle,
        baseUrl: process.env.PROTOCOL + process.env.SUBDOMAIN + process.env.DOMAIN + process.env.SUBFOLDER,
        CONFIG: process.env.CONFIG,
        MANIFEST: process.env.MANIFEST
    },

    server: {
        host: "0.0.0.0"
    },

    router: {
        base: process.env.BASE
    },

    plugins: Config.plugins,

    modules: [
        "@nuxtjs/pwa",
        "@nuxtjs/axios",
        "@nuxtjs/style-resources",
        "~/modules/Routes.js"
    ],

    styleResources: {
        scss: [
            "assets/css/_abs.scss"
        ]
    },

    css: ["@/assets/css/style.scss"],

    loading: false,

    head: {
        script: [
            {src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/102/three.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.4.4/lottie.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenLite.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/plugins/CSSPlugin.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.2/plugins/RoundPropsPlugin.min.js"}
        ]
    },

    build: {
        analyze: false,
        uglify: {
            uglifyOptions: {
                compress: {
                    drop_console: process.env.NODE_ENV === "prod"
                }
            }
        },
        postcss: [
            require("autoprefixer")({
                browsers: ["last 2 versions", "ie >= 9", "Safari 8"]
            })
        ],
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: "pre",
                    test: /\.(js|vue)$/,
                    loader: "eslint-loader",
                    exclude: /(node_modules)/
                });
            }
        }
    },

    generate: {
        dir: process.env.DIR,
        routes: routes,
        fallback: true
    }
};
