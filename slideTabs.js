(function ($) {
    'use strict';

    var adaptTabs = window.adaptTabs || {};

    adaptTabs = (function () {
        function adaptiveTabs(element, settings) {
            var _ = this,
                dataSetting,
                defaults = {
                    wrapperClass: '.tabs-wrapper',
                    prevButton: $('<button type="button" class="prev-tab" />'),
                    nextButton: $('<button type="button" class="next-tab" />'),
                    tabLabel: '.tabs-label',
                    tabContent: '.tabs-content',
                    adaptive: true,
                    onInit: function () {
                    },
                    afterChange: function () {
                    }
                };

            dataSetting = $(element).data('tabs');

            _.options = $.extend({}, defaults, settings);
            _.tabs = $(element);
            _.wrapper;
            _.tabsLabel = $(element).find(_.options.tabLabel);
            _.tabsContent = $(dataSetting).find(_.options.tabContent);
            _.currentTab = 0;
            _.tabsCount = _.tabsLabel.length - 1;
            _.isScrolling = false;
            _.changeTab = $.proxy(_.changeTab, _);
            _.prevTab = $.proxy(_.prevTab, _);
            _.nextTab = $.proxy(_.nextTab, _);
            _.init();
            _.setActiveTab(_.currentTab);
            _.checkResponsive();
        }

        return adaptiveTabs;
    }());

    adaptTabs.prototype.init = function () {
        var _ = this;

        _.tabsLabel.on('click', _.changeTab);
        _.tabs.addClass('tabs-init');

        $(window).on('resize', _.checkResponsive());
        _.options.onInit();
    };

    adaptTabs.prototype.initSlide = function () {
        var _ = this;

        _.isScrolling = true;
        _.tabs.addClass('is-scrolled');
        _.wrapper = _.tabs.wrapInner('<div class="tabs-scroll"/>').children();
        _.$prevArrow = $(_.options.prevButton);
        _.$nextArrow = $(_.options.nextButton);
        _.tabs.append(_.$prevArrow, _.$nextArrow);

        _.$prevArrow.on('click', _.prevTab);
        _.$nextArrow.on('click', _.nextTab);
    };

    adaptTabs.prototype.checkResponsive = function () {
        var _ = this,
            currentWidth = _.tabs.width();

        if (!_.isScrolling) {
            _.tabsLabel.each(function () {
                var r = $(this).position().left + $(this).width();

                if (r > currentWidth) {
                    _.initSlide();
                    return false;
                }
            });
        }
    };

    adaptTabs.prototype.setActiveTab = function (index) {
        var _ = this,
            index = index || _.currentTab,
            $label = $(_.tabsLabel[index]),
            $tab = $(_.tabsContent[index]);

        $label.parent().addClass('is-active').siblings().removeClass('is-active');
        $tab.attr('aria-hidden', false).addClass('is-active').siblings().removeClass('is-active').attr('aria-hidden', true);

        _.tabs.trigger('tabs.change', index);
        $tab.trigger('tabs.change');

        _.options.afterChange();
    };

    adaptTabs.prototype.changeTab = function (event) {
        var _ = this,
            $target = $(event.currentTarget);
        event.preventDefault();

        _.currentTab = _.tabsLabel.index($target);

        _.setActiveTab();
    };
    adaptTabs.prototype.slideTab = function () {
        var _ = this,
            transform = {
                "-webkit-transform": "translate(-" + _.currentTab * 100 + "% , 0)",
                "-ms-transform": "translate(-" + _.currentTab * 100 + "% , 0)",
                "transform": "translate(-" + _.currentTab * 100 + "% , 0)"
            };

        _.wrapper.css(transform);

        if (_.currentTab != 0) {
            _.$prevArrow.fadeIn();
        } else {
            _.$prevArrow.fadeOut();
        }

        if (_.currentTab != _.tabsCount) {
            _.$nextArrow.fadeIn();
        } else {
            _.$nextArrow.fadeOut();
        }

        _.setActiveTab();
    };

    adaptTabs.prototype.prevTab = function () {
        var _ = this;

        _.currentTab = _.currentTab == 0 ? 0 : --_.currentTab;
        _.slideTab();
    };

    adaptTabs.prototype.nextTab = function () {
        var _ = this;

        _.currentTab = _.currentTab == _.tabsCount ? _.tabsCount : ++_.currentTab;
        _.slideTab();
    };

    $.fn.adaptTabs = function () {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].adaptTabs = new adaptTabs(_[i], opt);
            else
                ret = _[i].adaptTabs[opt].apply(_[i].adaptTabs, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };
}(jQuery));


$(window).on('load', function () {
    $('[data-tabs]').adaptTabs();
});