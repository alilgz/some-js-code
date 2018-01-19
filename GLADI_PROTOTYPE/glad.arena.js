
$(document).ready(function(){

// INIT UI
$('.storage').css('left', '920px');
$('.storage').css('top', '10px');

$('#CURR_DOLL').click()



// FILL DATA


FillData();

LoadItems('armors', items.filter(x=>x.type=="upper" || x.type=="hands"));
LoadItems('weapons', items.filter(x=>x.type=="weapon1"));
LoadItems('parts', items.filter(x=>x.type=="boots" || x.type=="head" || x.type=="weapon2"));


//LoadItems('weapons', items.filter(x=>x.Name.indexOf('Training')>-1));
//LoadItems('shop1', items.filter(x=>x.type=="weapon1"));


//assign events 

$('#StartFight').on('click', function(){

 var def1 = $('#first #DEF_INFO').text();
 var def2 = $('#second #DEF_INFO').text();
 var atk1 = $('#first #ATK_INFO').text();
 var atk2 = $('#second #ATK_INFO').text();

//reset HP 
 hp1=200;
 hp2=200;



AddLogMsg( 'Fight!'+ 'First : ' + atk1 + ' ATK, '+ def1 +' DEF\n Second:'+ atk2 +' ATK, ' + def2 + ' DEF'  );

  FightOneRound(atk1, atk2);
 // NOW FIGHT IN PROGRESS 

});


var hp1=200;
var hp2=200;


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



function FightOneRound(atk1, atk2){
 
 console.log(atk1, atk2);
var critChance=30; 
var evadeChance=5; 
  	var dmg1=atk1;
  	var dmg2=atk2;
var crit=0;
var evade=0;

  	if (getRandomInt(0, 100) < critChance) // crit 
  	{
  		
  		if (getRandomInt(0, 100)>50){  //first
  			dmg1*=2;
  			crit=1;

  		} else {
  			dmg2*=2;
  			crit=2;
  		}
  	} 

  	if (getRandomInt(0, 100) < evadeChance) // crit 
  	{
		if (getRandomInt(0, 100)>50)  
			evade=1;
		else
			 evade=2;
  	}

  	hp1-= evade==1 ? 0 : dmg2;
  	hp2-= evade==2 ? 0 : dmg1;

 	DescribeAttack('#1', dmg1, crit==1, evade==2); // if OPPONENT EVADE
 	DescribeAttack('#2', dmg2, crit==2, evade==1);
 
 if (hp1<=0 || hp2<=0)
 {
 	if (hp1>0){
 	AddLogMsg('Player #1 Won with '+hp1 +' HP');
 } else {
 	AddLogMsg('Player #2 Won with '+hp2 +' HP');
 }

 } else 
 {

 	// increase attack power 
 	setTimeout(function(){ FightOneRound( (atk1*1) , (atk2*1)); } , 500);

 }

}

function DescribeAttack(name, dmg, isCrit, isEvaded)
{
 if (isEvaded)
 	AddLogMsg( 'Player '+name+' hit, but opponent evaded attack.');
 	else
	AddLogMsg( (isCrit? 'Critical! ':'') + 'Player '+name+' hit for  '+ dmg +' damage');
}

AddLogMsg=function(txt){
 var t  = $('#LogText').html();
  $('#LogText').html( txt + '<br>' + t);
}

// item equip event
// AMAZING static event!!! no need to re-init if added new element of this type

$(document).on("click", '.storage a.gear', function(e){
	var number =$(e.currentTarget).data('item');
	
	console.log('Click:' , items[number].type);

	var bdy = '';
	if ($('#CURR_DOLL:checked').val()!='' && $('#CURR_DOLL:checked').val()!=undefined){
    	bdy='#' + $('#CURR_DOLL:checked').val() + ' ' ;
	} else {

		return;
	}

	$(''+bdy + ' div.doll_'+items[number].type).css('background-position', items[number].position);
	console.log('Click:' , bdy);

	champion.Equip(items[number]);

	$(''+bdy+'#DEF_INFO').text(champion.totalArmor());
	$(''+bdy+'#ATK_INFO').text(champion.totalAttack());

	$(''+bdy+'#DEF_INFO_COMPARE').text(champion.totalArmorCompare(items[number]));
	$(''+bdy+'#ATK_INFO_COMPARE').text(champion.totalWeaponCompare(items[number]));

	//$('#log').append("<p> Armor:" + champion.totalArmor()+"</p>");
});


// item BUY event
 
$('.shop a.gear').click(function(e){
	var number =$(e.currentTarget).data('item');
	
	console.log('Click shop :' , items[number].type);
	
	
	// ask to buy or not
	//('Are you sure you want to buy ' + items[number].Name + '?')) 
confirmBuy( 'title', 'Are you sure you want to buy ' + items[number].Name + '?', function(){
	// add to storage
	console.info('func_yes');
	LoadItems('weapons', items.filter(x=>x.Counter==number));


	// 'equip'
	/*
	$('div.doll_'+items[number].type).css('background-position', items[number].position);
		champion.Equip(items[number]);
	$('#DEF_INFO').text(champion.totalArmor());
	$('#ATK_INFO').text(champion.totalAttack());
	*/
},

function(){ 
	console.info('func_no');
	 }
);


	$('#DEF_INFO_COMPARE').text(champion.totalArmorCompare(items[number]));
	$('#ATK_INFO_COMPARE').text(champion.totalWeaponCompare(items[number]));

	//$('#log').append("<p> Armor:" + champion.totalArmor()+"</p>");
});



$('.gear').mouseleave(function(e){
	$('#DEF_INFO_COMPARE').text("");
	$('#ATK_INFO_COMPARE').text("");
});
$('.gear').mouseover(function(e){
	var number =$(e.currentTarget).data('item');
	//console.log(items[number].type);
	
	
	$('#DEF_INFO_COMPARE').text(champion.totalArmorCompare(items[number]));
	$('#ATK_INFO_COMPARE').text(champion.totalWeaponCompare(items[number]));
	//$('#log').append("<p> Armor:" + champion.totalArmor()+"</p>");
})


//demo();
});	

       
var champion = new Equipment();
 


function filterBreastplate(item){
 return item.type=="upper";	
}

function demo()
{

	for(var i=0; i<16; i++){
		for (var j=0; j<16; j++)
		{
			var px = "-" + (i*32) + "px";
			var py = "-" + (j*32) + "px";
			var pos = "background-position: "+px+" "+py+";"
			var elem = "<div style=\"display:block;background-image: url(png/items1.png);width: 32px;  height: 32px;"+pos+"\"></div><p>"+ px +" " + py +"</p>";
			$('#items').append(elem);		
		}
	}
}
 



 confirmBuy = function(title, message, func_yes, func_no)
{

$('#id_confrmdiv span').text(message);

$('#id_confrmdiv').css('display','block'); 

$('#id_truebtn').unbind('click');
$('#id_truebtn').click( function(){
   //do your delete operation
    console.log('Click true');

	$('#id_confrmdiv').css('display','none'); 
	func_yes();
	return true;
});

$('#id_falsebtn').unbind('click');
$('#id_falsebtn').click( function(){
	console.log('Click false');

     $('#id_confrmdiv').css('display','none'); 
     func_no();
   return false;
});

};