(function(){
  // 预加载
  new resLoader({
    presources: [
      'http://news.sohu.com/upload/yf/trump/imgs/bg01.jpg'
    ],
    resources: [],
    onProgress: function(current, total) {
        var percent = parseInt(current / total * 100) + '%';
        $('.pace-progress').text(percent);
    },
    onComplete: function(total) {
      // loading资源加载完毕
      $('.loading').show();
      var preload = new createjs.LoadQueue(false);
      preload.setMaxConnections(3);
      preload.addEventListener("fileload", handleFileComplete);
      preload.loadManifest([
        { "id": "img1", "src": "http://news.sohu.com/upload/yf/trump/imgs2/13.png" },
        { "id": "img2", "src": "http://i3.itc.cn/20160628/3649_9ceb2cda_0912_db8e_bb64_3d6ab50512c4_1.png" },
        { "id": "img3", "src": "http://i1.itc.cn/20160620/3707_a7098e26_e5ea_06ad_e6dd_49c956d23071_1.png" },
        { "id": "img4", "src": "http://news.sohu.com/upload/yf/trump/imgs2/14.png" },
        { "id": "img5", "src": "http://news.sohu.com/upload/yf/trump/imgs/ida1.png" },
        { "id": "img6", "src": "http://news.sohu.com/upload/yf/trump/imgs2/20.png" },
        { "id": "img7", "src": "http://news.sohu.com/upload/yf/trump/imgs2/8.png" }
      ]);
      function handleFileComplete() {
        if(preload._numItems == preload._numItemsLoaded){
          // 游戏资源加载完毕
          $('.loading').hide();
          $('.main').show();
          var st = new Stage("stage");
          st.init();
        }else{
          $('.pace-progress').html( parseInt(preload._numItemsLoaded * 100/preload._numItems) + '%' )
        }
      }
    }
  }).start();

  // 主舞台
  function Stage(id){
    this.canvas = document.getElementById(id),
    this.stage = new createjs.Stage(id),
    this.playing = false,
    this.temp = {};
  }
  Stage.prototype.init = function(){
    createjs.Touch.enable(this.stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.stage);

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;

    var _this = this;
    _this.time = 0;
    circle.addEventListener('click', function(e){
      if( !_this.playing ){
        var _that = _this;
        var audio5js = new Audio5js({
          ready: function () {
            that = this;
            this.load('http://news.sohu.com/upload/yf/trump/bgm2.mp3');
            this.play();
            this.on('timeupdate', function (position, duration) {
              if( position === '00:01' ) {
                // this.pause();
                setTimeout(function(){
                  _that.time += 30;
                  console.log(_that.time);
                }, 30);
              }
            }, this);
          }
        });
      }else{
        that.play();
      }
    })
    this.stage.addChild(circle);
  }
})();
