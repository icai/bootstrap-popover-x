/*!
 * Bootstrap: popover-x.js v3.3.1
 * fork url: https://github.com/icai/bootstrap-popover-x
 * Licensed under MIT
 * don't complete , don't fork
 *
 */

// bootstrap popover
(function($, undefined){

    $.fn.popover.Constructor.prototype.setContent = function () {
      var $tip    = this.tip()
      var title   = this.getTitle()
      var content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
        this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
      ](content)

      $tip.removeClass('fade top bottom left right bottom-left top-left bottom-right top-right right-top left-top right-bottom left-bottom in')

      // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
      // this manually by checking the contents.
      if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

    $.fn.popover.Constructor.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
               placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
               placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
               placement == 'right' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   } :
               placement == 'bottom-left' ? {top: pos.top + pos.height, left: pos.left + pos.width / 2 - (actualWidth * .10)} :
               placement == 'top-left' ? {top: pos.top - actualHeight,  left: pos.left + pos.width / 2 - (actualWidth * .10)} :
               placement == 'bottom-right' ? {top: pos.top + pos.height, left: pos.left + pos.width / 2 - (actualWidth * .90)} :
               placement == 'top-right' ? {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - (actualWidth * .90)} :
               placement == 'right-top' ? {top: pos.top + pos.height / 2 - (actualHeight *.10), left: pos.left + pos.width} : 
               placement == 'left-top' ? {top: pos.top + pos.height / 2 - (actualHeight *.10), left: pos.left - actualWidth} :
               placement == 'right-bottom' ? {top: pos.top + pos.height / 2 - (actualHeight * .90), left: pos.left + pos.width} :
               /* placement == 'left-bottom' */ {top: pos.top + pos.height / 2 - (actualHeight * .90), left: pos.left - actualWidth}
    }
})(jQuery);

! function($) {
    var PopoverX = function(element, options) {
        this.type = 'popoverX'
        this.options =
        this.$element = null
        this.init(element, options)
    }

    PopoverX.VERSION = '3.3.1'

    PopoverX.TRANSITION_DURATION = 150

    PopoverX.DEFAULTS = {
        template: '<div class="popover" role="dialog"><div class="arrow"></div><div class="popover-dialog"><h3 class="popover-title"></h3><div class="popover-content"></div><div class="popover-fonter"></div></div></div>',
        keyboard: true,
        container: 'body',
        buttons: {},
        fonter: '',
        content: '',
        dismiss: true,
        //animation: true,
        placement: 'right',
        trigger: '', // manual, click
        title: '',
        delay: 0,
        //html: false,
        viewport: {
          selector: 'body',
          padding: 0
        },
        backdrop: true,
        show: true
    }

    PopoverX.prototype = $.extend({}, $.fn.popover.Constructor.prototype);


    PopoverX.prototype.constructor = PopoverX;
    PopoverX.prototype.init = function(element, options) {
        this.$element = $(element);
        this.options = options;
        this.$body = $(document.body);
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
          var trigger = triggers[i]
          if (trigger == 'click') {
            this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
          }
        }
    }

    PopoverX.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
        var placement = this.options.placement
        this.arrow()
          .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
          .css(isHorizontal ? 'top' : 'left', '')

        if(placement.split('-').length == 2){
            this.arrow()
              .css(isHorizontal ? 'left' : 'top', '')
              .css(isHorizontal ? 'top' : 'left', '')
        }

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

        if ($tip.find('.popover-footer').length) {
            $tip
                .removeClass('has-footer')
                .addClass('has-footer');
        }
        if (this.options.remote) {
            $tip.find('.popover-content').load(this.options.remote, $.proxy(function() {
                $tip.trigger('load.complete.popoverX');
            }, this));
        }

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
        if (!$tip.find('.popover-fonter').html()) $tip.find('.popover-fonter').hide()

        $tip.on('click.dismiss.bs.popoverX', '[data-dismiss="popover-x"]', $.proxy(this.hide, this))    

    }

      PopoverX.prototype.enforceFocus = function () {
        var $tip = this.tip()
        $(document)
          .off('focusin.bs.modal') // guard against infinite focus loop
          .on('focusin.bs.modal', $.proxy(function (e) {
            if ($tip !== e.target && !$tip.has(e.target).length) {
              $tip.trigger('focus')
            }
          }, this))
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

    PopoverX.prototype.backdrop = function(callback) {
        var that = this
        if(this.options.backdrop){
            var $tip = this.tip();
            this.$backdrop = $('<div class="popover-backdrop " />')
                .prependTo($tip)
        }
     }

      PopoverX.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
      }


    PopoverX.prototype.show = function(_relatedTarget) {
        var that = this
        var $tip = this.tip()
        var tipId = this.getUID(this.type)

        var e = $.Event('show.bs.popoverX', {
            relatedTarget: _relatedTarget
        })
        $tip.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.backdrop();
        this.setContent()

        $tip.attr('id', tipId)
        this.$element.attr('aria-describedby', tipId)

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

        if (!$tip.parent().length) {
            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
        }


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

        var multi = placement.split('-');
        if(multi.length == 2){
            $tip.addClass(multi[0])
        }

        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
        this.applyPlacement(calculatedOffset, placement)



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






}(jQuery);
