// todo
//1: global increase mobs power 
//2: classes and specific spawns : aoe, sneak, mini bosses, traps, mimics
// classes: rogue, warrior, mage
// rogue: better sneak, better crit, see traps, weak normal damage, can distance, good steal
// warrior: can aoe with spear weapon, good armor, bad sneak, good normal atk, better regen
// mage : have learnable skills for sneak, see traps, strong aoe, can summon pet 
// add 'skill' amulets
//3: different weapons-armor: for range/aoe 
// have bow: available ranged attack
// have polearm: can hit all mobs in range
// have cloak: can sneak better
//4: class skills
//specfic npc to learn skills
//skill books?
//5: better interface + icons
//6: rewrite with outer functions

var Skill = {
// just one place to keep all names written ONCE
    
    Camping:"Camping",
    Prayer:"Healing",
    Evasion:"Evasion",
    Greed:"Greed",
    Criticals:"Critical Strike",
    Poison:"Poison", 
    Shield:"Shielding",
    Reflect:"Reflect",
    Traps:"Traps",
    ArcaneMastery:"Spellcasting",
    VR:"Vampiric",
    OverHit:"OverHit!",
    Cripple:"Cripple",
    PotionMastery:"Potion Craft",
};
var Archetype = {
    Rogue:1, Warrior:2, Wizard:3, Monk:4, Healer:5
};

var Buttons = {
 counter : [0,0,0,0,0],
 
 Reset : function(){
    counter[0] = 0;
    counter[1] = 0;
    counter[2] = 0;
    counter[3] = 0;
    counter[4] = 0;
 },

 Get: function (num){
    return Buttons.counter[num];
 },

 Count: function (num){
     Buttons.counter[num]++;
     console.log('saved click on ', num,  '  = ',  Buttons.counter[num]);
 }

};

 
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


    //drink potion
     DrinkPotion : function()
     { 
        if (pots>0)
        {
            pots--;
            HP+=10+2*Player.Level;
            if(HP>Player.MaxHP) 
                    HP=Player.MaxHP; 
        }
    },

      Def : function()
        {
            return Math.min(200, Math.floor(Player.Level*2 + Player.DefBonus));
        },

        Atk :  function()
        {
            return  Math.floor(Player.AtkBonus/Player.Level + Player.Level*3 + 6 + Player.AtkBonus/3);
        },
        isMonk : function(){
        return Player.Class==4;
    },

    isWarrior : function(){
        return Player.Class==2;
    },
    isMage : function(){
        return Player.Class==3;
    }

    };


// less usable
  
    Player.isRogue = function(){
        return Player.Class==1;
    }
    Player.isCleric = function(){
        return Player.Class==5;
    }


Player.UpdateClassName=function(){
    var add="";
        if (Player.Level<=2){ add="Noob ";}
        if (Player.Level>4){ add="Trained ";}
        if (Player.Level>7){ add="Mighty ";}
        if (Player.Level>10){ add="Expert ";}
        switch(Player.Class){
        case 0 :  Player.ClassName = add ; break;
        case Archetype.Rogue   :  Player.ClassName = add + "Rogue"; ; break;
        case Archetype.Warrior :  Player.ClassName = add + "Warrior"; break;
        case Archetype.Wizard  :  Player.ClassName = add + "Mage";    break;
        case Archetype.Monk    :  Player.ClassName = add + "Monk";    break;
        case Archetype.Healer  :  Player.ClassName = add + "Healer";  break;
        Player.ClassName =  add+"unknown";
        }
    }  


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
    }


console.log('begin');



