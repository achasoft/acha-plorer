/*
 * PLUGINS
 * */
(function ($) {
    function startTrigger(e) {
        var $elem = $(this);
        $elem.data('mouseheld_timeout', setTimeout(function () {
            $elem.trigger('mouseheld');
        }, e.data));
    }

    function stopTrigger() {
        var $elem = $(this);
        clearTimeout($elem.data('mouseheld_timeout'));
    }


    var mouseheld = $.event.special.mouseheld = {
        setup: function (data) {
            // the first binding of a mouseheld event on an element will trigger this
            // lets bind our event handlers
            var $this = $(this);
            $this.bind('mousedown', +data || mouseheld.time, startTrigger);
            $this.bind('mouseleave mouseup', stopTrigger);
        },
        teardown: function () {
            var $this = $(this);
            $this.unbind('mousedown', startTrigger);
            $this.unbind('mouseleave mouseup', stopTrigger);
        },
        time: 750 // default to 750ms
    };
})(jQuery);

(function ($) {

    var mouseHeldHanlder;
    var startTrigger = function (data) {
        var $elem = $(this);
        mouseHeldHanlder = setInterval(function () {
            $elem.trigger('mouseheldThrottle');
        }, 300);
    };
    var stopTrigger = function () {
        clearInterval(mouseHeldHanlder);
    };

    var mouseThrottle = $.event.special.mouseheldThrottle = {
        setup: function (data) {
            var $this = $(this);
            $this.bind('mousedown', +data || mouseThrottle.time, startTrigger);
            $this.bind('mouseleave mouseup', stopTrigger);
        },
        teardown: function () {
            var $this = $(this);
            $this.unbind('mousedown', startTrigger);
            $this.unbind('mouseleave mouseup', stopTrigger);
        },
        time: 750
    };
})(jQuery);
//-------------------------------------------------------------

