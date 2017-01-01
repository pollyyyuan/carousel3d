
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
		this.lastIndex=0;//当前页面索引
		this.key=0;
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
		//图片的个数
		me.imgNum=me.imgBox.length;
		console.log(me.imgNum);
		//初始化需要移动的距离等
		me.betHeight=-15;
		me.betWidth=(me.box.width()-me.imgBox.width())/2;
		// 初始化节点
		me.initBox();
		me.initDot();
		//初始化方法
		me.initEvent();
		me.autoPlay();
	},
	//初始化img位置
	initBox:function(){
		var me=this;
		var mainBox=me.imgBox.first(),
			nextBox=mainBox.next(),
			prevBox=me.imgBox.last();
		mainBox.css({'transform':'translate3d(0,'+me.betHeight+'px,0)','z-index':4}).addClass('img-active');
		nextBox.css({'transform':'translate3d('+me.betWidth+'px,0,0)','z-index':2});
		prevBox.css({'transform':'translate3d(-'+me.betWidth+'px,0,0)','z-index':3});
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
			me.dotBox.css('margin-left',function(){
				var width=$(this).width();
				return -width/2;
			})
		}
	},
	//节点变换方法
	activeDot:function(dom){
			dom.addClass('dot-active').siblings().removeClass('dot-active');
	},
	getActive:function(direction){
		var me=this;
		var direction=direction||0;
		if(me.lastIndex>me.imgNum-1)
		{
			me.lastIndex=0;
		}
		else if(me.lastIndex<0){
			me.lastIndex=me.imgNum-1;
		}
		else{
			me.lastIndex=me.lastIndex;
		}
		var mainBox=me.imgBox.eq(me.lastIndex);
		var nextBox=(me.lastIndex>me.imgNum-2)?me.imgBox.eq(0):mainBox.next();
		var prevBox=(me.lastIndex<1)?me.imgBox.last():mainBox.prev();
		if(direction){
			var nextnextBox=(me.lastIndex==1)?me.imgBox.last():prevBox.prev();
		}
		else{	
			var nextnextBox=(me.lastIndex==me.imgNum-2)?me.imgBox.eq(0):nextBox.next();
		}
		return [mainBox,nextBox,nextnextBox,prevBox];
	}
	,
	animateDIY:function(direction){
		var me=this;
		var dom=me.getActive(direction);
		var direction=direction||0;
		dom[0].removeClass('img-active').css('z-index',3);
		dom[2].css('z-index',2);
		if(direction){
			dom[1].css('z-index',1);
			dom[3].css('z-index',4).addClass('img-active');
			me.move(dom[0],1);
			me.move(dom[1],0);
			me.move(dom[2],2);
			me.move(dom[3],0,1);
		}
		else{
			dom[1].css('z-index',4).addClass('img-active');
			dom[3].css('z-index',1);
			me.move(dom[0],2);
			me.move(dom[1],0,1);
			me.move(dom[2],1);
			me.move(dom[3],0);
		}
		
	},
	autoPlay:function(){
		var me=this;
		me.timer=setInterval(function(){
			me.key++;
			me.key=(me.key>me.imgNum-1)?0:me.key;
			me.activeDot(me.dotBox.find('span').eq(me.key));
			me.animateDIY();
			me.lastIndex++;
		},5000);
		
	}
	,
	//绑定事件
	initEvent:function(){
		var me=this;
		// 绑定左右按钮显示事件
		me.box.hover(function(){
			me.leftBtn.css('opacity',1);
			me.rightBtn.css('opacity',1);
		},function(){
			me.leftBtn.css('opacity',0);
			me.rightBtn.css('opacity',0);
		});
		// 绑定左右按钮
		me.rightBtn.on('click',function(){
			me.key++;
			me.key=(me.key>me.imgNum-1)?0:me.key;
			me.activeDot(me.dotBox.find('span').eq(me.key));
			me.animateDIY();
			me.lastIndex++;
		});
		me.leftBtn.on('click',function(){
			me.key--;
			me.key=(me.key<0)?me.imgNum-1:me.key;
			me.activeDot(me.dotBox.find('span').eq(me.key));
			me.animateDIY(1);
			me.lastIndex--;
		});
		me.dotBox.find('span').on('mouseenter',function(){
			 var activeIndex=me.dotBox.find('[class="dot-active"]').attr('data-index');
			 var current=$(this);
			 var currentIndex=$(this).attr('data-index');
			 var index=currentIndex-activeIndex;
			 if(index==1)
			 {
			 	me.key++;
				me.key=(me.key>me.imgNum-1)?0:me.key;
				me.activeDot(me.dotBox.find('span').eq(me.key));
				me.animateDIY();
				me.lastIndex++;
			 }
			 else if(index==-1){
			 	me.key--;
				me.key=(me.key<0)?me.imgNum-1:me.key;
				me.activeDot(me.dotBox.find('span').eq(me.key));
				me.animateDIY(1);
				me.lastIndex--;
			 }
			 else{
			 	me.imgBox.removeClass('trans').removeClass('img-active').css({'transform':'translate3d(0,0,0)','z-index':1});
			 	me.key=currentIndex;
			 	me.activeDot(current);
			 	me.lastIndex=currentIndex;
			 	var dom=me.getActive();
			 	dom[0].addClass('img-active').css('z-index',4);
			 	dom[1].css('z-index',3);
			 	dom[3].css('z-index',2);
			 	me.move(dom[0],0,1);
			 	me.move(dom[1],1);
			 	me.move(dom[3],2);
			 }
			
		})
	},
	//w默认0，代表在0位置，1代表在width，2代表在-width
	//h默认0，代表0位置 ，1代表height
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
				width=-me.betWidth;
			break;
			default:
				width=width;
		};
		// console.log(dom+h);
		if(!h)
		{
			height=0;
		}
		dom.addClass('trans').css({
			'transform':'translate3d('+width+'px,'+height+'px,0)','opacity':1});
	}
};
})(jQuery);