(function(elid, wi, he, exp, pot, gld, hp, lvl, cur_e, e_sz)
    {

    
    var IMHP=12;
    var IMAtk=13;
    var IMXP=14;
    var IMGold=15;
    


    var Evasion=0;
    var CurrentMobMaxHP=200;    
   
   // todo, skills

    //var AOEMultiplier=0;    
    var CriticalMultiplier=2;    
    var SneakAddChance=0;    
    var StealAddChance=0;    
    //var KnockDownChance=0;    
    //var LevitationAvoidChance=0;    
    //var ShieldBlockChance=0;    
    //var SpikesDamage=0;    
    //var Vampirism=0;    
    //var Berserker=0;    
    var Hint ="";



    var Traits=[

    // passive 'skills'
    // name,  key value, description, level, enabled, etc ]
        [ Skill.Camping,  1, "Restore health after fight", 1 ],
        [Skill.Prayer,  1, "Additional health restored from potions", 1],
        [Skill.Evasion,  10, "% Chance to avoid monster attack", 1],
        [Skill.Greed,  10, "% Chance to find x2 gold", 1],
        [Skill.Criticals,  30, "% Chance to make critical x2 attack", 1], 
        [Skill.Poison,  5, "% Additional damage", 1], 

        //warrior        
        [Skill.Shield,  5, "5-25% more effect from armor", 1], 
        [Skill.Reflect,  1, " 1-2-3-4-5% chance reflect full damage", 1], 

        //rogue    
         [Skill.Traps,  1, " 1-2-3-4-5% chance reflect full damage", 1], 

        //Wizard
        [Skill.ArcaneMastery,  2, "First nuke do x2/x2.25/x2.5/x2.75/x3 Damage", 1], 
        [Skill.VR,  2, "restoring  2-10% from damage inflicted", 1], 

        //Monk
        [Skill.OverHit,  2, "If damage  x2 more  from mob HP left - get 20% exp bonus", 1], 
        [Skill.Cripple,  30, "If attack crits -  mob damage - decreased for penalty 30%-60%", 1], 

        //Healer
        [Skill.PotionMastery,  20, " 20-80% chance to get 1 pot from each monster", 1]

    ];

    var ImproveTrait = function(traitName, cost=200)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
        {
            if ( Traits[i][0] == traitName){

                if (Traits[i][3]<5 && Player.Gold>=cost)
                {
                    Traits[i][3]++; 
                    Player.Gold-=cost;
                } 
            }
        }

    }

    var GetHintFor = function(index){
        //return visible hint #i
        var num=0;
    for (var i = 0; i < Traits.length ; i++) 
    {
          if (Traits[i][1]!=0)  {
            if (num == index)
                    return Traits[i][2] ;
            num++;
          }
    }

        return "";
    }

 var IsTraitEnabled = function(traitName)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
            if ( Traits[i][0] == traitName) 
                return Traits[i][1]>0;

            return false;
    }




 var SetTraitKeyValue = function(traitName, val)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
            if ( Traits[i][0] == traitName) 
                Traits[i][1]=val;

    };

