/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
(function (e) {
    (e.flexslider = function (t, n) {
        var r = e(t);
        r.vars = e.extend({}, e.flexslider.defaults, n);
        var i = r.vars.namespace,
            s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
            o = ("ontouchstart" in window || s || (window.DocumentTouch && document instanceof DocumentTouch)) && r.vars.touch,
            u = "click touchend MSPointerUp",
            a = "",
            f,
            l = r.vars.direction === "vertical",
            c = r.vars.reverse,
            h = r.vars.itemWidth > 0,
            p = r.vars.animation === "fade",
            d = r.vars.asNavFor !== "",
            v = {},
            m = !0;
        e.data(t, "flexslider", r),
            (v = {
                init: function () {
                    (r.animating = !1),
                        (r.currentSlide = parseInt(r.vars.startAt ? r.vars.startAt : 0, 10)),
                        isNaN(r.currentSlide) && (r.currentSlide = 0),
                        (r.animatingTo = r.currentSlide),
                        (r.atEnd = r.currentSlide === 0 || r.currentSlide === r.last),
                        (r.containerSelector = r.vars.selector.substr(0, r.vars.selector.search(" "))),
                        (r.slides = e(r.vars.selector, r)),
                        (r.container = e(r.containerSelector, r)),
                        (r.count = r.slides.length),
                        (r.syncExists = e(r.vars.sync).length > 0),
                        r.vars.animation === "slide" && (r.vars.animation = "swing"),
                        (r.prop = l ? "top" : "marginLeft"),
                        (r.args = {}),
                        (r.manualPause = !1),
                        (r.stopped = !1),
                        (r.started = !1),
                        (r.startTimeout = null),
                        (r.transitions =
                            !r.vars.video &&
                            !p &&
                            r.vars.useCSS &&
                            (function () {
                                var e = document.createElement("div"),
                                    t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                                for (var n in t) if (e.style[t[n]] !== undefined) return (r.pfx = t[n].replace("Perspective", "").toLowerCase()), (r.prop = "-" + r.pfx + "-transform"), !0;
                                return !1;
                            })()),
                        r.vars.controlsContainer !== "" && (r.controlsContainer = e(r.vars.controlsContainer).length > 0 && e(r.vars.controlsContainer)),
                        r.vars.manualControls !== "" && (r.manualControls = e(r.vars.manualControls).length > 0 && e(r.vars.manualControls)),
                        r.vars.randomize &&
                            (r.slides.sort(function () {
                                return Math.round(Math.random()) - 0.5;
                            }),
                            r.container.empty().append(r.slides)),
                        r.doMath(),
                        r.setup("init"),
                        r.vars.controlNav && v.controlNav.setup(),
                        r.vars.directionNav && v.directionNav.setup(),
                        r.vars.keyboard &&
                            (e(r.containerSelector).length === 1 || r.vars.multipleKeyboard) &&
                            e(document).bind("keyup", function (e) {
                                var t = e.keyCode;
                                if (!r.animating && (t === 39 || t === 37)) {
                                    var n = t === 39 ? r.getTarget("next") : t === 37 ? r.getTarget("prev") : !1;
                                    r.flexAnimate(n, r.vars.pauseOnAction);
                                }
                            }),
                        r.vars.mousewheel &&
                            r.bind("mousewheel", function (e, t, n, i) {
                                e.preventDefault();
                                var s = t < 0 ? r.getTarget("next") : r.getTarget("prev");
                                r.flexAnimate(s, r.vars.pauseOnAction);
                            }),
                        r.vars.pausePlay && v.pausePlay.setup(),
                        r.vars.slideshow && r.vars.pauseInvisible && v.pauseInvisible.init();
                    if (r.vars.slideshow) {
                        r.vars.pauseOnHover &&
                            r.hover(
                                function () {
                                    !r.manualPlay && !r.manualPause && r.pause();
                                },
                                function () {
                                    !r.manualPause && !r.manualPlay && !r.stopped && r.play();
                                }
                            );
                        if (!r.vars.pauseInvisible || !v.pauseInvisible.isHidden()) r.vars.initDelay > 0 ? (r.startTimeout = setTimeout(r.play, r.vars.initDelay)) : r.play();
                    }
                    d && v.asNav.setup(),
                        o && r.vars.touch && v.touch(),
                        (!p || (p && r.vars.smoothHeight)) && e(window).bind("resize orientationchange focus", v.resize),
                        r.find("img").attr("draggable", "false"),
                        setTimeout(function () {
                            r.vars.start(r);
                        }, 200);
                },
                asNav: {
                    setup: function () {
                        (r.asNav = !0),
                            (r.animatingTo = Math.floor(r.currentSlide / r.move)),
                            (r.currentItem = r.currentSlide),
                            r.slides
                                .removeClass(i + "active-slide")
                                .eq(r.currentItem)
                                .addClass(i + "active-slide"),
                            s
                                ? ((t._slider = r),
                                  r.slides.each(function () {
                                      var t = this;
                                      (t._gesture = new MSGesture()),
                                          (t._gesture.target = t),
                                          t.addEventListener(
                                              "MSPointerDown",
                                              function (e) {
                                                  e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId);
                                              },
                                              !1
                                          ),
                                          t.addEventListener("MSGestureTap", function (t) {
                                              t.preventDefault();
                                              var n = e(this),
                                                  i = n.index();
                                              !e(r.vars.asNavFor).data("flexslider").animating && !n.hasClass("active") && ((r.direction = r.currentItem < i ? "next" : "prev"), r.flexAnimate(i, r.vars.pauseOnAction, !1, !0, !0));
                                          });
                                  }))
                                : r.slides.on(u, function (t) {
                                      t.preventDefault();
                                      var n = e(this),
                                          s = n.index(),
                                          o = n.offset().left - e(r).scrollLeft();
                                      o <= 0 && n.hasClass(i + "active-slide")
                                          ? r.flexAnimate(r.getTarget("prev"), !0)
                                          : !e(r.vars.asNavFor).data("flexslider").animating && !n.hasClass(i + "active-slide") && ((r.direction = r.currentItem < s ? "next" : "prev"), r.flexAnimate(s, r.vars.pauseOnAction, !1, !0, !0));
                                  });
                    },
                },
                controlNav: {
                    setup: function () {
                        r.manualControls ? v.controlNav.setupManual() : v.controlNav.setupPaging();
                    },
                    setupPaging: function () {
                        var t = r.vars.controlNav === "thumbnails" ? "control-thumbs" : "control-paging",
                            n = 1,
                            s,
                            o;
                        r.controlNavScaffold = e('<ol class="' + i + "control-nav " + i + t + '"></ol>');
                        if (r.pagingCount > 1)
                            for (var f = 0; f < r.pagingCount; f++) {
                                (o = r.slides.eq(f)), (s = r.vars.controlNav === "thumbnails" ? '<img src="' + o.attr("data-thumb") + '"/>' : "<a>" + n + "</a>");
                                if ("thumbnails" === r.vars.controlNav && !0 === r.vars.thumbCaptions) {
                                    var l = o.attr("data-thumbcaption");
                                    "" != l && undefined != l && (s += '<span class="' + i + 'caption">' + l + "</span>");
                                }
                                r.controlNavScaffold.append("<li>" + s + "</li>"), n++;
                            }
                        r.controlsContainer ? e(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold),
                            v.controlNav.set(),
                            v.controlNav.active(),
                            r.controlNavScaffold.delegate("a, img", u, function (t) {
                                t.preventDefault();
                                if (a === "" || a === t.type) {
                                    var n = e(this),
                                        s = r.controlNav.index(n);
                                    n.hasClass(i + "active") || ((r.direction = s > r.currentSlide ? "next" : "prev"), r.flexAnimate(s, r.vars.pauseOnAction));
                                }
                                a === "" && (a = t.type), v.setToClearWatchedEvent();
                            });
                    },
                    setupManual: function () {
                        (r.controlNav = r.manualControls),
                            v.controlNav.active(),
                            r.controlNav.bind(u, function (t) {
                                t.preventDefault();
                                if (a === "" || a === t.type) {
                                    var n = e(this),
                                        s = r.controlNav.index(n);
                                    n.hasClass(i + "active") || (s > r.currentSlide ? (r.direction = "next") : (r.direction = "prev"), r.flexAnimate(s, r.vars.pauseOnAction));
                                }
                                a === "" && (a = t.type), v.setToClearWatchedEvent();
                            });
                    },
                    set: function () {
                        var t = r.vars.controlNav === "thumbnails" ? "img" : "a";
                        r.controlNav = e("." + i + "control-nav li " + t, r.controlsContainer ? r.controlsContainer : r);
                    },
                    active: function () {
                        r.controlNav
                            .removeClass(i + "active")
                            .eq(r.animatingTo)
                            .addClass(i + "active");
                    },
                    update: function (t, n) {
                        r.pagingCount > 1 && t === "add" ? r.controlNavScaffold.append(e("<li><a>" + r.count + "</a></li>")) : r.pagingCount === 1 ? r.controlNavScaffold.find("li").remove() : r.controlNav.eq(n).closest("li").remove(),
                            v.controlNav.set(),
                            r.pagingCount > 1 && r.pagingCount !== r.controlNav.length ? r.update(n, t) : v.controlNav.active();
                    },
                },
                directionNav: {
                    setup: function () {
                        var t = e('<ul class="' + i + 'direction-nav"><li><a class="' + i + 'prev" href="#">' + r.vars.prevText + '</a></li><li><a class="' + i + 'next" href="#">' + r.vars.nextText + "</a></li></ul>");
                        r.controlsContainer ? (e(r.controlsContainer).append(t), (r.directionNav = e("." + i + "direction-nav li a", r.controlsContainer))) : (r.append(t), (r.directionNav = e("." + i + "direction-nav li a", r))),
                            v.directionNav.update(),
                            r.directionNav.bind(u, function (t) {
                                t.preventDefault();
                                var n;
                                if (a === "" || a === t.type) (n = e(this).hasClass(i + "next") ? r.getTarget("next") : r.getTarget("prev")), r.flexAnimate(n, r.vars.pauseOnAction);
                                a === "" && (a = t.type), v.setToClearWatchedEvent();
                            });
                    },
                    update: function () {
                        var e = i + "disabled";
                        r.pagingCount === 1
                            ? r.directionNav.addClass(e).attr("tabindex", "-1")
                            : r.vars.animationLoop
                            ? r.directionNav.removeClass(e).removeAttr("tabindex")
                            : r.animatingTo === 0
                            ? r.directionNav
                                  .removeClass(e)
                                  .filter("." + i + "prev")
                                  .addClass(e)
                                  .attr("tabindex", "-1")
                            : r.animatingTo === r.last
                            ? r.directionNav
                                  .removeClass(e)
                                  .filter("." + i + "next")
                                  .addClass(e)
                                  .attr("tabindex", "-1")
                            : r.directionNav.removeClass(e).removeAttr("tabindex");
                    },
                },
                pausePlay: {
                    setup: function () {
                        var t = e('<div class="' + i + 'pauseplay"><a></a></div>');
                        r.controlsContainer ? (r.controlsContainer.append(t), (r.pausePlay = e("." + i + "pauseplay a", r.controlsContainer))) : (r.append(t), (r.pausePlay = e("." + i + "pauseplay a", r))),
                            v.pausePlay.update(r.vars.slideshow ? i + "pause" : i + "play"),
                            r.pausePlay.bind(u, function (t) {
                                t.preventDefault();
                                if (a === "" || a === t.type) e(this).hasClass(i + "pause") ? ((r.manualPause = !0), (r.manualPlay = !1), r.pause()) : ((r.manualPause = !1), (r.manualPlay = !0), r.play());
                                a === "" && (a = t.type), v.setToClearWatchedEvent();
                            });
                    },
                    update: function (e) {
                        e === "play"
                            ? r.pausePlay
                                  .removeClass(i + "pause")
                                  .addClass(i + "play")
                                  .html(r.vars.playText)
                            : r.pausePlay
                                  .removeClass(i + "play")
                                  .addClass(i + "pause")
                                  .html(r.vars.pauseText);
                    },
                },
                touch: function () {
                    var e,
                        n,
                        i,
                        o,
                        u,
                        a,
                        f = !1,
                        d = 0,
                        v = 0,
                        m = 0;
                    if (!s) {
                        t.addEventListener("touchstart", g, !1);
                        function g(s) {
                            if (r.animating) s.preventDefault();
                            else if (window.navigator.msPointerEnabled || s.touches.length === 1)
                                r.pause(),
                                    (o = l ? r.h : r.w),
                                    (a = Number(new Date())),
                                    (d = s.touches[0].pageX),
                                    (v = s.touches[0].pageY),
                                    (i =
                                        h && c && r.animatingTo === r.last
                                            ? 0
                                            : h && c
                                            ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo
                                            : h && r.currentSlide === r.last
                                            ? r.limit
                                            : h
                                            ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide
                                            : c
                                            ? (r.last - r.currentSlide + r.cloneOffset) * o
                                            : (r.currentSlide + r.cloneOffset) * o),
                                    (e = l ? v : d),
                                    (n = l ? d : v),
                                    t.addEventListener("touchmove", y, !1),
                                    t.addEventListener("touchend", b, !1);
                        }
                        function y(t) {
                            (d = t.touches[0].pageX), (v = t.touches[0].pageY), (u = l ? e - v : e - d), (f = l ? Math.abs(u) < Math.abs(d - n) : Math.abs(u) < Math.abs(v - n));
                            var s = 500;
                            if (!f || Number(new Date()) - a > s)
                                t.preventDefault(), !p && r.transitions && (r.vars.animationLoop || (u /= (r.currentSlide === 0 && u < 0) || (r.currentSlide === r.last && u > 0) ? Math.abs(u) / o + 2 : 1), r.setProps(i + u, "setTouch"));
                        }
                        function b(s) {
                            t.removeEventListener("touchmove", y, !1);
                            if (r.animatingTo === r.currentSlide && !f && u !== null) {
                                var l = c ? -u : u,
                                    h = l > 0 ? r.getTarget("next") : r.getTarget("prev");
                                r.canAdvance(h) && ((Number(new Date()) - a < 550 && Math.abs(l) > 50) || Math.abs(l) > o / 2) ? r.flexAnimate(h, r.vars.pauseOnAction) : p || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0);
                            }
                            t.removeEventListener("touchend", b, !1), (e = null), (n = null), (u = null), (i = null);
                        }
                    } else {
                        (t.style.msTouchAction = "none"),
                            (t._gesture = new MSGesture()),
                            (t._gesture.target = t),
                            t.addEventListener("MSPointerDown", w, !1),
                            (t._slider = r),
                            t.addEventListener("MSGestureChange", E, !1),
                            t.addEventListener("MSGestureEnd", S, !1);
                        function w(e) {
                            e.stopPropagation(),
                                r.animating
                                    ? e.preventDefault()
                                    : (r.pause(),
                                      t._gesture.addPointer(e.pointerId),
                                      (m = 0),
                                      (o = l ? r.h : r.w),
                                      (a = Number(new Date())),
                                      (i =
                                          h && c && r.animatingTo === r.last
                                              ? 0
                                              : h && c
                                              ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo
                                              : h && r.currentSlide === r.last
                                              ? r.limit
                                              : h
                                              ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide
                                              : c
                                              ? (r.last - r.currentSlide + r.cloneOffset) * o
                                              : (r.currentSlide + r.cloneOffset) * o));
                        }
                        function E(e) {
                            e.stopPropagation();
                            var n = e.target._slider;
                            if (!n) return;
                            var r = -e.translationX,
                                s = -e.translationY;
                            (m += l ? s : r), (u = m), (f = l ? Math.abs(m) < Math.abs(-r) : Math.abs(m) < Math.abs(-s));
                            if (e.detail === e.MSGESTURE_FLAG_INERTIA) {
                                setImmediate(function () {
                                    t._gesture.stop();
                                });
                                return;
                            }
                            if (!f || Number(new Date()) - a > 500)
                                e.preventDefault(),
                                    !p && n.transitions && (n.vars.animationLoop || (u = m / ((n.currentSlide === 0 && m < 0) || (n.currentSlide === n.last && m > 0) ? Math.abs(m) / o + 2 : 1)), n.setProps(i + u, "setTouch"));
                        }
                        function S(t) {
                            t.stopPropagation();
                            var r = t.target._slider;
                            if (!r) return;
                            if (r.animatingTo === r.currentSlide && !f && u !== null) {
                                var s = c ? -u : u,
                                    l = s > 0 ? r.getTarget("next") : r.getTarget("prev");
                                r.canAdvance(l) && ((Number(new Date()) - a < 550 && Math.abs(s) > 50) || Math.abs(s) > o / 2) ? r.flexAnimate(l, r.vars.pauseOnAction) : p || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0);
                            }
                            (e = null), (n = null), (u = null), (i = null), (m = 0);
                        }
                    }
                },
                resize: function () {
                    !r.animating &&
                        r.is(":visible") &&
                        (h || r.doMath(),
                        p
                            ? v.smoothHeight()
                            : h
                            ? (r.slides.width(r.computedW), r.update(r.pagingCount), r.setProps())
                            : l
                            ? (r.viewport.height(r.h), r.setProps(r.h, "setTotal"))
                            : (r.vars.smoothHeight && v.smoothHeight(), r.newSlides.width(r.computedW), r.setProps(r.computedW, "setTotal")));
                },
                smoothHeight: function (e) {
                    if (!l || p) {
                        var t = p ? r : r.viewport;
                        e ? t.animate({ height: r.slides.eq(r.animatingTo).height() }, e) : t.height(r.slides.eq(r.animatingTo).height());
                    }
                },
                sync: function (t) {
                    var n = e(r.vars.sync).data("flexslider"),
                        i = r.animatingTo;
                    switch (t) {
                        case "animate":
                            n.flexAnimate(i, r.vars.pauseOnAction, !1, !0);
                            break;
                        case "play":
                            !n.playing && !n.asNav && n.play();
                            break;
                        case "pause":
                            n.pause();
                    }
                },
                uniqueID: function (t) {
                    return (
                        t.find("[id]").each(function () {
                            var t = e(this);
                            t.attr("id", t.attr("id") + "_clone");
                        }),
                        t
                    );
                },
                pauseInvisible: {
                    visProp: null,
                    init: function () {
                        var e = ["webkit", "moz", "ms", "o"];
                        if ("hidden" in document) return "hidden";
                        for (var t = 0; t < e.length; t++) e[t] + "Hidden" in document && (v.pauseInvisible.visProp = e[t] + "Hidden");
                        if (v.pauseInvisible.visProp) {
                            var n = v.pauseInvisible.visProp.replace(/[H|h]idden/, "") + "visibilitychange";
                            document.addEventListener(n, function () {
                                v.pauseInvisible.isHidden() ? (r.startTimeout ? clearTimeout(r.startTimeout) : r.pause()) : r.started ? r.play() : r.vars.initDelay > 0 ? setTimeout(r.play, r.vars.initDelay) : r.play();
                            });
                        }
                    },
                    isHidden: function () {
                        return document[v.pauseInvisible.visProp] || !1;
                    },
                },
                setToClearWatchedEvent: function () {
                    clearTimeout(f),
                        (f = setTimeout(function () {
                            a = "";
                        }, 3e3));
                },
            }),
            (r.flexAnimate = function (t, n, s, u, a) {
                !r.vars.animationLoop && t !== r.currentSlide && (r.direction = t > r.currentSlide ? "next" : "prev"), d && r.pagingCount === 1 && (r.direction = r.currentItem < t ? "next" : "prev");
                if (!r.animating && (r.canAdvance(t, a) || s) && r.is(":visible")) {
                    if (d && u) {
                        var f = e(r.vars.asNavFor).data("flexslider");
                        (r.atEnd = t === 0 || t === r.count - 1), f.flexAnimate(t, !0, !1, !0, a), (r.direction = r.currentItem < t ? "next" : "prev"), (f.direction = r.direction);
                        if (Math.ceil((t + 1) / r.visible) - 1 === r.currentSlide || t === 0)
                            return (
                                (r.currentItem = t),
                                r.slides
                                    .removeClass(i + "active-slide")
                                    .eq(t)
                                    .addClass(i + "active-slide"),
                                !1
                            );
                        (r.currentItem = t),
                            r.slides
                                .removeClass(i + "active-slide")
                                .eq(t)
                                .addClass(i + "active-slide"),
                            (t = Math.floor(t / r.visible));
                    }
                    (r.animating = !0),
                        (r.animatingTo = t),
                        n && r.pause(),
                        r.vars.before(r),
                        r.syncExists && !a && v.sync("animate"),
                        r.vars.controlNav && v.controlNav.active(),
                        h ||
                            r.slides
                                .removeClass(i + "active-slide")
                                .eq(t)
                                .addClass(i + "active-slide"),
                        (r.atEnd = t === 0 || t === r.last),
                        r.vars.directionNav && v.directionNav.update(),
                        t === r.last && (r.vars.end(r), r.vars.animationLoop || r.pause());
                    if (!p) {
                        var m = l ? r.slides.filter(":first").height() : r.computedW,
                            g,
                            y,
                            b;
                        h
                            ? ((g = r.vars.itemMargin), (b = (r.itemW + g) * r.move * r.animatingTo), (y = b > r.limit && r.visible !== 1 ? r.limit : b))
                            : r.currentSlide === 0 && t === r.count - 1 && r.vars.animationLoop && r.direction !== "next"
                            ? (y = c ? (r.count + r.cloneOffset) * m : 0)
                            : r.currentSlide === r.last && t === 0 && r.vars.animationLoop && r.direction !== "prev"
                            ? (y = c ? 0 : (r.count + 1) * m)
                            : (y = c ? (r.count - 1 - t + r.cloneOffset) * m : (t + r.cloneOffset) * m),
                            r.setProps(y, "", r.vars.animationSpeed);
                        if (r.transitions) {
                            if (!r.vars.animationLoop || !r.atEnd) (r.animating = !1), (r.currentSlide = r.animatingTo);
                            var w = (function () {
                                var e = !1;
                                return function () {
                                    e || r.wrapup(m), (e = !0);
                                };
                            })();
                            r.container.unbind("webkitTransitionEnd transitionend"), r.container.bind("webkitTransitionEnd transitionend", w), setTimeout(w, r.vars.animationSpeed + 200);
                        } else
                            r.container.animate(r.args, r.vars.animationSpeed, r.vars.easing, function () {
                                r.wrapup(m);
                            });
                    } else
                        o
                            ? (r.slides.eq(r.currentSlide).css({ opacity: 0, zIndex: 1 }), r.slides.eq(t).css({ opacity: 1, zIndex: 2 }), r.wrapup(m))
                            : (r.slides.eq(r.currentSlide).css({ zIndex: 1 }).animate({ opacity: 0 }, r.vars.animationSpeed, r.vars.easing),
                              r.slides.eq(t).css({ zIndex: 2 }).animate({ opacity: 1 }, r.vars.animationSpeed, r.vars.easing, r.wrapup));
                    r.vars.smoothHeight && v.smoothHeight(r.vars.animationSpeed);
                }
            }),
            (r.wrapup = function (e) {
                !p && !h && (r.currentSlide === 0 && r.animatingTo === r.last && r.vars.animationLoop ? r.setProps(e, "jumpEnd") : r.currentSlide === r.last && r.animatingTo === 0 && r.vars.animationLoop && r.setProps(e, "jumpStart")),
                    (r.animating = !1),
                    (r.currentSlide = r.animatingTo),
                    r.vars.after(r);
            }),
            (r.animateSlides = function () {
                !r.animating && m && r.flexAnimate(r.getTarget("next"));
            }),
            (r.pause = function () {
                clearInterval(r.animatedSlides), (r.animatedSlides = null), (r.playing = !1), r.vars.pausePlay && v.pausePlay.update("play"), r.syncExists && v.sync("pause");
            }),
            (r.play = function () {
                r.playing && clearInterval(r.animatedSlides),
                    (r.animatedSlides = r.animatedSlides || setInterval(r.animateSlides, r.vars.slideshowSpeed)),
                    (r.started = r.playing = !0),
                    r.vars.pausePlay && v.pausePlay.update("pause"),
                    r.syncExists && v.sync("play");
            }),
            (r.stop = function () {
                r.pause(), (r.stopped = !0);
            }),
            (r.canAdvance = function (e, t) {
                var n = d ? r.pagingCount - 1 : r.last;
                return t
                    ? !0
                    : d && r.currentItem === r.count - 1 && e === 0 && r.direction === "prev"
                    ? !0
                    : d && r.currentItem === 0 && e === r.pagingCount - 1 && r.direction !== "next"
                    ? !1
                    : e === r.currentSlide && !d
                    ? !1
                    : r.vars.animationLoop
                    ? !0
                    : r.atEnd && r.currentSlide === 0 && e === n && r.direction !== "next"
                    ? !1
                    : r.atEnd && r.currentSlide === n && e === 0 && r.direction === "next"
                    ? !1
                    : !0;
            }),
            (r.getTarget = function (e) {
                return (r.direction = e), e === "next" ? (r.currentSlide === r.last ? 0 : r.currentSlide + 1) : r.currentSlide === 0 ? r.last : r.currentSlide - 1;
            }),
            (r.setProps = function (e, t, n) {
                var i = (function () {
                    var n = e ? e : (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo,
                        i = (function () {
                            if (h) return t === "setTouch" ? e : c && r.animatingTo === r.last ? 0 : c ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : n;
                            switch (t) {
                                case "setTotal":
                                    return c ? (r.count - 1 - r.currentSlide + r.cloneOffset) * e : (r.currentSlide + r.cloneOffset) * e;
                                case "setTouch":
                                    return c ? e : e;
                                case "jumpEnd":
                                    return c ? e : r.count * e;
                                case "jumpStart":
                                    return c ? r.count * e : e;
                                default:
                                    return e;
                            }
                        })();
                    return i * -1 + "px";
                })();
                r.transitions &&
                    ((i = l ? "translate3d(0," + i + ",0)" : "translate3d(" + i + ",0,0)"), (n = n !== undefined ? n / 1e3 + "s" : "0s"), r.container.css("-" + r.pfx + "-transition-duration", n), r.container.css("transition-duration", n)),
                    (r.args[r.prop] = i),
                    (r.transitions || n === undefined) && r.container.css(r.args),
                    r.container.css("transform", i);
            }),
            (r.setup = function (t) {
                if (!p) {
                    var n, s;
                    t === "init" &&
                        ((r.viewport = e('<div class="' + i + 'viewport"></div>')
                            .css({ overflow: "hidden", position: "relative" })
                            .appendTo(r)
                            .append(r.container)),
                        (r.cloneCount = 0),
                        (r.cloneOffset = 0),
                        c && ((s = e.makeArray(r.slides).reverse()), (r.slides = e(s)), r.container.empty().append(r.slides))),
                        r.vars.animationLoop &&
                            !h &&
                            ((r.cloneCount = 2),
                            (r.cloneOffset = 1),
                            t !== "init" && r.container.find(".clone").remove(),
                            v.uniqueID(r.slides.first().clone().addClass("clone").attr("aria-hidden", "true")).appendTo(r.container),
                            v.uniqueID(r.slides.last().clone().addClass("clone").attr("aria-hidden", "true")).prependTo(r.container)),
                        (r.newSlides = e(r.vars.selector, r)),
                        (n = c ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset),
                        l && !h
                            ? (r.container
                                  .height((r.count + r.cloneCount) * 200 + "%")
                                  .css("position", "absolute")
                                  .width("100%"),
                              setTimeout(
                                  function () {
                                      r.newSlides.css({ display: "block" }), r.doMath(), r.viewport.height(r.h), r.setProps(n * r.h, "init");
                                  },
                                  t === "init" ? 100 : 0
                              ))
                            : (r.container.width((r.count + r.cloneCount) * 200 + "%"),
                              r.setProps(n * r.computedW, "init"),
                              setTimeout(
                                  function () {
                                      r.doMath(), r.newSlides.css({ width: r.computedW, float: "left", display: "block" }), r.vars.smoothHeight && v.smoothHeight();
                                  },
                                  t === "init" ? 100 : 0
                              ));
                } else
                    r.slides.css({ width: "100%", float: "left", marginRight: "-100%", position: "relative" }),
                        t === "init" &&
                            (o
                                ? r.slides
                                      .css({ opacity: 0, display: "block", webkitTransition: "opacity " + r.vars.animationSpeed / 1e3 + "s ease", zIndex: 1 })
                                      .eq(r.currentSlide)
                                      .css({ opacity: 1, zIndex: 2 })
                                : r.slides.css({ opacity: 0, display: "block", zIndex: 1 }).eq(r.currentSlide).css({ zIndex: 2 }).animate({ opacity: 1 }, r.vars.animationSpeed, r.vars.easing)),
                        r.vars.smoothHeight && v.smoothHeight();
                h ||
                    r.slides
                        .removeClass(i + "active-slide")
                        .eq(r.currentSlide)
                        .addClass(i + "active-slide"),
                    r.vars.init(r);
            }),
            (r.doMath = function () {
                var e = r.slides.first(),
                    t = r.vars.itemMargin,
                    n = r.vars.minItems,
                    i = r.vars.maxItems;
                (r.w = r.viewport === undefined ? r.width() : r.viewport.width()),
                    (r.h = e.height()),
                    (r.boxPadding = e.outerWidth() - e.width()),
                    h
                        ? ((r.itemT = r.vars.itemWidth + t),
                          (r.minW = n ? n * r.itemT : r.w),
                          (r.maxW = i ? i * r.itemT - t : r.w),
                          (r.itemW = r.minW > r.w ? (r.w - t * (n - 1)) / n : r.maxW < r.w ? (r.w - t * (i - 1)) / i : r.vars.itemWidth > r.w ? r.w : r.vars.itemWidth),
                          (r.visible = Math.floor(r.w / r.itemW)),
                          (r.move = r.vars.move > 0 && r.vars.move < r.visible ? r.vars.move : r.visible),
                          (r.pagingCount = Math.ceil((r.count - r.visible) / r.move + 1)),
                          (r.last = r.pagingCount - 1),
                          (r.limit = r.pagingCount === 1 ? 0 : r.vars.itemWidth > r.w ? r.itemW * (r.count - 1) + t * (r.count - 1) : (r.itemW + t) * r.count - r.w - t))
                        : ((r.itemW = r.w), (r.pagingCount = r.count), (r.last = r.count - 1)),
                    (r.computedW = r.itemW - r.boxPadding);
            }),
            (r.update = function (e, t) {
                r.doMath(), h || (e < r.currentSlide ? (r.currentSlide += 1) : e <= r.currentSlide && e !== 0 && (r.currentSlide -= 1), (r.animatingTo = r.currentSlide));
                if (r.vars.controlNav && !r.manualControls)
                    if ((t === "add" && !h) || r.pagingCount > r.controlNav.length) v.controlNav.update("add");
                    else if ((t === "remove" && !h) || r.pagingCount < r.controlNav.length) h && r.currentSlide > r.last && ((r.currentSlide -= 1), (r.animatingTo -= 1)), v.controlNav.update("remove", r.last);
                r.vars.directionNav && v.directionNav.update();
            }),
            (r.addSlide = function (t, n) {
                var i = e(t);
                (r.count += 1),
                    (r.last = r.count - 1),
                    l && c ? (n !== undefined ? r.slides.eq(r.count - n).after(i) : r.container.prepend(i)) : n !== undefined ? r.slides.eq(n).before(i) : r.container.append(i),
                    r.update(n, "add"),
                    (r.slides = e(r.vars.selector + ":not(.clone)", r)),
                    r.setup(),
                    r.vars.added(r);
            }),
            (r.removeSlide = function (t) {
                var n = isNaN(t) ? r.slides.index(e(t)) : t;
                (r.count -= 1),
                    (r.last = r.count - 1),
                    isNaN(t) ? e(t, r.slides).remove() : l && c ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove(),
                    r.doMath(),
                    r.update(n, "remove"),
                    (r.slides = e(r.vars.selector + ":not(.clone)", r)),
                    r.setup(),
                    r.vars.removed(r);
            }),
            v.init();
    }),
        e(window)
            .blur(function (e) {
                focused = !1;
            })
            .focus(function (e) {
                focused = !0;
            }),
        (e.flexslider.defaults = {
            namespace: "flex-",
            selector: ".slides > li",
            animation: "fade",
            easing: "swing",
            direction: "horizontal",
            reverse: !1,
            animationLoop: !0,
            smoothHeight: !1,
            startAt: 0,
            slideshow: !0,
            slideshowSpeed: 7e3,
            animationSpeed: 600,
            initDelay: 0,
            randomize: !1,
            thumbCaptions: !1,
            pauseOnAction: !0,
            pauseOnHover: !1,
            pauseInvisible: !0,
            useCSS: !0,
            touch: !0,
            video: !1,
            controlNav: !0,
            directionNav: !0,
            prevText: "Previous",
            nextText: "Next",
            keyboard: !0,
            multipleKeyboard: !1,
            mousewheel: !1,
            pausePlay: !1,
            pauseText: "Pause",
            playText: "Play",
            controlsContainer: "",
            manualControls: "",
            sync: "",
            asNavFor: "",
            itemWidth: 0,
            itemMargin: 0,
            minItems: 1,
            maxItems: 0,
            move: 0,
            allowOneSlide: !0,
            start: function () {},
            before: function () {},
            after: function () {},
            end: function () {},
            added: function () {},
            removed: function () {},
            init: function () {},
        }),
        (e.fn.flexslider = function (t) {
            t === undefined && (t = {});
            if (typeof t == "object")
                return this.each(function () {
                    var n = e(this),
                        r = t.selector ? t.selector : ".slides > li",
                        i = n.find(r);
                    (i.length === 1 && t.allowOneSlide === !0) || i.length === 0 ? (i.fadeIn(400), t.start && t.start(n)) : n.data("flexslider") === undefined && new e.flexslider(this, t);
                });
            var n = e(this).data("flexslider");
            switch (t) {
                case "play":
                    n.play();
                    break;
                case "pause":
                    n.pause();
                    break;
                case "stop":
                    n.stop();
                    break;
                case "next":
                    n.flexAnimate(n.getTarget("next"), !0);
                    break;
                case "prev":
                case "previous":
                    n.flexAnimate(n.getTarget("prev"), !0);
                    break;
                default:
                    typeof t == "number" && n.flexAnimate(t, !0);
            }
        });
})(jQuery),
    (function (e, t) {
        "use strict";
        var n = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        e.fn.imagesLoaded = function (r) {
            function c() {
                var t = e(f),
                    n = e(l);
                s && (l.length ? s.reject(u, t, n) : s.resolve(u)), e.isFunction(r) && r.call(i, u, t, n);
            }
            function h(e) {
                p(e.target, e.type === "error");
            }
            function p(t, r) {
                if (t.src === n || e.inArray(t, a) !== -1) return;
                a.push(t), r ? l.push(t) : f.push(t), e.data(t, "imagesLoaded", { isBroken: r, src: t.src }), o && s.notifyWith(e(t), [r, u, e(f), e(l)]), u.length === a.length && (setTimeout(c), u.unbind(".imagesLoaded", h));
            }
            var i = this,
                s = e.isFunction(e.Deferred) ? e.Deferred() : 0,
                o = e.isFunction(s.notify),
                u = i.find("img").add(i.filter("img")),
                a = [],
                f = [],
                l = [];
            return (
                e.isPlainObject(r) &&
                    e.each(r, function (e, t) {
                        e === "callback" ? (r = t) : s && s[e](t);
                    }),
                u.length
                    ? u.bind("load.imagesLoaded error.imagesLoaded", h).each(function (r, i) {
                          var s = i.src,
                              o = e.data(i, "imagesLoaded");
                          if (o && o.src === s) {
                              p(i, o.isBroken);
                              return;
                          }
                          if (i.complete && i.naturalWidth !== t) {
                              p(i, i.naturalWidth === 0 || i.naturalHeight === 0);
                              return;
                          }
                          if (i.readyState || i.complete) (i.src = n), (i.src = s);
                      })
                    : c(),
                s ? s.promise(i) : i
            );
        };
    })(jQuery),
    (function (e, t, n) {
        "use strict";
        var r = e.document,
            i = e.Modernizr,
            s = function (e) {
                return e.charAt(0).toUpperCase() + e.slice(1);
            },
            o = "Moz Webkit O Ms".split(" "),
            u = function (e) {
                var t = r.documentElement.style,
                    n;
                if (typeof t[e] == "string") return e;
                e = s(e);
                for (var i = 0, u = o.length; i < u; i++) {
                    n = o[i] + e;
                    if (typeof t[n] == "string") return n;
                }
            },
            a = u("transform"),
            f = u("transitionProperty"),
            l = {
                csstransforms: function () {
                    return !!a;
                },
                csstransforms3d: function () {
                    var e = !!u("perspective");
                    if (e) {
                        var n = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
                            r = "@media (" + n.join("transform-3d),(") + "modernizr)",
                            i = t("<style>" + r + "{#modernizr{height:3px}}" + "</style>").appendTo("head"),
                            s = t('<div id="modernizr" />').appendTo("html");
                        (e = s.height() === 3), s.remove(), i.remove();
                    }
                    return e;
                },
                csstransitions: function () {
                    return !!f;
                },
            },
            c;
        if (i) for (c in l) i.hasOwnProperty(c) || i.addTest(c, l[c]);
        else {
            i = e.Modernizr = { _version: "1.6ish: miniModernizr for Isotope" };
            var h = " ",
                p;
            for (c in l) (p = l[c]()), (i[c] = p), (h += " " + (p ? "" : "no-") + c);
            t("html").addClass(h);
        }
        if (i.csstransforms) {
            var d = i.csstransforms3d
                    ? {
                          translate: function (e) {
                              return "translate3d(" + e[0] + "px, " + e[1] + "px, 0) ";
                          },
                          scale: function (e) {
                              return "scale3d(" + e + ", " + e + ", 1) ";
                          },
                      }
                    : {
                          translate: function (e) {
                              return "translate(" + e[0] + "px, " + e[1] + "px) ";
                          },
                          scale: function (e) {
                              return "scale(" + e + ") ";
                          },
                      },
                v = function (e, n, r) {
                    var i = t.data(e, "isoTransform") || {},
                        s = {},
                        o,
                        u = {},
                        f;
                    (s[n] = r), t.extend(i, s);
                    for (o in i) (f = i[o]), (u[o] = d[o](f));
                    var l = u.translate || "",
                        c = u.scale || "",
                        h = l + c;
                    t.data(e, "isoTransform", i), (e.style[a] = h);
                };
            (t.cssNumber.scale = !0),
                (t.cssHooks.scale = {
                    set: function (e, t) {
                        v(e, "scale", t);
                    },
                    get: function (e, n) {
                        var r = t.data(e, "isoTransform");
                        return r && r.scale ? r.scale : 1;
                    },
                }),
                (t.fx.step.scale = function (e) {
                    t.cssHooks.scale.set(e.elem, e.now + e.unit);
                }),
                (t.cssNumber.translate = !0),
                (t.cssHooks.translate = {
                    set: function (e, t) {
                        v(e, "translate", t);
                    },
                    get: function (e, n) {
                        var r = t.data(e, "isoTransform");
                        return r && r.translate ? r.translate : [0, 0];
                    },
                });
        }
        var m, g;
        i.csstransitions &&
            ((m = { WebkitTransitionProperty: "webkitTransitionEnd", MozTransitionProperty: "transitionend", OTransitionProperty: "oTransitionEnd otransitionend", transitionProperty: "transitionend" }[f]), (g = u("transitionDuration")));
        var y = t.event,
            b = t.event.handle ? "handle" : "dispatch",
            w;
        (y.special.smartresize = {
            setup: function () {
                t(this).bind("resize", y.special.smartresize.handler);
            },
            teardown: function () {
                t(this).unbind("resize", y.special.smartresize.handler);
            },
            handler: function (e, t) {
                var n = this,
                    r = arguments;
                (e.type = "smartresize"),
                    w && clearTimeout(w),
                    (w = setTimeout(
                        function () {
                            y[b].apply(n, r);
                        },
                        t === "execAsap" ? 0 : 100
                    ));
            },
        }),
            (t.fn.smartresize = function (e) {
                return e ? this.bind("smartresize", e) : this.trigger("smartresize", ["execAsap"]);
            }),
            (t.Isotope = function (e, n, r) {
                (this.element = t(n)), this._create(e), this._init(r);
            });
        var E = ["width", "height"],
            S = t(e);
        (t.Isotope.settings = {
            resizable: !0,
            layoutMode: "masonry",
            containerClass: "isotope",
            itemClass: "isotope-item",
            hiddenClass: "isotope-hidden",
            hiddenStyle: { opacity: 0, scale: 0.001 },
            visibleStyle: { opacity: 1, scale: 1 },
            containerStyle: { position: "relative", overflow: "hidden" },
            animationEngine: "best-available",
            animationOptions: { queue: !1, duration: 800 },
            sortBy: "original-order",
            sortAscending: !0,
            resizesContainer: !0,
            transformsEnabled: !0,
            itemPositionDataEnabled: !1,
        }),
            (t.Isotope.prototype = {
                _create: function (e) {
                    (this.options = t.extend({}, t.Isotope.settings, e)), (this.styleQueue = []), (this.elemCount = 0);
                    var n = this.element[0].style;
                    this.originalStyle = {};
                    var r = E.slice(0);
                    for (var i in this.options.containerStyle) r.push(i);
                    for (var s = 0, o = r.length; s < o; s++) (i = r[s]), (this.originalStyle[i] = n[i] || "");
                    this.element.css(this.options.containerStyle), this._updateAnimationEngine(), this._updateUsingTransforms();
                    var u = {
                        "original-order": function (e, t) {
                            return t.elemCount++, t.elemCount;
                        },
                        random: function () {
                            return Math.random();
                        },
                    };
                    (this.options.getSortData = t.extend(this.options.getSortData, u)),
                        this.reloadItems(),
                        (this.offset = { left: parseInt(this.element.css("padding-left") || 0, 10), top: parseInt(this.element.css("padding-top") || 0, 10) });
                    var a = this;
                    setTimeout(function () {
                        a.element.addClass(a.options.containerClass);
                    }, 0),
                        this.options.resizable &&
                            S.bind("smartresize.isotope", function () {
                                a.resize();
                            }),
                        this.element.delegate("." + this.options.hiddenClass, "click", function () {
                            return !1;
                        });
                },
                _getAtoms: function (e) {
                    var t = this.options.itemSelector,
                        n = t ? e.filter(t).add(e.find(t)) : e,
                        r = { position: "absolute" };
                    return (
                        (n = n.filter(function (e, t) {
                            return t.nodeType === 1;
                        })),
                        this.usingTransforms && ((r.left = 0), (r.top = 0)),
                        n.css(r).addClass(this.options.itemClass),
                        this.updateSortData(n, !0),
                        n
                    );
                },
                _init: function (e) {
                    (this.$filteredAtoms = this._filter(this.$allAtoms)), this._sort(), this.reLayout(e);
                },
                option: function (e) {
                    if (t.isPlainObject(e)) {
                        this.options = t.extend(!0, this.options, e);
                        var n;
                        for (var r in e) (n = "_update" + s(r)), this[n] && this[n]();
                    }
                },
                _updateAnimationEngine: function () {
                    var e = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, ""),
                        t;
                    switch (e) {
                        case "css":
                        case "none":
                            t = !1;
                            break;
                        case "jquery":
                            t = !0;
                            break;
                        default:
                            t = !i.csstransitions;
                    }
                    (this.isUsingJQueryAnimation = t), this._updateUsingTransforms();
                },
                _updateTransformsEnabled: function () {
                    this._updateUsingTransforms();
                },
                _updateUsingTransforms: function () {
                    var e = (this.usingTransforms = this.options.transformsEnabled && i.csstransforms && i.csstransitions && !this.isUsingJQueryAnimation);
                    e || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale), (this.getPositionStyles = e ? this._translate : this._positionAbs);
                },
                _filter: function (e) {
                    var t = this.options.filter === "" ? "*" : this.options.filter;
                    if (!t) return e;
                    var n = this.options.hiddenClass,
                        r = "." + n,
                        i = e.filter(r),
                        s = i;
                    if (t !== "*") {
                        s = i.filter(t);
                        var o = e.not(r).not(t).addClass(n);
                        this.styleQueue.push({ $el: o, style: this.options.hiddenStyle });
                    }
                    return this.styleQueue.push({ $el: s, style: this.options.visibleStyle }), s.removeClass(n), e.filter(t);
                },
                updateSortData: function (e, n) {
                    var r = this,
                        i = this.options.getSortData,
                        s,
                        o;
                    e.each(function () {
                        (s = t(this)), (o = {});
                        for (var e in i) !n && e === "original-order" ? (o[e] = t.data(this, "isotope-sort-data")[e]) : (o[e] = i[e](s, r));
                        t.data(this, "isotope-sort-data", o);
                    });
                },
                _sort: function () {
                    var e = this.options.sortBy,
                        t = this._getSorter,
                        n = this.options.sortAscending ? 1 : -1,
                        r = function (r, i) {
                            var s = t(r, e),
                                o = t(i, e);
                            return s === o && e !== "original-order" && ((s = t(r, "original-order")), (o = t(i, "original-order"))), (s > o ? 1 : s < o ? -1 : 0) * n;
                        };
                    this.$filteredAtoms.sort(r);
                },
                _getSorter: function (e, n) {
                    return t.data(e, "isotope-sort-data")[n];
                },
                _translate: function (e, t) {
                    return { translate: [e, t] };
                },
                _positionAbs: function (e, t) {
                    return { left: e, top: t };
                },
                _pushPosition: function (e, t, n) {
                    (t = Math.round(t + this.offset.left)), (n = Math.round(n + this.offset.top));
                    var r = this.getPositionStyles(t, n);
                    this.styleQueue.push({ $el: e, style: r }), this.options.itemPositionDataEnabled && e.data("isotope-item-position", { x: t, y: n });
                },
                layout: function (e, t) {
                    var n = this.options.layoutMode;
                    this["_" + n + "Layout"](e);
                    if (this.options.resizesContainer) {
                        var r = this["_" + n + "GetContainerSize"]();
                        this.styleQueue.push({ $el: this.element, style: r });
                    }
                    this._processStyleQueue(e, t), (this.isLaidOut = !0);
                },
                _processStyleQueue: function (e, n) {
                    var r = this.isLaidOut ? (this.isUsingJQueryAnimation ? "animate" : "css") : "css",
                        s = this.options.animationOptions,
                        o = this.options.onLayout,
                        u,
                        a,
                        f,
                        l;
                    a = function (e, t) {
                        t.$el[r](t.style, s);
                    };
                    if (this._isInserting && this.isUsingJQueryAnimation)
                        a = function (e, t) {
                            (u = t.$el.hasClass("no-transition") ? "css" : r), t.$el[u](t.style, s);
                        };
                    else if (n || o || s.complete) {
                        var c = !1,
                            h = [n, o, s.complete],
                            p = this;
                        (f = !0),
                            (l = function () {
                                if (c) return;
                                var t;
                                for (var n = 0, r = h.length; n < r; n++) (t = h[n]), typeof t == "function" && t.call(p.element, e, p);
                                c = !0;
                            });
                        if (this.isUsingJQueryAnimation && r === "animate") (s.complete = l), (f = !1);
                        else if (i.csstransitions) {
                            var d = 0,
                                v = this.styleQueue[0],
                                y = v && v.$el,
                                b;
                            while (!y || !y.length) {
                                b = this.styleQueue[d++];
                                if (!b) return;
                                y = b.$el;
                            }
                            var w = parseFloat(getComputedStyle(y[0])[g]);
                            w > 0 &&
                                ((a = function (e, t) {
                                    t.$el[r](t.style, s).one(m, l);
                                }),
                                (f = !1));
                        }
                    }
                    t.each(this.styleQueue, a), f && l(), (this.styleQueue = []);
                },
                resize: function () {
                    this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout();
                },
                reLayout: function (e) {
                    this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms, e);
                },
                addItems: function (e, t) {
                    var n = this._getAtoms(e);
                    (this.$allAtoms = this.$allAtoms.add(n)), t && t(n);
                },
                insert: function (e, t) {
                    this.element.append(e);
                    var n = this;
                    this.addItems(e, function (e) {
                        var r = n._filter(e);
                        n._addHideAppended(r), n._sort(), n.reLayout(), n._revealAppended(r, t);
                    });
                },
                appended: function (e, t) {
                    var n = this;
                    this.addItems(e, function (e) {
                        n._addHideAppended(e), n.layout(e), n._revealAppended(e, t);
                    });
                },
                _addHideAppended: function (e) {
                    (this.$filteredAtoms = this.$filteredAtoms.add(e)), e.addClass("no-transition"), (this._isInserting = !0), this.styleQueue.push({ $el: e, style: this.options.hiddenStyle });
                },
                _revealAppended: function (e, t) {
                    var n = this;
                    setTimeout(function () {
                        e.removeClass("no-transition"), n.styleQueue.push({ $el: e, style: n.options.visibleStyle }), (n._isInserting = !1), n._processStyleQueue(e, t);
                    }, 10);
                },
                reloadItems: function () {
                    this.$allAtoms = this._getAtoms(this.element.children());
                },
                remove: function (e, t) {
                    (this.$allAtoms = this.$allAtoms.not(e)), (this.$filteredAtoms = this.$filteredAtoms.not(e));
                    var n = this,
                        r = function () {
                            e.remove(), t && t.call(n.element);
                        };
                    e.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue.push({ $el: e, style: this.options.hiddenStyle }), this._sort(), this.reLayout(r)) : r();
                },
                shuffle: function (e) {
                    this.updateSortData(this.$allAtoms), (this.options.sortBy = "random"), this._sort(), this.reLayout(e);
                },
                destroy: function () {
                    var e = this.usingTransforms,
                        t = this.options;
                    this.$allAtoms.removeClass(t.hiddenClass + " " + t.itemClass).each(function () {
                        var t = this.style;
                        (t.position = ""), (t.top = ""), (t.left = ""), (t.opacity = ""), e && (t[a] = "");
                    });
                    var n = this.element[0].style;
                    for (var r in this.originalStyle) n[r] = this.originalStyle[r];
                    this.element
                        .unbind(".isotope")
                        .undelegate("." + t.hiddenClass, "click")
                        .removeClass(t.containerClass)
                        .removeData("isotope"),
                        S.unbind(".isotope");
                },
                _getSegments: function (e) {
                    var t = this.options.layoutMode,
                        n = e ? "rowHeight" : "columnWidth",
                        r = e ? "height" : "width",
                        i = e ? "rows" : "cols",
                        o = this.element[r](),
                        u,
                        a = (this.options[t] && this.options[t][n]) || this.$filteredAtoms["outer" + s(r)](!0) || o;
                    (u = Math.floor(o / a)), (u = Math.max(u, 1)), (this[t][i] = u), (this[t][n] = a);
                },
                _checkIfSegmentsChanged: function (e) {
                    var t = this.options.layoutMode,
                        n = e ? "rows" : "cols",
                        r = this[t][n];
                    return this._getSegments(e), this[t][n] !== r;
                },
                _masonryReset: function () {
                    (this.masonry = {}), this._getSegments();
                    var e = this.masonry.cols;
                    this.masonry.colYs = [];
                    while (e--) this.masonry.colYs.push(0);
                },
                _masonryLayout: function (e) {
                    var n = this,
                        r = n.masonry;
                    e.each(function () {
                        var e = t(this),
                            i = Math.ceil(e.outerWidth(!0) / r.columnWidth);
                        i = Math.min(i, r.cols);
                        if (i === 1) n._masonryPlaceBrick(e, r.colYs);
                        else {
                            var s = r.cols + 1 - i,
                                o = [],
                                u,
                                a;
                            for (a = 0; a < s; a++) (u = r.colYs.slice(a, a + i)), (o[a] = Math.max.apply(Math, u));
                            n._masonryPlaceBrick(e, o);
                        }
                    });
                },
                _masonryPlaceBrick: function (e, t) {
                    var n = Math.min.apply(Math, t),
                        r = 0;
                    for (var i = 0, s = t.length; i < s; i++)
                        if (t[i] === n) {
                            r = i;
                            break;
                        }
                    var o = this.masonry.columnWidth * r,
                        u = n;
                    this._pushPosition(e, o, u);
                    var a = n + e.outerHeight(!0),
                        f = this.masonry.cols + 1 - s;
                    for (i = 0; i < f; i++) this.masonry.colYs[r + i] = a;
                },
                _masonryGetContainerSize: function () {
                    var e = Math.max.apply(Math, this.masonry.colYs);
                    return { height: e };
                },
                _masonryResizeChanged: function () {
                    return this._checkIfSegmentsChanged();
                },
                _fitRowsReset: function () {
                    this.fitRows = { x: 0, y: 0, height: 0 };
                },
                _fitRowsLayout: function (e) {
                    var n = this,
                        r = this.element.width(),
                        i = this.fitRows;
                    e.each(function () {
                        var e = t(this),
                            s = e.outerWidth(!0),
                            o = e.outerHeight(!0);
                        i.x !== 0 && s + i.x > r && ((i.x = 0), (i.y = i.height)), n._pushPosition(e, i.x, i.y), (i.height = Math.max(i.y + o, i.height)), (i.x += s);
                    });
                },
                _fitRowsGetContainerSize: function () {
                    return { height: this.fitRows.height };
                },
                _fitRowsResizeChanged: function () {
                    return !0;
                },
                _cellsByRowReset: function () {
                    (this.cellsByRow = { index: 0 }), this._getSegments(), this._getSegments(!0);
                },
                _cellsByRowLayout: function (e) {
                    var n = this,
                        r = this.cellsByRow;
                    e.each(function () {
                        var e = t(this),
                            i = r.index % r.cols,
                            s = Math.floor(r.index / r.cols),
                            o = (i + 0.5) * r.columnWidth - e.outerWidth(!0) / 2,
                            u = (s + 0.5) * r.rowHeight - e.outerHeight(!0) / 2;
                        n._pushPosition(e, o, u), r.index++;
                    });
                },
                _cellsByRowGetContainerSize: function () {
                    return { height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top };
                },
                _cellsByRowResizeChanged: function () {
                    return this._checkIfSegmentsChanged();
                },
                _straightDownReset: function () {
                    this.straightDown = { y: 0 };
                },
                _straightDownLayout: function (e) {
                    var n = this;
                    e.each(function (e) {
                        var r = t(this);
                        n._pushPosition(r, 0, n.straightDown.y), (n.straightDown.y += r.outerHeight(!0));
                    });
                },
                _straightDownGetContainerSize: function () {
                    return { height: this.straightDown.y };
                },
                _straightDownResizeChanged: function () {
                    return !0;
                },
                _masonryHorizontalReset: function () {
                    (this.masonryHorizontal = {}), this._getSegments(!0);
                    var e = this.masonryHorizontal.rows;
                    this.masonryHorizontal.rowXs = [];
                    while (e--) this.masonryHorizontal.rowXs.push(0);
                },
                _masonryHorizontalLayout: function (e) {
                    var n = this,
                        r = n.masonryHorizontal;
                    e.each(function () {
                        var e = t(this),
                            i = Math.ceil(e.outerHeight(!0) / r.rowHeight);
                        i = Math.min(i, r.rows);
                        if (i === 1) n._masonryHorizontalPlaceBrick(e, r.rowXs);
                        else {
                            var s = r.rows + 1 - i,
                                o = [],
                                u,
                                a;
                            for (a = 0; a < s; a++) (u = r.rowXs.slice(a, a + i)), (o[a] = Math.max.apply(Math, u));
                            n._masonryHorizontalPlaceBrick(e, o);
                        }
                    });
                },
                _masonryHorizontalPlaceBrick: function (e, t) {
                    var n = Math.min.apply(Math, t),
                        r = 0;
                    for (var i = 0, s = t.length; i < s; i++)
                        if (t[i] === n) {
                            r = i;
                            break;
                        }
                    var o = n,
                        u = this.masonryHorizontal.rowHeight * r;
                    this._pushPosition(e, o, u);
                    var a = n + e.outerWidth(!0),
                        f = this.masonryHorizontal.rows + 1 - s;
                    for (i = 0; i < f; i++) this.masonryHorizontal.rowXs[r + i] = a;
                },
                _masonryHorizontalGetContainerSize: function () {
                    var e = Math.max.apply(Math, this.masonryHorizontal.rowXs);
                    return { width: e };
                },
                _masonryHorizontalResizeChanged: function () {
                    return this._checkIfSegmentsChanged(!0);
                },
                _fitColumnsReset: function () {
                    this.fitColumns = { x: 0, y: 0, width: 0 };
                },
                _fitColumnsLayout: function (e) {
                    var n = this,
                        r = this.element.height(),
                        i = this.fitColumns;
                    e.each(function () {
                        var e = t(this),
                            s = e.outerWidth(!0),
                            o = e.outerHeight(!0);
                        i.y !== 0 && o + i.y > r && ((i.x = i.width), (i.y = 0)), n._pushPosition(e, i.x, i.y), (i.width = Math.max(i.x + s, i.width)), (i.y += o);
                    });
                },
                _fitColumnsGetContainerSize: function () {
                    return { width: this.fitColumns.width };
                },
                _fitColumnsResizeChanged: function () {
                    return !0;
                },
                _cellsByColumnReset: function () {
                    (this.cellsByColumn = { index: 0 }), this._getSegments(), this._getSegments(!0);
                },
                _cellsByColumnLayout: function (e) {
                    var n = this,
                        r = this.cellsByColumn;
                    e.each(function () {
                        var e = t(this),
                            i = Math.floor(r.index / r.rows),
                            s = r.index % r.rows,
                            o = (i + 0.5) * r.columnWidth - e.outerWidth(!0) / 2,
                            u = (s + 0.5) * r.rowHeight - e.outerHeight(!0) / 2;
                        n._pushPosition(e, o, u), r.index++;
                    });
                },
                _cellsByColumnGetContainerSize: function () {
                    return { width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth };
                },
                _cellsByColumnResizeChanged: function () {
                    return this._checkIfSegmentsChanged(!0);
                },
                _straightAcrossReset: function () {
                    this.straightAcross = { x: 0 };
                },
                _straightAcrossLayout: function (e) {
                    var n = this;
                    e.each(function (e) {
                        var r = t(this);
                        n._pushPosition(r, n.straightAcross.x, 0), (n.straightAcross.x += r.outerWidth(!0));
                    });
                },
                _straightAcrossGetContainerSize: function () {
                    return { width: this.straightAcross.x };
                },
                _straightAcrossResizeChanged: function () {
                    return !0;
                },
            }),
            (t.fn.imagesLoaded = function (e) {
                function n() {
                    e.call(i, s);
                }
                function r(e) {
                    var i = e.target;
                    i.src !== u && t.inArray(i, a) === -1 && (a.push(i), --o <= 0 && (setTimeout(n), s.unbind(".imagesLoaded", r)));
                }
                var i = this,
                    s = i.find("img").add(i.filter("img")),
                    o = s.length,
                    u = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
                    a = [];
                return (
                    o || n(),
                    s.bind("load.imagesLoaded error.imagesLoaded", r).each(function () {
                        var e = this.src;
                        (this.src = u), (this.src = e);
                    }),
                    i
                );
            });
        var x = function (t) {
            e.console && e.console.error(t);
        };
        t.fn.isotope = function (e, n) {
            if (typeof e == "string") {
                var r = Array.prototype.slice.call(arguments, 1);
                this.each(function () {
                    var n = t.data(this, "isotope");
                    if (!n) {
                        x("cannot call methods on isotope prior to initialization; attempted to call method '" + e + "'");
                        return;
                    }
                    if (!t.isFunction(n[e]) || e.charAt(0) === "_") {
                        x("no such method '" + e + "' for isotope instance");
                        return;
                    }
                    n[e].apply(n, r);
                });
            } else
                this.each(function () {
                    var r = t.data(this, "isotope");
                    r ? (r.option(e), r._init(n)) : t.data(this, "isotope", new t.Isotope(e, this, n));
                });
            return this;
        };
    })(window, jQuery),
    (function (e) {
        var t, n, r, i;
        return (
            (i = "quickfit"),
            (r = { min: 8, max: 12, tolerance: 0.02, truncate: !1, width: null, sample_number_of_letters: 10, sample_font_size: 12 }),
            (n = (function () {
                function n(t) {
                    (this.options = t),
                        (this.item = e('<span id="meassure"></span>')),
                        this.item.css({ position: "absolute", left: "-1000px", top: "-1000px", "font-size": "" + this.options.sample_font_size + "px" }),
                        e("body").append(this.item),
                        (this.meassures = {});
                }
                var t;
                return (
                    (t = null),
                    (n.instance = function (e) {
                        return t || (t = new n(e)), t;
                    }),
                    (n.prototype.get_meassure = function (e) {
                        var t;
                        return (t = this.meassures[e]), t === void 0 && (t = this.set_meassure(e)), t;
                    }),
                    (n.prototype.set_meassure = function (e) {
                        var t, n, r, i, s;
                        (i = ""), (r = e === " " ? "&nbsp;" : e);
                        for (n = 0, s = this.options.sample_number_of_letters - 1; 0 <= s ? n <= s : n >= s; 0 <= s ? n++ : n--) i += r;
                        return this.item.html(i), (t = this.item.width() / this.options.sample_number_of_letters / this.options.sample_font_size), (this.meassures[e] = t), t;
                    }),
                    n
                );
            })()),
            (t = (function () {
                function t(t, s) {
                    (this.element = t), (this.options = e.extend({}, r, s)), (this.element = e(this.element)), (this._defaults = r), (this._name = i), (this.quickfit_helper = n.instance(this.options));
                }
                return (
                    (t.prototype.fit = function () {
                        var e;
                        return (
                            this.options.width || ((e = this.element.width()), (this.options.width = e - this.options.tolerance * e)),
                            (this.text = this.element.attr("data-quickfit")) ? (this.previously_truncated = !0) : (this.text = this.element.html()),
                            this.calculate_font_size(),
                            this.options.truncate && this.truncate(),
                            this.element.css("font-size", "" + this.font_size + "px")
                        );
                    }),
                    (t.prototype.calculate_font_size = function () {
                        var e, t, n, r, i;
                        (t = 0), (i = this.text);
                        for (n = 0, r = i.length; n < r; n++) (e = i[n]), (t += this.quickfit_helper.get_meassure(e));
                        return (this.target_font_size = parseInt(this.options.width / t)), (this.font_size = Math.max(this.options.min, Math.min(this.options.max, this.target_font_size)));
                    }),
                    (t.prototype.truncate = function () {
                        var e, t, n, r, i;
                        if (this.font_size > this.target_font_size) {
                            (r = ""), (i = 3 * this.quickfit_helper.get_meassure(".") * this.font_size), (e = 0);
                            while (i < this.options.width && e < this.text.length) (n = this.text[e++]), t && (r += t), (i += this.font_size * this.quickfit_helper.get_meassure(n)), (t = n);
                            return r.length + 1 === this.text.length ? (r = this.text) : (r += "..."), (this.text_was_truncated = !0), this.element.attr("data-quickfit", this.text).html(r);
                        }
                        if (this.previously_truncated) return this.element.html(this.text);
                    }),
                    t
                );
            })()),
            (e.fn.quickfit = function (e) {
                return this.each(function () {
                    return new t(this, e).fit();
                });
            })
        );
    })(jQuery, window);
