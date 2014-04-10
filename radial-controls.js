(function($) {
var TWO_PI = 2*Math.PI;

var defaultOptions = {
    $triggers: null,
    controls: null,
    centerOnCursor: true
};


$.fn.radialControls = function(userOptions) {

    var $container = this,
        $body = $('body'),
        $main,
        $linksParent,
        $links,
        $wheel,
        $overlay,
        options = $.extend({}, defaultOptions, userOptions),
        mainHalfWidth,
        count,
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
            $link.bind('click', control.onclick);

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

        $container.append(
            $overlay,
            $main.append(
                $wheel,
                $linksParent.append(
                    $links
                )
            )
        );

        return $container;
    }

    function showControls(event) {
        $container.show();
        $main.addClass('expanded');

        setupControls();

        $main.css({
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
        $main.unbind('click');

        var mx = event.pageX - $main.offset().left;
        var my = event.pageY - $main.offset().top;

        var cx = mainHalfWidth + 30;
        var cy = mainHalfWidth + 30;

        var rx = (mx - cx);
        var ry = -(my - cy);

        var d = Math.sqrt(rx*rx + ry*ry);

        if(d > mainHalfWidth*2.2 || d < mainHalfWidth*0.3) {
            return;
        }

        var angle = Math.atan2(ry, rx);
        var sector = Math.round(angle/arcAngle);

        var index = sector >= 0 ? sector : $links.length + sector;

        var $highlight = $links.eq(index).addClass('rc-focus');

        // $main.bind('click', options.controls[index].onclick);
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