var GetTraitValue = function(traitName)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
        {
            if ( Traits[i][0] == traitName)  
                 return Traits[i][3] * Traits[i][1]; 
            // should be some unique?
        }
        return 0;

    };


    var DrawPlayerInterface=function()
    {

        var i=0;
        
        var debug=true;



        ctx.strokeRect(150,40,300,10);
        ctx.fillStyle = "green";
        ctx.fillRect(151,41,  Math.min(300,  Math.floor(300*Player.HP/Player.MaxHP)),8);

        if (evs[cur_e].length>IMHP+1) {
        ctx.fillStyle = "red";
        ctx.fillText("vs", 455, 50);
        ctx.strokeRect(320+150,40,300,10);
        ctx.fillStyle = "gray";
        ctx.fillRect(320+151,41,  Math.min(100,  Math.floor(300*evs[cur_e][IMHP]/CurrentMobMaxHP)),8);
        }
       
        
        var iconSpaceX=10;
        var iconSpaceY=10;
        var iconHeight=15;
        var iconWidth=75;


        ctx.strokeRect(i*40+5,540,300,13);
        ctx.fillStyle = "red";
        ctx.fillText("Passive Skills", i*40+130, 540+10);

        ctx.strokeRect(8*40+5,540,300,13);
        ctx.fillStyle = "red";
        ctx.fillText("Active Skills", 8*40+130, 540+10);



        var j =Traits.length - 1;

         for (var i = Traits.length - 1; i >= 0; i--) 
            if (Traits[i][1]==0)   
                j--;

        for (var i = Traits.length - 1; i >= 0; i--) {

              if (Traits[i][1]!=0)  
              {
                ctx.strokeRect( j*(iconSpaceX + iconWidth) + 5 , 560 ,iconWidth,iconHeight);
                ctx.fillStyle = "blue";
                ctx.fillText(Traits[i][3], 2 + j*(iconSpaceX + iconWidth)+7, 560+11);
                ctx.fillStyle = "red";
                ctx.fillText(Traits[i][0], 10 + j*(iconSpaceX + iconWidth)+7, 560+11);
                ctx.fillText(" " , j*(iconSpaceX + iconWidth)+7, 560+22);
                j--;
        
            }
        }
        

        ctx.fillStyle = "red";
        ctx.fillText(Hint, 0 * (iconSpaceX + iconWidth)+7, 590);


    };
    

    var Roll = function(percent){
        return Math.floor(Math.random()*100) <= percent; // so Roll(90) give 90% chance success)
    };

    var R20 = function(){
        return Math.floor(Math.random()*20);
    };

    var R100 = function(){
        return Math.floor(Math.random()*100);
    };

   

    var calcDMGFromPlayer = function(atk, Tdef, Thp)
    {
        var criticalBonus=0;

        var normalDamage=(atk*atk) / (Tdef*10);

        var minDamage=(0.5 + atk/10);
        
        if (criticalBonus > 0)
        {
            return Math.floor( minDamage + criticalBonus  );
        }
        return Math.floor( minDamage +  normalDamage );
    };

    var calcDMGFromMob = function(atk, Tdef, Thp)
    {
        var criticalBonus=0;

        var normalDamage=(atk*atk) / (Tdef*10);

        var minDamage=(0.5 + atk/10);
        
        if (criticalBonus>0)
        {
            return    Math.floor( minDamage + criticalBonus  );
        }

        return    Math.floor( minDamage +  normalDamage );

    };

 

    var MobToElements = function(mob)
    {
        var element = [ mob.name,  mob.desc ].concat(  battle, mob.hp, mob.atk, mob.xp, mob.gold);
        return element;
    };


    function monster(mname, hp, damage, defence, exp, gold, desc="")
    {
     this.name=mname;
     this.hp=hp;
     this.atk=damage;
     this.def=defence;
     this.xp=exp;
     this.gold=gold;
     this.description = desc;
    };


    var hit = function(){

        //console.log("[Hit]  player class=", PlayerClass);

        var PlayerDidDamage = calcDMGFromPlayer(Player.Atk(),evs[cur_e][IMAtk]/5, evs[cur_e][IMHP]); 
        var PlayerGotDamage = calcDMGFromMob(evs[cur_e][IMAtk],Player.Def(),Player.HP) ;
        //also monster got damage from spikes
        //PlayerDidDamage += (PlayerGotDamage*SpikesDamage/100);
        
        evs[cur_e][IMHP] -=  PlayerDidDamage;
        hp -=  PlayerGotDamage;        
        
        //player won
       if (evs[cur_e][IMHP]<=0) {
            var GotMoney = evs[cur_e][IMGold];
            var GotExp = evs[cur_e][IMXP];

            if (R100() <= GetTraitValue("Greed"))
            {
                 GotMoney *= 2;
            }


            alert("Monster defeated and you got "+GotExp+"EXP and $" + GotMoney);

            Player.Exp+=evs[cur_e][IMXP]; 
            Player.Gold += GotMoney ;

           // dont let hero die if he killed mob 
           Player.HP = Math.max(1,hp);  

            // restore some hp from Camping
                var RestoredHP = (Player.MaxHP * GetTraitValue("Camping")  / 100) ;
                hp= Math.min(Player.MaxHP, Player.HP + RestoredHP);

            while (exp>=Player.Level*Player.Level*5) { exp-=Player.Level*Player.Level*5; hp+=10; Player.Level++; alert("Level Up!") }
            cur_e++; 
            
            if (cur_e==e_sz) alert("Victory!")

        } else {
        // mob won
            hp = Math.max(0,hp);
            if(hp<=0) 
                    alert("Game Over!");
        } 
        if (evs[cur_e][IMHP]>0 && hp>0)
        {
            ;

        // both alive - apply vampiric effects
        /*
           if ( hp <= MaxHP &&  Vampirism > 0 )
            { 
             hp += Math.floor(PlayerDidDamage * Vampirism / 100);
             hp = Math.min( MaxHP,  hp );
            }
            */
        }
    };
    
    
    //move to next cell
    var nxt = function(){ 
        cur_e++; 
        // reset CELL only variables (for 'one time' actions)
     }

