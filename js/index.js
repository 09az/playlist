// vm.src = ''
// vm.data.push(
//   {
//     l:[
//       {c:'',v:''},
//       ''
//     ],
//     h:'',
//     p:'',
//     s:'iceage4.mp4'
//   }
// );
// vm.old = vm.data;

Vue.component('rows', {
  // 声明 props
  props: ['item','index','col','filter','play','row','page','label_class'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message” 这样使用
  template: '<div class="col-xs-12" >\
              <a :id="row*index + col"></a>\
              <div class="row">\
                <div class="col-sx-12">\
                  <div class="thumbnail">\
                    <template v-if="!item.p">\
                      <video :name="\'video\'+ page" width="100%" muted :src="item.s" type="video/mp4">\
                    </template>\
                    <template v-else>\
                      <img :src="item.p">\
                    </template>\
                    <div class="caption">\
                      <h6 style="line-height: 2;">\
                        <span class="label label-primary" @click="vm.filter()" style="cursor: pointer;">\
                          {{ row*index + col }}\
                        </span>&shy; \
                        <template v-for="(label,index) in item.l">\
                          <template v-if="label.c">\
                            <span class="label" :class="\'label-\' + label.c" @click="filter(label.v)" style="cursor: pointer;">\
                              <abbr :title="label.z">{{ label.v }}</abbr> \
                            </span>&shy;\
                          </template> \
                          <template v-else>\
                            <span class="label" :class="\'label-\' + label_class[Math.floor((Math.random()*label_class.length))]" @click="filter(label)" style="cursor: pointer;">\
                              <abbr :title="label.z">{{ label }}</abbr> \
                            </span>&shy;\
                          </template> \
                        </template> \
                      </h6>\
                      <p> {{ item.h }} </p>\
                      <p>\
                        <a href="javascript:;" class="btn btn-primary" @click="play(row*index + col)" role="button">播放</a>\
                      </p> \
                    </div> \
                  </div>\
                </div>\
              </div>\
            </div>'  
});

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
     end:'hidden',//没有更多数据了
     currentTime:70,
     rows:{},
     label_class:['danger','warning','info','success','primary'],
  },
  updated:function(){
    var videos = document.getElementsByName('video'+ this.page),
          len = videos.length;
      while (len--){
        // console.log(len)
        // console.log(videos.item(len))
        videos.item(len).currentTime = this.currentTime;
      } 
  },
  computed: {
    items: function () {
        return this.data.slice(0,this.page * this.pageSize);
    },
    row: function (){
      return this.getrows();
    }
  },
  watch: {
  	index: function () {
      if (this.index > -1) {
      	this.labels = this.items[this.index].l;
      }
    },
    items: function(){
     // console.log('watch')
      this.resize();
     // console.log('/watch')
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
  				if (value.l[i].v == label || value.l[i] == label) {
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
      index -= 1;//瀑布流id，比items的 [index] 大 1
  		this.hidden = false;
  		this.index = index;
  		this.source = this.items[index].s;
  		this.poster = this.items[index].p;
        location.href = "#" + (index + 1);
        var listCtn = document.getElementById('list-cantainer');
        listCtn.style.height = "0";
        listCtn.style.overflow = "hidden";
        document.getElementById('playbox').currentTime=this.currentTime;
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
    //隐藏播放页，显示列表
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

    },
    //根据页面宽度，返回瀑布流的列数
    getrows: function(){
      var windowWidth = document.getElementById('body').offsetWidth;
      switch(true){
        case windowWidth < 768:
          return 1;
        break;
        case windowWidth >= 768 && windowWidth < 992:
          return 2;
        break;
        case windowWidth >= 992 && windowWidth < 1200:
          return 3
        break;
        case windowWidth >= 1200:
          return 4;
        break;
      }
    },
    //resize事件发生时，重新计算列数和赋值
    resize: function(){
     // console.log(this.items.length)
      this.rows = {'one':[],'two':[],'three':[],'four':[]};
      var d = this.items;
      var row = this.getrows();
      for (var i = 0,len = d.length; i < len; i++) {
        if(i%row == 0){
          this.rows.one.push(d[i]);
        }
        if(i%row == 1 && row >=2){
          this.rows.two.push(d[i]);
        }
        if(i%row == 2 && row >=3){
          this.rows.three.push(d[i]);
        }
        if(i%row == 3 && row >=4 ){
          this.rows.four.push(d[i]);
        }
      };
      //console.log(this.rows);
    },
    loaded: function(){
      var script,
          body = document.body;
          host='js/',
          paths = [
              host + 'data.js',
              'data.js'
          ];
      for (var i = 0; i < paths.length; i++) {
        script = document.createElement('script');
        script.src = paths[i];
        body.appendChild(script);
        body.removeChild(body.lastChild);
      };
      
    }

  } 
});

//console.log(data);