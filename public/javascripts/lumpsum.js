

/*
$('input#lumpsum').keyup(function(event) {

  // skip for arrow keys
  if(event.which >= 37 && event.which <= 40){
   event.preventDefault();
  }

  $(this).val(function(index, value) {
      value = value.replace(/,/g,'');
      return numberWithCommas(value);
  });
});

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


*/
 $('input#lumpsum').keyup(function(event) {

  
  if(event.which >= 37 && event.which <= 40){
   event.preventDefault();
  }

  $(this).val(function(index, value) {
	 value = value.replace(/,/g,'');
  	return formatNumber(value);
   });
  });

function formatNumber(num) {

            var n1, n2;
            num = num + '' || '';
            // works for integer and floating as well
            n1 = num.split('.');
            n2 = n1[1] || null;
            n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            num = n2 ? n1 + '.' + n2 : n1;
            return num;
        }

var totalYears;
var lumpsum;

function getLumpsum(){
	
	
	totalYears =$('#lumpsumYears').val(); /*document.getElementById("lumpsumYears").value;*/
	lumpsum=$('#lumpsum').val(); /* document.getElementById("lumpsum").value; */
	
    
    let lumpAmount=lumpsum.replace(/,/g,'');  
    
    if ( lumpAmount < 5000 || lumpAmount > 1000000){ 
		$('#lumpsumInvestErr').slideDown();
  //     $(' #imgcap2').css("top","41.3%");
        }
    else if(isNaN(lumpAmount))
         $('#lumpsumInvestErr').slideDown();
	 else if ( totalYears < 1 || totalYears > 50 ) {
		$('#lumpsumInvestErr').slideUp(); 
		$('#lumpsumTimeErr').slideDown();
        // $(' #imgcap2').css("top","41.3%");
	} else {
		
		//$('#lumpsumInvestErr').slideUp(); 
		$('#lumpsumTimeErr').slideUp();
	
	 localStorage.lumpsum = lumpAmount;
	 localStorage.lumpYears = totalYears;
	 localStorage.lumpsumInvestment = true;	
	console.log("years"+totalYears+"amt"+lumpAmount);
     sessionStorage.setItem('tempGoals', JSON.stringify({currentPage:4}));
	window.location.href = "/GoalSelection";
    }
    /*if($('#lumpsumInvestErr').slideDown() && $('#lumpsumTimeErr').slideDown()){
        $(' #imgcap2').css("top","45.4%");
    }*/
}


function showLumpsum(){
	
	$("#setMood").attr("src", "images/buildWealthMood.png");  
	$("#setMoodText").hide();
     $("#goalSelected").text("Build Wealth");
    $(" .moodGoals > img").css("visibility","show"); 
	//$(" .moodGoals > img,.page6 > p").css("visibility","hidden"); 
  //$(".moodGoals #back").css("visibility","show");
	$(" .slider").css("visibility","hidden");
	$(" .contentMood .page4 #invest").css("visibility","hidden");
	  $(".contentMood .page1, .contentMood .page2,.contentMood .page3, .page3Sub,.contentMood .page4 .sub-page4").hide();
	$(".page2 .dotHr").hide();
	
	  $(".contentMood .page4,.contentMood .page4 .selectMode").show();
/*	console.log("years"+localStorage.years+"time"+	 localStorage.sip);*/
}
	
