


class Stats
{

	 constructor(str, dex, con, gear){
	 	this.stats =  [];
	 	this.stats["STR"]=str;
	 	this.stats["DEX"]=dex;
	 	this.stats["CON"]=con;
	 	this.equip = gear;
	 }


}

Stats.prototype.GetStat = function(statName){
	
	 switch(statName)
	 {
	 	//base stats - pure value
	 	case "STR":
	 	case "DEX":
	 	case "CON":
	 	 return this.stats[statName];

	 	// calculated by formula 
	 	case "PAtk":
	 	 return ( this.stats["STR"] * 1.02) * this.equip.totalAttack() ;  // 1 str = 2% patk  ++ skill

	 	case "PDef":
	 	 return  this.equip.totalArmor() ; // + skill /etc 

	 	case "Critical":
	 	 return 15 + this.stats["DEX"] * 2 ;// X weapon type modifier?

	 	case "Atk.Speed":
	 	 return this.stats["DEX"] * 6  ; // X weapon type modifier?

	 	case "Eva":
	 	 return this.stats["DEX"] * 2  ; // X weapon type modifier?

	 }
	 
}


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

 

function LoadItems(id, data)
{
	k=0;
	 data.forEach(i=>$('#'+ id).append("<A class='gear' href='#' data-item="+ (i.Counter)+" style='display:block'> <span style='display:inline-block;background-image: url(png/items1.png);width: 32px;  height: 32px; background-position: "+i.position+"''></span><span style='display:inline-block'>" +i.Name+"</span></a>" ));
}


 