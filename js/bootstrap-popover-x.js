/*!
 * Bootstrap: popover-x.js v3.3.1
 * fork url: https://github.com/icai/bootstrap-popover-x
 * Licensed under MIT
 * don't complete , don't fork
 *
 */
! function($) {
    var PopoverX = function(element, options) {
        this.type = 'popoverX'
        this.options =
        this.$element = null
        this.init(element, options)
    }

    PopoverX.VERSION = '3.3.1'

    PopoverX.TRANSITION_DURATION = 150

    PopoverX.DEFAULTS = $.extend({}, $.fn.modal.Constructor.defaults, $.fn.popover.Constructor.DEFAULTS, {
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-fonter"></div></div>',
        keyboard: true,
        container: 'body',
        buttons: {},
        fonter: ''

    })

    PopoverX.prototype = $.extend({}, $.fn.modal.Constructor.prototype ,{
        tip: $.fn.popover.Constructor.prototype.tip,
        getTitle: $.fn.popover.Constructor.prototype.getTitle,
        getContent: $.fn.popover.Constructor.prototype.getContent,
        getPosition: $.fn.popover.Constructor.prototype.getPosition,
        getCalculatedOffset: $.fn.popover.Constructor.prototype.getCalculatedOffset,
        applyPlacement: $.fn.popover.Constructor.prototype.applyPlacement,
        getViewportAdjustedDelta: $.fn.popover.Constructor.prototype.getViewportAdjustedDelta,
        replaceArrow: $.fn.popover.Constructor.prototype.replaceArrow
    });


    PopoverX.prototype.constructor = PopoverX;
    PopoverX.prototype.init = function(element, options) {
        this.$element = $(element);
        this.options = options;
        this.$body = $(document.body);
        this.$target = this.options.$target;
        if (this.$element.find('.popover-footer').length) {
            this.$element
                .removeClass('has-footer')
                .addClass('has-footer');
        }
        if (this.options.remote) {
            this.$element.find('.popover-content').load(this.options.remote, $.proxy(function() {
                this.$element.trigger('load.complete.popoverX');
            }, this));
        }
    }

    PopoverX.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    PopoverX.prototype.resize = function() {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    }



    PopoverX.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
        ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
        if (!$tip.find('.popover-fonter').html()) $tip.find('.popover-fonter').hide()
    }

    PopoverX.prototype.handleUpdate = function() {


    }

    PopoverX.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.popoverX', $.proxy(function(e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.popoverX')
        }
    }

    PopoverX.prototype.hide = function() {

    }



    PopoverX.prototype.setFonter = function() {

    }


    PopoverX.prototype.backdrop = function(callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .prependTo(this.$element)
                .on('click.dismiss.bs.popoverX', $.proxy(function(e) {
                    if (e.target !== e.currentTarget) return
                    this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
                }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                .one('bsTransitionEnd', callback)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            var callbackRemove = function() {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                .one('bsTransitionEnd', callbackRemove)
                .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    }

    PopoverX.prototype.show = function(_relatedTarget) {
        var that = this
        var $tip = this.tip()
        var tipId = this.getUID(this.type)

        if (!$tip.parent().length) {
            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
        }
       
        var e = $.Event('show.bs.popoverX', {
            relatedTarget: _relatedTarget
        })

        $tip.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return


        $tip.on('click.dismiss.bs.popoverX', '[data-dismiss="popover-x"]', $.proxy(this.hide, this))
        this.isShown = true

        this.setContent()
        this.backdrop();

        $tip.attr('id', tipId)
        this.$element.attr('aria-describedby', tipId)

        $tip
            .addClass('in')
            .attr('aria-hidden', false)

        if (this.options.animation) $tip.addClass('fade')

        var transition = $.support.transition && $tip.hasClass('fade')

        var placement = typeof this.options.placement == 'function' ?
            this.options.placement.call(this, $tip[0], this.$element[0]) :
            this.options.placement


        var autoToken = /\s?auto?\s?/i
        var autoPlace = autoToken.test(placement)
        if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

        $tip
            .detach()
            .css({
                top: 0,
                left: 0,
                display: 'block'
            })
            .addClass(placement)
            .data('bs.' + this.type, this)



        var pos = this.getPosition()
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (autoPlace) {
            var orgPlacement = placement
            var $container = this.options.container ? $(this.options.container) : this.$element.parent()
            var containerDim = this.getPosition($container)

            placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top' :
                placement == 'top' && pos.top - actualHeight < containerDim.top ? 'bottom' :
                placement == 'right' && pos.right + actualWidth > containerDim.width ? 'left' :
                placement == 'left' && pos.left - actualWidth < containerDim.left ? 'right' :
                placement

            $tip
                .removeClass(orgPlacement)
                .addClass(placement)
        }

        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

        this.applyPlacement(calculatedOffset, placement)

        if (that.options.backdrop) that.adjustBackdrop()

        if (transition) {
            $tip[0].offsetWidth // force reflow
        }

        that.enforceFocus()

        var e = $.Event('shown.bs.popoverX', {
            relatedTarget: _relatedTarget
        })

        transition ?
            $tip.find('.popover-dialog') // wait for modal to slide in
            .one('bsTransitionEnd', function() {
                $tip.trigger('focus').trigger(e)
            })
            .emulateTransitionEnd(PopoverX.TRANSITION_DURATION) :
            $tip.trigger('focus').trigger(e)



    }


    // POPOVER-X PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.popover-x')
            var options = $.extend({}, PopoverX.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.popover-x', (data = new PopoverX(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.popoverX

    $.fn.popoverX = Plugin
    $.fn.popoverX.Constructor = PopoverX


    // POPOVER-X NO CONFLICT
    // =================

    $.fn.popoverX.noConflict = function() {
        $.fn.popoverX = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.popover-x.data-api', '[data-toggle="popover-x"]', function(e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option = $target.data('bs.popover-x') ? 'toggle' : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        //$target.trigger('click.target.popoverX');

        $target.one('show.bs.popoverX', function(showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.popoverX', function() {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($this, option, this)
    })

}(jQuery);
