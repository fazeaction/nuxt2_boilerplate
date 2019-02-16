//
//  components/types/mixins/Transition.js

import { TweenLite } from "gsap";

export default {
    transition: {

        css: false,
        appear: true,
        mode: "out-in",
        routeName: "",

        beforeLeave(el) {},
        leave(el, done) {

            this.routeName !== this.$route.name
                ? TweenLite.to(el, 0.25, { opacity: 0, onComplete: done })
                : done();
        },
        leaveCancelled(el) { TweenLite.killTweensOf(el); },
        afterLeave(el) {},

        beforeEnter(el) {
            this.routeName = this.$route.name
            TweenLite.set(el, { opacity: 0, willChange: "opacity" })
        },
        enter(el, done) {

            TweenLite.to(el, 1, { opacity: 1, onComplete: done })
        },
        enterCancelled(el) { TweenLite.killTweensOf(el); },
        afterEnter(el) {}

    }
}