(function ($, window, document, undefined) {
    $(document).ready(function () {
        //handle tabs
        $('.tabs-header a').click(function () {
            var item = $(this);
            var id = parseInt(item.attr('data-tab'), 10);
            var tabs = $('.tabs-header li').removeClass('active');
            item.parent().addClass('active');
            var contents = $('.tab-content');
            contents.removeClass('active');
            contents.eq(id - 1).addClass('active');
        });
        var parseValue = function (val) {
            val = (val || '').replace('px', '');
            var num = parseInt(val, 10);
            if (isNaN(num)) return 0;
            return num;
        };
        var slideHandlerLeft = $('.tabs-content .left-slide-handler');
        var slideHandlerRight = $('.tabs-content .right-slide-handler');
        var slideOnWindowResize = _.throttle(function(){
            var width = $(this).width();
            var totalWidth = 0;
            $('.tab-content.active .section').each(function (i) {
                totalWidth += $(this).outerWidth();
            });

            var needSlide = width < totalWidth;
            if (!needSlide) totalWidth = width;

            $('.tab-content.active')
                .css('left', 0)
                .width(totalWidth + 1)
                .parent()
                .width(width)
                .removeClass(needSlide ? '' : 'slide')
                .addClass(needSlide ? 'slide' : '');
        }, 100, true);
        var scroll = function (amount) {
            var elem = $('.tab-content.active');
            var left = parseValue(elem.css('left')) + amount;
            var gap = elem.width() - $('.tabs-content').width();

            if (amount > 0) {
                if (left > 25) left = 25;
            } else if (Math.abs(left) > gap + 25) {
                left = -(gap + 25);
            }
            elem.css('left', left);
        };
        var scrollDebounce = _.throttle(scroll, 200, true);
        slideHandlerLeft.click(function () {
            scrollDebounce(+50);
        });
        slideHandlerRight.click(function () {
            scrollDebounce(-50);
        });
        slideHandlerLeft.on('mouseheldThrottle', {time: 999}, function () {
            scrollDebounce(+100);
        });
        slideHandlerRight.on('mouseheldThrottle', {time: 999}, function () {
            scrollDebounce(-100);
        });

        var slide2HandlerLeft = $('.path-inner-container .left-slide-handler');
        var slide2HandlerRight = $('.path-inner-container .right-slide-handler');

        var siblingsWidth = 0;
        var totalWidth = 0;
        var slide2OnWindowResize = _.throttle(function(){
            var parent = $('.path-inner-container');
            if(!siblingsWidth){
                parent.siblings().each(function(i, e){
                    siblingsWidth += $(e).outerWidth();
                });
            }

            var parentWidth = parent.parent().outerWidth() - siblingsWidth;
            var container = $('.root-folders');
            if(!totalWidth){
                $('.path-inner-container .root-folder').each(function (i) {
                    totalWidth += $(this).outerWidth();
                });
            }
            var needSlide = parentWidth < totalWidth;
            if (!needSlide) totalWidth = parentWidth;
            container
                .css('left', 0)
                .width(totalWidth)
                .parent()
                .removeClass(needSlide ? '' : 'slide')
                .addClass(needSlide ? 'slide' : '');

            parent.width(parentWidth-2);

        }, 100, true);
        var scroll2 = function (amount) {
            var elem = $('.path-inner-container .root-folders');
            var left = parseValue(elem.css('left')) + amount;
            var gap = elem.width() - elem.parent().width();

            if (amount > 0) {
                if (left > 25) left = 25;
            } else if (Math.abs(left) > gap + 25) {
                left = -(gap + 25);
            }
            elem.css('left', left);
        };
        var scroll2Debounce = _.throttle(scroll2, 200, true);
        slide2HandlerLeft.click(function () {
            scroll2Debounce(+50);
        });
        slide2HandlerRight.click(function () {
            scroll2Debounce(-50);
        });
        slide2HandlerLeft.on('mouseheldThrottle', {time: 999}, function () {
            scroll2Debounce(+100);
        });
        slide2HandlerRight.on('mouseheldThrottle', {time: 999}, function () {
            scroll2Debounce(-100);
        });


        $('.btn-delete button').click(function () {
            $('body').addClass('show-modal');
        });

        $('.modal-header .actions button.close').click(function () {
            $('body').removeClass('show-modal');
        });

        $('.aui-navigation-bar .show-sub-folders').click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('.aui-navigation-bar .show-sub-folders ul').css('display', 'none');
            var $elem = $(this);
            $elem.find('ul').css('display', 'block');
        });

        //drop handler
        var dropHandlersMenu = $('.drop-handler');
        dropHandlersMenu.click(function (e) {
            e.preventDefault();
            e.stopPropagation();

            var item = $(this);
            dropHandlersMenu
                .removeClass('active');

            item.addClass('active');
        });

        var viewer = $('.aui-file-explorer-preview');
        var clearViwerClasses = function(){
            viewer.removeClass('x-large')
            .removeClass('medium')
            .removeClass('detailed')
            .removeClass('large')
            .removeClass('small')
            .removeClass('tiles');
            $('.section .section-content .button').removeClass('active');
        };
        $('.vw-x-large-btn').click(function(){
            clearViwerClasses();
            viewer.addClass('x-large');
            viewer.find('.aui-icon-20, .aui-icon-40, .aui-icon-50, .aui-icon-70')
                .removeClass('aui-icon-20')
                .removeClass('aui-icon-40')
                .removeClass('aui-icon-50')
                .removeClass('aui-icon-70')
                .addClass('aui-icon-70');
            $(this).parent().addClass('active');
        });
        $('.vw-medium-btn').click(function(){
            clearViwerClasses();
            viewer.addClass('medium');
            viewer.find('.aui-icon-20, .aui-icon-40, .aui-icon-50, .aui-icon-70')
                .removeClass('aui-icon-20')
                .removeClass('aui-icon-40')
                .removeClass('aui-icon-50')
                .removeClass('aui-icon-70')
                .addClass('aui-icon-40');
            $(this).parent().addClass('active');
        });
        $('.vw-details-btn').click(function(){
            clearViwerClasses();
            viewer.addClass('detailed');
            viewer.find('.aui-icon-20, .aui-icon-40, .aui-icon-50, .aui-icon-70')
                .removeClass('aui-icon-20')
                .removeClass('aui-icon-40')
                .removeClass('aui-icon-50')
                .removeClass('aui-icon-70')
                .addClass('aui-icon-20');
            $(this).parent().addClass('active');
        });
        $('.vw-large-btn').click(function(){
            clearViwerClasses();
            viewer.addClass('large');
            viewer.find('.aui-icon-20, .aui-icon-40, .aui-icon-50, .aui-icon-70')
                .removeClass('aui-icon-20')
                .removeClass('aui-icon-40')
                .removeClass('aui-icon-50')
                .removeClass('aui-icon-70')
                .addClass('aui-icon-50');
            $(this).parent().addClass('active');
        });
        $('.vw-small-btn').click(function(){
            clearViwerClasses();
            viewer.addClass('small');
            viewer.find('.aui-icon-20, .aui-icon-40, .aui-icon-50, .aui-icon-70')
                .removeClass('aui-icon-20')
                .removeClass('aui-icon-40')
                .removeClass('aui-icon-50')
                .removeClass('aui-icon-70')
                .addClass('aui-icon-20');
            $(this).parent().addClass('active');
        });
        $('.vw-tiles-btn').click(function(){
            clearViwerClasses();
            viewer.addClass('tiles');
            viewer.find('.aui-icon-20, .aui-icon-40, .aui-icon-50, .aui-icon-70')
                .removeClass('aui-icon-20')
                .removeClass('aui-icon-40')
                .removeClass('aui-icon-50')
                .removeClass('aui-icon-70')
                .addClass('aui-icon-40');
            $(this).parent().addClass('active');
        });

        var fileAndFolders = viewer.find('.file, .folder');
        fileAndFolders.click(function(e){
            e.preventDefault();
            e.stopPropagation();
            fileAndFolders.removeClass('selected').removeClass('focused');
            $(this).addClass('selected');
        });

        $(document).click(function(){
            viewer.find('.file.selected, .folder.selected').removeClass('selected').addClass('focused');
        });

        $('.vw-select-all-btn').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var elems =  viewer.find('.file, .folder');
            elems.removeClass('focused');
            elems.addClass('selected');
        });
        $('.vw-select-none-btn').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var elems =  viewer.find('.file, .folder');
            elems.removeClass('focused');
            elems.removeClass('selected');
        });
        $('.vw-invert-selection-btn').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var elems =  viewer.find('.file, .folder');
            elems.removeClass('focused');
            elems.toggleClass('selected');
        });

        $(document).click(function () {
            $('.aui-navigation-bar .show-sub-folders ul').css('display', 'none');

            dropHandlersMenu
                .removeClass('active');
        });

        var onWindowResize = function (e) {
            slide2OnWindowResize();
            slideOnWindowResize();
        };
        $(window).resize(onWindowResize);
        onWindowResize();
        setTimeout(onWindowResize, 50);
    });
})(jQuery, window, document);