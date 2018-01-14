
 


var NPC = 
{
    name:"npc_name",
    desc:"npc_desc", 
    button_title : [,], // title, title[action ,  class]
    button_events :[,],


    //specific
    SetEvent : function(buttonNum, buttonTitle,  clickEvent, playerClass)
    {
        this.button_title[buttonNum][playerClass] = buttonTitle;
        this.button_events[buttonNum][playerClass] = clickEvent;
    } ,

    //default
    SetDefaultTitle: function(buttonNum,  buttonTitle)
    {
        this.button_title[buttonNum][0] = buttonTitle;
    },

    SetDefaultEvent: function(buttonNum,  clickEvent)
    {
        this.button_events[buttonNum][0] = clickEvent;
    },
    ///by class
    SetTitleFor : function(buttonNum, playerClass, buttonTitle)
    {
        console.log('set title f : class, num, title', playerClass, buttonNum, buttonTitle);
        this.button_title[buttonNum][playerClass] = buttonTitle;
        console.log(this.button_title);
    } ,
    SetEventFor : function(buttonNum, playerClass, clickEvent)
    {
        this.button_events[buttonNum][playerClass] = clickEvent;
    },
    GetTitle: function(n){

        console.log(Player.Class);
        return this.button_title[n][Player.Class] === undefined ? this.button_title[n][0] : this.button_title[n][Player.Class];
    },
    GetTitleForClass: function(n, c){
        return this.button_title[n][c] == undefined ? this.button_title[n][0] : this.button_title[n][c];
    },

    GetEventForClass: function(n, c){

        console.log('GetEventForClass # #',n, c);
        return this.button_events[n][c] == undefined ? this.button_events[n][0] : this.button_events[n][c];
    },


    CreateNPC : function (name, desc){

    this.name = name;
    this.desc = desc;

    this.button_title = [,];

        this.button_title[0] = [];
        this.button_title[1] = [];
        this.button_title[2] = [];
        this.button_title[3] = [];
        this.button_title[4] = [];

    this.button_title[0][0] = " - ";
    this.button_title[1][0] = " - ";
    this.button_title[2][0] = "Leave";
    this.button_title[3][0] = " - ";
    this.button_title[4][0] = " - ";

    this.button_events = [,];

        this.button_events[0]=[];
        this.button_events[1]=[];
        this.button_events[2]=[];
        this.button_events[3]=[];
        this.button_events[4]=[];

    this.button_events[0][0] = Game.nop;
    this.button_events[1][0] = Game.nop;
    this.button_events[2][0] = Game.leave;
    this.button_events[3][0] = Game.nop;
    this.button_events[4][0] = Game.nop;
    return this;
    },

    Titles:function(num)
    {
     return Game.TitleForClass(
                this.GetTitleForClass(num,Archetype.Rogue),
                this.GetTitleForClass(num,Archetype.Warrior),
                this.GetTitleForClass(num,Archetype.Wizard),
                this.GetTitleForClass(num,Archetype.Healer),
                this.GetTitleForClass(num,Archetype.Monk)
            );
    },



    Actions:function(num)
    {

        console.log('Actions #', num);
        return Game.ActionForClass(
                this.GetEventForClass(num,Archetype.Rogue),
                this.GetEventForClass(num,Archetype.Warrior),
                this.GetEventForClass(num,Archetype.Wizard),
                this.GetEventForClass(num,Archetype.Healer),
                this.GetEventForClass(num,Archetype.Monk));
        }


}

var BS = NPC.CreateNPC("BlackSmith", "desc for BS");


var WizShop = NPC.CreateNPC("Magic Shop", "Wizard provides his services");

WizShop.SetDefaultTitle(0,"Buy Potion $20");
WizShop.SetDefaultEvent(0,Player.BuyPot);

WizShop.SetDefaultTitle(1,"Full Heal $100");
WizShop.SetDefaultEvent(1,Player.BuyFullHeal);

WizShop.SetDefaultTitle(2,"Leave");
WizShop.SetDefaultEvent(2,Game.leave);

WizShop.SetTitleFor(3, Archetype.Rogue, "Learn 'Healing' $100");
WizShop.SetTitleFor(4, Archetype.Rogue, "Learn 'Poison' $100");
WizShop.SetEventFor(3, Archetype.Rogue,  function(){ ImproveTrait(Skill.Prayer, 100); });
WizShop.SetEventFor(4, Archetype.Rogue,  function(){ ImproveTrait(Skill.Poison, 100); });

WizShop.SetTitleFor(3, Archetype.Warrior, "Learn 'Healing' $100");
WizShop.SetTitleFor(4, Archetype.Warrior, "Learn 'Reflect' $100");
WizShop.SetEventFor(3, Archetype.Warrior,  function(){ ImproveTrait(Skill.Prayer, 100); });
WizShop.SetEventFor(4, Archetype.Warrior,  function(){ ImproveTrait(Skill.Reflect, 100); });


WizShop.SetTitleFor(3, Archetype.Wizard, "Learn 'SpellCasting' $100");
WizShop.SetTitleFor(4, Archetype.Wizard, "Learn 'Vampiric' $100");
WizShop.SetEventFor(3, Archetype.Wizard,  function(){ ImproveTrait(Skill.ArcaneMastery, 100); });
WizShop.SetEventFor(4, Archetype.Wizard,  function(){ ImproveTrait(Skill.VR, 100); });

