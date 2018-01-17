
var Tab={};

Tab.Open=function(name){
	


	console.log("open:", name);
	
$('#Shop').hide();
$('#Map').hide();
$('#Arena').hide();
$('#Cells').hide();

	$('#Loading').show();
	 setTimeout(function(){  
	 	console.log("Timer");
		$('#Loading').hide();
		$('#'+name).show();
	 }, 500);
}

$(document).ready(function(){
	Tab.Open("Map");
});


/* --------- PLAYER ------------*/

class Player
{
	constructor(name)
	{
 	
 	this.Name=name;	
 	this.gold=2000; // start money 
 	this.Gladiators = [];

	this.Gladiators.push(new  Gladiator('Djonn'));
	this.Gladiators.push(new  Gladiator('Erikk'));
	
	this.Library=0;
	this.TrainingYard=0;
	this.Tower=0;
	this.Medicine=0;
	}

}

/* --------- GLADI ---------------*/

class Gladiator  
{
	constructor(name){

		this.Name=name;
		
		this.Health=200;
		this.MaxHealth=this.Health;

		this.Armor=2;
		this.Damage=2;

		this.Level = 1;
		this.Exp = 0;
		this.Items = [];

		this.Items.push( new Item('Training Helmet', 2, 10, config.bodypart.Head) );
		this.Items.push( new Item('Training Breastplate', 5, 30, config.bodypart.Breastplate) );
		this.Items.push( new Item('Training Sword', 2, 30, config.bodypart.Weapon) );

		this.Skills=[];

	}

}

Gladiator.prototype.Fight=function(anotherGlad){ return true; }

Gladiator.prototype.Print=function(){ return 'Name: ' + this.Name; }

Gladiator.prototype.SummaryDefenceValue=function(helmet, body, gaiters, boots){
 return this.Armor + 
  (helmet== undefined ? 0  : helmet.armor ) +
  (body== undefined ? 0  : body.armor ) +
  (gaiters== undefined ? 0  : gaiters.armor ) +
  (boots== undefined ? 0  : boots.armor );
}

Gladiator.prototype.Preview =function()
{

var helmet = Item.GetItem(this.Items, config.bodypart.Head) ;
var boots = Item.GetItem(this.Items, config.bodypart.Boots) ;
var body = Item.GetItem(this.Items, config.bodypart.Breastplate) ;
var gaiters = Item.GetItem(this.Items, config.bodypart.Gaiters) ;

	return '<h1> Name: ' + this.Name +'</h1>' +
		   '<h2> Health: ' + this.Health + '/'+ this.MaxHealth +'</h2>' +
		   '<h2> Morale: ' + this.Morale  +'</h2>' +
		   '<h2> Armor: ' + this.SummaryDefenceValue(helmet, body, gaiters, boots)  +'</h2>' +
		   '<br/>' +
		   '<h3> Helmet: ' +  (helmet== undefined ? ' - ' : helmet.Print() ) +'</h3>' +
		   '<h3> Boots: ' +  (boots == undefined ? ' - ' : boots.Print() ) +'</h3>' ;
 }


/* --------- ITEM ---------------*/
class Item {
  constructor(name,  value, price, bodypart) 
  {
    this.Name  = name;
    this.bodypart  = bodypart;
    this.armor = value;
    this.cost  = price;
  }
}

Item.prototype.Print=function()
{
	return this.Name+', Def +' + this.armor + ', Price:' + this.cost + ' gold' ;
}

Item.GetItem=function (list, bodypart) {
	return list.find(function(e) {    return (e.bodypart == bodypart);});
}


/* -------------  CONFIG ---------------*/

var config = { 
	bodypart:{	Head:'Helmet', Breastplate:'Breastplate', Gaiters:'Gaiters', Boots:'Shoes', Gloves:'Gloves' , Weapon:'Weapon'},
	skills:{ 	LightArmor:'LightArmor', HeavyArmor:'HeavyArmor', Swords:'Swords', Blunt:'Blunts' }
};


var Items = [];
Items.push( new Item('Training Helmet', 2, 10, config.bodypart.Head) );
Items.push( new Item('Training Breastplate', 5, 30, config.bodypart.Breastplate) );

/*
идеи:
 гладиатор получает класс на 5 левеле
 пригодные к арене копейщик(ретиарий retiarius), мечник(thraex), гладиатор(murmilo)
  могут быть использованы для боев, проданы в армию, или как охрана  
 некоторые классы непригодны для арены - вор, лучник
 зато их можно отправить в разные локации
  вора в город - ( потом есть шанс его выкупать из тюрьмы)
  лучник в лес - охотник(еда, трофеи) или егерь ( организация охот)
 апгрейд обиталища вора\охотника 

  %USERPROFILE%\.cargo\bin



*/