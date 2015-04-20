define('apps/bill/bill', function(require, exports) {
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        billData = eval("(" + $('.j-bill-data').val() + ")"),
        userData = eval("(" + $('.j-users').val() + ")"),
        $useroptions = $('#useroptions'),
        socket = io.connect(),
        CUSER = window.CUSER,
        fqadmin = window.FQUSER;

    // 设置underscore模板边界符号
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    // 餐馆详细信息
    var InfoView = Backbone.View.extend({
        el: $(".j-inner-wrap"),
        events: {
            'mouseenter .j-details': 'fnShowDetails',
            'mouseleave .j-details': 'fnHideDetails',
            'click .j-item-hd': 'fnShowBill'
        },
        initialize: function() {
            var self = this;
            $(function() {
                var _user = '';
                $.each(userData, function(i, user) {
                    _user += '<option value="' + user.name + '">' + user.name + '</option>';
                });
                $useroptions.html(_user);
            });
        },
        fnShowDetails: function(e) {
            $(e.currentTarget).addClass('over');
        },
        fnHideDetails: function(e) {
            $(e.currentTarget).removeClass('over');
        },
        fnShowBill: function(e) {
            var $self = $(e.currentTarget),
                $next = $self.next();
            $next.toggle();
        }
    });

    new InfoView;


    console.log(billData)
    console.log(userData)


});
