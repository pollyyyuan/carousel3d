
;(function($){
	//对象实例化，转化为方法
	$.extend({
		"carousel3d":function(dom,options){
		var eg=new carousel3d(options);
		return eg.init(dom);
		}
	});
	//创建carousel3d对象
	var carousel3d=function(options,speed){
		this.options=$.extend({
			loop:false,
			speed:500
		},options);
		this.center=0;//当前页面索引
	};	
	carousel3d.prototype={
	// 初始化方法,dom表示页面节点对象，options表示修改参数
	init:function(dom){
		var me=this;
		//获取节点保存至对象
		me.box=dom.box;
		me.imgBox=dom.imgBox;
		me.dotBox=dom.dotBox;
		me.leftBtn=dom.leftBtn;
		me.rightBtn=dom.rightBtn;
		//页面的个数
		me.imgNum=me.imgBox.length;
		console.log(me.imgNum);
		//初始化需要移动的距离等
		me.betHeight=-10;
		console.log('betHeight'+me.betHeight);
		me.betWidth=(me.box.width()-me.imgBox.width())/2;
		console.log('box'+me.box.width());
		console.log('img'+me.imgBox.width());

		console.log('betWidth'+me.betWidth);
		// 初始化节点
		me.initDot();
		me.initBox();
		//初始化方法
		me.initEvent();
	},
	//初始化img位置
	initBox:function(){
		var me=this;
		me.imgBox.css('z-index',1);
		var center=me.imgBox.eq(0);
		console.log(me.imgBox);
		var right=center.next();
		center.css({'transform':'translate3d('+me.betWidth+'px,'+me.betHeight+'px,0)','z-index':4})
			  .addClass('img-active');
		right.css({'transform':'translate3d('+me.betWidth*2+'px,0,0)','z-index':2});
		me.imgBox.last().css('z-index',3);
	},
	//初始化dot点
	initDot:function(){
		var me=this;
		if(me.imgNum)
		{	
			var str='';
			//根据页面个数创建节点
			for(var i=0;i<me.imgNum;i++)
			{
				str+='<span data-index='+i+'></span>';
			}
			//节点加到页面上
			me.dotBox.html(str);
			//增加高亮效果
			me.dotBox.find('span').eq(0).addClass('dot-active');	
		}
	},
	//节点变换方法
	activeDot:function(dom){
			dom.addClass('dot-active').siblings().removeClass('dot-active');
	},
	//绑定事件
	initEvent:function(){
		var me=this;
		// 绑定左右按钮显示事件
		me.box.parent('.content').hover(function(){
			me.leftBtn.css('opacity',1);
			me.rightBtn.css('opacity',1);
		},function(){
			me.leftBtn.css('opacity',0);
			me.rightBtn.css('opacity',0);
		});
		// 绑定左右按钮
		me.rightBtn.on('click',function(){
			me.center=(me.center>me.imgNum-1)?0:me.center;
			var centerb=me.imgBox.eq(me.center);
			var right=(me.center>me.imgNum-2)?me.imgBox.eq(0):centerb.next();
			var left=(me.center==me.imgNum-2)?me.imgBox.eq(0):right.next();
			var leftShow=(me.center<1)?me.imgBox.last():centerb.prev();
			// var center=me.imgBox.eq(me.center),
			// 	right=me.imgBox.eq(me.two),
			// 	left=me.imgBox.eq(me.three);
			 // me.imgBox.css('z-index','1');
			leftShow.css('z-index',1);
			right.addClass('img-active').css('z-index',4);
			me.move(right,1,1);
			me.move(centerb);
			centerb.removeClass('img-active').css('z-index',3);
			me.move(left,2);
			left.css('z-index',2);
			me.center++;
			me.activeDot(me.dotBox.find('span').eq(me.center));
			// console.log('centre='+me.center);
		});
		me.leftBtn.on('click',function(){
			me.center=(me.center>me.imgNum-1)?0:me.center;
			var centerb=me.imgBox.eq(me.center);
			var right=(me.center>me.imgNum-2)?me.imgBox.eq(0):centerb.next();
			var left=(me.center==me.imgNum-2)?me.imgBox.eq(0):right.next();
			var leftShow=(me.center<1)?me.imgBox.last():centerb.prev();
			// var center=me.imgBox.eq(me.center),
			// 	right=me.imgBox.eq(me.two),
			// 	left=me.imgBox.eq(me.three);
			 // me.imgBox.css('z-index','1');
			leftShow.css('z-index',1);
			right.addClass('img-active').css('z-index',4);
			me.move(right,1,1);
			me.move(centerb);
			centerb.removeClass('img-active').css('z-index',3);
			me.move(left,2);
			left.css('z-index',2);
			me.center++;
			if(me.center>2)
			{
			me.activeDot(me.dotBox.find('span').eq(0));
			}
			else{
			me.activeDot(me.dotBox.find('span').eq(me.center));
			}
		});
		
	},
	//w默认0，代表在0位置，1代表在width，2代表在width*2
	//h默认0，代表0位置，1代表height
	move:function(dom,w,h){
		var me=this;
		var width,
			height=me.betHeight,
			w=w||0,
			h=h||0;
		switch(w){
			case 0:
				width=0;
			break;
			case 1:
				width=me.betWidth;
			break;
			case 2:
				width=me.betWidth*2;
			break;
			default:
				width=width;
		};
		// console.log(dom+h);
		if(!h)
		{
			height=0;
		}
		// dom.addClass('trans').css('transform','rotateY(-5deg)');
		dom.addClass('trans').css({
			'transform':'translate3d('+width+'px,'+height+'px,0)','opacity':1});
	}
};
})(jQuery);