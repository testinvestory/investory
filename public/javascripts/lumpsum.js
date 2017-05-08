

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

var totalYears;
var lumpsum;

function getLumpsum(){
	
	
	totalYears =$('#lumpsumYears').val(); /*document.getElementById("lumpsumYears").value;*/
	lumpsum=$('#lumpsum').val(); /* document.getElementById("lumpsum").value; */
	
    
    let lumpAmount=lumpsum.replace(/,/g,'');  
    
    if ( lumpAmount < 7000 || lumpAmount > 100000){ 
		$('#lumpsumInvestErr').slideDown();
      
    
	} else if ( totalYears < 1 || totalYears > 50 ) {
		$('#lumpsumInvestErr').slideUp(); 
		$('#lumpsumTimeErr').slideDown();
	} else {
		
		$('#lumpsumInvestErr').slideUp; 
		$('#lumpsumTimeErr').slideUp();
	
	 localStorage.lumpsum = lumpAmount;
	 localStorage.lumpYears = totalYears;
	 localStorage.lumpsumInvestment = true;	
	console.log("years"+totalYears+"amt"+lumpAmount);
     sessionStorage.setItem('tempGoals', JSON.stringify({currentPage:4}));
	window.location.href = "/GoalSelection";
    }
}


function showLumpsum(){
	
	$("#setMood").attr("src", "images/emergencyFundsMood.png");  
	$("#setMoodText").hide(); 
	$(" .moodGoals > img,.page5 > p,.page6 > p").css("visibility","hidden");  
	$(" .slider").css("visibility","hidden");
	$(" .contentMood .page4 #invest").css("visibility","hidden");
	  $(".contentMood .page1, .contentMood .page2,.contentMood .page3, .page3Sub,.contentMood .page4 .sub-page4").hide();
	$(".page2 .dotHr").hide();
	
	  $(".contentMood .page4,.contentMood .page4 .selectMode").show();
/*	console.log("years"+localStorage.years+"time"+	 localStorage.sip);*/
}
	
