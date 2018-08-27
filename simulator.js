const martialArtPercentage = {
    karate: {
        stamina: 20,
        speed: 30,
        strength: 20,
        technique: 30
    },
    muayThai: {
        stamina: 25,
        speed: 30,
        strength: 20,
        technique: 25
    },
    boxing: {
        stamina: 25,
        speed: 25,
        strength: 25,
        technique: 25
    }
};

class Fighter{
    constructor(stats){
        this.art = stats.art;
        this.stamina = stats.stamina;
        this.speed = stats.speed;
        this.strength = stats.strength;
        this.technique = stats.technique;
    }
    calcFighterTotalRank(){
        return this.stamina/(100/martialArtPercentage[this.art].stamina)+
        this.speed/(100/martialArtPercentage[this.art].speed) +
        this.strength/(100/martialArtPercentage[this.art].strength) +
        this.technique/(100/martialArtPercentage[this.art].technique);
   }
   calcWinningPercentageVsFighter(opponentRank){
       let selfRank = this.calcFighterTotalRank(),
       weakerFighterPercentage = (100-Math.abs(selfRank-opponentRank))/2,
       strongerFighterPercentage = weakerFighterPercentage + Math.abs(selfRank-opponentRank);
       return (selfRank > opponentRank 
       ? {selfRank:strongerFighterPercentage,opponentRank:weakerFighterPercentage} 
       : {selfRank:weakerFighterPercentage,opponentRank:strongerFighterPercentage});
   }

}

class FightSimulator{
    constructor(firstFighterClass,secondFighterClass){
        this.firstFighterClass = Object.assign(Object.create(firstFighterClass),firstFighterClass);
        this.secondFighterClass = Object.assign(Object.create(secondFighterClass),secondFighterClass);
        this.firstFighterClass.winningCounter = 0;
        this.secondFighterClass.winningCounter = 0;
        let fightersPercentageObj = this.firstFighterClass.calcWinningPercentageVsFighter(this.secondFighterClass.calcFighterTotalRank());
        this.firstFighterClass.winningPercentage = fightersPercentageObj.selfRank;
        this.secondFighterClass.winningPercentage = fightersPercentageObj.opponentRank;
    }
    simulateSingleFight(){
        let randomNumber = Math.floor((Math.random()*1000)+1);
        let firstFighterRange = this.firstFighterClass.winningPercentage*10;
        return randomNumber <= firstFighterRange ? this.firstFighterClass : this.secondFighterClass;
    }
    simulateHundredFights(){
        return new Promise((resolve,reject)=>{
            for(let i=0;i<100 || this.firstFighterClass.winningCounter > 50 || this.secondFighterClass.winningCounter > 50;++i){
                new Promise((resolve,reject) => {
                    resolve(this.simulateSingleFight(this.firstFighterClass,this.secondFighterClass));
                }).then((winner)=>{
                    if(winner === this.firstFighterClass){
                        ++this.firstFighterClass.winningCounter;
                    }else{        
                        ++this.secondFighterClass.winningCounter;
                    }
                });
            }
            resolve([this.firstFighterClass,this.secondFighterClass]);
        }).then((fightersArr)=>{
            console.log('Fighter A winnings: ',this.firstFighterClass.winningCounter,'\n Fighter B winnings: ',this.secondFighterClass.winningCounter);
            return this.firstFighterClass.winningCounter > this.secondFighterClass.winningCounter ? this.firstFighterClass : this.secondFighterClass;
        });
    }
    
}

module.exports = {
    Fighter,
    FightSimulator
};