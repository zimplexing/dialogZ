(function($) {
    //构造函数
    var DialogZ = function(element, options) {
        //这边两个参数是从 new DialogZ(this,option) 中传过来的
        this.$element = $(element);
        this.options = options;
    };
    // 默认参数
    DialogZ.defaults = {
        //timing for callbacks
        nDefaultTimeOpenDialog: 0,
        nDefaultTimeCloseDialog: 0,
        isOpen: false,
        inProgress: false,
        content: null,
        showButton: false,
        sureBtnText: '确定',
        cancelBtnText: '取消',
        onFirstOpenDialog: function() {
            return false;
        },
        onBeforeOpenDialog: function() {
            return false;
        },
        onOpenDialog: function() {
            return false;
        },
        onBeforeCloseDialog: function() {
            return false;
        },
        onCloseDialog: function() {
            return false;
        },
        onSureClick: function() {
            return false;
        }
    };


    DialogZ.prototype.render = function() {
        var self = this,
            _content,
            bottonGroup;
        if (this.options.content) {
            var _wrap = '<div class="dialog__overlay"></div><div class="dialog__content"></div>';
            this.$element.html(_wrap);
            this.$element.find('.dialog__content').append(this.options.content);
        } else {
            this.$element.find('.dialog__content').append(this.$element.content);
        }
        if (this.options.showButton) {
            bottonGroup = '<div class="dialog__button">' +
                '<button class="dialog__btn dialog__sure">' + this.options.sureBtnText + '</button>' +
                '<button class="dialog__btn dialog__cancel">' + this.options.cancelBtnText + '</button>' +
                '</div>'
            this.$element.find('.dialog__content').append(bottonGroup);
            // 给多个关闭的功能的元素绑定close事件
            this.$element.find('.dialog__cancel').on('click', this.close.bind(this));

            this.$element.find('.dialog__sure').on('click', this.options.onSureClick);
        }


        // esc键关闭dialog
        $(document).on('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            if (keyCode === 27 && self.options.isOpen) {
                self.close();
            }
        });

        var $oDialogOVerlay = this.$element.find('.dialog__overlay');
        if ($oDialogOVerlay.length) {
            $oDialogOVerlay.on('click', this.close.bind(this));
        }
    };


    /**
     * 打开dialog
     */
    DialogZ.prototype.show = function() {
        var _that = this;
        //正在操作dialog（关&闭）
        this.options.inProgress = true;

        if (!this.options.isEverOpen) {
            // 回调第一次打开时的方法
            this.options.onFirstOpenDialog(this);
            this.options.isEverOpen = true;
        }
        setTimeout(function() {
            _that.$element.addClass('dialog--open');

            _that.options.onOpenDialog(_that);

            _that.inProgress = false;

        }, this.options.nDefaultTimeOpenDialog);
        this.options.isOpen = true;
    };

    /**
     * 关闭dialog
     */
    DialogZ.prototype.close = function() {
        this.options.onBeforeOpenDialog(this);

        var _that = this;

        this.options.onBeforeCloseDialog(this);

        setTimeout(function() {
            _that.$element.removeClass('dialog--open');

            _that.options.onCloseDialog(_that);

            _that.inProgress = false;
        }, this.options.nDefaultTimeCloseDialog);

        this.options.isOpen = false;
    };

    function Plugin(option, params) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.DialogZ'),
                options = $.extend({}, DialogZ.defaults, option);

            if (!data) {
                $this.data('bs.DialogZ', (data = new DialogZ(this, options)));
                data.render();
            }

            if (typeof option === 'string') data[option](params);
        })
    }
    //将`DialogZ`这个原型方法赋值给`old`,做一个备份,防止有其他插件名称也为`DialogZ`,而造成冲突
    var old = $.fn.dialogZ
    //对`DialogZ`的原型方法赋值
    $.fn.dialogZ = Plugin
    //重新将`$.fn.DialogZ`的`Constructor`指向为插件的构造函数`DialogZ`,因为`Constructor`可以被认为的修改掉
    $.fn.dialogZ.Constructor = DialogZ
    //防止命名冲突
    $.fn.dialogZ.noConflict = function() {
        $.fn.dialogZ = old
        return this
    }
}(jQuery));