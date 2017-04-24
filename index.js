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
      // preload.setMaxConnections(1);
      preload.addEventListener("fileload", handleFileComplete);
      preload.loadManifest([
        { "id": "bg0", "src": "../imgs/bg0.jpg" },
        { "id": "girl", "src": "../imgs/girl.png" },
        { "id": "candle1", "src": "../imgs/candles.png" },
        { "id": "finger", "src": "../imgs/finger.png" },
        { "id": "bianzi", "src": "../imgs/bianzi.png" },
        { "id": "bianzi2", "src": "../imgs/bianzi2.png" },
        { "id": "pabtn", "src": "../imgs/beginbtn.png" },
        { "id": "pa", "src": "../imgs/pa.png" }
      ]);
      function handleFileComplete() {
        if(preload._numItems == preload._numItemsLoaded){
          // 游戏资源加载完毕
          $('.loading').hide();
          $('.main').show();
          var st = new Stage("stage", preload);
          st.init();
        }else{
          $('.pace-progress').html( parseInt(preload._numItemsLoaded * 100/preload._numItems) + '%' )
        }
      }
    }
  }).start();

  // 主舞台
  function Stage(id, loader){
    this.canvas = document.getElementById(id),
    this.stage = new createjs.Stage(id),
    this.playing = false,
    this.loader = loader,
    this.isTemp = false,
    this.time = 1000;
  }
  
  Stage.prototype.init = function(){
    createjs.Touch.enable(this.stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.stage);

    this.insTimer = undefined;
    this.insAdo = undefined;    
    
    this.drawGame();
  }

  // 首页
  Stage.prototype.drawFengmian = function(){
    this.stage.removeAllChildren();
    var blackbg = new createjs.Shape();
    blackbg.graphics.beginFill("#000").drawRect(0, 0, 750, 1336);
    var bg0 = new createjs.Bitmap(this.loader.getResult("bg0"));
    bg0.width = 750;
    bg0.height = 1335;
    bg0.x = 0;
    bg0.y = 0;
    createjs.Tween.get(bg0).wait(500).to({alpha:0}, 1000).call(handleComplete);
    var _this = this;
    function handleComplete() {
        _this.drawMain();
    }
    // this.stage.addChild(blackbg);
    this.stage.addChild(bg0);
  }

  // 游戏准备页
  Stage.prototype.drawMain = function(){
    this.stage.removeAllChildren();
    // 背景
    var blackbg = new createjs.Shape();
    blackbg.graphics.beginFill("#434343").drawRect(0, 0, 750, 1336);
    // 主角
    var girl = new createjs.Bitmap(this.loader.getResult("girl"));
    girl.width = 662;
    girl.height = 792;
    girl.x = 50;
    girl.y = 250;
    // createjs.Tween.get(girl, {loop:true}).to({alpha:0.5, x: 55, y: 260},1000).to({alpha:1, x: 50, y: 250},1000).call(handleComplete);
    function handleComplete() {}
    // 蜡烛
    var cdSheet = new createjs.SpriteSheet({
        images: ['../imgs/candles.png'],
        frames: {width:99, height:194, count: 2},
        animations: {
            burn:{
              frames: [0,1],
              speed: 0.1
            }
        }
    });
    var cdani = new createjs.Sprite(cdSheet, "burn");
    cdani.x = cdani.y = 30;
    // 手指和鞭子
    var finger = new createjs.Bitmap(this.loader.getResult("finger")),
        bianzi = new createjs.Bitmap(this.loader.getResult("bianzi")),
        pabtn  = new createjs.Bitmap(this.loader.getResult("pabtn"));
    bianzi.x = 300;
    bianzi.y = 400;
    bianzi.width = 152;
    bianzi.height = 280;
    finger.width = 172;
    finger.height= 153;
    finger.x = 600;
    finger.y = 500;
    bianzi.visible = false;
    pabtn.x = 160;
    pabtn.y = 680;
    pabtn.width = 456;
    pabtn.height = 273;
    pabtn.alpha = 0;
    pabtn.visible = false;
    createjs.Tween.get(pabtn, {loop:true}).to({alpha: 1},500).to({alpha: 0.5},500).call(handleComplete);
    function handleCompleteF(){
      finger.visible = false;
      bianzi.visible = true;
      pabtn.visible = true;
      createjs.Tween.get(bianzi).to({x: 200, y: 400},1000).call(handleCompleteF2);
    }
    function handleCompleteF2(){
      createjs.Tween.get(bianzi).to({x: 300, y: 400},1000).call(handleCompleteF3);
    }
    function handleCompleteF3(){
      pabtn.visible = false;
      finger.visible = true;
      bianzi.visible = false;
      createjs.Tween.get(finger).to({x: 600, y: 500},600).call(handleCompleteF4);
    }
    function handleCompleteF4(){
      createjs.Tween.get(finger).to({x: 500, y: 500},600).call(handleCompleteF);
    }
    handleCompleteF4();
    
    this.stage.addChildAt(blackbg, 0);
    this.stage.addChildAt(girl, 1);
    this.stage.addChildAt(cdani, 2);
    this.stage.addChildAt(bianzi, 3);
    this.stage.addChildAt(finger, 4);
    this.stage.addChildAt(pabtn, 5);

    // 点击开始
    _this = this;
    blackbg.addEventListener('click', function(e){
      _this.drawGame();
    });
  }

  // 游戏页
  Stage.prototype.drawGame = function(){
    _this = this;
    _this.stage.removeAllChildren();
    // 背景
    var blackbg = new createjs.Shape();
    blackbg.graphics.beginFill("#434343").drawRect(0, 0, 750, 1336);
    // 蜡烛
    var cdSheet = new createjs.SpriteSheet({
        images: ['../imgs/candles.png'],
        frames: {width:99, height:194, count: 2},
        animations: {
            burn:{
              frames: [0,1],
              speed: 0.1
            }
        }
    });
    var cdani = new createjs.Sprite(cdSheet, "burn");
    cdani.x = cdani.y = 30;
    // 主角
    var girl = new createjs.Bitmap(this.loader.getResult("girl"));
    girl.width = 662;
    girl.height = 792;
    girl.x = 50;
    girl.y = 250;
    // 鞭子
    var bianzi = new createjs.Bitmap(this.loader.getResult("bianzi"));
    bianzi.x = 540;
    bianzi.y = 580;
    bianzi.width = 152;
    bianzi.height = 280;
    bianzi.regX = 152;
    bianzi.regY = 280;
    var bianzi2 = new createjs.Bitmap(this.loader.getResult("bianzi2"));
    bianzi2.x = 540;
    bianzi2.y = 630;
    bianzi2.width = 344;
    bianzi2.height = 206;
    bianzi2.regX = 344;
    bianzi2.regY = 206;
    bianzi2.rotation = 0;
    bianzi2.visible = false;
    // 啪
    var pa = new createjs.Bitmap(this.loader.getResult("pa"));
    pa.x = 350;
    pa.y = 650;
    pa.width = 187;
    pa.height = 181;
    pa.regX = 83.5;
    pa.regY = 90.5;
    pa.visible = false;

    _this.getAdo().getInstance();
    function handleCompleteP(){
      pa.visible = false;
      pa.scaleX = pa.scaleY = 1;
      pa.alpha = 1;
    }
    function handleCompleteB2(){
      bianzi.visible = true;
      bianzi2.visible = false;
      pa.visible = true;
      createjs.Tween.get(pa).to({alpha: 0.5, scaleX: 2, scaleY: 2},500).call(handleCompleteP);
    }
    function handleCompleteB(){
      bianzi.rotation = 0;
      bianzi.visible = false;
      bianzi2.visible = true;
      createjs.Tween.get(bianzi2).to({rotation: -10},100).call(handleCompleteB2);
    }
    blackbg.addEventListener('click', function(e){
      createjs.Tween.get(bianzi).to({rotation: -80},200).call(handleCompleteB);
      createjs.Tween.get(girl).to({x: 30},100).to({x: 60},100).to({x: 50},100).call(handleComplete);
      console.log(_this.isTemp);
    });

    this.stage.addChildAt(blackbg, 0);
    this.stage.addChildAt(girl, 1);
    this.stage.addChildAt(cdani, 2);
    this.stage.addChildAt(bianzi, 3);
    this.stage.addChildAt(bianzi2, 3);
    this.stage.addChildAt(pa, 3);
  }

  // 节奏小球
  Stage.prototype.drawTemp = function(){
    this.circle = new createjs.Shape();
    this.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    this.circle.x = 100;
    this.circle.y = 100;

    this.circle.addEventListener('click', function(e){
      _this.getAdo().getInstance()
    });
    this.stage.addChild(this.circle);
  }

  // 寻找节奏
  Stage.prototype.checkTemp = function(){
    var _this = this;
    // 2200 3100
    if(this.time % 900 > 350 && this.time % 900 < 450){
      _this.isTemp = true;
    }else{
      _this.isTemp = false;
    }
  }

  // 单例Timer
  Stage.prototype.getTimer = function(){
    var _this = this;
    return (function(_this){
      function init(){
        var timer = setInterval(function(){
          if(_this.time >　240000){
            clearInterval(timer)
          }else{
            _this.time += 20
            _this.checkTemp()
          }
        }, 20);
        return timer;
      }
      return {
        getInstance: function(){
          if(!_this.insTimer){
            _this.time = 1000;
            _this.insTimer = init();
          }
          return _this.insTimer;
        }
      }
    })(_this)
  }

  // 单例播放
  Stage.prototype.getAdo = function(){
    var _this = this;
    return (function(_this){
      function init(){
        var audio = new Audio5js({
          ready: function () {
            this.load('../sounds/temp.mp3');
            // this.load('http://news.sohu.com/upload/yf/trump/bgm2.mp3')
            this.play();
            this.on('timeupdate', function (position, duration) {
              if( position === '00:01' ) {
                _this.getTimer().getInstance()
              }
            }, this);
          }
        });
        return audio;
      }
      return {
        getInstance: function(){
          if(!_this.insAdo){
            _this.insAdo = init();
          }
          return _this.insAdo;
        }
      }
    })(_this)
  }
})();
