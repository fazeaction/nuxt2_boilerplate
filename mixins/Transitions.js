//
//  components/types/mixins/Transition.js

import {
    Events,
    TRANSITION_ENTER,
    TRANSITION_ENTER_DONE,
    TRANSITION_LEAVE,
    TRANSITION_LEAVE_DONE
} from "~/assets/js/controllers/Events";

export default {
    transition: {
        css: false,
        mode: "out-in",
        appear: true,
        beforeLeave() {
            Events.dispatchEvent( TRANSITION_LEAVE );
        },
        leave(el, done) {
            TweenLite.to(
                el,
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
        beforeEnter( el ) {
            TweenLite.set( el, { opacity: 0 });
            Events.dispatchEvent( TRANSITION_ENTER );
        },
        enter(el, done) {
            TweenLite.to(
                el,
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
        }
    }
}
