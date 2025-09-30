import axios from "axios";

const types = ['Fire', 'Water', 'Storm', 'Earth', 'Cosmic', 'Metal', 'Light', 'Dark'];

const damageByType = [
                    [0.66, 0.66, 1, 1, 1, 1.33, 1, 1],
                    [1.33, 0.66, 0.66, 1, 1, 1, 1, 1],
                    [1, 1.33, 0.66, 0.66, 1, 1, 1, 1],
                    [1, 1, 1.33, 0.66, 0.66, 1, 1, 1],
                    [1, 1, 1, 1.33, 0.66, 0.66, 1, 1],
                    [0.66, 1, 1, 1, 1.33, 0.66, 1, 1],
                    [1, 1, 1, 1, 1, 1, 0.66, 1.33],
                    [1, 1, 1, 1, 1, 1, 1.33, 0.66]
];


const factions = ['Technology', 'Magic', 'Demon', 'Nature', 'Divine', 'Endless'];

const damageByFaction = [
                    [1, 0.75, 1, 1.25, 1, 1],
                    [1.25, 1, 0.75, 1, 1, 1],
                    [1, 1.25, 1, 0.75, 1, 1],
                    [0.75, 1, 1.25, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1.25],
                    [1, 1, 1, 1, 1.25, 1]

]

const stats = ['Attack', 'Defence', 'Speed', 'Accuracy', 'Mana'];

const terrains = ['Water', 'Firestorm', 'Forest', 'Thunderstorm', 'Pure', 'Evil', 'Artificial', 'Space'];

const damageByTerrain = [
                    [0.9, 1.1, 1, 1, 1, 1, 1, 1],
                    [1.1, 0.9, 1, 1, 1, 1, 1, 1],
                    [1, 1, 0.9, 1.1, 1, 1, 1, 1],
                    [1, 1, 1.1, 0.9, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1.1, 0.9],
                    [1, 1, 1, 1, 1, 1, 0.9, 1.1],
                    [1, 1, 1, 1, 0.9, 1.1, 1, 1],
                    [1, 1, 1, 1, 1.1, 0.9, 1, 1]
]


const monsters = ['Abyss', 'Banshit', 'Cuck-oo', 'Dumdum', 'Sharqueen', 'Cyberflare'];

const monsterStats = [
    ['Abyss', 5, 0, 50, 104, 82, 88, 73],
    ['Banshit', 5, 2, 77, 80, 103, 85, 90],
    ['Cuck-oo', 2, 3, 60, 80, 120, 96, 60],
    ['Dumdum', 3, 2, 107, 88, 55, 60, 99],
    ['Sharqueen', 1, 3, 90, 49, 93, 79, 66],
    ['Cyberflare', 0, 0, 110, 98, 70, 75, 64]
]

function damagePercentCalculator(typeAttacker, typeReceiver, factionAttacker, factionReceiver, terrain){
    const typeModifier = damageByType[typeAttacker][typeReceiver];
    const factionModifier = damageByFaction[factionAttacker][factionReceiver];
    const terrainModifier = damageByTerrain[terrain][typeAttacker];
    return (typeModifier * factionModifier * terrainModifier);
}

function getParticipantSpecs(attacker, receiver){
    const attackerInd = monsters.indexOf(attacker);
    const defenderInd = monsters.indexOf(receiver);
    if (attackerInd == -1 || defenderInd == -1){
        return [];
    }
    else {
        const attackerSpecs = monsterStats[attackerInd];
        const defenderSpecs = monsterStats[defenderInd];
        return [attackerSpecs[1], defenderSpecs[1], attackerSpecs[2], defenderSpecs[2]];
    }
}

//to demonstrate the damage if a fire type of faction Technology attacks a water type of faction nature during a firestorm
async function checkDamage(){
    const specs = getParticipantSpecs('Cyberflare', 'Sharqueen');
    console.log(specs);
    const dmg = damagePercentCalculator(specs[0], specs[1], specs[2], specs[3], 1);
    console.log(dmg);
}
window.checkDamage = checkDamage;
