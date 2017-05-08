var totalYears;
var sip;
  var sipInvestValue;  
var sipTime;
    $('input#sip').keyup(function(event) {

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

function getSIP(){
	// debugger;	
	//alert("dad");
	var sipInvestValue = $('#sip').val();
	var sipTime = $('#years').val();
   
 let amount=sipInvestValue.replace(/,/g,'');  
	if ( amount < 1000 || amount > 100000 ){ 
		$('#sipInvestErr').slideDown();
       
	} else if ( sipTime < 1 || sipTime > 50 ) {
		$('#sipInvestErr').slideUp(); 
		$('#sipTimeErr').slideDown();
	} else {
		// debugger;
		$('#sipInvestErr').slideUp; 
		$('#sipTimeErr').slideUp();
		totalYears = document.getElementById("years").value;
		sip=amount; 
		localStorage.sip = sip;
		localStorage.years = totalYears;
		localStorage.sipInvestment = true;	
		console.log("years"+totalYears+"time"+amount);
		sessionStorage.setItem('tempGoals', JSON.stringify({currentPage:4}));
		window.location.href = "/GoalSelection";
	}
}

function showSIP(){	
	$("#setMood").attr("src", "images/emergencyFundsMood.png");  
	$("#setMoodText").hide(); 
	$(".moodGoals > img").css("visibility","hidden");  
	$(".slider").css("visibility","hidden");
	$(".contentMood .page4 #invest").css("visibility","hidden");
	$(".contentMood .page1, .contentMood .page2,.contentMood .page3, .page3Sub,.contentMood .page4 .sub-page4").hide();
	$(".page2 .dotHr").hide();
	$(".contentMood .page4,.contentMood .page4 .selectMode").show();
	/*	console.log("years"+localStorage.years+"time"+	 localStorage.sip);*/
}