WizShop.SetTitleFor(3, Archetype.Healer, "Learn 'PotionMastery' $100");
WizShop.SetTitleFor(4, Archetype.Healer, "Learn 'Healing' $100");
WizShop.SetEventFor(3, Archetype.Healer,  function(){ ImproveTrait(Skill.PotionMastery, 100); });
WizShop.SetEventFor(4, Archetype.Healer,  function(){ ImproveTrait(Skill.Prayer, 100); });

WizShop.SetTitleFor(3, Archetype.Monk, "Battle Meditation $100");
WizShop.SetTitleFor(4, Archetype.Monk, "Learn 'Healing' $100");
WizShop.SetEventFor(3, Archetype.Monk,  function(){ Player.DoTraining(100, 0, 0, 6, 0,0,4,1); });
WizShop.SetEventFor(4, Archetype.Monk,  function(){ ImproveTrait(Skill.Prayer, 100); });


//Warrior	Rogue	Wizard	Healer	Monk

//Ninja	W, Bleed, Reflect	W,Evasion, Critical, Trap mastery	A,  HP,Evasion	 HP,Evasion, Critical	Evasion, Cripple, OverHit


var Ninja = NPC.CreateNPC("Ninja", "Strong assassin can share his knowledge");


Ninja.SetDefaultTitle(2,"Leave");
Ninja.SetDefaultEvent(2,Game.leave);

Ninja.SetTitleFor(0, Archetype.Warrior, "Sword Practice $50");
Ninja.SetTitleFor(1, Archetype.Warrior, "Learn 'Bleed' $100");
Ninja.SetTitleFor(3, Archetype.Warrior, " - ");
Ninja.SetTitleFor(4, Archetype.Warrior, "Learn 'Reflect' $100");

Ninja.SetEventFor(0, Archetype.Warrior,  function(){ Player.ImproveAtk(50, 5, 0,3); });
Ninja.SetEventFor(1, Archetype.Warrior,  function(){ ImproveTrait(Skill.Poison, 100); });
Ninja.SetEventFor(3, Archetype.Warrior,  Game.nop );
Ninja.SetEventFor(4, Archetype.Warrior,  function(){ ImproveTrait(Skill.Reflect, 100); });

Ninja.SetTitleFor(0, Archetype.Rogue, "Dagger Practice $50");
Ninja.SetTitleFor(1, Archetype.Rogue, "Learn 'Evasion' $100");
Ninja.SetTitleFor(3, Archetype.Rogue, "Learn 'Criticals' $100");
Ninja.SetTitleFor(4, Archetype.Rogue, "Learn 'Traps' $100");

Ninja.SetEventFor(0, Archetype.Rogue,  function(){ Player.ImproveAtk(50, 4, 0,3); });
Ninja.SetEventFor(1, Archetype.Rogue,  function(){ ImproveTrait(Skill.Evasion, 100); });
Ninja.SetEventFor(3, Archetype.Rogue,  function(){ ImproveTrait(Skill.Criticals, 100); });
Ninja.SetEventFor(4, Archetype.Rogue,  function(){ ImproveTrait(Skill.Traps, 100); });

Ninja.SetTitleFor(0, Archetype.Wizard, "Defence Lessons $50");
Ninja.SetTitleFor(1, Archetype.Wizard, "Mental Training $50");
Ninja.SetTitleFor(3, Archetype.Wizard, "Learn 'Evasion' $100");
Ninja.SetTitleFor(4, Archetype.Wizard, " - ");

Ninja.SetEventFor(0, Archetype.Wizard,  function(){ Player.ImproveDef(50, 3, 0,3); });
Ninja.SetEventFor(1, Archetype.Wizard,  function(){ Player.ImproveAtk(50, 4, 0,3); });
Ninja.SetEventFor(3, Archetype.Wizard,  function(){ ImproveTrait(Skill.Evasion, 100); });
Ninja.SetEventFor(4, Archetype.Wizard,  Game.nop );

Ninja.SetTitleFor(0, Archetype.Healer, "Staff Practice $50");
Ninja.SetTitleFor(1, Archetype.Healer, "Mental Training $50");
Ninja.SetTitleFor(3, Archetype.Healer, "Learn 'Criticals' $100");
Ninja.SetTitleFor(4, Archetype.Healer, "Learn 'Evasion' $100");

Ninja.SetEventFor(0, Archetype.Healer,  function(){ Player.DoTraining(50, 2, 0, 2, 2, 0,3); });
Ninja.SetEventFor(1, Archetype.Healer,  function(){ Player.DoTraining(50, 4, 0, 1, 0, 1,3); });
Ninja.SetEventFor(3, Archetype.Healer,  function(){ ImproveTrait(Skill.Criticals, 100); });
Ninja.SetEventFor(4, Archetype.Healer,  function(){ ImproveTrait(Skill.Evasion, 100); });

Ninja.SetTitleFor(0, Archetype.Monk, "Learn 'OverHit!'  $100");
Ninja.SetTitleFor(1, Archetype.Monk, "Mental Training $50");
Ninja.SetTitleFor(3, Archetype.Monk, "Learn 'Cripple' $100");
Ninja.SetTitleFor(4, Archetype.Monk, "Learn 'Evasion' $100");

Ninja.SetEventFor(0, Archetype.Monk,  function(){ ImproveTrait(Skill.OverHit, 100); });
Ninja.SetEventFor(1, Archetype.Monk,  function(){ Player.DoTraining(50, 4, 0, 1, 1, 1,3); });
Ninja.SetEventFor(3, Archetype.Monk,  function(){ ImproveTrait(Skill.Cripple, 100); });
Ninja.SetEventFor(4, Archetype.Monk,  function(){ ImproveTrait(Skill.Evasion, 100); });


var NPCS=[  
     BS, WizShop, Ninja
    ];

