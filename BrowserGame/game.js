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

 
(function(elid, wi, he, exp, pot, gld, hp, lvl, cur_e, e_sz){
    var AtkBonus=1;
    var DefBonus=1;
    var MaxHP=100;
    
    var IMHP=12;
    var IMAtk=13;
    var IMXP=14;
    var IMGold=15;
    
    //talents array: 3 active , 2 passive
    // can be learn by other class[?], better multipliers for specified class
    
    // mechanism to skill learn
    // 0. always available 
    // 1. by level
    // 2. buy for $$
    // 3. spell books (for unique skill or upgrades)
    // 4. Skill Points per level or Per Mob
    
    // need mechanism to avoid 'best skill' spam:
    // 0. why avoid? want me add random effects?
    // 1. mana
    // 2. reuse
    // 3. required items
    // 4. drop/xp penalty ?
    
    
    
    // knight 
    // passive: spikes - reflect % of received  damage 
    // passive: shield block - receive less damage, lesser crits from mob
    // make only one passive ? - reflect or decrease dmg
    // good hp regen? more hp from pots? potion mastery?
    // 1 knockdown - no damage from mob if success
    // 2 : ?
    // 3 : ?
    
    
    // rogue
    // passive: better avoid crits/ avoid normal damage
    // passive: sneak chance, steal chance++
    
    // acive : move behind and stab x2
    // active: decrease mob power/accuracy ?
        
    //mage
    // mana shield: ??
    // add mana ? can craft pots?
    // levitate: first attack from mob - 0 dmg, because mage levitate
    // charge : cast long skill - receive x2 damage, but make x4 
    // can run from mob easy
    // must be best with aoe
    // debuff mob?
    
    
    
    // mobs 
    // 0. add suffixes and multipliers
    // 1. add drop potions
    // 2. add groups (show as 3*50hp -> if has aoe can damage all )
    // and 3. add mini bosses 
    // 4. make their damage/level depends on player level (level 10 player must meet 'Epic Slime')
    // 5. mobs with  skills?
    // 6.  add ranged mobs, melee get extra damage when running to them
    
    // NPCs
    // 0. one for each class
    // 1. fake npc (humanoid monsters)
    // 2. lesser prices for some class?
    // 3. Gambling?
    
    // Items
    // 0. Alternate weapon [ ? ] bow/throwing knife/minion?
    // 1. repair after each fight? can't be repaired more than normal? 
    var PlayerClass=0;
    

    var Evasion=0;
    var CurrentMobMaxHP=200;    
   
   // todo, skills

    var AOEMultiplier=0;    
    var CriticalMultiplier=2;    
    var SneakAddChance=0;    
    var StealAddChance=0;    
    var KnockDownChance=0;    
    var LevitationAvoidChance=0;    
    var ShieldBlockChance=0;    
    var SpikesDamage=0;    
    var Vampirism=0;    
    var Berserker=0;    
    var Hint ="";


    var Traits=[

    // passive 'skills'
    // name,  key value, description, level, enabled, etc ]
        ["Camping",  1, "Restore health after fight", 1 ],
        
        ["Prayer",  1, "Additional health restored from potions", 1],
        
        ["Evasion",  10, "% Chance to avoid monster attack", 1],
        
        ["Greed",  10, "% Chance to find x2 gold", 1],

        ["Critical Strike",  30, "% Chance to make critical x2 attack", 1], 

        ["Poison",  5, "% Additional damage", 1], 

    //

    ];

    var ImproveTrait = function(traitName)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
        {
            if ( Traits[i][0] == traitName){

                if (Traits[i][3]<9 && gld>=200)
                {
                    Traits[i][3]++; 
                    gld-=200;
                } 
            }
        }

    }

 var SetTraitKeyValue = function(traitName, val)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
            if ( Traits[i][0] == traitName) 
                Traits[i][1]=val;

    }

