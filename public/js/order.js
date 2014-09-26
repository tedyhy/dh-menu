define('order', function(require, exports){
    var Class = require('core/lang/class');

    var Base = require('core/lang/base');

    var Order = Base.create({
        elements : {
            '.j-order-num' : 'elOrderNum',
            '.j-order-price' : 'elOrderPrice',
            '.j-order-list' : 'elOrderList',
            '.j-menu-list' : 'elMenuList',

            '.j-input-search' : 'elInputSearch',
            '.j-search-list' : 'elSearchList'
        },
        events : {
            'click .j-order-reset' : 'clickOrderReset',
            'click .j-menu-item' : 'clickMenuItem',
            'click .j-selected-remove' : 'removeItem',

            'keyup .j-input-search' : 'searchMenu',
            'click .j-search-item' : 'clickSearchItem'
        },
        tpl : {
            orderItem : '<li class="j-selected-item" data-id="<%=id%>" data-name="<%=name%>" data-price="<%=price%>"><p><%=name%></p><p><%=username%> <a href="javascript:;" class="j-selected-remove">删除</a></p></li>',
            searchItem : '<li class="j-search-item" data-id="<%=id%>" data-name="<%=name%>" data-price="<%=price%>"><%=name%> ￥<%=price%></li>'
        },
        init : function(){
            var self = this;

            var socket = this.socket = io.connect();

            this.username = null;

            this.menuList = [];

            this.chkUserName();

            this.initOrder();

            this.initMenuList();

            socket.on('menu.select', this.proxy(this.selectMenu));
            socket.on('menu.remove', this.proxy(this.removeMenu));
            socket.on('menu.reset', this.proxy(this.resetMenu));

            $(document).on('click', function(){
                self.elSearchList.hide();
            })
        },
        chkUserName : function(){
            this.username = window.prompt('我知道你的ip是：'+ window.IP +'，所以请输入你的真实名字再点菜。');
        },
        initOrder : function(){
            var self = this,
                num = 0,
                price = 0
                ;

            this.elOrderList.find('.j-selected-item').each(function(){
                num++;
                price += +$(this).attr('data-price');
                self.elMenuList.find('.j-menu-item[data-id="'+ $(this).attr('data-id') +'"]').addClass('selected');
            });

            this.elOrderNum.text(num);
            this.elOrderPrice.text(price);
        },
        initMenuList : function(){
            var list = this.menuList = [];

            this.elMenuList.find('.j-menu-item').each(function(){
                var $e = $(this),
                    id = +$e.attr('data-id'),
                    name = $e.attr('data-name'),
                    price = +$e.attr('data-price'),
                    obj = {
                        id : id, 
                        name : name, 
                        price : price
                    }
                    ;

                list.push(obj);
            })
        },
        hasMenu : function(id){
            return this.el.find('.j-selected-item[data-id="'+ id +'"]').length > 0;
        },
        selectMenu : function(obj){
            var item;

            for(var i in obj){
                item = obj[i];

                if(!this.el.find('.j-selected-item[data-id="'+ item.id +'"]').length){
                    this.addOrderItem(item);
                }
            }
        },
        removeMenu : function(obj){
            this.removeOrderItem(obj);           
        },
        resetMenu : function(){
            this.resetOrder();
        },
        clickMenuItem : function(e){
            var $e = $(e.currentTarget),
                id = +$e.attr('data-id'),
                name = $e.attr('data-name'),
                price = +$e.attr('data-price'),
                obj = {
                    ORDERID : window.ORDERID,
                    username : this.username,
                    id : id, 
                    name : name, 
                    price : price
                }
                ;

            if($e.hasClass('selected')) return;

            if(this.hasMenu(id)){
                alert('这个菜已经点过了，亲。');
                return;
            }

            this.addOrderItem(obj);
            this.socket.emit('server.menu.select', obj);
        },
        clickOrderReset : function(){
            this.resetOrder();

            this.socket.emit('server.menu.reset', {ORDERID : ORDERID});
        },
        removeItem : function(e){
            var $e = $(e.currentTarget),
                $item = $e.closest('.j-selected-item'),
                id = +$item.attr('data-id'),
                name = $item.attr('data-name'),
                price = +$item.attr('data-price'),
                obj = {
                    ORDERID : window.ORDERID,
                    username : this.username,
                    id : id, 
                    name : name, 
                    price : price
                }
                ;

            if(window.confirm('确定要删除吗？')){
                this.removeOrderItem(obj);
                this.socket.emit('server.menu.remove', obj);
            }
        },
        addOrderItem : function(obj){
            if(!this.username){
                this.chkUserName();
                return;
            }
            if(obj){
                this.el.find('.j-menu-item[data-id="'+ obj.id +'"]').addClass('selected');
                this.elOrderList.append(this.tmpl(this.tpl.orderItem, {
                    username : obj.username,
                    id : obj.id,
                    name : obj.name,
                    price : obj.price
                }));

                this.resetPrice(1, obj.price);
            }
        },
        removeOrderItem : function(obj){
            if(obj){
                this.el.find('.j-menu-item[data-id="'+ obj.id +'"]').removeClass('selected');
                this.el.find('.j-selected-item[data-id="'+ obj.id +'"]').remove();

                this.resetPrice(2, obj.price);
            }
        },
        resetOrder : function(){
            this.elOrderList.empty();
            this.elOrderPrice.text('0.00');
            this.elOrderNum.text('0');
            this.elMenuList.find('.selected').removeClass('selected');
        },
        resetPrice : function(type, price){
            var currentPrice = +this.elOrderPrice.text();

            this.elOrderPrice.text(type === 1 ? currentPrice + price : currentPrice - price);

            this.elOrderNum.text(this.elOrderList.children().length);
        },
        searchMenu : function(e){
            var $e = $(e.currentTarget),
                value = $e.val(),
                re = new RegExp(value.replace(/\s/g, '')),
                list = this.menuList,
                $list = this.elSearchList,
                tmpl = this.tmpl,
                tpl = this.tpl,
                code = e.keyCode,
                count = 0,
                $prev,
                $next
                ;

            if($.trim(value) === ''){
                $list.hide();
                return;
            }

            if(code === 38){ // 上箭头
                if($list.is(':visible') && ($prev = this.$currentItem.prev('.j-search-item')).length){
                    $prev.addClass('hover');
                    this.$currentItem.removeClass('hover');
                    this.$currentItem = $prev;
                }
            }else if(code === 40){ // 下箭头
                if($list.is(':visible') && ($next = this.$currentItem.next('.j-search-item')).length){
                    $next.addClass('hover');
                    this.$currentItem.removeClass('hover');
                    this.$currentItem = $next;
                }
            }else if($list.is(':visible') && code === 13){ // 回车
                this.selectSearchItem(this.$currentItem);
            }else{
                $list.hide().empty();

                $(list).each(function(m, n){
                    if(re.test(n.name.replace(/\s/g, ''))){
                        $list.append(tmpl(tpl.searchItem, {
                            id : n.id,
                            name : n.name,
                            price : n.price
                        }));
                        count++;
                    }
                });

                if(count > 0){
                    this.$currentItem = $list.children().eq(0);
                    this.$currentItem.addClass('hover');
                    $list.show();
                }
            }
        },
        clickSearchItem : function(e){
            var $e = $(e.currentTarget);

            this.selectSearchItem($e);

            return false;
        },
        selectSearchItem : function($e){
            if(!$e || !$e.length) return;

            var id = +$e.attr('data-id'),
                name = $e.attr('data-name'),
                price = +$e.attr('data-price'),
                obj = {
                    ORDERID : window.ORDERID,
                    username : this.username,
                    id : id, 
                    name : name, 
                    price : price
                }
                ;

            if($e.hasClass('selected')) return;

            if(this.hasMenu(id)){
                alert('这个菜已经点过了，亲。');
                return;
            }

            this.addOrderItem(obj);
            this.socket.emit('server.menu.select', obj);

            this.elInputSearch.val('');
            this.elSearchList.hide();
        }
    })

    Class.mixin(exports, {
        init : function(){
            new Order();
        }
    })
});

seajs.use('order', function(exports){
    exports.init();
});