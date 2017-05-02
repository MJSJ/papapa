(function(){
  //全局变量window.GRADE
  window.GRADE = 0;
  // 预加载
  new resLoader({
    presources: [
      '../imgs/sharebg.png',
      '../imgs/sharegd.png'
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
        { "id": "bg1", "src": "../imgs/bg1.jpg" },
        { "id": "girl", "src": "../imgs/girl.png" },
        { "id": "eyes", "src": "../imgs/eyes.png" },
        { "id": "candle1", "src": "../imgs/cd1.png" },
        { "id": "candle2", "src": "../imgs/cd2.png" },
        { "id": "finger", "src": "../imgs/finger.png" },
        { "id": "bianzi", "src": "../imgs/bianzi.png" },
        { "id": "bianzi2", "src": "../imgs/bianzi2.png" },
        { "id": "pabtn", "src": "../imgs/beginbtn.png" },
        { "id": "pa", "src": "../imgs/pa.png" },
        { "id": "star", "src": "../imgs/star.png" },
        { "id": "prod", "src": "../imgs/prod.png" },
        { "id": "go", "src": "../imgs/go.png" },
        { "id": "ready", "src": "../imgs/ready.png" }
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
    this.alltemp = 0, // 节奏总数
    this.correct = 0, // 踩对的节奏数
    this.dire = [
      {x: 259, y: 547 },
      {x: 364, y: 637 },
      {x: 500, y: 640 }
    ],
    this.time = 1000;
  }

  Stage.prototype.init = function(){
    createjs.Touch.enable(this.stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", this.stage);

    this.insTimer = undefined;
    this.insAdo = undefined;

    var _this = this;
    this.ontouchAgain = function(e){
      $(".resultBox").hide();
      _this.drawGame();
    }

    this.drawFengmian();
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
    this.stage.addChild(bg0);
  }

  // 游戏准备页
  Stage.prototype.drawMain = function(){
    this.stage.removeAllChildren();
    // 背景
    var blackbg = this.getBitMap({
      x: 0, y: 0, width: 750, height: 1336, id: 'bg1'
    });
    // 主角
    var girl = this.getBitMap({
      width: 736, height: 832, x: 14, y: 250, id: 'girl'
    });
    function handleComplete() {}
    // 蜡烛
    var cdSheet = new createjs.SpriteSheet({
        images: ['../imgs/cd1.png', '../imgs/cd2.png'],
        frames: {width:156, height:239, count: 2},
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
    var finger = this.getBitMap({
      x: 600, y: 500, width: 172, height: 153, id: 'finger'
    }),
    bianzi = this.getBitMap({
      x: 300, y: 400, width: 152, height: 280, visible: false, id: 'bianzi'
    }),
    pabtn = this.getBitMap({
      x: 160, y: 680, width: 456, height: 273, alpha: 0, visible: false, id: 'pabtn'
    });
    // 表情
    var faces = new createjs.SpriteSheet({
        images: ['../imgs/eyes.png'],
        frames: {width:89.333, height:99, count: 3},
        animations: {
            hurt:0,
            amaze:1,
            fear:2
        }
    });
    var fear = new createjs.Sprite(faces, "fear"),
        amaze = new createjs.Sprite(faces, "amaze"),
        hurt = new createjs.Sprite(faces, "hurt");
    fear.x = amaze.x = hurt.x = 172;
    fear.y = amaze.y = hurt.y = 325;
    amaze.visible = hurt.visible = false;
    // 手指和鞭子切换
    createjs.Tween.get(pabtn, {loop:true}).to({alpha: 1},500).to({alpha: 0.5},500).call(handleComplete);
    function handleCompleteF(){
      finger.visible = false;
      bianzi.visible = true;
      pabtn.visible = true;
      amaze.visible = true;
      fear.visible = hurt.visible = false;
      createjs.Tween.get(bianzi).to({x: 200, y: 400},1000).call(handleCompleteF2);
    }
    function handleCompleteF2(){
      createjs.Tween.get(bianzi).to({x: 300, y: 400},1000).call(handleCompleteF3);
    }
    function handleCompleteF3(){
      pabtn.visible = false;
      finger.visible = true;
      bianzi.visible = false;
      fear.visible = true;
      amaze.visible = hurt.visible = false;
      createjs.Tween.get(finger).to({x: 600, y: 500},600).call(handleCompleteF4);
    }
    function handleCompleteF4(){
      createjs.Tween.get(finger).to({x: 500, y: 500},600).call(handleCompleteF);
    }
    handleCompleteF4();

    // 产品图
    var prod = this.getBitMap({
      x: 560, y: 20, width: 800, height: 800, id: 'prod'
    })
    prod.scaleX = prod.scaleY = 0.2;
    var prodText = new createjs.Text("王室佳宝", "30px Arial bold", "#ff7700");
    prodText.x = 580;
    prodText.y = 220;
    prodText.textBaseline = "alphabetic";

    this.stage.addChild(blackbg);
    this.stage.addChild(prod);
    this.stage.addChild(prodText);
    this.stage.addChild(girl);
    this.stage.addChild(fear);
    this.stage.addChild(amaze);
    this.stage.addChild(hurt);
    this.stage.addChild(cdani);
    this.stage.addChild(bianzi);
    this.stage.addChild(finger);
    this.stage.addChild(pabtn);

    // 点击开始
    _this = this;
    blackbg.addEventListener('click', function(e){
      _this.drawGame();
    });
  }

  // 游戏页
  Stage.prototype.drawGame = function(){
    _this = this;
    _this.stage.alpha = 0.7;
    $('.sharegd').hide();
    $(document).off("touchstart", ".again", _this.ontouchAgain)
    _this.stage.removeAllChildren();
    _this.correct = 0;
    _this.alltemp = 50;
    _this.cur = 0;
    _this.tp = 1;
    _this.insAdo = undefined;
    _this.insTimer = undefined;
    this.pa0 = new Audio5js({
      ready: function () {
        this.load('../sounds/pa0.mp3');
      }
    }),
    this.pa1 = new Audio5js({
      ready: function () {
        this.load('../sounds/pa1.mp3');
      }
    }),
    this.pa2 = new Audio5js({
      ready: function () {
        this.load('../sounds/pa2.mp3');
      }
    })
    // 背景
    var blackbg = this.getBitMap({
      x: 0, y: 0, width: 750, height: 1336, id: 'bg1'
    });
    // 蜡烛
    var cdSheet = new createjs.SpriteSheet({
        images: ['../imgs/cd1.png', '../imgs/cd2.png'],
        frames: {width:156, height:239, count: 2},
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
    var girl = this.getBitMap({
      width: 736, height: 832, x: 14, y: 250, id: 'girl'
    });
    // 表情
    var faces = new createjs.SpriteSheet({
        images: ['../imgs/eyes.png'],
        frames: {width:89.333, height:99, count: 3},
        animations: {
            hurt:0,
            amaze:1,
            fear:2
        }
    });
    var fear = new createjs.Sprite(faces, "fear"),
        amaze = new createjs.Sprite(faces, "amaze"),
        hurt = new createjs.Sprite(faces, "hurt");
    fear.x = amaze.x = hurt.x = 172;
    fear.y = amaze.y = hurt.y = 325;
    amaze.visible = hurt.visible = false;
    // 鞭子
    var bianzi = this.getBitMap({
      x: 540,y: 580,width: 152,height: 280,regX: 152,regY: 280, id: 'bianzi'
    }),
    bianzi2 = this.getBitMap({
      x: 540,y: 630,width: 344,height: 206,regX: 344,regY: 206,visible: false, id: 'bianzi2'
    });
    pa = this.getBitMap({
      x: 350,y: 650,width: 187,regX: 83.5,regY: 90.5,visible: false, id: 'pa'
    });
    bianzi.visible = false

    _this.getAdo().getInstance();
    function handleComplete(){}
    function handleCompleteP(){
      pa.visible = false;
      pa.scaleX = pa.scaleY = 1;
      pa.alpha = 1;
    }
    function handleCompleteB2(){
      bianzi.visible = true;
      bianzi2.visible = false;
      if(_this.tp == 2){
        pa.visible = true;
        createjs.Tween.get(pa).to({alpha: 0.5, scaleX: 2, scaleY: 2},500).call(handleCompleteP);
      }
    }
    function handleCompleteB(){
      bianzi.rotation = 0;
      bianzi.visible = false;
      bianzi2.visible = true;
      createjs.Tween.get(bianzi2).to({rotation: -10},100).call(handleCompleteB2);
    }
    function handleCompleteFa(){
      fear.visible = true;
      hurt.visible = false;
    }
    this.paAnimation = function(e){
      var pan = parseInt(Math.random()*3)
      _this['pa' + pan].play()
      bianzi.visible = true
      createjs.Tween.get(bianzi).to({rotation: -80},200).call(handleCompleteB);
      createjs.Tween.get(girl).to({x: 0},100).to({x: 30},100).to({x: 14},100).call(handleComplete);
      fear.visible = false;
      hurt.visible = true;
      createjs.Tween.get(hurt).to({x: 158},100).to({x: 188},100).to({x: 172},100).call(handleCompleteFa);
      var pos = {
        x: e.stageX,
        y: e.stageY
      }
      bianzi.x = pos.x + 170;
      bianzi.y = pos.y - 20;
      bianzi2.x = bianzi.x;
      bianzi2.y = bianzi.y + 50;
      pa.x = bianzi.x - 190;
      pa.y = bianzi.y + 70;
    }
    blackbg.addEventListener('mousedown', function(e){
      if(_this.cur > 0){
        _this.tp = 1;
        _this.paAnimation(e);
      }
    })
    var _this = this
    this.star = this.getBitMap({
      x: 0, y: 0, width: 146, height: 134, visible: false, id: 'star', regX: 73, regY: 67
    })
    this.star.addEventListener('mousedown', function(e){
      if(_this.cur > 0){
        _this.correct++;
        _this.tp = 2;
        _this.paAnimation(e);
      }
    })

    // 产品图
    var prod = this.getBitMap({
      x: 560, y: 20, width: 800, height: 800, id: 'prod'
    })
    prod.scaleX = prod.scaleY = 0.2;
    var prodText = new createjs.Text("王室佳宝", "30px Arial bold", "#ff7700");
    prodText.x = 580;
    prodText.y = 220;
    prodText.textBaseline = "alphabetic";
    // ready go
    _this.ready = this.getBitMap({
      x: 375, y: 450, width: 205, height: 69,regX: 102.5,regY: 23, visible: false, alpha: 0, id: 'ready'
    })
    _this.go = this.getBitMap({
      x: 375, y: 450, width: 107, height: 75,regX: 53.5,regY: 37.5, visible: false, alpha: 0, id: 'go'
    })
    _this.ready.visible = true
    createjs.Tween.get(_this.ready).to({alpha: 1, scaleX: 1.5, scaleY: 1.5},500).call(handleComplete);

    this.stage.addChild(blackbg);
    this.stage.addChild(prod);
    this.stage.addChild(prodText);
    this.stage.addChild(girl);
    this.stage.addChild(fear);
    this.stage.addChild(amaze);
    this.stage.addChild(hurt);
    this.stage.addChild(cdani);
    this.stage.addChild(bianzi);
    this.stage.addChild(bianzi2);
    this.stage.addChild(pa);
    this.stage.addChild(this.star);
    this.stage.addChild(this.ready);
    this.stage.addChild(this.go);
  }

  // 获取bitmap
  Stage.prototype.getBitMap = function(conf){
    var bitmap = new createjs.Bitmap(this.loader.getResult(conf.id));
    if (conf.visible !== false) conf.visible = true;
    bitmap.x = conf.x || 0;
    bitmap.y = conf.y || 0;
    bitmap.width = conf.width || 0;
    bitmap.height = conf.height || 0;
    bitmap.regX = conf.regX || 0;
    bitmap.regY = conf.regY || 0;
    bitmap.visible = conf.visible;
    bitmap.alpha = conf.alpha || 1;
    return bitmap;
  }

  // 寻找节奏
  Stage.prototype.checkTemp = function(){
    var _this = this;
    function handleComplete(){}
    function handleCompleteG(){
      _this.go.visible = false
    }
    function handleCompleteP(){
      _this.star.visible = false;
      _this.star.scaleX = _this.star.scaleY = 1;
      _this.star.alpha = 1;
      _this.cur++;
      if( (_this.cur !== _this.correct && _this.cur !== 0) || _this.correct === 50){
        // 游戏结束
        clearInterval(_this.insTimer)
        _this.insAdo.pause()
        window.GRADE = parseInt((_this.correct / _this.alltemp)*100)
        View.showResult()
        setTimeout(function(){
          $(document).on("touchstart", ".again", _this.ontouchAgain)
        }, 2000);
      }
    }
    if(this.time % 900 == 100){
      _this.star.visible = true;
      var pos = _this.dire[parseInt(Math.random()*3)]
      _this.star.x = pos.x;
      _this.star.y = pos.y;
      createjs.Tween.get(this.star).to({alpha: 0.5, scaleX: 1.5, scaleY: 1.5},500).call(handleCompleteP);
      if(_this.cur === 0){
        // 游戏提示
        this.ready.visible = false
        this.go.visible = true
        createjs.Tween.get(this.go).to({alpha: 1, scaleX: 1.5, scaleY: 1.5},200).call(handleCompleteG);
        this.stage.alpha = 1;
        createjs.Tween.get(this.stage, {loop: true}).to({alpha: 0.7},400).to({alpha: 1},400).to({alpha: 0.7},400).to({alpha: 1},400).call(handleComplete);
        _this.tp = 2
        _this.correct = 1
        _this.paAnimation({
          stageX: pos.x,
          stageY: pos.y
        })
      }
    }else{}
  }

  // 单例Timer
  Stage.prototype.getTimer = function(){
    var _this = this;
    return (function(_this){
      function init(){
        var timer = setInterval(function(){
          if(_this.time >　50000){
            clearInterval(_this.insTimer)
            _this.insAdo.pause()
            window.GRADE = 100
            View.showResult()
            setTimeout(function(){
              $(document).on("touchstart", ".again", _this.ontouchAgain)
            }, 2000);
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
            this.play();
            this.on('timeupdate', function (position, duration) {
              if( position === '00:01' ) {
                _this.getTimer().getInstance()
              }
            }, this);
            var _theado = this;
            this.on('ended', function (){
              _theado.play();
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

  //游戏结束调
  Stage.prototype.getGrade = function(){
     window.Grade = parseInt(this.correct/this.alltemp*100)
     return window.Grade
  }
})();
