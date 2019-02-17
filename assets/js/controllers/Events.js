//
// utils/controllers/Events.js

import EventDispatcher from "~/assets/js/core/EventDispatcher.js";

export let TRANSITION_ENTER = "transition_enter";
export let TRANSITION_ENTER_DONE = "transition_enter_done";
export let TRANSITION_LEAVE = "transition_leave";
export let TRANSITION_LEAVE_DONE = "transition_leave_done";

class DefaultEvents extends EventDispatcher {
    constructor() {
        super();
    }
}

const _Events = new DefaultEvents();
export const Events = _Events;