var Store = {
    defaults: { cutoffWidth: 768 },
    init: function (e, t) {
        var n = /\/admin\/design/.test(top.location.pathname),
            r = $(window),
            i = $(document).width();
        t = $.extend(this.defaults, t);
        if (e == "home" || "products" || "product") {
            $(".product, #product, #gallery").each(function () {
                $(this).imagesLoaded(function () {
                    $(this).find(".spinner").fadeOut(),
                        $(".product, #product").find(".product_images.galy").flexslider({ animation: "slide", easing: "swing", animationSpeed: 500, directionNav: !1, slideshow: !1, smoothHeight: !0 }),
                        $("#gallery .product_images.galy").flexslider({ animation: "slide", easing: "swing", animationSpeed: 500, directionNav: !1, slideshow: !0, smoothHeight: !0 }),
                        $(this).find(".slides img").attr("style", "opacity: 1");
                });
            }),
                "ontouchstart" in document.documentElement ||
                    $(".product_images.galy").click(function (e) {
                        e.preventDefault(), $(this).flexslider("next");
                    });
            var s = $("#products_page .canvas.grid #products");
            $(s).imagesLoaded(function () {
                s.isotope({ itemSelector: ".product", layoutMode: "fitRows", resizable: !0 });
            }),
                $("#options_button, #cat_button").on("click", function (e) {
                    e.preventDefault(),
                        e.stopPropagation(),
                        $(this).addClass("selected"),
                        $(this).parent().children("#options_menu").show(),
                        $(this).children("span.label").text("Select an Option"),
                        $("#options_button").children("span.arrow").toggle();
                }),
                $("#product_sharing > a").click(function (e) {
                    e.preventDefault(), e.stopPropagation(), $("#product_sharing ul").fadeToggle();
                }),
                $("#close_sharing").click(function (e) {
                    e.preventDefault(), e.stopPropagation(), $("#product_sharing ul").fadeToggle();
                }),
                $("html, #options_menu").on("click", function () {
                    $("#options_button.selected").children("span.label").text("Buy Now"),
                        $("#options_button.selected").children("span.arrow").toggle(),
                        $("#options_button").removeClass("selected"),
                        $("#options_menu").hide(),
                        $("#product_sharing ul:visible").fadeToggle();
                }),
                $("#product #options_menu li").on("click", function () {
                    var e = $(this).text(),
                        t = $(this).attr("id");
                    $(this).parents("form").children('input[type="hidden"]').attr("value", t), $(this).parents("form").children("#product-addtocart").click();
                });
        }
        if (e == "cart") {
            var o = $("#cart-form");
            $("#checkout-btn").click(function (e) {
                e.preventDefault(), o.append('<input type="hidden" name="checkout" value="1">').submit();
            }),
                $(".remove_item").click(function (e) {
                    e.preventDefault(), $(this).closest("li").find(".quantity_input input").val(0), o.submit();
                });
        }
    },
};