//sneak  mob
var skp = function()
{ 
    //SneakChance()
    if (100 < Math.floor(Math.random(100)))
    {
        //accident
        hp-=10;
        hp = Math.max(1,hp);
    }

    // sneak give no exp, and no money 
    cur_e++; 
};
    
    //run from mob
var dns = function()
{  
        // 50% chance for -5 hp
    if (50 > Math.floor(Math.random(100)))
    {
        hp-=5;
        hp = Math.max(1,hp);
    }
        // 25% chance for -5 gold
    if (25 > Math.floor(Math.random(100)))
    {
        gld-=5;
    }
    cur_e++;
};
    
    //try to steal drop from alive mob
    var tlk = function(){ 
        // trief  = steal, some chance
        // warrior = practice ( no money, but chance for x2 exp)
        // wiz = learn // ? 
        // monk = peace 
        // healer = sleep ( chance for 100% steal)
        cur_e++ 
    };
    
    //nothing u can do here
    var nop = function(){ ; };
 
  var InitClassMasteries = function()
  {

    Player.UpdateClassName();
    console.log(Player.Class);

    if ( Player.Class != Archetype.Warrior)
    {
        console.log("Hide warrior");
        SetTraitKeyValue(Skill.Shield,  0) ;
        SetTraitKeyValue(Skill.Reflect,  0) ;
    }
    
    if (Player.Class != Archetype.Wizard)
    {
        console.log("Hide wiz");
        SetTraitKeyValue(Skill.ArcaneMastery,  0) ;
        SetTraitKeyValue(Skill.VR,  0) ;
    }
    
    if (Player.Class!=Archetype.Rogue)
    {
        console.log("Hide rog");
       SetTraitKeyValue(Skill.Traps,  0) ;
    }
        
    if (Player.Class!=4)
    {
        console.log("Hide Monk");
        SetTraitKeyValue(Skill.OverHit,  0) ;
        SetTraitKeyValue(Skill.Cripple,  0) ;
    }

    if (Player.Class != 5)
    {
        console.log("Hide heal");
        SetTraitKeyValue(Skill.PotionMastery,  0) ;
    }

  };

 

    var ButtonAttack = function()
    {
        if (Player.Class==1)
             return "Stab";
        if (Player.Class==3)
             return "Nuke";
        if (Player.Class==4)
             return "Kick";
         
        return "Attack";
    }

    var ButtonSneak = function(){
        if (Player.Class==1)
             return "Sneak 75%";
        if (Player.Class==3 || Player.Class==5 )
             return "Sneak 5%";
        return "Sneak 40%";
    }
     
    var ButtonSteal = function(){
        if (Player.isRogue())
             return "Steal 75%";
        if (Player.isMage())
             return "Steal 5%";
        return "Steal 10%";
    }

   



    var ActionForClass = function(FuncRogue, FuncWarrior, FuncWizard, FuncHealer, FuncMonk)
    {
        //console.log("[FuncForClass | pc]= ", Player.Class);

           if (Player.Class == 1) 
              FuncRogue();

           if (Player.Class == 2) 
              FuncWarrior();

           if (Player.Class == 3) 
             FuncWizard();

           if (Player.Class == 4) 
             FuncMonk();

           if (Player.Class == 5) 
             FuncHealer();

    }

    var TitleForClass = function(TitleRogue, TitleWarrior, TitleWizard, TitleHealer, TitleMonk)
    {

        //console.log("[TitleForClass | pc]= ", Player.Class);

           if (Player.Class == 1) 
             return TitleRogue;
           if (Player.Class == 2) 
             return TitleWarrior;
           if (Player.Class == 3) 
             return TitleWizard;

           if (Player.Class == 4) 
             return TitleMonk;

           if (Player.Class == 5) 
             return TitleHealer;

         return "WTF";
    }



    // general battle, must be modified for each class
    
    var battle = [ ButtonAttack , "Use Potion +10HP", ButtonSneak,"Run 50%", ButtonSteal,
                  hit, Player.DrinkPotion, skp, dns, tlk ];
         
    
    var canvas=document.querySelector(elid), ctx=canvas.getContext("2d");
    
    canvas.width=wi; canvas.height=he;
    
    var evs=[], 
        
        
        // start location 
        e_tp=[
            ["Village", "Your adventure start here. Choose your class:", "Rogue", "Warrior", "Mage","Monk" , "Healer",
            // set class bonuses for traits ?
        function(){ 
            Player.Class=Archetype.Rogue;
            // rogue - high greed, high eva, high crit,good poison
        SetTraitKeyValue("Camping",  1),
        SetTraitKeyValue("Prayer",  1),
        SetTraitKeyValue("Evasion",  10),
        SetTraitKeyValue("Greed",  20);   
        SetTraitKeyValue("Critical Strike",  35) ;
        SetTraitKeyValue("Poison",  7) ;
        // hide extra Traits
         InitClassMasteries();

        cur_e++ }, 

        function(){ 
            Player.Class=Archetype.Warrior;
            //warrior - good rest, normal crit
        SetTraitKeyValue("Camping",  1.2),
        SetTraitKeyValue("Prayer",  1.1),
        SetTraitKeyValue(Skill.Evasion,  0),
        SetTraitKeyValue(Skill.Greed,  10);   
        SetTraitKeyValue(Skill.Criticals,  25) 
        SetTraitKeyValue(Skill.Poison,  4) 
         // hide extra Traits
        InitClassMasteries();

         cur_e++ }, 
        function(){ 
            Player.Class=Archetype.Wizard;
            //mage - more greed, bad crits, good poison
        SetTraitKeyValue(Skill.Camping,  1.1),
        SetTraitKeyValue("Prayer",  1.2),
        SetTraitKeyValue(Skill.Evasion,  3),
        SetTraitKeyValue("Greed",  15);   
        SetTraitKeyValue("Critical Strike",  15) 
        SetTraitKeyValue("Poison",  8) 
        InitClassMasteries();
         cur_e++ },
        function(){ 
            Player.Class=Archetype.Monk; 
            // monk - no greed, good eva, low poison, good crit
        SetTraitKeyValue(Skill.Camping,  1.4),
        SetTraitKeyValue("Prayer",  1.4),
        SetTraitKeyValue("Evasion",  15),
        SetTraitKeyValue("Greed",  0);   
        SetTraitKeyValue("Critical Strike",  35) 
        SetTraitKeyValue("Poison",  5) 
        InitClassMasteries();
        cur_e++ },  
        function(){ 
            // good restore / poisons
            Player.Class=Archetype.Healer; 
        SetTraitKeyValue("Camping",  2.5),
        SetTraitKeyValue("Prayer",  2.0),
        SetTraitKeyValue("Evasion",  3),
        SetTraitKeyValue("Greed",  7);   
        SetTraitKeyValue("Critical Strike",  15) 
        SetTraitKeyValue("Poison",  12) 
        InitClassMasteries();
        cur_e++ }, 
         ,nxt

    ],


      // locations for Warrrior : shop { training,  improve shield }
      ["BlackSmith", "Dude with hammer can make your gear better and train you as Fighter.", 


      // rog, war, wiz, heal, monk
        function(){ return TitleForClass(
            "Upgrade Weapon $50",
             "Upgrade Weapon $50",
             "Enchant Weapon $90 ",
             "Upgrade Weapon $40",
             "Practice with Hammer")}, 
               

        function(){ return TitleForClass(
             "Improve Armor $50",
             "Improve Armor $50",
             " - " ,
             " - " ,
             " - " )}, 
        "Leave",

        function(){ return TitleForClass( "Learn 'Criticals' $100","Shielding Lesson  $100", " - ", "Learn 'Criticals' $100", " - ")}, 
        function(){ return TitleForClass("-", "Help with Work +$50", "Help with Work +$50", "Heal his horse +$50", "Do hard work")}, 
        // var DoTraining = function (cost, AddMaxHP, AddHP, AddAtk, AddDef, AddGold){
        //"Weapon Training $50", "Weapon Training $50","Enchant Weapon $100", "Basic Training $50", "Basic Training $50"), //      "Basic Training $50", 
        function(){return ActionForClass( 
            function(){ return Player.DoTraining(50, 0,0, 6, 0, 0, 1,3); },  // rog 
            function(){ return Player.DoTraining(50, 0,0, 6, 0, 0, 1,3); },  //war
            function(){ return Player.DoTraining(100, 0,0, 6, 0, 1,3); },   //wiz
            function(){ return Player.DoTraining(50, 0,0, 4, 0, 1,3); },  // heal
            function(){ return Player.DoTraining(50, 4,0, 2, 0, 0,1,1 ); }  // monk
        )},

        //"Improve Armor $50", "Improve Armor  $50"," - ", " - ", " - "), 
        function(){return ActionForClass( 
            function(){ return Player.DoTraining(50, 0,0, 0, 4, 0); },  // rog 
            function(){ return Player.DoTraining(50, 2,0, 0, 4, 0); },  //war
            nop,   //wiz
            nop,  // heal
            nop  // monk
        )},
        
        nxt, // leave
         
         // "Learn 'Criticals' $100","Shielding Lesson  $100", " - ", "Learn 'Criticals' $100", " - "), 

        function(){return ActionForClass(
            function(){ ImproveTrait("Critical Strike", 100); },  // rog 
            function(){ ImproveTrait("Shield Mastery", 100); },  //war
            nop,   //wiz
            function(){ ImproveTrait("Critical Strike", 100); },  // heal
            nop  // monk
        )},

        function(){ return ActionForClass(//"-", "Help with Work +$50", "Help with Work +$50", "Heal his horse +$50", "Do hard work"), 
            nop,  // rog 
            function(){ Player.DoTraining(0, 0,-2, 0, 0, 50); },  //war
            function(){ Player.DoTraining(0, 0,0, 0, 0, 50); },   //wiz
            function(){ Player.DoTraining(0, 0,0, 0, 0, 50); },  // heal
            function(){ Player.DoTraining(0, 4,-2, 2, 0, 0); }  // monk
        )}

     ],

/*
    // locations for all : shop { heal, pots, upgrade weapon/armor }
    //bonus for wizards - extra pot on max heal, extra max hp, also training give more to wiz
    ["Shop", "Wizard provides his services", "Buy Potion $20", "Full Heal $100", "Leave","Enchant Weapon $50","Enchant Armor 50$",
        function(){ if(gld>=20 ) { gld-=20; pot++} },
        function(){ if(gld>=100) { gld-=100; hp=MaxHP} }, nxt ,
        function(){ if(gld>=50 ) { gld-=50; Vampirism+=1; MaxHP+=1; } },
        function(){ if(gld>=50 ) { gld-=50; DefBonus+=2; MaxHP+=5;} }, nxt,

    ],

    // locations for Healer : learn heal power

    // bonus for clerics / monks ? 
    ["Church", "Cleric provides his services", "Buy Potion $20", "Full Heal $50", "Leave","Learn 'Greed'" , "Improve 'Camping'",
        function(){ if(gld>=20 )  { gld-=20; pot++} },
        function(){ if(gld>=100)  { gld-=100; hp=MaxHP; } }, nxt ,
        function(){ if(gld>=50 )  { gld-=50; ImproveTrait("Greed");} },
        function(){ if(gld>=100 ) { gld-=100;ImproveTrait("Camping"); } },
        nxt, 

    ],
        // bonus for all ? 
        ["Hunter", "Strong huntsman can teach you something", "Drink herbal tea $10", "Learn 'Poison' $100", "Leave" , "Learn 'Camo' $50" , "Improve 'Camping' $100",
        function(){ if(gld>=10 )  { gld-=10; MaxHP += 5; } },
        function(){ if(gld>=100)  { gld-=100; ImproveTrait("Poison"); } },
         nxt ,
        function(){ if(gld>=50 )  { gld-=50;  ImproveTrait("Evasion");  } },
        function(){ if(gld>=100 ) { gld -=100; ImproveTrait("Camping"); } },
        
        nxt, 

    ],
        
["Poor person", "He asks you to help him", "Sell HP pot +$25", "Make Quest", "Leave" , "Train Him" , " - ",
        function(){ if(gld>=10 )  { gld-=10; MaxHP += 5; } },
        function(){ if(gld>=100)  { gld-=100; ImproveTrait("Poison"); } },
         nxt ,
        function(){ if(gld>=50 )  { gld-=50;  ImproveTrait("Evasion");  } },
        ,
        
        nxt, 

    ],
        

        // locations for Rogue : shop { attackpower, hide chance,  steal chance }
    ["Ninja", "He can train rogue powers", "Weapon Practice $50", "Critical Strike - 100$", "Leave","Learn 'How-to-Spoil'","Learn 'Hide'",
        function(){ if(gld>=50)  { gld-=50; AtkBonus+=2 ; DefBonus+=2; Evasion+=2;} },
        function(){ if(gld>=50)  { gld-=50; ImproveTrait("Critical Strike");; } },
        nxt,
        function(){ if(gld>=300 && StealChance() <90 && isRogue()) {gld-=300; StealAddChance+=5} },
        function(){ if(gld>=300 && SneakChance() <90 && isRogue()) {gld-=300; SneakAddChance+=5;} },
     ],
    
   


     // should we remove it? it's from original game
    ["Dr. Future", "He can play with TIME", "Return to past $200", "Move To future $50", "Leave", "Free Lesson","-",
        function(){ if(gld>=200){gld-=200;  
     var prev_e= cur_e;
         cur_e=0;
                                 
       for (var i0=0;i0< prev_e;i0++)
        {
            if (!isNaN(evs[i0][IMHP])){
            if (evs[i0][IMHP]<=0) {
                //heal and make less reward
            //evs[i0][IMXP]   = Math.max(0,evs[i][IMXP]-10) ;
            //evs[i0][IMatk]  +=  Math.floor(1+Math.random()*15) ;
            //evs[i0][IMGold] = Math.max(0 , evs[i][IMGold] - 20) ;
            evs[i0][IMHP]   = 20 + Math.floor(Math.random()*100) ;
//            } else { 
                //stronger and better reward
  //          evs[i0][IMXP]   += Math.floor(5+Math.random()*25) ;
            //evs[i0][IMatk]  += Math.floor(5+Math.random()*15) ;
            //evs[i0][IMGold] += Math.floor(5+Math.random()*20) ;
    //        evs[i0][IMHP]   +=  Math.floor(5+Math.random()*20) ;
            }
        }

        }
        } },
        function(){ alert("He stole all your money and puff.. disappear"); gld=0; cur_e++;} , nxt ,
        function(){  DefBonus+=1; MaxHP-=5; },   ,],
        */



        // monsters: from strong - to weak

    ["SawMan", "Huge man with a saw, it's really danger"].concat(battle,160,30,50,200),
    ["Skeleton", "A terrible skeleton on your way"].concat(battle,80,15,20,100),
    ["Goblin", "Green goblin wants to get your money"].concat(battle,65,10,15,70),
    ["Giant ant", "Damn! That insects...."].concat(battle,55,15,15,70+Math.floor(Math.random()*20)),
    ["Werewolf", "Dark werewolf trying to bite you"].concat(battle,50,15,15,50+Math.floor(Math.random()*40)),
    ["Slime", "What the strange jelly monster?"].concat(battle,20+R20(),3,7,30),
    ["Big slime", "What the strange jelly monster?"].concat(battle,30+R20(),5,9,35),
    MobToElements( new monster("Zombie", 50, 10, 33, 50, 1) ),
    MobToElements( new monster("Imp", 70, 25, 35,  80, 1) ),
    MobToElements( new monster("Lizard", 60, 16, 16, 50, 1) ),

    // final boss
    ["Dragon", "Omg! It is evil Dragon!","Attack","Use Potion +10HP","-","-","-",hit,Player.DrinkPotion,,,,800,130,100,1000 ] ];


