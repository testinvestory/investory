 $(".page8 .next").click(function() { 
        if( $('.page8 #invest').html() >= 1000 ) {
            selectTab(4);
        }
            
    });    
    $(".page8 .go").click(function(){ 
       
       let sipTime=$('.page8 #time').val();
         
        let amount=$('.page8 #amount').val();
      //  alert(amount)
        let ConAmount=amount.replace(/,/g,''); //Replace comma from amount
        if (ConAmount < 7000 ){ 
		$('.page8 .page2VldMsg').slideDown();
       
	} else if ( sipTime < 1 || sipTime > 50 ) {
		 $(".page8 .page2VldMsg").slideUp(); 
		$('.page8 .page2VldMsg2').slideDown();
	} else {  
        debugger;
        
        
       // totalYears = document.getElementById("years").value;
		taxSaveAmt=ConAmount; 
		localStorage.taxSaveAmt = taxSaveAmt;
		localStorage.years = totalYears;
		localStorage.taxInvestment = true;	
		console.log("years"+totalYears+"time"+amount);
		sessionStorage.setItem('tempGoals', JSON.stringify({currentPage:4}));
        
        
            setProfile(0,1,0);
            selectTab(4);
            $(".page8 .page2VldMsg2").slideUp();
             $(".page8 .page2VldMsg").slideUp();
        } 
        
        
    });
    