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
        }
    }


    function bindEvts(){

        $(".shareBtn").on("touchstart",function(){
            View.showShare();
        })
        $(".jump").on("touchstart",function(){
            window.location.href = JUMPURL;
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
