/*!
 * Bootstrap: popover-x.js v3.3.1
 * fork url: https://github.com/icai/bootstrap-popover-x
 * Licensed under MIT
 * don't complete , don't fork
 *  
 */
! function($) {
    var PopoverX = function(element, options) {
        var self = this;
        this.options = options;
        this.$element = $(element).on('click.dismiss.popoverX', '[data-dismiss="popover-x"]', $.proxy(this.hide, this));
        this.init();
    }

    PopoverX.VERSION = '3.3.1'

    PopoverX.TRANSITION_DURATION = 150

    PopoverX.DEFAULTS = $.extend({}, $.fn.modal.Constructor.defaults, $.fn.popover.Constructor.DEFAULTS, {
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-fonter"></div></div>'
        keyboard: true,
        buttons: {},
        fonter: ''

    })

    PopoverX.prototype = $.extend({}, $.fn.modal.Constructor.prototype, $.fn.popover.Constructor.prototype);


    PopoverX.prototype.constructor = PopoverX;
    PopoverX.prototype.init = function() {
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


    Popover.prototype.setContent = function() {
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
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-fonter').hide()
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


    PopoverX.prototype.show = function(_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.popoverX', {
            relatedTarget: _relatedTarget
        })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

      var $tip = this.tip()

      var tipId = this.getUID(this.type)


        this.escape()
        this.resize()

        this.$element.on('click.dismiss.bs.popover-x', '[data-dismiss="popover-x"]', $.proxy(this.hide, this))

        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            if (that.options.backdrop) that.adjustBackdrop()

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.popoverX', {
                relatedTarget: _relatedTarget
            })

            transition ?
                that.$element.find('.popover-dialog') // wait for modal to slide in
                .one('bsTransitionEnd', function() {
                    that.$element.trigger('focus').trigger(e)
                })
                .emulateTransitionEnd(PopoverX.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
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

        $target.one('show.bs.modal', function(showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function() {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })

}(jQuery);
