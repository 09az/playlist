
var vm = new Vue({
  el: '#app',
  data: {
  	 index:-1,//当前的记录
  	 labels:{},//导航条label
  	 hidden:true,
  	 old:[],
     data:[],
     source:'',
     poster:'',
     playbackRate:1,//播放速度
     page:1,
     pageSize:12,
     end:'hidden'
  },
  computed: {
    items: function () {
        return this.data.slice(0,this.page * this.pageSize);
    }
  },
  watch: {
  	index: function () {
      if (this.index > -1) {
      	this.labels = this.items[this.index].l;
      }
    }
  },
  methods: {
  	//标签筛选
  	filter: function (label,change) {
  		this.page = 1;
      this.index = -1;
  		this.end = 'hidden';
  		if (label == undefined) {
  			return this.data = this.old;
  		};
  		this.data = this.old.filter(function(value){
    		if (value.l == undefined) return false; //兼容没有label的记录
  			for (var i = 0,len = value.l.length; i < len; i++) {
  				if (value.l[i].v == label) {
  					return true;
  				};
  			};
  		});
      if (change) {
        this.changeview();
      };
      location.hash = '';
  	},
  	//播放页面切换
  	play: function (index) {
  		this.hidden = false;
  		this.index = index;
  		this.source = this.items[index].s;
  		this.poster = this.items[index].p;
        location.href = "#" + (index + 1);
        var listCtn = document.getElementById('list-cantainer');
        listCtn.style.height = "0";
        listCtn.style.overflow = "hidden";
    },
    //下拉加载
    scroll: function (){
    	var offset = document.getElementById('app').offsetHeight - window.innerHeight - window.pageYOffset;
    	if (offset < 50) {
    		if (this.page < this.data.length / this.pageSize) {
    			  this.page += 1;
    			// console.log(this.data.length / this.pageSize)
    			// console.log(this.page);
    	    };
    	    if (this.page >= this.data.length / this.pageSize ) {
    	    	this.end = 'show';
    	    };
    		
    	};
    	
    },
    //定位到锚点
    goback: function (argument) {
    	this.changeview();
      //给地址增加锚
      location.href = location.hash;
  	
    },
    changeview: function (){
      this.hidden = !this.hidden;
      this.source = '';
      this.poster = '';
      document.getElementById('list-cantainer').style.height = "auto";
    },
    //按键处理
    keyhandle: function (video){

    	var video =document.getElementById(video);
    	var	second = 30,//快进秒数
	    	keynum;
		if(window.event) // IE8 及更早IE版本
		{
			keynum=event.keyCode;
		}
		
		
		switch(keynum)
		{
			case 37://左键
			  	video.currentTime -= second;
			  	break;
			case 39://右键
			  	video.currentTime += second;
			  	break;
			case 38://上键
				if (video.muted) {
					video.volume = 0;
				};
				video.muted=false;
				if (video.volume > 0.9) {
					video.volume = 1;
				};
				if (video.volume < 1) {
					video.volume += 0.1;
				};
				
			  	break;
			case 40://下键
				video.muted=false;
				if (video.volume < 0.1) {
					video.volume = 0;
				};
				if (video.volume >0){
					 video.volume -= 0.1;
				}
			  	break;
		  	case 32:// 空格键
		  		video.paused ? video.play() : video.pause();
		  		break;
		  	case 187:// 加号
		  		if (video.playbackRate >= 1 && video.playbackRate < 4) {
		  			video.playbackRate += 0.5;
		  		};
		  		if (video.playbackRate <= 1) {
		  			video.playbackRate *= 2;
		  		};
		  		break;
		  	case 189:// 减号
		  		if (video.playbackRate > 1) {
		  			video.playbackRate -= 0.5;
		  		};
		  		if (video.playbackRate <= 1 && video.playbackRate > 0.25) {
		  			video.playbackRate /= 2;
		  		};
		  		break;
		  	case 48:// 数字0
		  		video.playbackRate = 1;
		  		break;
		}
		this.playbackRate = video.playbackRate;
		//console.log(keynum);
		//console.log(video.playbackRate);

    }
    
  } 
});

//console.log(data);