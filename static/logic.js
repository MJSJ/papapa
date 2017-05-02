(function($){
    var JUMPURL = "https://baidu.com";
    var View = {
        showShare:function(){
            $(".share").show();
        },
        showResult:function(){
            View.showGrade(window.GRADE);
            $(".resultBox").show();
        },
        //index里调View.showGrade();
        showGrade:function(grade){
            $(".grade").html(grade)
            if(grade == 100){
                window.content = '我艹，根本停不下来，我的啪啪啪持久度已经突破了天际，不服来战！'
            }else{
                window.content = '哈哈哈，我的啪啪啪持久度超过了'+grade+'%的人，你也来挑战一下吧！'
            }
        }
    }


    function bindEvts(){

        $(".shareBtn").on("touchstart",function(){
            $('.sharegd').show();
        })
        $(".jump").on("touchstart",function(){
            $(".share").show();
        })

        $(".share").on("touchstart",function(){
            $(".share").hide();
        })

        $(".sharebg img").on("touchstart",function(e){
            e.stopPropagation();
        })
    }

    window.View = View;
    bindEvts();
})($)
