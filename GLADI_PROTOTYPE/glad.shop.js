
$(document).ready(function(){

FillData();

//LoadItems('armors', items.filter(x=>x.type=="upper" || x.type=="hands"));
//LoadItems('weapons', items.filter(x=>x.type=="weapon1"));
//LoadItems('parts', items.filter(x=>x.type=="boots" || x.type=="head" || x.type=="weapon2"));


LoadItems('weapons', items.filter(x=>x.Name.indexOf('Training')>-1));


LoadItems('shop1', items.filter(x=>x.type=="weapon1"));



// item equip event
// AMAZING static event!!! no need to re-init if added new element of this type

$(document).on("click", '.storage a.gear', function(e){
	var number =$(e.currentTarget).data('item');
	
	console.log('Click:' , items[number].type);

	var bdy = '';
	if ($('#CURR_DOLL:checked').val()!='' && $('#CURR_DOLL:checked').val()!=undefined){
    	bdy='#'+$('#CURR_DOLL:checked').val();
	}

	$(''+bdy + ' div.doll_'+items[number].type).css('background-position', items[number].position);
	console.log('Click:' , bdy);

	champion.Equip(items[number]);

	$('#DEF_INFO').text(champion.totalArmor());
	$('#ATK_INFO').text(champion.totalAttack());

	$('#DEF_INFO_COMPARE').text(champion.totalArmorCompare(items[number]));
	$('#ATK_INFO_COMPARE').text(champion.totalWeaponCompare(items[number]));

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