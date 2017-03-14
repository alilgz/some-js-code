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




console.log('begin');



(function(elid, wi, he, exp, pot, gld, hp, lvl, cur_e, e_sz)
    {

        Game.cur_e = cur_e;

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




    var DrawPlayerInterface=function()
    {

        var i=0;

        var debug=true;

        ctx.strokeRect(150,40,300,10);
        ctx.fillStyle = "green";
        ctx.fillRect(151,41,  Math.min(300,  Math.floor(300*Player.HP/Player.MaxHP)),8);

        if (evs[Game.cur_e].length>IMHP+1) {
        ctx.fillStyle = "red";
        ctx.fillText("vs", 455, 50);
        ctx.strokeRect(320+150,40,300,10);
        ctx.fillStyle = "gray";
        ctx.fillRect(320+151,41,  Math.min(100,  Math.floor(300*evs[Game.cur_e][IMHP]/CurrentMobMaxHP)),8);
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


        var normalDamage=(atk*atk) / (Tdef  *10);

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


    function Monster(mname, hp, damage, defence, exp, gold, desc="")
    {
     this.name=mname;
     this.hp=hp;
     this.atk=damage;
     this.def=defence;
     this.xp=exp;
     this.gold=gold;
     this.description = desc;
    };


   var zombie1 =  new Monster("Zombie", 50, 20, 20, 40, 50, "Normel zombie");
   var zombie2 =  new Monster("Weak Zombie", 35, 14, 17, 30, 30, "almost rotten zombie");
   var zombie3 =  new Monster("Fast Zombie", 64, 20, 25, 60, 70, "fresh and fast zombie'");



    var hit = function(){

        console.log("[Hit]  player class=", Player.Class);

        var PlayerDidDamage = calcDMGFromPlayer(Player.Atk(),evs[Game.cur_e][IMAtk]/5, evs[Game.cur_e][IMHP]);
        var PlayerGotDamage = calcDMGFromMob(evs[Game.cur_e][IMAtk],Player.Def(),Player.HP) ;
        console.log('initial damage to player: ',PlayerGotDamage );
        console.log('initial damage from player: ',PlayerDidDamage );

        var PoisonDmg = GetTraitValue(Skill.Poison) * PlayerDidDamage  / 100 ;  // crit not affect this ?
        console.log('poison damage from player: ',PoisonDmg );

        var isCritical  = GetTraitValue(Skill.Criticals) > R100();
        // player evasion chance :

        if (isCritical)
        {
            //damage x2
            PlayerDidDamage *=2;
            console.log('Player Crit!' );

            var cripple_effect = GetTraitValue(Skill.Cripple);
            console.log('Cripple: ',cripple_effect );
            // cripple effect
            PlayerGotDamage -= (GetTraitValue(Skill.Cripple) * PlayerGotDamage /100);
            console.log('damage to player after cripple check: ',PlayerGotDamage );
        }

        var reflect_chance = GetTraitValue(Skill.Reflect);
        if (reflect_chance > R100())
        {
            console.log('Player reflected damage!',PlayerGotDamage );
            PlayerDidDamage += PlayerGotDamage;
            PlayerGotDamage=0;
        }

        var evasion_chance = GetTraitValue(Skill.Evasion);
        if (evasion_chance > R100())
        {
            PlayerGotDamage=0;
            console.log('Player evaded damage!' );
        }

        evs[Game.cur_e][IMHP] -=  (PlayerDidDamage + PoisonDmg);
        Player.HP  -=  PlayerGotDamage;
        
        //player won
       if (evs[Game.cur_e][IMHP]<=0) {
            var GotMoney = evs[Game.cur_e][IMGold];
            var GotExp = evs[Game.cur_e][IMXP];

            if (R100() <= GetTraitValue(Skill.Greed))
            {
                console.log('Greed bonus!!' );
                 GotMoney *= 2;
            }


            alert("Monster defeated and you got "+GotExp+"EXP and $" + GotMoney);

            Player.Exp += evs[Game.cur_e][IMXP];
            Player.Gold += GotMoney ;

           // dont let hero die if he killed mob 
           Player.HP = Math.max(1,hp);  

            // restore some hp from Camping
                var RestoredHP = (Player.MaxHP * GetTraitValue(Skill.Camping)  / 100) ;
                console.log('Camping bonus : ', RestoredHP  );

           Player.HP= Math.min(Player.MaxHP, Player.HP + RestoredHP);

            while (Player.Expp>=Player.Level*Player.Level*5) { Player.Exp-=Player.Level*Player.Level*5; hp+=10; Player.Level++; alert("Level Up!") }
           Game.cur_e++;
            
            if (Game.cur_e==e_sz) alert("Victory!")

        } else {
        // mob won
           Player.HP = Math.max(0,Player.HP);
            if(Player.HP<=0)
                    alert("Game Over!");
        } 
        if (evs[Game.cur_e][IMHP]>0 && Player.HP>0)
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
    Game.cur_e++;
    Game.FirstAttack=1;
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
    Game.cur_e++;
    Game.FirstAttack=1;
};
    
    //try to steal drop from alive mob
    var tlk = function(){ 
        // trief  = steal, some chance
        // warrior = practice ( no money, but chance for x2 exp)
        // wiz = learn // ? 
        // monk = peace 
        // healer = sleep ( chance for 100% steal)
        Game.cur_e++;
        Game.FirstAttack=1;

    };
    
    //nothing u can do here
    var nop = function(){ ; };

 

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

   








    // general battle, must be modified for each class
    
    var battle = [ ButtonAttack , "Use Potion +10HP", ButtonSneak,"Run 50%", ButtonSteal,
                  hit, Player.DrinkPotion, skp, dns, tlk ];
         
    
    var canvas=document.querySelector(elid), ctx=canvas.getContext("2d");
    
    canvas.width=wi; canvas.height=he;
    
    var evs=[], 
        
        
        // start location 
        e_tp=[
            ["Village", "Your adventure start here. Choose your class:", "Rogue", "Warrior", "Mage","Monk" , "Healer",

        function(){ 
            Player.Class=Archetype.Rogue;
            // rogue - high greed, high eva, high crit,good poison
        // hide extra Traits
         Player.InitClassMasteries();
         Game.nxt(); },
        function(){
            Player.Class=Archetype.Warrior;
            //warrior - good rest, normal crit
         // hide extra Traits
            Player.InitClassMasteries();

            Game.nxt();  },
        function(){ 
            Player.Class=Archetype.Wizard;
            //mage - more greed, bad crits, good poison
            Player.InitClassMasteries();
            Game.nxt();  },
        function(){ 
            Player.Class=Archetype.Monk; 
            // monk - no greed, good eva, low poison, good crit
            Player.InitClassMasteries();
            Game.nxt();  },
        function(){ 
            // good restore / poisons
            Player.Class=Archetype.Healer; 
            Player.InitClassMasteries();
            Game.nxt();
        },

    ],


      // locations for Warrrior : shop { training,  improve shield }
     ["BlackSmith", "Dude with hammer can make your gear better and train you as Fighter.",


      // rog, war, wiz, heal, monk
        function(){ return Game.TitleForClass(
            "Upgrade Weapon $50",
             "Upgrade Weapon $50",
             "Enchant Weapon $90 ",
             "Upgrade Weapon $40",
             "Practice with Hammer")}, 
               

        function(){ return Game.TitleForClass(
             "Improve Armor $50",
             "Improve Armor $50",
             " - " ,
             " - " ,
             " - " )}, 
        "Leave",

        function(){ return Game.TitleForClass( "Learn 'Criticals' $100","Shielding Lesson  $100", " - ", "Learn 'Criticals' $100", " - ")},
        function(){ return Game.TitleForClass("-", "Help with Work +$50", "Help with Work +$50", "Heal his horse +$50", "Do hard work")},
        // var DoTraining = function (cost, AddMaxHP, AddHP, AddAtk, AddDef, AddGold){
        //"Weapon Training $50", "Weapon Training $50","Enchant Weapon $100", "Basic Training $50", "Basic Training $50"), //      "Basic Training $50", 
        function(){return Game.ActionForClass(
            function(){ return Player.DoTraining(50, 0,0, 6, 0, 0, 1,3); },  // rog 
            function(){ return Player.DoTraining(50, 0,0, 6, 0, 0, 1,3); },  //war
            function(){ return Player.DoTraining(100, 0,0, 6, 0, 1,3); },   //wiz
            function(){ return Player.DoTraining(50, 0,0, 4, 0, 1,3); },  // heal
            function(){ return Player.DoTraining(50, 4,0, 2, 0, 0,1,1 ); }  // monk
        )},

        //"Improve Armor $50", "Improve Armor  $50"," - ", " - ", " - "), 
        function(){return Game.ActionForClass(
            function(){ return Player.DoTraining(50, 0,0, 0, 4, 0); },  // rog
            function(){ return Player.DoTraining(50, 2,0, 0, 4, 0); },  //war
            nop,   //wiz
            nop,  // heal
            nop  // monk
        )},

          Game.leave, // leave
         
         // "Learn 'Criticals' $100","Shielding Lesson  $100", " - ", "Learn 'Criticals' $100", " - "), 

        function(){return Game.ActionForClass(
            function(){ ImproveTrait(Skill.Criticals, 100); },  // rog
            function(){ ImproveTrait(Skill.Shield, 100); },  //war
            nop,   //wiz
            function(){ ImproveTrait(Skill.Criticals, 100); },  // heal
            nop  // monk
        )},

        function(){ return Game.ActionForClass(//"-", "Help with Work +$50", "Help with Work +$50", "Heal his horse +$50", "Do hard work"),
            nop,  // rog 
            function(){ Player.DoTraining(0, 0,-2, 0, 0, 50); },  //war
            function(){ Player.DoTraining(0, 0,0, 0, 0, 50); },   //wiz
            function(){ Player.DoTraining(0, 0,0, 0, 0, 50); },  // heal
            function(){ Player.DoTraining(0, 4,-2, 2, 0, 0); }  // monk
        )}

     ],

     [WizShop.name, WizShop.desc,
            function() { return WizShop.Titles(0)},
            function() { return WizShop.Titles(1)},
            function() { return WizShop.Titles(2)},
            function() { return WizShop.Titles(3)},
            function() { return WizShop.Titles(4)},
            function() { return WizShop.Actions(0)},
            function() { return WizShop.Actions(1)},
            function() { return WizShop.Actions(2)},
            function() { return WizShop.Actions(3)},
            function() { return WizShop.Actions(4)}],



             [Ninja.name, Ninja.desc,
             function() { return Ninja.Titles(0)},
             function() { return Ninja.Titles(1)},
             function() { return Ninja.Titles(2)},
             function() { return Ninja.Titles(3)},
             function() { return Ninja.Titles(4)},
             function() { return Ninja.Actions(0)},
             function() { return Ninja.Actions(1)},
             function() { return Ninja.Actions(2)},
             function() { return Ninja.Actions(3)},
             function() { return Ninja.Actions(4)}],




/*


     // should we remove it? it's from original game
    ["Dr. Future", "He can play with TIME", "Return to past $200", "Move To future $50", "Leave", "Free Lesson","-",
        function(){ if(gld>=200){gld-=200;  
     var prev_e= Game.cur_e;
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
    ["Slime", "What the strange jelly Monster?"].concat(battle,20+R20(),3,7,30),
    ["Big slime", "What the strange jelly Monster?"].concat(battle,30+R20(),5,9,35),
            MobToElements( zombie1 ),
            MobToElements( zombie2 ),
            MobToElements( zombie3 ),
    MobToElements( new Monster("Imp", 70, 25, 35,  80, 30) ),
    MobToElements( new Monster("Lizard", 60, 16, 16, 50, 50) ),

    // final boss
    ["Dragon", "Omg! It is evil Dragon!","Attack","Use Potion +10HP","-","-","-",hit,Player.DrinkPotion,,,,800,130,100,1000 ] ];



// init cells 

    var q=e_tp.length-2;
// 1st is village         
     evs.push( e_tp[0].slice(0) ); // village
     //evs.push( e_tp[1].slice(0) ); // bs
    //evs.push( e_tp[2].slice(0) ); // wiz



// this crap should be improved
// keep only few NPC, more monsters
// only 1 time traveler, not on 1-2 line, but later
// 
    for (var i=0;i<e_sz-2;i++)
             {
                 evs.push( e_tp[1+Math.floor(Math.random()*q)].slice(0) );
             }

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
         "  Gold $"+   Player.Gold + "  Potions "+ Player.pots , 10,30);
       
    ctx.fillText("Class: " + Player.ClassName,10,45);
        

        // draw map 
        for (var i=0;i<e_sz;i++)
        {
            //14 in row
            cX=i % 14;
            cY=Math.floor(i/14);
            ctx.fillText((i==e_sz-1||i<=Game.cur_e) ? evs[i][0] : "??", cX*50+20, 50*cY+ 120);
        }

        // hp bar + skills bar
        DrawPlayerInterface();

        ctx.fillStyle = "black";
        ctx.fillText("@",(Game.cur_e % 14)*50+25,50*Math.floor(Game.cur_e/14) + 100);
        ctx.fillText(evs[Game.cur_e][0]+ ': '+evs[Game.cur_e][1],20,60);
        //var enemyInfo = "Enemy HP:"+Math.floor(evs[Game.cur_e][IMHP]);
        // enemyInfo += " Atk: "+evs[Game.cur_e][IMAtk];
        //  if (evs[Game.cur_e].length > IMHP+1)  ctx.fillText(enemyInfo ,20,80);

        

        // buttons     
        ctx.fillStyle = "red";
        for (var i=0;i<5;i++) 
        {
            ctx.strokeRect(i*120+5,460,110,20);
            if (typeof(evs[Game.cur_e][i+2]) === 'function')
            {
                var temp_text = evs[Game.cur_e][i+2]();
                //console.log('button #', i, " FUNC TEXT = ", evs[Game.cur_e][i+2]);
              ctx.fillText(temp_text ,i*120+10,473);
            } else {
              ctx.fillText(evs[Game.cur_e][i+2],i*120+10,473);
              //console.log('button #', i, " TEXT = ", evs[Game.cur_e][i+2]);

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
                        console.log('click button #',i, evs[Game.cur_e][i+7]);
                        
                        evs[Game.cur_e][i+7]();
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