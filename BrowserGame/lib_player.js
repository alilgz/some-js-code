/**
 * Created by ODiakov on 2/6/2017.
 */



var Player = {
    Class:0,
    Exp:0,
    Level:1,
    MaxHP:100, HP:100,
    AtkBonus:1,
    DefBonus:1,
    ClassName: "Noob",
    Gold:3000, // for debug!
    pots:0,


    //

    BuyFullHeal:function(){

        if (this.Gold>100)
        {
            this.HP=this.MaxHP;
            this.Gold-=100;
        }

    },

    BuyPot:function(){
        console.log('BuyPot');
        console.log('Gold = ', Player.Gold);

        if (Player.Gold>20)
        {

            Player.pots++;
            Player.Gold-=20;
        }
    },

    //drink potion
    DrinkPotion : function()
    {
        if (Player.pots>0)
        {
            Player.pots--;
            HP+=10+2*Player.Level;
            if(Player.HP>Player.MaxHP)
                Player.HP=Player.MaxHP;
        }
    },

    Def : function()
    {
        var BaseDef = Math.floor(Player.Level*2 + Player.DefBonus);
        var FullDef =  BaseDef  + (BaseDef * GetTraitValue(Skill.Shield) / 100) ;

        return Math.min(200, FullDef);
    },

    Atk :  function()
    {
        return  Math.floor(Player.AtkBonus/Player.Level + Player.Level*3 + 6 + Player.AtkBonus/3);
    },

    isMonk : function()
    {
        return Player.Class==4;
    },

    isWarrior : function()
    {
        return Player.Class==2;
    },

    isMage : function(){
        return Player.Class==3;
    },

    isRogue: function(){
        return Player.Class==1;
    },

    isCleric : function(){
        return Player.Class==5;
    }

};



Player.UpdateClassName=function(){
    var add="";
    if (Player.Level<=2){ add="Noob ";}
    if (Player.Level>4){ add="Trained ";}
    if (Player.Level>7){ add="Mighty ";}
    if (Player.Level>10){ add="Expert ";}
    switch(Player.Class)
    {
        case 0 :  Player.ClassName = add ; break;
        case Archetype.Rogue   :  Player.ClassName = add + "Rogue"; ; break;
        case Archetype.Warrior :  Player.ClassName = add + "Warrior"; break;
        case Archetype.Wizard  :  Player.ClassName = add + "Mage";    break;
        case Archetype.Monk    :  Player.ClassName = add + "Monk";    break;
        case Archetype.Healer  :  Player.ClassName = add + "Healer";  break;
            Player.ClassName =  add+"unknown";
    }
};



Player.InitClassMasteries = function()
{

    Player.UpdateClassName();
    console.log(Player.Class);

    // 1. set general by class
switch(Player.Class) {

    case Archetype.Rogue:
        SetTraitKeyValue(Skill.Camping, 1),
        SetTraitKeyValue(Skill.Prayer, 1),
        SetTraitKeyValue(Skill.Evasion, 10),
        SetTraitKeyValue(Skill.Greed, 20);
        SetTraitKeyValue(Skill.Criticals, 35);
        SetTraitKeyValue(Skill.Poison, 7);
        break;
    case Archetype.Warrior:
        SetTraitKeyValue(Skill.Camping,  1.2),
        SetTraitKeyValue(Skill.Prayer,  1.1),
        SetTraitKeyValue(Skill.Evasion,  0),
        SetTraitKeyValue(Skill.Greed,  10);
        SetTraitKeyValue(Skill.Criticals,  25)
        SetTraitKeyValue(Skill.Poison,  4)

        break;
    case Archetype.Wizard:
        SetTraitKeyValue(Skill.Camping,  1.1),
        SetTraitKeyValue(Skill.Prayer,  1.2),
        SetTraitKeyValue(Skill.Evasion,  3),
        SetTraitKeyValue(Skill.Greed,  15);
        SetTraitKeyValue(Skill.Criticals,  15)
        SetTraitKeyValue(Skill.Poison,  8)

        break;
    case Archetype.Monk:
        SetTraitKeyValue(Skill.Camping,  1.4),
        SetTraitKeyValue("Prayer",  1.4),
        SetTraitKeyValue("Evasion",  15),
        SetTraitKeyValue("Greed",  0);
        SetTraitKeyValue("Critical Strike",  35)
        SetTraitKeyValue("Poison",  5)

        break;
    case Archetype.Healer:
        SetTraitKeyValue("Camping",  2.5),
        SetTraitKeyValue("Prayer",  2.0),
        SetTraitKeyValue("Evasion",  3),
        SetTraitKeyValue("Greed",  7);
        SetTraitKeyValue("Critical Strike",  15)
        SetTraitKeyValue("Poison",  12)

        break;

}

    // hide class specific
    if ( Player.Class != Archetype.Warrior)
    {
        SetTraitKeyValue(Skill.Shield,  0) ;
        SetTraitKeyValue(Skill.Reflect,  0) ;
    }

    if (Player.Class != Archetype.Wizard)
    {
        SetTraitKeyValue(Skill.ArcaneMastery,  0) ;
        SetTraitKeyValue(Skill.VR,  0) ;
    }

    if (Player.Class!=Archetype.Rogue)
    {
        SetTraitKeyValue(Skill.Traps,  0) ;
    }

    if (Player.Class!=4)
    {
        SetTraitKeyValue(Skill.OverHit,  0) ;
        SetTraitKeyValue(Skill.Cripple,  0) ;
    }

    if (Player.Class != 5)
    {
        SetTraitKeyValue(Skill.PotionMastery,  0) ;
    }

};

Player.ImproveAtk= function (cost, AddAtk,  button_num, maxTimesAllowed)
{
    Player.DoTraining(cost, 0, 0, AddAtk, 0, 0, button_num, maxTimesAllowed);
};

Player.ImproveDef= function (cost, AddDef,  button_num, maxTimesAllowed)
{
    Player.DoTraining(cost, 0, 0, 0, AddDef, 0, button_num, maxTimesAllowed);
};



Player.DoTraining = function (cost, AddMaxHP, AddHP, AddAtk, AddDef, AddGold, button_num, maxTimesAllowed)
{

    if (Buttons.Get(button_num) >= maxTimesAllowed)
        return;

    if (cost == 0 || cost<Player.Gold)
    {
        Player.Gold-=cost;
        Player.MaxHP+=AddMaxHP;
        Player.HP+=AddHP;
        Player.AtkBonus+=AddAtk;
        Player.DefBonus+=AddDef;
        Player.Gold+=AddGold;
        // count how many timespressed
        Buttons.Count(button_num);
    }
};
