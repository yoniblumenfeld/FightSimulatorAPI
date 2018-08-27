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

let calcFightersWinningPercentages= (fighterARank,fighterBRank) => {
    let weakerFighterPercentage = (100-Math.abs(fighterARank-fighterBRank))/2,
        strongerFighterPercentage = weakerFighterPercentage + Math.abs(fighterARank-fighterBRank);
    
    return fighterARank > fighterBRank ? {'fighterAPercentage':strongerFighterPercentage,'fighterBPercentage':weakerFighterPercentage} : 
    {'fighterAPercentage':weakerFighterPercentage,'fighterBPercentage':strongerFighterPercentage};
};

let calcFightersTotalRank = ([fighterA,fighterB]) => {
    let fighterARank = calcFighterTotalRank(fighterA);
    let fighterBRank = calcFighterTotalRank(fighterB);
    return {fighterARank,fighterBRank};
};

let calcFighterTotalRank = (fighter) => {
    let art = fighter.stats.art,
        stats = fighter.stats;
    console.log(art,stats);
    return stats.stamina/(100/martialArtPercentage[art].stamina)+
    stats.speed/(100/martialArtPercentage[art].speed) +
    stats.strength/(100/martialArtPercentage[art].strength) +
    stats.technique/(100/martialArtPercentage[art].technique);
};

let getFightersObjects = ([fighterA,fighterB]) => {
    let ranks = calcFightersTotalRank([fighterA,fighterB]);
    let percentages = calcFightersWinningPercentages(ranks.fighterARank,ranks.fighterBRank);
    return {
            fighterA:{
                        winPercentage:parseFloat(percentages.fighterAPercentage).toFixed(1),
                        totalRank: ranks.fighterARank
                    },
            fighterB:{
                        winPercentage:parseFloat(percentages.fighterBPercentage).toFixed(1),
                        totalRank: ranks.fighterBRank
                    }
            };
}

let simulateSingleFight = (fighterA,fighterB) => {
        let randomNumber = Math.floor((Math.random()*1000)+1),
        fighterARange = fighterA.winPercentage*10;
        return randomNumber < fighterARange ? {fighterA} : {fighterB};
};

let simulateHundredFights = (fighterA,fighterB) => {
    fighterA.winningCounter = 0,
    fighterB.winningCounter = 0;
    return new Promise((resolve,reject)=>{
        for(let i=0;i<100 || fighterA.winningCounter > 50 || fighterB.winningCounter > 50;++i){
            new Promise((resolve,reject) => {
                resolve(simulateSingleFight(fighterA,fighterB));
            }).then((winner)=>{
                if(winner.hasOwnProperty('fighterA')){
                    ++fighterA.winningCounter;
                }else{        
                    ++fighterB.winningCounter;
                }
            });
        }
        resolve({fighterA,fighterB});
    }).then((fightersObj)=>{
        console.log('Fighter A winnings: ',fightersObj.fighterA.winningCounter,'\n Fighter B winnings: ',fightersObj.fighterB.winningCounter);
        let [fighterA,fighterB] = [fightersObj.fighterA,fightersObj.fighterB]

        return fighterA.winningCounter > fighterB.winningCounter ? {fighterA} : {fighterB};
    });
};
module.exports = {
    calcFightersTotalRank,
    calcFightersWinningPercentages,
    getFightersObjects,
    simulateSingleFight,
    simulateHundredFights
};