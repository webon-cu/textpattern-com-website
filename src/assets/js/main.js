(function ()
{
    'use strict';

    document.documentElement.className = 'js';

    // Detect whether jQuery v2 features required, otherwise use jQuery v1 for higher compatibility.

    var jqueryVersion = '1.11.3';

    if (typeof JSON !== 'undefined' && 'querySelector' in document && 'addEventListener' in window) {
        jqueryVersion = '2.1.4';
    }

    requirejs.config({
        paths:
        {
            'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/'+jqueryVersion+'/jquery.min',
            'jqueryui': 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min',
            'flowplayer': 'flowplayer/flowplayer.min'
        },
        shim:
        {
            'cookie.@@timestamp': ['jquery'],
            'jqueryui': ['jquery']
        }
    });

    // Detect whether browser supports SVG format.

    define('feature', function ()
    {
        return {
            svg: function ()
            {
                return document.createElementNS || document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
            }
        };
    });

    // Detect whether user enabled 'Do No Track' in their browser, and honour it.

    define('track', function ()
    {
        return {
            allow : navigator.doNotTrack !== 'yes' && navigator.doNotTrack !== '1' && navigator.doNotTrack !== 1
        };
    });

    require(['jquery'], function ($)
    {
        // Load objects as variables.

        var code = $('pre code'),
            details = $('details'),
            fields = $('form textarea'),
            vidplayer = $('.videoplayer');

        // Syntax highlighting, via 'Google Code Prettify'.
        // Automatically applies syntax highlighting to `pre code` HTML elements.
        // More info - https://github.com/tcollard/google-code-prettify.

        if (code.length)
        {
            code.parent().addClass('prettyprint');

            require(['prettify.@@timestamp'], function ()
            {
                prettyPrint();
            });
        }

        // Details polyfill, via 'jQuery Details'.
        // Adds `details` and `summary` HTML elements for unsupported browsers.
        // More info - https://github.com/mathiasbynens/jquery-details.
        // Browser support info - http://caniuse.com/#feat=details.

        if (details.length) {
            require(['details.@@timestamp'], function ()
            {
                details.details();
                $('html').addClass($.fn.details.support ? 'details' : 'no-details');
            });
        }

        // Auto-growing textareas, via 'Autosize'.
        // Allows dynamic resizing of textarea height, so that it grows as based
        // on visitor input. More info - https://github.com/jackmoore/autosize.

        if (fields.length) {
            require(['autosize.@@timestamp'], function ()
            {
                fields.autosize();
            });
        }

        // HTML5 videos (with Flash fallback), via 'Flowplayer'.
        // More info - https://github.com/flowplayer/flowplayer.

        if (vidplayer.length) {
            require(['flowplayer'], function ()
            {
                vidplayer.flowplayer({
                    splash: true,
                    ratio: 0.417
                });
            });
        }
    });

    // If no SVG support, replace SVGs with PNGs.

    require(['jquery', 'feature'], function ($, supports)
    {
        if (!supports.svg) {
            $('img.svg').attr('src', function ()
            {
                return $(this).attr('src').replace('.svg', '.png');
            });
        }
    });

    // Responsive navigation menu, via 'Responsive Nav'.
    // More info - https://github.com/viljamis/responsive-nav.js.

    require(['responsivenav.@@timestamp'], function ()
    {
        responsiveNav('.site-navigation', {
            transition: 400,
            insert: 'before',
            navClass: 'site-navigation'
        });
    });

    // `picture` tag and/or `img` tag with `srcset` and `sizes` attributes polyfill, via 'Picturefill'.
    // More info - https://github.com/scottjehl/picturefill.

    require(['jquery'], function ($)
    {
        if ($('img[srcset], img[sizes], picture').length) {
            require(['picturefill.@@timestamp']);
        }
    });

    // EU-cookie disclaimer, via 'jquery.cookie'.
    // More info - https://github.com/carhartl/jquery-cookie.

    require(['jquery', 'cookie.@@timestamp'], function ($)
    {
        if (!$.cookie('acceptedCookies'))
        {
            var disclaimer = $('<aside id="cookie-disclaimer"><div class="container"><p><strong>This website uses cookies to enhance your experience.</strong> By continuing to use this website you agree to cookies being placed on your computer. If you wish to use this website but do not wish for cookies to be placed on your computer you can change the settings in your internet browser. <a href="#" data-action="close">Close</a>.</p></div></aside>');
            $('body').prepend(disclaimer);
            $.cookie('acceptedCookies', 1, {expires: 1461});

            disclaimer.find('a').on('click', function (e)
            {
                e.preventDefault();

                disclaimer.slideUp('fast', function ()
                {
                    disclaimer.remove();
                });
            });
        }
    });

    require(['track'], function(track)
    {
        if (track.allow) {
            // Google Analytics - remember to amend the user account ID number!

            window._gaq = window._gaq || [];
            window._gaq.push(['_setAccount', 'UA-xxxxxxxx-x']);
            window._gaq.push(['_setDomainName', 'none']);
            window._gaq.push(['_gat._anonymizeIp']);
            window._gaq.push(['_setVisitorCookieTimeout', 0]);
            window._gaq.push(['_setSessionCookieTimeout', 0]);
            window._gaq.push(['_setCampaignCookieTimeout', 0]);
            window._gaq.push(['_trackPageview']);
            require(['//www.google-analytics.com/ga.js']);
        }
    });

})();
