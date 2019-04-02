//
// utils/controllers/Scroll.js

import vs from "virtual-scroll"
import event from "dom-events"
import { detect } from "detect-browser";

class Scroll {

    constructor( opt = {} ) {

        this.createBound();
        this.options = opt;
        this.rAF = undefined;
        this.isRAFCanceled = false;
        this.disabled = true;

        this.browser = detect();

        this.vars = {
            vertical: true,
            ease: this.options.ease || 0.075,
            current: 0,
            currentOffset: 0,
            target: 0,
            normalize: this.getNormalized(),
            height: window.innerHeight,
            width: window.innerWidth,
            bounding: 0,
            ticking: false,
            offset: 0,
            scrollPosition: 0,
            scrollOffsetPosition: 0,
            prevPosition: 0,
            prevOffsetPosition:0,
            direction: 1,
            skew: this.options.skew || false,
            decimals: 3,
            size: { w: 0, h: 0 }
        }

        this.vs = new vs({
            limitInertia: this.options.vs && this.options.vs.limitInertia || false,
            mouseMultiplier: this.options.vs && this.options.vs.mouseMultiplier || 1,
            touchMultiplier: this.options.vs && this.options.vs.touchMultiplier || 1.5,
            firefoxMultiplier: this.options.vs && this.options.vs.firefoxMultiplier || 30,
            preventTouch: this.browser.os != "Android OS"
        })

        this.dom = {
            section: this.options.section,
            children: []
        }

        this.gestures = {
            pageX: 0,
            initPointX: 0,
            velPointX: 0,
            distance: 0,
            screenNormalizedDistance: 0,
            pageNormalizedDistance: 0,
            direction: 0,
            duration: 0,
            swipeDuration: 115,
            lastLoopValue: 0,
            loopInterval: 100,
            loop: undefined
        }

    }

    init() {
        this.addEvents();
        this.resize();
    }

    run() {

        this.requestAnimationFrame();

        if ( this.disabled ) {
            this.vars.target = this.vars.current;
            return;
        }

        const target = Math.max( 0, this.vars.target - this.vars.offset );
        const targetOffset = this.vars.target;

        this.vars.current += ( target - this.vars.current ) * this.vars.ease;
        this.vars.current < .1 && ( this.vars.current = 0 );
        this.vars.currentOffset += ( targetOffset - this.vars.currentOffset ) * this.vars.ease;
        this.vars.currentOffset < .1 && ( this.vars.currentOffset = 0 );

        this.vars.elasticity = ( target - this.vars.current ) || 0;
        this.vars.elasticityOffset = ( targetOffset - this.vars.currentOffset ) || 0;

        this.vars.scrollPosition = this.vars.current;
        this.vars.scrollOffsetPosition = this.vars.currentOffset;

        if ( this.isNotScrolling() ) {
            this.onTop() && this.vs._emitter.emit( "scrollOnTop" );
            this.onBottom() && this.vs._emitter.emit( "scrollOnBottom" );
            return;
        }
        else if ( this.vars.scrollOffsetPosition > this.vars.prevOffsetPosition ) this.vars.direction = 1;
        else this.vars.direction = -1;

        this.vs._emitter.emit( "direction", this.vars.direction );
        this.vs._emitter.emit( "scrolling", parseFloat(( this.vars.scrollPosition ).toFixed(this.vars.decimals)) );
        this.vs._emitter.emit( "scrollingOffset", parseFloat(( this.vars.scrollOffsetPosition ).toFixed(this.vars.decimals)) );
        this.vs._emitter.emit( "elasticity", this.vars.elasticity );

        const _current = -this.vars.scrollPosition;
        const _currentOffset = -this.vars.scrollOffsetPosition;

        for ( let child of this.dom.children ) {
            if ( child.inView ) {
                child.el.dataset.visible = true;
                const point = child.offset ? _currentOffset : _current;
                const transform = child.transform ? this.getTransformOf( child ) : 0;
                const target = ( point + ( point * child.parallax / 100 ) - transform );
                const cy = this.isVerticalScroll( child ) ? target : 0;
                const cx = this.isHorizontalScroll( child ) ? target : 0;
                const maxSkew = 7.5;
                const skew = !this.vars.skew ? 0 : this.isVerticalScroll( child ) && !child.el.dataset.blockSkew ? Math.max( -maxSkew, Math.min( maxSkew, (child.offset ? this.vars.elasticityOffset : this.vars.elasticity) * .02 * (child.el.dataset.maxSkew || 1) )) : 0;
                if ( child.isImg ) {
                    child.dataset.s = - Math.ceil( this.vars.vertical ? cy : cx );
                    child.dataset.t = transform;
                }
                for ( let img of child.imgs ) {
                    img.dataset.s = - Math.ceil( this.vars.vertical ? cy : cx );
                    img.dataset.t = transform;
                }
                child.el.style.transform = `translate3d(${cx}px,${cy}px,0) skew(${skew}deg, ${skew}deg)`;
            } else {
                child.el.dataset.visible = false;
            }
            child.inView = this.childInView(child);
        }
        this.vars.prevPosition = this.vars.scrollPosition;
        this.vars.prevOffsetPosition = this.vars.scrollOffsetPosition;
    }

