
var myClassId;
$(".indexsip .panel").click(function() {
 myClassId = $(this).attr("id");
    

    // alert(myClass);  
});
$(".pagesip .go").click(function(){
   
    if(myClassId=="sipcal")
    {
       
            $(".pagesip > h3,.pagesip > h4").hide();
            $(".pagesip > div").not('.pagesip').hide(); 
             $(".pagesip > div").not('#pagelumpcalculate').hide();
             $('#pagesipcalculate').show();
            $('#sipbtn').removeClass('sipBtn');
        }
    else{
        $(".pagesip > h3,.pagesip > h4").hide();
                 $(".pagesip > div").not('.pagesip').hide();
                 $('#pagesipcalculate').hide();
                  $('#pagelumpcalculate').show();
                $('.lumBtn').removeClass('lumBtn');
                
    }
    });
/*$(".indexsip .sip1").click(function(){ 
    $("#imgbluecap").show();
    $("#imgbluecap2").hide();
});
$(".indexsip .sip2").click(function(){ 
    $("#imgbluecap").hide();
    $("#imgbluecap2").show();
});
    */                        

$(".indexsip .panel").click(function(){ 
   
       
        $(".panel-heading").css("background-color","#35BFD3");
        $(".panel-heading h2").css("color","#FFFFFF");
       $(".panel-heading .pDot").css("border","2px #FFFFFF solid");
       $(".panel-body ul, .panel-body h2").css("color","#333333");
       
       
         $(".panel-body ul, .panel-body h2",this).css("color","#35BFD3");
        $(".panel-heading",this).css("background-color","#FFDE15");
            
     $(".panel-heading",this).css("border-bottom","1px solid #35BFD3"); 
       $(".panel-heading h2",this).css("color","#35BFD3");
       $(".panel-heading .pDot",this).css("border","2px #35BFD3 solid");
     
   });
                   
function showSIP(){
   
  //  resetSession();
    
    $(".pagesip > div").not('.pagesip').hide();
    $('#pagelumpcalculate').hide();
     $('#pagesipcalculate').show();
    $('#sipbtn').removeClass('sipBtn');
    $('#lumpsumbtn').addClass('lumBtn');
     
   
}
function showLumpsum(){
  //  resetSession();
   
     $(".pagesip > div").not('.pagesip').hide();
    $('#pagesipcalculate').hide();
     $('#pagelumpcalculate').show();
     $('#sipbtn').addClass('sipBtn');
     $('.lumBtn').removeClass('lumBtn');
   
}