var GetTraitValue = function(traitName)   {

        for (var i = Traits.length - 1; i >= 0; i--) 
        {
            if ( Traits[i][0] == traitName)  return Traits[i][3] * Traits[i][1];            }
        }
        return 0;

    }






    var HealPower=1;      // 1 = 100%, for mage, warrior -  1.1; for monk, cleric 1.3 ( 1.4 -> 1.5 -> 1.6 after skill lvl up ), 1 for rogue
    var CanUseHeal=0;     // 0 = no heal after fight, 1 = small heal (warrior,  monk) , 2 = big heal after fight (Cleric)


 

    var DrawPlayerInterface=function(){

        var i=0;
        
        var debug=true;



        ctx.strokeRect(150,40,300,10);
        ctx.fillStyle = "green";
        ctx.fillRect(151,41,  Math.min(300,  Math.floor(300*hp/MaxHP)),8);

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




    


        for (var i = Traits.length - 1; i >= 0; i--) 
        {
            ctx.strokeRect(i*(iconSpaceX + iconWidth)+5,560,iconWidth,iconHeight);
            ctx.fillStyle = "blue";
            ctx.fillText(Traits[i][3], 0+ i*(iconSpaceX + iconWidth)+7, 560+11);
            ctx.fillStyle = "red";
            ctx.fillText(Traits[i][0], 10+ i*(iconSpaceX + iconWidth)+7, 560+11);
            ctx.fillText(" ",i*(iconSpaceX + iconWidth)+7, 560+22);
        }

        ctx.fillStyle = "red";
        ctx.fillText(Hint, 0 * (iconSpaceX + iconWidth)+7, 590);


        /*
       if (Vampirism>0 || debug)
        {
            ctx.strokeRect(i*(iconSpaceX + iconWidth)+5,560,iconWidth,iconHeight);
            ctx.fillStyle = "red";
            ctx.fillText("VR",i*(iconSpaceX + iconWidth)+7, 560+12);
            ctx.fillText(Vampirism + "%",i*(iconSpaceX + iconWidth)+7, 560+22);
            
        }

        i++
        if (SpikesDamage>0 || debug)
        {
             ctx.strokeRect(i*(iconSpaceX + iconWidth)+5,560,iconWidth,iconHeight);
            ctx.fillStyle = "red";
            ctx.fillText("Reflect", i*(iconSpaceX + iconWidth)+7, 560+12);
            ctx.fillText( SpikesDamage + "%", i*(iconSpaceX + iconWidth)+7, 560+22);
        }
        
        i++
        if (SneakAddChance>0 || debug)
        {
             ctx.strokeRect(i*(iconSpaceX + iconWidth)+5,560,iconWidth,iconHeight);
            ctx.fillStyle = "red";
            ctx.fillText("Sneak", i*(iconSpaceX + iconWidth)+7, 560+12);
            ctx.fillText(SneakChance()+"%",i*(iconSpaceX + iconWidth)+7, 560+22);
        }
        
        i++
        if (StealAddChance>0 || debug)
        {
             ctx.strokeRect(i*(iconSpaceX + iconWidth)+5,560,iconWidth,iconHeight);
            ctx.fillStyle = "red";
            ctx.fillText("Steal", i*(iconSpaceX + iconWidth)+7, 560+12);
            ctx.fillText(StealChance()+"%",i*(iconSpaceX + iconWidth)+7, 560+22);
        }

        i++
        if (LevitationAvoidChance>0 || debug)
        {
             ctx.strokeRect(i*(iconSpaceX + iconWidth)+5,560,iconWidth,iconHeight);
            ctx.fillStyle = "red";
            ctx.fillText("Fly", i*(iconSpaceX + iconWidth)+7, 560+12);
            ctx.fillText("+75%",i*(iconSpaceX + iconWidth)+7, 560+22);
        }
        */


    }
    
    var R20 = function(){
        return Math.floor(Math.random()*20);
    }
    var Def = function()
    {
        return Math.min(200, Math.floor(lvl*2 + DefBonus));
    }
    var StealChance=function(){
            if (isRogue())
                return 5+ StealAddChance*2;
        return StealAddChance;
    }
    var SneakChance=function(){
            if (isRogue())
                return 5+ SneakAddChance*2;
        return SneakAddChance;
    }
    var isWarrior = function(){
        return PlayerClass==2;
    }
    var isMage = function(){
        return PlayerClass==3;
    }
    var isRogue = function(){
        return PlayerClass==1;
    }
    var isCleric = function(){
        return PlayerClass==5;
    }

  var isMonk = function(){
        return PlayerClass==4;
    }
    var ClassName=function(classId, level){
    var add="";
        if (level<=2){ add="Noob ";}
        if (level>4){ add="Trained ";}
        if (level>7){ add="Mighty ";}
        if (level>10){ add="Expert ";}
        
        if (classId==0){ return add;}
        if (classId==1){ return add+"Rogue"; HealPower=1;     }
        if (classId==2){ return add+"Warrior"; HealPower=1.1; }
        if (classId==3){ return add+"Mage"; HealPower=1.1 ;   }
        if (classId==4){ return add+"Monk"; HealPower=1.3 ;   } 
        if (classId==5){ return add+"Healer"; HealPower=1.3;  }
        return add+"unknown";
    }    
    
    var Atk = function()
    {
        return  Math.floor(AtkBonus/lvl + lvl*3 + 6 + AtkBonus/3);
    }

    var calcDMGFromPlayer = function(atk, Tdef, Thp)
    {
        var criticalBonus=0;
        if (Math.random()>0.7){   
            criticalBonus=atk*CriticalMultiplier;    
        }
        var normalDamage=(atk*atk) / (Tdef*10);
        var minDamage=(0.5 + atk/10);
        
        if (criticalBonus>0)
        {
            return    Math.floor( minDamage + criticalBonus  );
        }
        return    Math.floor( minDamage +  normalDamage );
    }

    var calcDMGFromMob = function(atk, Tdef, Thp)
    {
        var criticalBonus=0;
        if (Math.random()>0.8){   
            criticalBonus=atk*2;    
        }
        var normalDamage=(atk*atk) / (Tdef*10);
        var minDamage=(0.5 + atk/10);
        
        if (criticalBonus>0)
        {
            return    Math.floor( minDamage + criticalBonus  );
        }
        return    Math.floor( minDamage +  normalDamage );
    }

 

