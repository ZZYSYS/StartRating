var rating = (function() {
	//选择模式(整颗、半颗、四分之一颗)
	var strategies = {
		entire: function() {
			return 1;
		},
		half: function() {
			return 2;
		},
		quarter: function() {
			return 4;
		}
	};
	
	var Light = function(element, options) {
		this.$starBox = $(element);
		this.options = options;
		this.$starDis = this.$starBox.find(".ratingDisplay");
		this.starWidth = 26;
	};
	Light.prototype.init = function() {
		this.setTotalStar();
		this.setLightStar();
		if(!this.options.readOnly) {
			this.bindEvent();
		}
	};
	Light.prototype.setTotalStar = function() {
		this.$starBox.width(this.options.total * this.starWidth);
	};
	Light.prototype.setLightStar = function() {
		this.$starDis.width(this.options.num * this.starWidth);
	};
	//绑定事件
	Light.prototype.bindEvent = function() {
		var self = this;
		self.$starBox.on("mousemove", this.$starDis, function(e) {
			var disLeft = (e.pageX - $(this).offset().left) / self.starWidth;
			var num = self.getStarNum(disLeft);
			self.$starDis.width(num * self.starWidth);
		}).on("click", this.$starDis, function(e) {
			var num = self.getStarNum((e.clientX - $(this).offset().left) / self.starWidth);
			self.options.num = num;
			(typeof self.options.chosen === "function") && self.options.chosen.call(this);
			self.$starBox.trigger("chosen");
		}).on("mouseout", function() {
			self.$starDis.width(self.options.num * self.starWidth);
		});
	};
	//获取星星数量
	Light.prototype.getStarNum = function(disLeft) {
		var toStarLeft = disLeft - parseInt(disLeft);
			if(!strategies[this.options.mode]) {
				this.options.mode = "entire";
			}
			mode = strategies[this.options.mode]();
			compare = 1 / mode;
		var k = compare;
		for(var i = 0; i < mode; i++) {
			if(toStarLeft < k) {
				return parseInt(disLeft) + k;
			}
			k += compare;
		}
	};
	Light.prototype.unBindEvent = function() {
		this.$starBox.off();
	};
	//默认参数
	var DEFAULT = {
		mode: "entire",
		total: 6,
		num: 2,
		readOnly: false,
		chosen: function() {}
	}
	
	var init = function(element, option) {
		var options = $.extend({}, DEFAULT, (typeof option === "object") && option),
			rating = $(element).data("rating");
		if(!rating) {
			$(element).data("rating", (rating = new Light(element, options)));
			rating.init();
		}
		if(typeof option === "string") {
			rating[option]();
		}
	}
	
	$.fn.extend({
		rating: function(option) {
			return this.each(function() {
				init(this, option);
			});
		}
	});
	
	return {
		init: init
	}
	
})();

//jQuery方法,参数为：
//模式 model: entire, half, quarter
//总星星数 total
//默认点亮星星数 num
//是否只读 readOnly
//可绑定chosen事件或作为参数出传入,使用rating方法的另一种传参模式：传入一个字符串unBindEvent(即选中后解绑定所有事件,不可再次选择)
$(".ratingBox").rating({
	mode: "half",
	total: 6,
	num: 2.5,
	readOnly: false
//	chosen: function() {
//		$(".ratingBox").rating("unBindEvent");
//	}
}).on("chosen", function() {
	$(".ratingBox").rating("unBindEvent");
});
