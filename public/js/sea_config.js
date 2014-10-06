seajs.config({
    base: '/static/js/',
    alias: {
        'jquery': 'libs/jquery/jquery'
    },
    preload: [],
    map: [
        [/^(.*\.(?:js))(?:.*)$/i, '$1?20140930']
    ]
})