var MobToElements = function(mob){
    var element = [ mob.name, "description here" ].concat(  battle, mob.hp, mob.atk, mob.xp, mob.gold);
    return element;
}




function monster(mname, hp, damage, defence, exp, gold){
 this.name=mname;
 this.hp=hp;
 this.atk=damage;
 this.def=defence;
 this.xp=exp;
 this.gold=gold;
}


    var hit = function(){
        var PlayerDidDamage = calcDMGFromPlayer(Atk(),evs[cur_e][IMAtk]/5, evs[cur_e][IMHP]); 
        var PlayerGotDamage = calcDMGFromMob(evs[cur_e][IMAtk],Def(),hp) ;
        //also monster got damage from spikes
        PlayerDidDamage += (PlayerGotDamage*SpikesDamage/100);
        
        evs[cur_e][IMHP] -=  PlayerDidDamage;
        hp -=  PlayerGotDamage;        
        
        //player won
       if (evs[cur_e][IMHP]<=0) {
            var GotMoney = evs[cur_e][IMGold];
            var GotExp = evs[cur_e][IMXP];
            if (R100() <= GetTraitValue("Greed")){
                 GotMoney *= 2;
            }


            alert("Monster defeated and you got "+GotExp+"EXP and $" + GotMoney);
            exp+=evs[cur_e][IMXP]; 
            gld += GotMoney ;

           // dont let hero die if he killed mob 
           hp = Math.max(1,hp);  

            // restore some hp from Camping
                var RestoredHP = (MaxHP * GetTraitValue("Camping") * HealPower / 100) ;
                hp= Math.min(MaxHP, hp + RestoredHP);

            while (exp>=lvl*lvl*5) { exp-=lvl*lvl*5; hp+=10; lvl++; alert("Level Up!") }
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
        // both alive - apply vampiric effects
           if ( hp <= MaxHP &&  Vampirism > 0 )
            { 
             hp += Math.floor(PlayerDidDamage * Vampirism / 100);
             hp = Math.min( MaxHP,  hp );
            }
        }
    }
    
    //drink potion
    var use = function(){ if (pot>0){pot--;hp+=10+2*lvl;if(hp>MaxHP)hp=MaxHP} }
    
    //move to next cell
    var nxt = function(){ 
        cur_e++; 
        // reset CELL only variables (for 'one time' actions)
     }

