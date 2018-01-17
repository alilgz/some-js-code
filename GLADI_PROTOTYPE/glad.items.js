
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
	;
	$('div.doll_'+items[number].type).css('background-position', items[number].position);

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




class Item
{

constructor(name, bodypart, damage, pos)
	{
		this.Counter=Item.counter++;
		this.Name=name;
		this.type=bodypart;
		this.Damage=damage;
		//this.x=posX;
		//this.y=posY;
		this.position=pos; 
	}
}


class Equipment {

 constructor()
 {
  this.Helmet=-1;
  this.Upper=-1;
  this.Boots=-1;
  this.Gloves=-1;
  this.Weapon = -1;
  this.Shield=-1;
 }
}

 Equipment.prototype.Equip = function(item){
  switch (item.type){
case "weapon1":
   this.Weapon=item.Counter; break;
case "head":
   this.Helmet=item.Counter; break;
case "hands":
   this.Gloves=item.Counter; break;
case "weapon2":
   this.Shield=item.Counter; break;
case "boots":
   this.Boots=item.Counter; break;
case "upper":
   this.Upper=item.Counter; break;
case "boots":
   this.Boots=item.Counter; break;

  }
  return item.Counter;

 }

 Equipment.prototype.totalArmor = function()
 {
 return (this.Helmet ==-1  ? 0 : items[this.Helmet].Damage)+
 		(this.Gloves ==-1  ? 0 : items[this.Gloves].Damage)+
 		(this.Boots ==-1   ? 0 : items[this.Boots].Damage)+
 		(this.Upper ==-1   ? 0 : items[this.Upper].Damage)+
 		(this.Shield ==-1   ? 0 : items[this.Shield].Damage)
 		 ;
}


Equipment.prototype.totalArmorCompare=function(item)
{

var compared = -2;
 switch (item.type)
 {
case "head":
   compared=this.Helmet; break;
case "hands":
   compared=this.Gloves; break;
case "weapon2":
   compared=this.Shield; break;
case "boots":
   compared=this.Boots; break;
case "upper":
   compared=this.Upper; break;
case "boots":
   compared=this.Boots; break;
  }
 if (compared ==-2)
 	 return ""; 
  return   item.Damage -  (compared ==-1 ? 0 :items[compared].Damage) ;
}


Equipment.prototype.totalWeaponCompare=function(item)
{

var compared = -2;
 switch (item.type)
 {
case "weapon1":
   compared=this.Weapon; break;
 }

 if (compared ==-2)
 	 return ""; 


  return   item.Damage -  (compared ==-1 ? 0 :items[compared].Damage) ;



}


 Equipment.prototype.totalAttack = function()
 {
 return (this.Weapon ==-1  ? 0 : items[this.Weapon].Damage);
}

var champion = new Equipment();


Item.counter=0;

var items = [];


function FillData(){
items.push(new Item("Training Sword", "weapon1", 3,"0px -4px" ));

items.push(new Item("Bronse Sword", "weapon1", 6,"-192px -128px" ));
items.push(new Item("Stone Axe", "weapon1", 6, "-192px -224px" ));
items.push(new Item("Gold Sword", "weapon1", 7,"-288px -192px" ));
items.push(new Item("Ritual Dagger", "weapon1", 7,"-480px -256px" ));
items.push(new Item("Magit staff", "weapon1", 7,"-448px -192px" ));
items.push(new Item("Crossbow", "weapon1", 7,"-192px -0px" ));
items.push(new Item("Hammer", "weapon1", 8,"-352px -96px" ));

items.push(new Item("Wooden Shield", "weapon2", 3,"-64px -4px" ));
items.push(new Item("Bronse Shield", "weapon2", 6,"-96px -100px" ));
items.push(new Item("Iron Shield", "weapon2", 7, "-32px -228px" ));
items.push(new Item("Round Shield", "weapon2", 8, "-64px -68px" ));


items.push(new Item("Training Armor", "upper", 5, "-192px -68px" ));
items.push(new Item("Iron Armor", "upper", 5, "-160px -4px" ));
items.push(new Item("Mithril Armor", "upper", 5,"-128px -4px" ));

items.push(new Item("Iron helmet", "head", 4, "-32px -96px" ));
items.push(new Item("Steel gloves", "hands", 5, "-64px -32px" ));
items.push(new Item("Wizard hat", "head", 5, "-288px -32px" ));

items.push(new Item("Leather shoes","boots",  2, "-416px -96px" ));
items.push(new Item("Hard shoes", "boots", 5, "-416px -128px" ));
items.push(new Item("Iron boots", "boots", 5, "-480px -0px" ));


}


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

function LoadItems(id, data)
{
	k=0;
	 data.forEach(i=>$('#'+ id).append("<A class='gear' href='#' data-item="+ (i.Counter)+" style='display:block'> <span style='display:inline-block;background-image: url(png/items1.png);width: 32px;  height: 32px; background-position: "+i.position+"''></span><span style='display:inline-block'>" +i.Name+"</span></a>" ));
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