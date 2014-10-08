seajs.config({
    base: '/static/js/',
    alias: {
        'jquery': 'libs/jquery/jquery',
        'doT': 'libs/doT/doT',
        'underscore': 'libs/underscore/underscore',
        'backbone': 'libs/backbone/backbone'
    },
    preload: [],
    map: [
        [/^(.*\.(?:js))(?:.*)$/i, '$1?20140930']
    ]
})