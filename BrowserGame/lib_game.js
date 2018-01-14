



// map, position, turns, moving functions
//interface,  limitations, skills, etc


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


var Traits=[

    // passive 'skills'
    // name ='camping',  start value=XX, description, level [1..5], if  0 (disabled) ,  perLevel]
    [Skill.Camping,  1, "% health restored after fight", 1 , 1], // 1 , 2 , 3 , 4 , 5
    [Skill.Prayer,  2, "% bonus health restored from potions", 1, 2],  // 2-4-6-8-10
    [Skill.Evasion,  5, "% Chance to avoid monster attack", 1,5], // 5-10-15-20-25
    [Skill.Greed,  10, "% Chance to find x2 gold", 1,5], //10-30
    [Skill.Criticals,  20, "% Chance to make critical x2 attack", 5], //20-35
    [Skill.Poison,  5, "% Additional damage, ignores armor", 1,3],   // 5-15

    //warrior
    [Skill.Shield,  5, "% additional armor", 1,5],  // 5-25
    [Skill.Reflect,  1, "% chance reflect full damage", 1, 1.3],  // 1-7

    //rogue
    [Skill.Traps,  10, "% chance decrease monster HP before fight", 1, 3],

    //Wizard
    [Skill.ArcaneMastery,  2, "First nuke do x2/x2.25/x2.5/x2.75/x3 Damage", 1, 1.25],
    [Skill.VR,  2, "Restore % health per attack", 1, 2], //2-8

    //Monk
    [Skill.OverHit,  2, "If damage  x2 more  from mob HP left - get % exp bonus", 1,3], // 5-12
    [Skill.Cripple,  20, "If attack crits -  mob damage - decreased for penalty %", 1, 4], //20-40

    //Healer
    [Skill.PotionMastery,  20, "% chance to get 1 pot from each monster", 1, 5]

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


function TraitEnabled(trait)
{
    return trait[1]>0;
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

var GetTraitValue = function(traitName)
{
    for (var i = Traits.length - 1; i >= 0; i--)
    {
        if ( Traits[i][0] == traitName)
        {
            // initial bonus + (level-1) * perlevel

            return Traits[i][1] + (Traits[i][3]-1 )  * Traits[i][4];
        }
        // should be some unique?
    }
    return 0;

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

// skills



var locations = [];

var Location =
    {
    Title: "", WelcomeText:"",
    Buttons:[],


    InitLocation :function(name, desc, titles, events){
        this.Title=name;
        this.WelcomeText=desc;
        for(var i=1; i<5; i++){
            this.Buttons.push( {title: titles[i], event: events[i]});
        }

        return this;
    },

    GetButtonTitles1111:function()
    {
         return [this.Buttons[0].title, this.Buttons[1].title, this.Buttons[2].title, this.Buttons[3].title, this.Buttons[4].title ];
    },

    GetButtonEvent222s:function(){
        return [this.Buttons[0].event, this.Buttons[1].event, this.Buttons[2].event, this.Buttons[3].event, this.Buttons[4].event ];
    }


    };


var Game = {
    cur_e:0,
    GameMap:[],
    FirstAttack:1, // is first attack per round
    nop : function(){ ; },
    leave : function(){
        // leave location, text cell
        Game.nxt();
        },
    nxt : function(){
        this.cur_e++;
        Game.FirstAttack=1;
    },
    InitGameMap: function(size){

      //push monsters // npc on map

        //for ()
    },

    TitleForClass : function(TitleRogue, TitleWarrior, TitleWizard, TitleHealer, TitleMonk)
    {

        if (Player.Class == Archetype.Rogue)
            return TitleRogue;

        if (Player.Class == Archetype.Warrior)
            return TitleWarrior;

        if (Player.Class == Archetype.Wizard)
            return TitleWizard;

        if (Player.Class == Archetype.Monk)
            return TitleMonk;

        if (Player.Class == Archetype.Healer)
            return TitleHealer;

        return "WTF";
    },



    ActionForClass : function(FuncRogue, FuncWarrior, FuncWizard, FuncHealer, FuncMonk)
    {

        console.log('execute ActionForClass #', Player.Class );
        if (Player.Class == Archetype.Rogue)
            FuncRogue();

        if (Player.Class == Archetype.Warrior)
            FuncWarrior();

        if (Player.Class == Archetype.Wizard)
            FuncWizard();

        if (Player.Class == Archetype.Monk)
            FuncMonk();

        if (Player.Class == Archetype.Healer)
            FuncHealer();

            console.log('wtf, unknown event');
    }


}

