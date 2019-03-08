//
// utils/controllers/Scroll.js

import vs from "virtual-scroll"
import event from "dom-events"
import { detect } from "detect-browser";

class Scroll {

    constructor(opt = {}) {

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
        }

        this.vs = new vs({
            limitInertia: this.options.vs && this.options.vs.limitInertia || false,
            mouseMultiplier: this.options.vs && this.options.vs.mouseMultiplier || 1,
            touchMultiplier: this.options.vs && this.options.vs.touchMultiplier || 1.5,
            firefoxMultiplier: this.options.vs && this.options.vs.firefoxMultiplier || 30,
            preventTouch: this.options.vs && this.options.vs.preventTouch || true
        })

        this.dom = {
            section: this.options.section,
            children: []
        }
    }

    createBound() {
        ["run", "calc", "resize", "scrollTo"]
        .forEach((fn) => this[fn] = this[fn].bind(this));
    }

    init() {
        this.addEvents()
        this.resize()
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

        if ( this.isNotUpdated() ) return;
        
        this.vars.direction = this.vars.scrollOffsetPosition > this.vars.prevOffsetPosition ? 1 : -1;

        console.log( this.vars.current );

        this.vs._emitter.emit( "direction", this.vars.direction );
        this.vs._emitter.emit( "scrolling", this.vars.scrollPosition.toFixed(4) );
        this.vs._emitter.emit( "scrollingOffset", this.vars.scrollOffsetPosition );
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

    isNotUpdated() {
        return (this.vars.scrollPosition).toFixed(4) === (this.vars.prevPosition).toFixed(4) && (this.vars.prevOffsetPosition).toFixed(4) === (this.vars.scrollOffsetPosition).toFixed(4)
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
        if ( !anim ) {
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
        this.resize();
    }

    vertical() {
        this.vars.vertical = true;
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
                return 2;
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

    addEvents() {
        this.on()
        event.on(window, "resize", this.resize)
    }

    removeEvents() {
        this.off()
        event.off(window, "resize", this.resize)
    }

    resize( e ) {
        this.vars.height = window.innerHeight;
        this.vars.width = window.innerWidth;
        !this.vars.native && this.clampTarget();
        e && e.type == "resize" && this.scrollTo(0);
        this.updateChildrenPos();
        const bounding = this.dom.section.getBoundingClientRect();
        this.vars.bounding = this.vars.vertical ? bounding.height - this.vars.height : bounding.width - this.vars.width;
        console.log(this.vars.bounding, this.dom)
        this.vs._emitter.emit("size", { w: bounding.width + this.vars.offset, h: bounding.height + this.vars.offset });
    }

    destroy() {
        this.vars.current = 0
        this.vs && (this.vs.destroy(), this.vs = null)
        this.removeEvents()
    }

}

window.Scroll = Scroll;