    isNotScrolling() {
        return (this.vars.scrollPosition).toFixed(this.vars.decimals) === (this.vars.prevPosition).toFixed(this.vars.decimals) && (this.vars.prevOffsetPosition).toFixed(this.vars.decimals) === (this.vars.scrollOffsetPosition).toFixed(this.vars.decimals);
    }

    onBottom() {
        return Math.ceil(this.vars.target) >= Math.floor( this.vars.bounding + this.vars.offset );
    }

    onTop() {
        return this.vars.target == 0;
    }

    isVerticalScroll( child ) {
        return ( this.vars.vertical && !child.opposite ) || ( !this.vars.vertical && child.opposite )
    }

    isHorizontalScroll ( child ) {
        return ( !this.vars.vertical && !child.opposite ) || ( this.vars.vertical && child.opposite )
    }

    calc(e) {
        const delta = e.deltaY;
        this.vars.target += delta * -1 * this.vars.normalize;
        this.clampTarget()
    }

    scrollTo(val, anim = false) {
        if (!anim) {
            this.vars.current = val;
            this.vars.currentOffset = val;
            this.vs._emitter.emit("scrolling", val);
            this.vs._emitter.emit("scrollingOffset", val);
        }
        this.vars.target = val;
        this.vars.targetOffset = val;
    }

    clampTarget() {
        this.vars.target = Math.round(Math.max(0, Math.min(this.vars.target, this.vars.bounding + this.vars.offset)))
    }

    childInView(child) {
        const initPos = Math.ceil(this.vars.vertical || child.opposite ? child.bounding.top : child.bounding.left);
        const lastPos = Math.ceil(this.vars.vertical || child.opposite ? initPos + child.bounding.height : initPos + child.bounding.width) + (child.transform * child.bounding.height);
        const windowSize = this.vars.vertical || child.opposite ? this.vars.height : this.vars.width;
        const scrollPoint = child.offset ? this.vars.scrollOffsetPosition : this.vars.scrollPosition
        return scrollPoint + windowSize + 100 > initPos && scrollPoint - 100 < lastPos;
    }

    getTransformOf(child) {
        const c = child.el ? child.el : child;
        const bounding = child.el ? child.bounding : c.getBoundingClientRect();
        const transform = c.dataset.transform * bounding.height;
        const scrollPos = this.vars.scrollPosition;
        const windowPos = (this.vars.vertical || child.opposite ? this.vars.height : this.vars.width);
        const initPos = Math.ceil(this.vars.vertical || child.opposite ? bounding.top : bounding.left);
        const lastPos = Math.ceil(this.vars.vertical || child.opposite ? initPos + bounding.height : initPos + bounding.width) + (child.transform * bounding.height);
        const scrollDist = lastPos - initPos;
        const startingPos = (windowPos - initPos)/scrollDist;
        const p = Math.min(1, ((scrollPos + windowPos - initPos)/scrollDist) - startingPos);
        return Math.ceil( transform * (1 - p) );
    }

    horizontal() {
        this.vars.vertical = false;
        this.vs._emitter.emit("vertical", this.vars.vertical);
        this.resize();
    }

    vertical() {
        this.vars.vertical = true;
        this.vs._emitter.emit("vertical", this.vars.vertical);
        this.resize();
    }

    getChildren() {
        this.dom.children = [];
        const children = this.dom.section.querySelectorAll("._s");
        for (let child of children) {
            const isImg = child.tagName === "IMG"
            const imgs = Array.from(child.querySelectorAll("img"));
            if (!this.vars.vertical && child.tagName === "FOOTER") return;
            this.dom.children.push({
                el: child,
                isImg,
                bounding: child.getBoundingClientRect(),
                parallax: child.dataset.parallax || 0,
                transform: child.dataset.transform || false,
                opposite: child.dataset.opposite || false,
                offset: child.dataset.offset || false,
                imgs,
                inView: false
            });
        }
    }

    updateChildrenPos() {
        for (let child of this.dom.children) {
            child.el.style.transform = `translate3d(0px,0px,0)`;
            for ( let img of child.imgs ) img.dataset.s = 0;
            if ( child.isImg ) child.dataset.s = 0;
            child.parallax = child.el.dataset.parallax || 0;
            child.transform = child.el.dataset.transform || false;
            child.bounding = child.el.getBoundingClientRect();
            child.inView = this.childInView( child );
            if (child.transform) {
                const cx = this.vars.vertical || child.opposite ? 0 : -this.getTransformOf( child );
                const cy = this.vars.vertical || child.opposite ? -this.getTransformOf( child ) : 0;
                if ( child.isImg ) child.dataset.s = - Math.ceil(this.vars.vertical || child.opposite ? cy : cx);
                for ( let img of child.imgs ) {
                    img.dataset.s = img.dataset.t = - Math.ceil(this.vars.vertical || child.opposite ? cy : cx);
                }
                child.el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
            }
        }
    }

