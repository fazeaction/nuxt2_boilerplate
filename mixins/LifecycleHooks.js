//
//  components/types/mixins/LifecycleHooks.js

export default {
    created() {
        this.setInitValue();
    },
    mounted() {
        this.init();
        this.addListeners();
    },
    methods: {
        setInitValue() {},
        init() {},
        addListeners() {},
        removeListeners()  {}
    },
    beforeDestroy() {
        this.removeListeners();
    }
};
