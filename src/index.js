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

const stats = ['Attack', 'Defence', 'Speed', 'Accuracy', 'Mana', 'HP'];

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
    ['Abyss', 5, 0, 50, 104, 82, 88, 73, 101, 'Dark Punch', 'Rile Up', 'Solid Smash', 'Dark Phantasm'],
    ['Banshit', 5, 2, 77, 80, 103, 85, 90, 92, 'Dark Wail', 'Shadow Veil', 'Dark Daze', 'Dark Phantasm'],
    ['Cuck-oo', 2, 3, 60, 80, 120, 96, 60, 78, 'Storm Strike', 'Storm Steps', 'Super Stun', 'Lightning Pulse'],
    ['Dumdum', 3, 2, 107, 88, 55, 60, 99, 82, 'Stone Throw', 'Dust Guard', 'Quake', 'Landslide'],
    ['Sharqueen', 1, 3, 90, 49, 93, 79, 66, 69, 'Water Tackle', 'Hydro Veil', 'Frost Fangs', 'Tsunami Surge'],
    ['Cyberflare', 0, 0, 110, 98, 70, 75, 64, 97, 'Flame Punch', 'Flame Up', 'Burning Uppercut', 'Infernal Axe']
]

const moves = ['Dark Punch', 'Rile Up', 'Solid Smash', 'Dark Phantasm', 'Dark Wail', 'Shadow Veil', 'Dark Daze', 'Dark Phantasm', 'Storm Strike', 'Storm Steps', 'Super Stun', 'Lightning Pulse', 'Stone Throw', 'Dust Guard', 'Quake', 'Landslide', 'Water Tackle', 'Hydro Veil', 'Frost Fangs', 'Tsunami Surge', 'Flame Punch', 'Flame Up', 'Burning Uppercut', 'Infernal Axe']

// move name, damage or status, power, effect on self, probability of this, effect on self 2, probability of this, effect on enemy,
// probability of this, effect on enemy 2, probability of this
// effect map:
/*
 * 0: none
 * 1: burn
 * 2: poison
 * 3: frost
 * 4: stun
 * 5: drowsy
 * 6: daze
 * 7: attack up
 * 8: defence up
 * 9: speed up
 * 10: accuracy up
 * 11: mana up
 * 12: hp up
 * 13: attack down
 * 14: defence down
 * 15: speed down
 * 16: accuracy down
 * 17: mana down
 * 18: hp down
*/
const movesData = [
    ['Dark Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Rile Up', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100],
    ['Solid Smash', 0, 40, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Dark Phantasm', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Flame Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Flame Up', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100],
    ['Burning Uppercut', 0, 50, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Infernal Axe', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100]
]

const statuses = ['None', 'Burned', 'Poisoned', 'Frostbitten', 'Stunned', 'Drowsy', 'Dazed'];

function damagePercentCalculator(typeAttacker, typeReceiver, factionAttacker, factionReceiver, terrain, statusAttacker, statusReceiver){
    const typeModifier = damageByType[typeAttacker][typeReceiver];
    const factionModifier = damageByFaction[factionAttacker][factionReceiver];
    const terrainModifier = damageByTerrain[terrain][typeAttacker];
    var statusAttModifier;
    var statusRecModifier;
    if (statusAttacker == 'Burned' || statusAttacker == 'Frostbitten'){
        statusAttModifier = 0.8;
    }
    else {
        statusAttModifier = 1;
    }
    if (statusReceiver == 'Poisoned'){
        statusRecModifier = 1.2;
    }
    else {
        statusRecModifier = 1;
    }
    return (typeModifier * factionModifier * terrainModifier * statusAttModifier * statusRecModifier);
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
        return [attackerSpecs[1], defenderSpecs[1], attackerSpecs[2], defenderSpecs[2], attackerSpecs[3], defenderSpecs[3], attackerSpecs[4], defenderSpecs[4]];
    }
}

// to demonstrate the damage if a fire type of faction Technology attacks a water type of faction nature during a firestorm
// if the latter is poisoned and the former is healthy
async function checkDamage(){
    const specs = getParticipantSpecs('Cyberflare', 'Sharqueen');
    console.log(specs);
    const dmgMod = damagePercentCalculator(specs[0], specs[1], specs[2], specs[3], 1, 'None', 'Poisoned');
    const dmg = 50 * (specs[4]/specs[7]) * dmgMod;
    console.log(dmg);
}
window.checkDamage = checkDamage;
