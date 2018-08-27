const express = require('express');
const bodyParser = require('body-parser');
const yargs = require('yargs');
const simulator = require('./simulator');
const argv = yargs
.option('p',{
    alias: 'port',
    describe: 'port to start server on',
    demand: 'false',
    type: 'number',
    default: 3000
})
.help()
.argv;
const port = argv.port;

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.post('/simulate/fighters',(req,res)=>{
    let ranks = simulator.calcFightersTotalRank(req.body);
    let percentages = simulator.calcFightersWinningPercentages(ranks.fighterARank,ranks.fighterBRank);
    res.json({ranks,percentages});
});

app.post('/simulate/fighters/fight',(req,res)=>{
    let {fighterA,fighterB} = simulator.getFightersObjects(req.body);
    console.log('Fighter A OBJECT: ',fighterA);
    console.log('Fighter B Object: ',fighterB);
    simulator.simulateHundredFights(fighterA,fighterB).then((winner)=>{
        res.json(winner);        
    });
});

app.get('/',(req,res)=>{
    res.json({msg:'Fighter Simulator API'});
});

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});