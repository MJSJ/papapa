(function($){
    var JUMPURL = "https://baidu.com";
    var View = {
        showShare:function(){
            $(".share").show();
        },
        showResult:function(){
            View.showGrade(window.GRADE, window.PERC);
            $(".resultBox").show();
        },
        //index里调View.showGrade();
        showGrade:function(grade, p){
            $(".grade").html(grade)
            $(".grade2").html(p)
            if(grade == 100){
                window.content = '状态太好了，再来一次'
            }else{
                window.content = '我还能更久点，再来一次'
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