// init cells 

    var q=e_tp.length-2;
// 1st is village         
     evs.push( e_tp[0].slice(0) );
     evs.push( e_tp[1].slice(0) );



// this crap should be improved
// keep only few NPC, more monsters
// only 1 time traveler, not on 1-2 line, but later
// 
    for (var i=0;i<e_sz-2;i++) 
             {    evs.push( e_tp[1+Math.floor(Math.random()*q)].slice(0) );}

//last is Dragon
    evs.push( e_tp[q+1].slice(0) );


            
    var game = setInterval(function()
    {
        
    ctx.clearRect(0,0,wi,he);
    ctx.fillText("NanoRPG in 30 lines of JavaScript by ripatti (modified by alilgz)",10,15);
    // basic stats
    ctx.fillText("LVL "+ Player.Level+
         "  HP "   +  Player.HP    + "/"+ Player.MaxHP +
         "  EXP "  +  Player.Exp   + "/"+ Player.Level * 10+
         "  ATK "  +  Player.Atk() + 
         "  DEF "  +  Player.Def() + 
         "  Gold $"+   Player.Gold + "  Potions "+ Player.pots,10,30);
       
    ctx.fillText("Class: " + Player.ClassName,10,45);
        

        // draw map 
        for (var i=0;i<e_sz;i++)
        {
            //14 in row
            cX=i % 14;
            cY=Math.floor(i/14);
            ctx.fillText((i==e_sz-1||i<=cur_e) ? evs[i][0] : "??", cX*50+20, 50*cY+ 120);
        }

        // hp bar + skills bar
        DrawPlayerInterface();

        ctx.fillStyle = "black";
        ctx.fillText("@",(cur_e % 14)*50+25,50*Math.floor(cur_e/14) + 100);
        ctx.fillText(evs[cur_e][0]+ ': '+evs[cur_e][1],20,60);
        if (evs[cur_e].length>IMHP+1)  ctx.fillText("Enemy HP "+evs[cur_e][IMHP],20,80);
        

        // buttons     
        ctx.fillStyle = "red";
        for (var i=0;i<5;i++) 
        {
            ctx.strokeRect(i*120+5,460,110,20);
            if (typeof(evs[cur_e][i+2]) === 'function')
            {
              ctx.fillText(evs[cur_e][i+2](),i*120+10,473);
            } else {
              ctx.fillText(evs[cur_e][i+2],i*120+10,473);
            }
        }

        ctx.fillStyle = "black";
        
    }, 100);

    
    document.addEventListener('click', function(e)
    {

        if (hp>0)

            for (var i=0;i<5;i++)

                if ( 
                     i*120+5 <= e.offsetX &&  e.offsetX  < i*120+115  && 460 <= e.offsetY && e.offsetY<460+20)
                       { 
                        console.log('click button #',i, evs[cur_e][i+7]);
                        
                        evs[cur_e][i+7](); 
                        }
                   else {
                    //     console.log("click" + e.offsetX +':'+e.offsetY + ' vs '+ (i*120+5)+':'+460);

                   }
    }, false);


    // add same hints to buttons ( class description?)

     document.addEventListener('mousemove', function(e){
        var iconSpaceX=10;
        var iconSpaceY=10;
        var iconHeight=15;
        var iconWidth=75;
        
        Hint="";
        
        if (hp>0)
            {
            for (var i=Traits.length-1; i>=0; i--)
                {
                 
                if ( i*(iconSpaceX + iconWidth)+5  <= e.offsetX &&  e.offsetX  < i*(iconSpaceX + iconWidth)+5 + iconWidth  && 560 <= e.offsetY && e.offsetY < 560 + iconHeight )
                        {
                            Hint = GetHintFor(i) ; //Traits[i][1] +""+ Traits[i][2];
                        }
                }
            }
    }, false);

})("#canvas",800,600,0,3,3000,100,1,0,90);