/**
 *  Copyright (C) 2014 Jahed Ahmed
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of
 *  this software and associated documentation files (the "Software"), to deal in the
 *  Software without restriction, including without limitation the rights to use, copy,
 *  modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 *  and to permit persons to whom the Software is furnished to do so, subject to the
 *  following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all copies
 *  or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 *  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 *  CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 *  OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {
var TWO_PI = 2*Math.PI;

var defaultOptions = {
    $triggers: null,
    controls: null,
    centerOnCursor: true,
    distance: 20
};


$.fn.radialControls = function(userOptions) {

    var $container = this,
        options = $.extend({}, defaultOptions, userOptions),
        $body = $('body'),
        $main,
        $linksParent,
        $links,
        $wheel,
        $overlay,
        $wrapper,
        mainHalfWidth,
        arcAngle;

    function buildControls() {
        $container.hide();

        $container.addClass('radial-control');
        $container.bind('click', hideControls);

        $main = $('<div>').addClass('rc-main');
        $linksParent = $('<ul>').addClass('rc-links');

        for(var controlIndex in options.controls) {
            var control = options.controls[controlIndex];

            var $link = $('<li>').addClass('rc-link');

            $link.html(control.text);
            $link.attr({
                'title': control.title
            });

            $linksParent.append($link);
        }

        $links = $linksParent.children();

        options.$triggers.each(function(index) {
            var $trigger = $(this);
            $trigger.addClass('rc-trigger');
            $trigger.bind('click', showControls);
        });

        $wheel = $('<div>').addClass('rc-wheel');
        $overlay = $('<div>').addClass('rc-overlay');
        $wrapper = $('<div>').addClass('rc-wrapper');

        $container.append(
            $overlay,
            $wrapper.append(
                $main.append(
                    $wheel,
                    $linksParent.append(
                        $links
                    )
                )
            )
        );

        return $container;
    }

    function showControls(event) {
        $container.show();
        $main.addClass('expanded');

        setupControls();

        $wrapper.css({
            left: event.pageX + 'px',
            top: event.pageY + 'px'
        });

        $body.bind('mousemove', onMouseMove);
    }

    function setupControls() {
        mainHalfWidth = $linksParent.width()/2;
        arcAngle = TWO_PI / $links.length;

        var linkHalfWidth = $links.width()/2;

        $links.each(function(index) {
            var $link = $(this);

            var currentAngle = arcAngle * index;

            var x = (mainHalfWidth * Math.cos(currentAngle)) + mainHalfWidth - linkHalfWidth;
            var y = -(mainHalfWidth * Math.sin(currentAngle)) + mainHalfWidth - linkHalfWidth;

            $link.css({
                'left': x,
                'top': y,
                'margin': 0
            });
        });
    }

    function onMouseMove(event) {
        $links.removeClass('rc-focus');
        $wrapper.unbind('click');


        var mx = event.pageX - $main.offset().left;
        var my = event.pageY - $main.offset().top;

        var cx = mainHalfWidth + 30;
        var cy = mainHalfWidth + 30;

        var rx = (mx - cx);
        var ry = -(my - cy);

        var d = Math.sqrt(rx*rx + ry*ry);

        if(d > mainHalfWidth*2 + options.distance || d < mainHalfWidth*0.3) {
            $wrapper.css({
                'cursor': ''
            });
            return;
        }

        var angle = Math.atan2(ry, rx);
        var sector = Math.round(angle/arcAngle);

        var index = sector >= 0 ? sector : $links.length + sector;

        var $highlight = $links.eq(index).addClass('rc-focus');

        $wrapper.bind('click', options.controls[index].onclick);
        $wrapper.css({
            'cursor': 'pointer'
        });
    }

    function hideControls() {
        $links.css({
            'top': '',
            'left': '',
            'margin': ''
        });

        $main.removeClass('expanded');
        $container.hide();

        $body.unbind('mousemove', onMouseMove);
    }

    var radialControls = buildControls();
    return radialControls;
};

})(jQuery);