(function($) {
    //构造函数
    var DialogZ = function(element, options) {
        //这边两个参数是从 new DialogZ(this,option) 中传过来的
        this.$element = $(element);
        this.options = options;
        this.$ctrlsClose = this.$element.find('[data-dialog-close]');
        this.initEvents();
    };
    // 默认参数
    DialogZ.defaults = {
        //timing for callbacks
        nDefaultTimeOpenDialog: 0,
        nDefaultTimeCloseDialog: 0,
        isOpen: false,
        inProgress: false,

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

    };

    DialogZ.prototype.onEndAnimation = function(el, callback) {
        var onEndCallbackFn = function(ev) {
            if (support.animations) {
                if (ev.target != this) return;
                this.removeEventListener(this.options.animEndEventName, onEndCallbackFn);
            }
            if (callback && typeof callback === 'function') { callback.call(); }
        };
        if (support.animations) {
            el.addEventListener(this.options.animEndEventName, onEndCallbackFn);
        } else {
            onEndCallbackFn();
        }
    };

    DialogZ.prototype.initEvents = function() {
        var self = this;
        var support = {
                animations: Modernizr.cssanimations
            },
            animEndEventNames = {
                'WebkitAnimation': 'webkitAnimationEnd',
                'OAnimation': 'oAnimationEnd',
                'msAnimation': 'MSAnimationEnd',
                'animation': 'animationend'
            };
        this.options.animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

        // 给多个关闭的功能的元素绑定toggle事件
        this.$ctrlsClose.each(function() {
            $(this).on('click', this.toggle.bind(this));
        });

        // esc键关闭dialog
        $(document).on('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            if (keyCode === 27 && self.isOpen) {
                self.toggle();
            }
        });


        var $oDialogOVerlay = this.$element.find('.dialog__overlay');
        if ($oDialogOVerlay.length) {
            $oDialogOVerlay.on('click', this.toggle.bind(this));
        }
    }

    //外部方法
    DialogZ.prototype.toggle = function(a, b) {
        var self = this;
        //正在操作dialog（关&闭）
        this.options.inProgress = true;

        if (!this.options.isEverOpen) {
            // 回调第一次打开时的方法
            this.options.onFirstOpenDialog(this);
            this.options.isEverOpen = true;
        }

        //关闭
        if (this.options.isOpen) {
            this.options.onBeforeCloseDialog(this);

            var _that = this;

            setTimeout(function() {
                _that.$element.removeClass('dialog--open');
                self.$element.addClass('dialog--open');

                self.onEndAnimation(_that.$element.find('.dialog__content'), function() {
                    self.$element.removeClass('dialog--open');
                });

                _that.options.onCloseDialog(_that);

                _that.inProgress = false;
            }, this.options.nDefaultTimeCloseDialog);
        } else {
            this.options.onBeforeOpenDialog(this);

            var _that = this;

            setTimeout(function() {
                _that.$element.addClass('dialog--open');

                _that.options.onOpenDialog(this_this);

                _that.inProgress = false;

            }, this.options.nDefaultTimeOpenDialog);
        }

        this.options.isOpen = !this.options.isOpen;
    };

    function Plugin(option, params) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.DialogZ'),
                options = $.extend({}, DialogZ.defaults, option);

            if (!data) $this.data('bs.DialogZ', (data = new DialogZ(this, options)));

            if (typeof option === 'string') data[option].call($this, params);
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