//sneak  mob
var skp = function()
{ 
    if (SneakChance() < Math.floor(Math.random(100)))
    {
        //accident
        hp-=10;
        hp = Math.max(1,hp);
    }

    // sneak give no exp, and no money 
    cur_e++; 
}
    
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
}
    
    //try to steal drop from alive mob
    var tlk = function(){ 
        // trief  = steal, some chance
        // warrior = practice ( no money, but chance for x2 exp)
        // wiz = learn // ? 
        // monk = peace 
        // healer = sleep ( chance for 100% steal)
        cur_e++ 
    }
    
    //nothing u can do here
    var nop = function(){ ; }
 
  
    var ButtonAttack = function()
    {
        if (PlayerClass==1)
             return "Stab";
        if (PlayerClass==3)
             return "Nuke";
        if (PlayerClass==4)
             return "Kick";
         
        return "Attack";
    }

    var ButtonSneak = function(){
        if (PlayerClass==1)
             return "Sneak 75%";
        if (PlayerClass==3 || PlayerClass==5 )
             return "Sneak 5%";
        return "Sneak 40%";
    }
     
    var ButtonSteal = function(){
        if (isRogue)
             return "Steal 75%";
        if (isMage)
             return "Steal 5%";
        return "Steal 10%";
    }



    // general battle, must be modified for each class
    
    var battle = [ ButtonAttack , "Use Potion +10HP", ButtonSneak,"Run 50%", ButtonSteal,
                  hit, use, skp, dns, tlk ];
         
    
    var canvas=document.querySelector(elid), ctx=canvas.getContext("2d");
    
    canvas.width=wi; canvas.height=he;
    
    var evs=[], 
        
        
        // start location 
        e_tp=[
            ["Village", "Your adventure start here. Choose your class:", "Rogue", "Warrior", "Mage","Monk" , "Healer",
            // set class bonuses for traits ?
        function(){ PlayerClass=1;

            // rogue - high greed, high eva, high crit,good poison
        SetTraitKeyValue("Camping",  1),
        SetTraitKeyValue("Prayer",  1),
        SetTraitKeyValue("Evasion",  10),
        SetTraitKeyValue("Greed",  20);   
        SetTraitKeyValue("Critical Strike",  35) 
        SetTraitKeyValue("Poison",  7) 
        cur_e++ }, 

        function(){ PlayerClass=2;
            //warrior - good rest, normal crit
        SetTraitKeyValue("Camping",  1.2),
        SetTraitKeyValue("Prayer",  1.1),
        SetTraitKeyValue("Evasion",  5),
        SetTraitKeyValue("Greed",  10);   
        SetTraitKeyValue("Critical Strike",  25) 
        SetTraitKeyValue("Poison",  4) 

         cur_e++ }, 
        function(){ PlayerClass=3;
            //mage - more greed, bad crits, good poison
        SetTraitKeyValue("Camping",  1.1),
        SetTraitKeyValue("Prayer",  1.2),
        SetTraitKeyValue("Evasion",  3),
        SetTraitKeyValue("Greed",  15);   
        SetTraitKeyValue("Critical Strike",  15) 
        SetTraitKeyValue("Poison",  8) 
         cur_e++ },
        function(){ PlayerClass=4; 
            // monk - no greed, good eva, low poison, good crit
        SetTraitKeyValue("Camping",  1.4),
        SetTraitKeyValue("Prayer",  1.4),
        SetTraitKeyValue("Evasion",  15),
        SetTraitKeyValue("Greed",  0);   
        SetTraitKeyValue("Critical Strike",  35) 
        SetTraitKeyValue("Poison",  5) 
        cur_e++ },  
        function(){ 
            // good restore / poisons
            PlayerClass=5; 
        SetTraitKeyValue("Camping",  2.5),
        SetTraitKeyValue("Prayer",  2.0),
        SetTraitKeyValue("Evasion",  3),
        SetTraitKeyValue("Greed",  7);   
        SetTraitKeyValue("Critical Strike",  15) 
        SetTraitKeyValue("Poison",  12) 
        cur_e++ }, 
         ,nxt

    ],

    // locations for all : shop { heal, pots, upgrade weapon/armor }
    //bonus for wizards - extra pot on max heal, extra max hp, also training give more to wiz
    ["Shop", "Wizard provides his services", "Buy Potion $20", "Full Heal $100", "Leave","Enchant Weapon $50","Enchant Armor 50$",
        function(){ if(gld>=20 ) { gld-=20; pot++} },
        function(){ if(gld>=100) { gld-=100; hp=MaxHP} }, nxt ,
        function(){ if(gld>=50 ) { gld-=50; Vampirism+=1; MaxHP+=1; } },
        function(){ if(gld>=50 ) { gld-=50; DefBonus+=2; MaxHP+=5;} }, nxt,

    ],

    // locations for Healer : learn heal power

/* 
    var HealPower=1;      // 1 = 100%, for mage, warrior -  1.1; for monk, cleric 1.3 ( 1.4 -> 1.5 -> 1.6 after skill lvl up ), 1 for rogue
    var CanUseHeal=0;     // 0 = no heal after fight, 1 = small heal (warrior,  monk) , 2 = big heal after fight (Cleric)
*/
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
    
         // locations for Warrrior : shop { training,  improve shield }
      ["Blacksmith", "Dude with hammer can make your gear better and train you as warrior.", "Basic Training $50", "5% Shield Rate $100", "Leave"," - ","5% Reflect $300",
        function(){ if(gld>=50)  {
            gld-=50;AtkBonus+=2 ; DefBonus+=2; MaxHP+=2;
            if (isWarrior())
                { DefBonus+=4; }
        } 
        },
        function(){ if(gld>=100 && ShieldBlockChance<50 && isWarrior()) { gld-=100; ShieldBlockChance+=5; } }, 
        nxt,
        nop,
        function(){ if(gld>=300 && SpikesDamage<50 && isWarrior()) { gld-=300; SpikesDamage+=5; }  },
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
    ["Dragon", "Omg! It is evil Dragon!","Attack","Use Potion +10HP","-","-","-",hit,use,,,,800,130,100,1000 ] ];


// init cells 

    var q=e_tp.length-2;
// 1st is village         
     evs.push( e_tp[0].slice(0) );



// this crap should be improved
// keep only few NPC, more monsters
// only 1 time traveler, not on 1-2 line, but later
// 
    for (var i=0;i<e_sz-2;i++) 
             {    evs.push( e_tp[1+Math.floor(Math.random()*q)].slice(0) );}

//last is Dragon
    evs.push( e_tp[q+1].slice(0) );


            
    var game = setInterval(function(){
        
    ctx.clearRect(0,0,wi,he);

    ctx.fillText("NanoRPG in 30 lines of JavaScript by ripatti (modified by alilgz)",10,15);

    // basic stats
    ctx.fillText("LVL "+lvl+
         "  HP "   + hp    + "/"+MaxHP+
         "  EXP "  + exp   + "/"+lvl*10+
         "  ATK "  + Atk() + //Math.floor(AtkBonus*lvl*4+6)+
         "  DEF "  + Def() + //Math.floor(lvl*2*DefBonus-1)+
         "  Gold $"+ gld   + "  Potions "+pot,10,30);
        
        ctx.fillText("Class: " + ClassName(PlayerClass,lvl),10,45);
        

        // draw map 
        for (var i=0;i<e_sz;i++)
        {
            //14 in row
            cX=i % 14;
            cY=Math.floor(i/14);
            ctx.fillText((i==e_sz-1||i<=cur_e)?evs[i][0]:"??",cX*50+20,50*cY+ 120);
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

    
    document.addEventListener('click', function(e){
        
       

        if (hp>0)

            for (var i=0;i<5;i++)

                if ( 
                     i*120+5 <= e.offsetX &&  e.offsetX  < i*120+115  && 460 <= e.offsetY && e.offsetY<460+20)
                       { evs[cur_e][i+7](); }
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
                 console.log("move" + e.offsetX +':'+e.offsetY );
                if ( i*(iconSpaceX + iconWidth)+5  <= e.offsetX &&  e.offsetX  < i*(iconSpaceX + iconWidth)+5 + iconWidth  && 560 <= e.offsetY && e.offsetY < 560 + iconHeight )
                        {

                                Hint =Traits[i][1] +""+ Traits[i][2];
                        }
                }
            }
    }, false);

})("#canvas",800,600,0,3,3000,100,1,0,90);