    reset() {
        this.resize();
    }

    enableScroll() {
        this.disabled = false;
        this.getChildren();
        this.resize();
    }

    disableScroll() {
        this.disabled = true
    }

    setOffset( num ) {
        this.vars.offset = num;
    }

    on(requestAnimationFrame = true) {
        if (this.isRAFCanceled) {
            this.isRAFCanceled = false
        }
        this.vs && this.vs.on(this.calc)
        requestAnimationFrame && this.requestAnimationFrame()
    }

    off(cancelAnimationFrame = true) {
        this.vs && this.vs.off(this.calc)
        cancelAnimationFrame && this.cancelAnimationFrame()
    }

    getNormalized() {
        switch ( this.browser.name ) {
            case "chrome":
                if ( this.browser.os == "Android OS" ) return 1
                return .5;
            case "safari":
                return .75;
            case "ios":
                return 2.25;
            default:
                return 1;
        }
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.run)
    }

    cancelAnimationFrame() {
        this.isRAFCanceled = true
        cancelAnimationFrame(this.rAF)
    }

    resize( e ) {
        this.vars.height = window.innerHeight;
        this.vars.width = window.innerWidth;
        !this.vars.native && this.clampTarget();
        e && e.type == "resize" && this.scrollTo(0);
        this.updateChildrenPos();
        const bounding = this.dom.section.getBoundingClientRect();
        this.vars.bounding = this.vars.vertical ? bounding.height - this.vars.height : bounding.width - this.vars.width;
        this.vars.size = { w: Math.floor(bounding.width + this.vars.offset), h: Math.floor(bounding.height + this.vars.offset) };
        this.vs._emitter.emit( "size", this.vars.size );
    }

    createBound() {
        ["run", "calc", "resize", "scrollTo"]
        .forEach((fn) => this[fn] = this[fn].bind(this));
    }

    addEvents() {
        this.on();
        event.on(window, "resize", this.resize);
        this.onTouchMoveHandler = this.onTouchMove.bind( this );
        this.onTouchStartHandler = this.onTouchStart.bind( this );
        this.onTouchEndHandler = this.onTouchEnd.bind( this );

        window.addEventListener("touchmove", this.onTouchMoveHandler, { passive: false });
        window.addEventListener("touchstart", this.onTouchStartHandler, { passive: true });
        window.addEventListener("touchend", this.onTouchEndHandler, { passive: true });
    }

    removeEvents() {
        this.off();
        event.off(window, "resize", this.resize);
        window.removeEventListener("touchmove", this.onTouchMoveHandler);
        window.removeEventListener("touchstart", this.onTouchStartHandler);
        window.removeEventListener("touchend", this.onTouchEndHandler);
    }

    onTouchStart( e ) {
        this.browser.os != "Android OS" && e.preventDefault();
        if ( e.touches.length > 1 || this.disabled ) return;
        this.checkTouchVelocity();
        this.gestures.duration = Date.now();
        this.gestures.initPointX = e.touches[0].pageX;
    }

    onTouchMove( e ) {
        e.preventDefault();
        e.stopPropagation();
        if ( e.touches.length > 1 || this.disabled ) return;
        const pageX = e.touches[0].pageX;
        const newDirection = this.gestures.pageX < pageX ? 1 : -1;
        const directionChanged = newDirection !== this.gestures.direction;
        this.gestures.initPointX = directionChanged ? pageX : this.gestures.initPointX;
        this.gestures.direction = newDirection;
        this.gestures.pageX = pageX;
        this.gestures.distance = Math.abs( this.gestures.initPointX - this.gestures.pageX );
        this.gestures.screenNormalizedDistance = ( this.gestures.distance / this.vars.width );
        this.gestures.pageNormalizedDistance = ( this.gestures.distance / this.vars.bounding );
    }

    onTouchEnd( e ) {
        this.browser.os != "Android OS" && e.preventDefault();
        clearTimeout( this.gestures.loop );
        if ( e.touches.length > 1 || this.disabled ) return;
        const swipe = Math.abs( this.gestures.duration - Date.now() ) < this.gestures.swipeDuration;
    }

    checkTouchVelocity() {
        this.gestures.velPointX = Math.abs( this.gestures.lastLoopValue - this.gestures.pageX ) / this.gestures.loopInterval;
        this.gestures.lastLoopValue = this.gestures.pageX;
        this.gestures.loop = setTimeout( this.checkTouchVelocity.bind(this), this.gestures.loopInterval );
    }

    destroy() {
        this.vars.current = 0
        this.vs && (this.vs.destroy(), this.vs = null)
        this.removeEvents()
    }

}

window.Scroll = Scroll;
