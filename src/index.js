import axios from "axios";


// Canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let isRendering = false;
let focalPoint = 0;
let instruction = 0;

let leaving = '';
let entering = '';

let whoAttacks = 0; //2 for both, 1 only AI when the player is switching, 0 when no one
let aiMove = 0;
let playerMove = 0;

// Store the next battle messages for the text box
let battleMessage = "Let's battle! The domain for this matchup is ";

// Load and cache images to avoid reloading
const imageCache = {};
function loadImage(src) {
  if (imageCache[src]) return imageCache[src];
  const img = new Image();
  img.src = src;
  imageCache[src] = img;
  return img;
}

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

const terrains = ['Sea', 'Firestorm', 'Forest', 'Thunderstorm', 'Pure', 'Evil', 'Artificial', 'Space'];
const terrainBackgrounds = ['img/sea.jpg', 'img/firestorm2.jpg', 'img/forest.jpg', 'img/thunderstorm2.jpg', 'img/pure.jpg', 'img/evil.jpg', 'img/artificial.jpg', 'img/space.jpg'];
const terrainSprites = [new Image(), new Image(), new Image(), new Image(),new Image(), new Image(),new Image(), new Image()];
var k = 0;
while (k < terrains.length){
    terrainSprites[k].src = terrainBackgrounds[k];
    k++;
}

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


const monsters = ['Abyss', 'Banshit', 'Cuck-oo', 'Dumdum', 'Sharqueen', 'Cyberflare', 'Mermina', 'Wormhell', 'Seraphix', 'Cosyz', 'Tungstongue', 'Aria', 'Satun', 'Storja', 'Gaia', 'Despire', 'Feris', 'Vanquash', 'Momori', 'Jarinn', 'Qwala', 'Ristora', 'Saibill', 'Veilara', 'Thram', 'Zenshi', 'Extone', 'Cereph', 'Firaoh', 'Lucy', 'Lavia', 'Zias', 'Dawn', 'Dusk'];

const monsterStats = [
    ['Abyss', 7, 0, 50, 104, 82, 88, 73, 101, 'Dark Punch', 'Rile Up', 'Solid Smash', 'Dark Phantasm', 'img/m1.png'],
    ['Banshit', 5, 2, 77, 80, 103, 85, 90, 92, 'Dark Wail', 'Shadow Veil', 'Dark Daze', 'Dark Phantasm', 'img/m2.png'],
    ['Cuck-oo', 2, 3, 60, 80, 120, 96, 60, 78, 'Storm Strike', 'Storm Steps', 'Super Stun', 'Lightning Pulse', 'img/m3.png'],
    ['Dumdum', 3, 2, 127, 88, 55, 60, 110, 82, 'Stone Throw', 'Dust Guard', 'Quake', 'Landslide', 'img/m4.png'],
    ['Sharqueen', 1, 3, 90, 49, 93, 86, 66, 69, 'Water Tackle', 'Hydro Veil', 'Frost Fangs', 'Tsunami Surge', 'img/m5.png'],
    ['Cyberflare', 0, 0, 110, 98, 70, 85, 64, 97, 'Flame Punch', 'Flame Up', 'Burning Uppercut', 'Infernal Storm', 'img/m6.png'],
    ['Mermina', 1, 1, 80, 100, 80, 91, 62, 60, 'Water Tackle', 'Rising Tide', 'Steam Blast', 'Tsunami Surge', 'img/m7.png'],
    ['Wormhell', 7, 5, 20, 140, 93, 90, 100, 79, 'Dark Slash', 'Rile Up', 'Eternal Cannon', 'Dark Phantasm', 'img/m8.png'],
    ['Seraphix', 6, 4, 45, 120, 101, 85, 107, 77, 'Light Burst', 'Clear Soul', 'Aura Blind', 'Infinite Radiance', 'img/m9.png'],
    ['Cosyz', 4, 5, 90, 40, 109, 73, 90, 51, 'Gravity Beam', 'Cosmo Guard', 'Galactic Storm', 'Black Hole', 'img/m10.png'],
    ['Tungstongue', 5, 0, 70, 120, 60, 87, 80, 120, 'Metal Slash', 'Sharpen Blade', 'Metal Debris', 'Magnetic Annihilation', 'img/m11.png'],
    ['Aria', 1, 4, 67, 101, 98, 92, 93, 90, 'Water Pulse', 'Steaming Ice', 'Cyclone Slash', 'Tsunami Surge', 'img/m12.png'],
    ['Satun', 0, 2, 100, 60, 65, 88, 100, 66, 'Flame Punch', 'Flame Up', 'Searing Burn', 'Infernal Storm', 'img/m13.png'],
    ['Storja', 2, 3, 130, 65, 111, 65, 80, 75, 'Storm Strike', 'Charge Up', 'Paralyzing Wave', 'Lightning Pulse', 'img/m14.png'],
    ['Gaia', 3, 4, 84, 90, 68, 98, 94, 90, 'Rockfall', 'Nature Sync', 'Calm of Green', 'Landslide', 'img/m15.png'],
    ['Despire', 4, 2, 70, 70, 113, 89, 123, 105, 'Gravity Beam', 'Destabilizing Wave', 'Galactic Storm', 'Black Hole', 'img/m16.png'],
    ['Feris', 6, 3, 91, 65, 70, 70, 130, 51, 'Light Burst', 'Clear Soul', 'Malevolent Slumber', 'Infinite Radiance', 'img/m17.png'],
    ['Vanquash', 1, 2, 80, 84, 80, 88, 78, 104, 'Water Punch', 'Flowing Grace', 'Steam Blast', 'Tsunami Surge', 'img/m18.png'],
    ['Momori', 5, 3, 77, 80, 103, 85, 99, 84, 'Metal Beam', 'Steel Guard', 'Mirror Maze', 'Magnetic Annihilation', 'img/m19.png'],
    ['Jarinn', 7, 1, 90, 62, 129, 96, 80, 78, 'Dark Punch', 'Shadow Dance', 'Nightmare Slash', 'Dark Phantasm', 'img/m20.png'],
    ['Qwala', 3, 0, 107, 88, 55, 84, 99, 82, 'Stone Throw', 'Dust Guard', 'Sapping Ground', 'Landslide', 'img/m21.png'],
    ['Ristora', 6, 3, 90, 49, 93, 89, 117, 59, 'Light Burst', 'Illumination', 'Blinding Light', 'Infinite Radiance', 'img/m22.png'],
    ['Saibill', 5, 0, 110, 78, 70, 75, 110, 97, 'Iron Punch', 'Upgrade', 'Paralyzing Wave', 'Magnetic Annihilation', 'img/m23.png'],
    ['Veilara', 1, 2, 62, 60, 80, 95, 162, 60, 'Water Tackle', 'Hydraulic Charge', 'Steam Blast', 'Tsunami Surge', 'img/m24.png'],
    ['Thram', 7, 2, 60, 90, 96, 90, 141, 86, 'Dark Slash', 'Rile Up', 'Uncertain Fate', 'Dark Phantasm', 'img/m25.png'],
    ['Zenshi', 6, 2, 93, 75, 104, 89, 92, 77, 'Light Burst', 'Clear Soul', 'Final Purge', 'Infinite Radiance', 'img/m26.png'],
    ['Extone', 3, 5, 134, 111, 109, 93, 36, 51, 'Rockfall', 'Grounded Focus', 'Heated Land', 'Landslide', 'img/m27.png'],
    ['Cereph', 4, 5, 72, 120, 60, 88, 100, 123, 'Spacial Wave', 'Temporal Warp', 'Galactic Storm', 'Black Hole', 'img/m28.png'],
    ['Firaoh', 0, 1, 73, 111, 98, 92, 89, 90, 'Fire Burst', 'Flame Up', 'Burning Toxins', 'Infernal Storm', 'img/m29.png'],
    ['Lucy', 7, 2, 100, 60, 62, 68, 140, 66, 'Shadow Beam', 'Unholy Focus', 'Nightmare Slash', 'Dark Phantasm', 'img/m30.png'],
    ['Lavia', 0, 5, 83, 107, 78, 99, 88, 84, 'Fire Burst', 'Rile Up', 'Final Purge', 'Infernal Storm', 'img/m31.png'],
    ['Zias', 2, 1, 75, 100, 91, 88, 110, 93, 'Lightning Fist', 'Thunderous Roar', 'Ionic Prison', 'Lightning Pulse', 'img/m32.png'],
    ['Dawn', 6, 4, 100, 70, 91, 90, 110, 105, 'Holy Burst', 'Clear Soul', 'Sacred Flames', 'Infinite Radiance', 'img/m33.png'],
    ['Dusk', 7, 4, 110, 65, 90, 90, 110, 100, 'Unholy Burst', 'Clear Soul', 'Unholy Venom', 'Dark Phantasm', 'img/m34.png']

]

const monsterSprites = Array(34).fill().map(() => new Image());
k = 0;
console.log(monsterSprites);
console.log(monsterStats);
while (k < monsterStats.length){
    monsterSprites[k].src = monsterStats[k][13];
    k++;
}

const moves = ['Dark Punch', 'Rile Up', 'Solid Smash', 'Dark Phantasm', 'Dark Wail', 'Shadow Veil', 'Dark Daze', 'Storm Strike', 'Storm Steps', 'Super Stun', 'Lightning Pulse', 'Stone Throw', 'Dust Guard', 'Quake', 'Landslide', 'Water Tackle', 'Hydro Veil', 'Frost Fangs', 'Tsunami Surge', 'Flame Punch', 'Flame Up', 'Burning Uppercut', 'Infernal Storm', 'Steam Blast', 'Rising Tide', 'Dark Slash', 'Eternal Cannon', 'Light Burst', 'Clear Soul', 'Aura Blind', 'Infinite Radiance', 'Gravity Beam', 'Cosmo Guard', 'Galactic Storm', 'Black Hole', 'Metal Slash', 'Sharpen Blade', 'Metal Debris', 'Magnetic Annihilation', 'Water Pulse', 'Steaming Ice', 'Cyclone Slash', 'Searing Burn', 'Charge Up', 'Paralyzing Wave', 'Rockfall', 'Nature Sync', 'Calm of Green', 'Destabilizing Wave', 'Malevolent Slumber', 'Water Punch', 'Flowing Grace', 'Metal Beam', 'Steel Guard', 'Mirror Maze', 'Dark Punch', 'Shadow Dance', 'Nightmare Slash', 'Sapping Ground', 'Illumination', 'Blinding Light', 'Iron Punch', 'Upgrade', 'Hydraulic Charge', 'Uncertain Fate', 'Final Purge', 'Grounded Focus', 'Heated Land', 'Spacial Wave', 'Temporal Warp', 'Fire Burst', 'Burning Toxins', 'Shadow Beam', 'Unholy Focus', 'Lightning Fist', 'Thunderous Roar', 'Ionic Prison', 'Holy Burst', 'Sacred Flames', 'Unholy Burst', 'Unholy Venom'];

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
 * 19: remove status
 * 20: instant defeat
 * 21: burn OR frostbite
 * 22: burn OR poison
 * 23: poison OR frostbite
 * 24: stun OR burn
 * 25: sleep OR burn
 * 26: daze OR burn
 * 27: daze OR sleep
 * 28: daze OR stun
 * 29: poison OR stun
 * 30: poison OR sleep
 * 31: poison OR daze
 * 32: frostbite OR sleep
 * 33: frostbite OR daze
 * 34: any random status
 * 35: attack OR mana up
 * 36: speed OR attack up
*/

const movesData = [
    ['Dark Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Dark type attack. Gains 1 spirit.'],
    ['Rile Up', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100, 'Increases Attack by one stage.'],
    ['Solid Smash', 0, 40, 0, 100, 0, 100, 0, 100, 0, 100, 'A stronger Technology faction attack. It has no added effects.'],
    ['Dark Phantasm', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Dark type attack. Does great damage. Costs 2 spirit.'],
    ['Dark Wail', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Dark type attack. Gains 1 spirit.'],
    ['Shadow Veil', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100, 'Veils user in shadows to lower foe Accuracy.'],
    ['Dark Daze', 2, 25, 0, 100, 0, 100, 6, 100, 0, 100, 'Does damage and always leaves the foe Dazed. Costs 1 spirit.'],
    ['Storm Strike', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Storm type attack. Gains 1 spirit.'],
    ['Storm Steps', 1, 0, 9, 100, 0, 100, 0, 100, 0, 100, 'Generates static electricity with feet to increase Speed.'],
    ['Super Stun', 1, 0, 0, 100, 0, 100, 4, 100, 0, 100, 'Grants the foe the Stunned status.'],
    ['Lightning Pulse', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Storm type attack. Does great damage. Costs 2 spirit.'],
    ['Stone Throw', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Earth type attack. Gains 1 spirit.'],
    ['Dust Guard', 1, 0, 8, 100, 0, 100, 0, 100, 0, 100, 'Creates a shield of dust around the user to increase Defence.'],
    ['Quake', 0, 45, 0, 100, 0, 100, 0, 100, 0, 100, 'A stronger Earth attack. It has no added effects.'],
    ['Landslide', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Earth type attack. Does great damage. Costs 2 spirit.'],
    ['Water Tackle', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Water type attack. Gains 1 spirit.'],
    ['Hydro Veil', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100, 'Hides behind waves to lower foe Accuracy.'],
    ['Frost Fangs', 2, 35, 0, 100, 0, 100, 3, 50, 0, 100, 'Does damage and has a 50% chance of giving the foe Frostbite. Costs 1 spirit.'],
    ['Tsunami Surge', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Water type attack. Does great damage.Costs 2 spirit.'],
    ['Flame Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Fire type attack. Gains 1 spirit.'],
    ['Flame Up', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100, 'Fires up the user to increase Attack.'],
    ['Burning Uppercut', 0, 50, 0, 100, 0, 100, 0, 100, 0, 100, 'A stronger Fire attack. It has no added effects.'],
    ['Infernal Storm', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Fire type attack. Does great damage. Costs 2 spirit.'],
    ['Steam Blast', 2, 45, 0, 100, 0, 100, 1, 50, 0, 100, 'Does damage and has a 50% chance of Burning the foe. Costs 1 spirit.'],
    ['Rising Tide', 1, 0, 9, 100, 0, 100, 0, 100, 0, 100, 'User gains momentum from waves to increase Speed.'],
    ['Dark Slash', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Dark type attack. Gains 1 spirit.'],
    ['Eternal Cannon', 0, 70, 0, 100, 0, 100, 0, 100, 0, 100, 'A stronger Endless faction attack. It has no added effects.'],
    ['Light Burst', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Light type attack. Gains 1 spirit.'],
    ['Clear Soul', 1, 0, 11, 100, 0, 100, 0, 100, 0, 100, 'User calms the soul and concentrates to increase Mana.'],
    ['Aura Blind', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100, 'User blinds the foe with bright lights to lower Accuracy.'],
    ['Infinite Radiance', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Light type attack. Does great damage. Costs 2 spirit.'],
    ['Gravity Beam', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Cosmic type attack. Gains 1 spirit.'],
    ['Cosmo Guard', 1, 0, 8, 100, 0, 100, 0, 100, 0, 100, 'User concentrates gravity around themselves to increase Defence.'],
    ['Galactic Storm', 2, 35, 0, 100, 0, 100, 4, 50, 0, 100, 'Does damage and has a 50% chance of leaving the foe Stunned. Costs 1 spirit.'],
    ['Black Hole', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Cosmic type attack. Does great damage. Costs 2 spirit.'],
    ['Metal Slash', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Metal type attack. Gains 1 spirit.'],
    ['Sharpen Blade', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100, 'User sharpens their blade to increase Attack.'],
    ['Metal Debris', 2, 35, 0, 100, 0, 100, 15, 50, 0, 100, 'Does damage and has a 50% chance of lowering the foe Speed.'],
    ['Magnetic Annihilation', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100, 'The ultimate Metal type attack. Does great damage. Costs 2 spirit.'],
    ['Water Pulse', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Water type attack. Gains 1 spirit.'],
    ['Steaming Ice', 1, 0, 0, 100, 0, 100, 21, 100, 0, 100, 'Attacks the foe with steam and ice that always leaves them Burned or Frostbitten.'],
    ['Cyclone Slash', 0, 45, 0, 100, 0, 100, 0, 100, 0, 100, 'A stronger Storm type attack. It has no added effects.'],
    ['Searing Burn', 2, 35, 0, 100, 0, 100, 1, 100, 0, 100, 'Does damage and always results in a Burn. Costs 1 spirit.'],
    ['Charge Up', 1, 0, 11, 100, 0, 100, 0, 100, 0, 100, 'User charges up their electric energy to increase Mana.'],
    ['Paralyzing Wave', 2, 35, 0, 100, 0, 100, 4, 100, 0, 100, 'Does damage and always leads to Stun. Costs 1 spirit.'],
    ['Rockfall', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Earth type attack. Gains 1 spirit.'],
    ['Nature Sync', 1, 0, 35, 100, 0, 100, 0, 100, 0, 100, 'User meditates in nature and increase Attack OR Mana.'],
    ['Calm of Green', 1, 0, 0, 100, 0, 100, 5, 100, 0, 100, 'User calms the foe and grants them Sleep.'],
    ['Destabilizing Wave', 1, 0, 0, 100, 0, 100, 28, 100, 0, 100, 'Destabilizes the foe with haphazard waves that always Stun OR Daze.'],
    ['Malevolent Slumber', 1, 0, 0, 100, 0, 100, 5, 100, 0, 100, 'User calls upon dark magic to put the foe to Sleep.'],
    ['Water Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Water type attack. Gains 1 spirit.'],
    ['Flowing Grace', 1, 0, 9, 100, 0, 100, 0, 100, 0, 100, 'User becomes one with the waves, increasing Speed.'],
    ['Metal Beam', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Metal type attack. Gains 1 spirit.'],
    ['Steel Guard', 1, 0, 8, 100, 0, 100, 0, 100, 0, 100, 'User created a steel exoskeleton, increasing Defence.'],
    ['Mirror Maze', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100, 'User uses mirrors to create after-images, lowering the foe Accuracy.'],
    ['Dark Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Dark type attack. Gains 1 spirit.'],
    ['Shadow Dance', 1, 0, 36, 100, 0, 100, 0, 100, 0, 100, 'User does a dark ritual dance that increases Speed OR Attack.'],
    ['Nightmare Slash', 0, 50, 0, 100, 0, 100, 0, 100, 0, 100, 'A stronger Dark type attack. It has no added effects.'],
    ['Sapping Ground', 1, 0, 0, 100, 0, 100, 17, 100, 0, 100, 'User siphons the Mana out of the foe and lowers it by one stage.'],
    ['Illumination', 1, 0, 10, 100, 0, 100, 0, 100, 0, 100, 'Marks the foe with light to increase own Accuracy.'],
    ['Blinding Light', 2, 35, 0, 100, 0, 100, 17, 65, 0, 100, 'Does damage and has a 65% chance of lowering foe Mana. Costs 1 spirit.'],
    ['Iron Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Metal type attack. Gains 1 spirit.'],
    ['Upgrade', 1, 0, 7, 100, 11, 100, 0, 100, 0, 100, 'User upgrades and increases Attack AND Mana.'],
    ['Hydraulic Charge', 1, 0, 7, 100, 9, 100, 0, 100, 0, 100, 'User channels hydraulic force to increase Attack AND Speed.'],
    ['Uncertain Fate', 1, 0, 0, 100, 0, 100, 34, 100, 0, 100, 'Imparts the foe a random status effect.'],
    ['Final Purge', 1, 0, 20, 100, 0, 100, 20, 100, 0, 100, 'Defeats the foe immediately while also sacrificing the user.'],
    ['Grounded Focus', 1, 0, 11, 100, 10, 100, 0, 100, 0, 100, 'Channels the chakra of the Earth to increase Accuracy AND Mana.'],
    ['Heated Land', 2, 30, 0, 100, 0, 100, 1, 80, 0, 100, 'Does damage and has an 80% chance of causing a Burn. Costs 1 spirit.'],
    ['Spacial Wave', 0, 30, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Cosmic type attack. Gains 1 spirit.'],
    ['Temporal Warp', 1, 0, 9, 100, 0, 100, 15, 100, 0, 100, 'Distorts time to lower foe Speed AND increase self Speed.'],
    ['Fire Burst', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Fire type attack. Gains 1 spirit.'],
    ['Burning Toxins', 2, 35, 0, 100, 0, 100, 22, 100, 0, 100, 'Does damage and always Burns OR Poisons.'],
    ['Shadow Beam', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Dark type attack. Gains 1 spirit.'],
    ['Unholy Focus', 1, 0, 7, 100, 10, 100, 0, 100, 0, 100, 'Meditates in the dark dimension to increase Attack AND Accuracy.'],
    ['Lightning Fist', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Storm type attack. Gains 1 spirit.'],
    ['Thunderous Roar', 1, 0, 11, 100, 9, 100, 0, 100, 0, 100, 'Summons thunder clouds with a roar that increases Speed AND Mana.'],
    ['Ionic Prison', 1, 0, 0, 100, 0, 100, 4, 65, 15, 100, 'Traps foe in an ionic prison that always lowers Speed and 65% chance of Stun.'],
    ['Holy Burst', 0, 30, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Light type attack. Gains 1 spirit.'],
    ['Sacred Flames', 2, 70, 0, 100, 0, 100, 1, 70, 0, 100, 'Does damage and 70% chance of Burn. Costs 1 spirit.'],
    ['Unholy Burst', 0, 30, 0, 100, 0, 100, 0, 100, 0, 100, 'A basic Dark type attack. Gains 1 spirit.'],
    ['Unholy Venom', 2, 70, 0, 100, 0, 100, 2, 70, 0, 100, 'Does damage and 70% chance of Poison. Costs 1 spirit.']
]

const statuses = ['None', 'Burned', 'Poisoned', 'Frostbitten', 'Stunned', 'Drowsy', 'Dazed'];

class Monster{
    constructor(k){
        if (monsters.length <= k) throw new Error('Invalid Choice of Monster');
        const mon = monsterStats[k];
        const name = mon[0];
        const type = mon[1];
        const faction = mon[2];
        const attack = mon[3];
        const defence = mon[4];
        const speed = mon[5];
        const accuracy = mon[6];
        const mana = mon[7];
        const hp = mon[8];
        const m1 = mon[9];
        const m2 = mon[10];
        const m3 = mon[11];
        const m4 = mon[12];
        const pic = mon[13];

        if (!monsters.includes(name)) throw new Error('Invalid Name: '.concat(name));
        if (type >= types.length) throw new Error('Invalid Type: '.concat(type));
        if (faction >= factions.length) throw new Error('Invalid Faction: '.concat(faction));
        this.name = name;
        this.type = type;
        this.faction = faction;
        this.attack = attack;
        this.defence = defence;
        this.speed = speed;
        this.mana = mana;
        this.accuracy = accuracy;
        this.hpmax = hp;
        this.atkstg = 0;
        this.defstg = 0;
        this.spdstg = 0;
        this.mnastg = 0;
        this.acrstg = 0;
        this.hpnow = hp;
        this.status = 0;
        this.statusCounter = 0;
        this.fieldCounter = 0;
        this.move1 = m1;
        this.move2 = m2;
        this.move3 = m3;
        this.move4 = m4;
        this.pic = pic;
    }

    getState(){
        return [this.name, this.type, this.faction, this.attack, this.defence, this.speed, this.mana, this.accuracy, this.hpmax, this.atkstg, this.defstg, this.spdstg, this.mnastg, this.acrstg, this.hpnow, this.status, this.statusCounter, this.fieldCounter, this.move1, this.move2, this.move3, this.move4, this.pic]
    }

    takeDamage(damage){
        this.hpnow = Math.max(0, this.hpnow - damage);
        return this.hpnow;
    }

    isDefeated(){
        return (this.hpnow <= 0);
    }

    changeStatus(st){
        this.status = st;
        return this.status;
    }

    removeSSD(){
        this.status = 0;
        this.statusCounter = 0;
    }

    applyEffect(k){
        console.log("Yo");
        if (k >= 1 && k <= 6){
            if (this.status == 0){
                this.status = k;
                var msg;
                switch(k){
                    case 1:
                        msg = 'Subject got Burned!';
                        break;
                    case 2:
                        msg = 'Subject got Poisoned!';
                        break;
                    case 3:
                        msg = 'Subject got Frostbitten!';
                        break;
                    case 4:
                        msg = 'Subject got Stunned!';
                        break;
                    case 5:
                        msg = 'Subject got Sleepy!';
                        break;
                    default:
                        msg = 'Subject got Dazed!';

                }
                return msg;

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 7){
            if (this.atkstg < 2){
                this.atkstg = this.atkstg + 1;
                return ("Subject's Attack rose!");
            }
            else {
                return ("Subject's Attack is already max!");
            }

        }
        else if (k == 8){
            if (this.defstg < 2){
                this.defstg = this.defstg + 1;
                return ("Subject's Defence rose!");
            }
            else {
                return ("Subject's Defence is already max!");
            }

        }
        else if (k == 9){
            if (this.spdstg < 2){
                this.spdstg = this.spdstg + 1;
                return ("Subject's Speed rose!");
            }
            else {
                return ("Subject's Speed is already max!");
            }

        }
        else if (k == 10){
            if (this.acrstg < 2){
                this.acrstg = this.acrstg + 1;
                return ("Subject's Accuracy rose!");
            }
            else {
                return ("Subject's Accuracy is already max!");
            }

        }
        else if (k == 11){
            if (this.mnastg < 2){
                this.mnastg = this.mnastg + 1;
                return ("Subject's Mana rose!");
            }
            else {
                return ("Subject's Mana is already max!");
            }

        }
        else if (k == 13){
            if (this.atkstg > -2){
                this.atkstg = this.atkstg - 1;
                return ("Subject's Attack fell!");
            }
            else {
                return ("Subject's Attack is already min!");
            }

        }
        else if (k == 14){
            if (this.defstg > -2){
                this.defstg = this.defstg - 1;
                return ("Subject's Defence fell!");
            }
            else {
                return ("Subject's Defence is already min!");
            }

        }
        else if (k == 15){
            if (this.spdstg > -2){
                this.spdstg = this.spdstg - 1;
                return ("Subject's Speed fell!");
            }
            else {
                return ("Subject's Speed is already min!");
            }

        }
        else if (k == 16){
            if (this.acrstg > -2){
                this.acrstg = this.acrstg - 1;
                return ("Subject's Accuracy fell!");
            }
            else {
                return ("Subject's Accuracy is already min!");
            }

        }
        else if (k == 17){
            if (this.mnastg > -2){
                this.mnastg = this.mnastg - 1;
                return ("Subject's Mana fell!");
            }
            else {
                return ("Subject's Mana is already min!");
            }

        }
        else if (k == 19){
            this,status = 0;
            return ("Subject is back to healthy!");

        }
        else if (k == 20){
            this.hpnow = 0;
            return ("Subject fainted!");

        }
        else if (k == 21){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 1;
                    return ('Subject got Burned!');
                }
                else {
                    this.status = 3;
                    return ('Subject got Frostbitten!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }


        }
        else if (k == 22){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 1;
                    return ('Subject got Burned!');
                }
                else {
                    this.status = 2;
                    return ('Subject got Poisoned!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 23){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 2;
                    return ('Subject got Poisoned!');
                }
                else {
                    this.status = 3;
                    return ('Subject got Frostbitten!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 24){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 4;
                    return ('Subject got Stunned!');
                }
                else {
                    this.status = 1;
                    return ('Subject got Burned!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 25){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 5;
                    return ('Subject got Sleepy!');
                }
                else {
                    this.status = 1;
                    return ('Subject got Burned!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 26){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 6;
                    return ('Subject got Dazed!');
                }
                else {
                    this.status = 1;
                    return ('Subject got Burned!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 27){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 6;
                    return ('Subject got Dazed!');
                }
                else {
                    this.status = 5;
                    return ('Subject got Sleepy!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 28){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 6;
                    return ('Subject got Dazed!');
                }
                else {
                    this.status = 4;
                    return ('Subject got Stunned!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 29){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 2;
                    return ('Subject got Poisoned!');
                }
                else {
                    this.status = 4;
                    return ('Subject got Stunned!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 30){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 2;
                    return ('Subject got Poisoned!');
                }
                else {
                    this.status = 5;
                    return ('Subject got Sleepy!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 31){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 2;
                    return ('Subject got Poisoned!');
                }
                else {
                    this.status = 6;
                    return ('Subject got Dazed!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 32){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 3;
                    return ('Subject got Frostbitten!');
                }
                else {
                    this.status = 5;
                    return ('Subject got Sleepy!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 33){
            if (this.status == 0){
                const rng6 = Math.random() * 100;
                if (rng6 > 50){
                    this.status = 3;
                    return ('Subject got Frostbitten!');
                }
                else {
                    this.status = 6;
                    return ('Subject got Dazed!');
                }

            }
            else {
                return ('Subject already has a Negative Status.');
            }

        }
        else if (k == 34){
            const rng6 = Math.random()  * 120;
            var stName = '';
            if (this.status != 0){
                return "Subject already has a Negative Status.";
            }
            if (rng6 >=0 && rng6 < 20){
                this.status = 1;
                stName = 'Burned!';
            }
            else if (rng6 >= 20 && rng6 < 40){
                this.status = 2;
                stName = 'Poisoned!';
            }
            else if (rng6 >= 40 && rng6 < 60){
                this.status = 3;
                stName = 'Frostbitten!';
            }
            else if (rng6 >= 60 && rng6 < 80){
                this.status = 4;
                stName = 'Stunned!';
            }
            else if (rng6 >= 80 && rng6 < 100){
                this.status = 5;
                stName = 'Sleepy!';
            }
            else {
                this.status = 6;
                stName = 'Dazed!';
            }
            return "Subject got ".concat(stName);
        }
        else if (k == 35){
            const rng6 = Math.random() * 100;
            if (rng6 > 50){
                if (this.atkstg < 2){
                    this.atkstg = this.atkstg + 1;
                    return ("Subject's Attack rose!");
                }
                else {
                    return ("Subject's Attack is already max!");
                }
            }
            else {
                if (this.mnastg < 2){
                    this.mnastg = this.mnastg + 1;
                    return ("Subject's Mana rose!");
                }
                else {
                    return ("Subject's Mana is already max!");
                }
            }

        }
        else if (k == 36){
            const rng6 = Math.random() * 100;
            if (rng6 > 50){
                if (this.atkstg < 2){
                    this.atkstg = this.atkstg + 1;
                    return ("Subject's Attack rose!");
                }
                else {
                    return ("Subject's Attack is already max!");
                }
            }
            else {
                if (this.spdstg < 2){
                    this.spdstg = this.spdstg + 1;
                    return ("Subject's Speed rose!");
                }
                else {
                    return ("Subject's Speed is already max!");
                }
            }

        }
        else {
            return ("");
        }


    }



    recall(){
        if (this.status == 4 || this.status == 5 || this.status == 6){
            this.status = 0;
            this.statusCounter = 0;
        }


    }

    statusDamage(){
        if (this.status == 1 || this.status == 2 || this.status == 3){
            this.hpnow = Math.max(0, this.hpnow - (this.hpmax/10));
        }
    }

    incrementFieldCounter(){
        this.fieldCounter = this.fieldCounter + 1;
    }

    incrementStatusCounter(){
        if (this.statusCounter < 3){
            this.statusCounter = this.statusCounter + 1;
        }
        else {
            this.statusCounter = 0;
            this.status = 0;
        }
    }

    changeStat(stat, direction){
        switch (stat){
            case 'ATK': {
                if (direction){
                    this.atkstg = Math.min(2, this.atkstg + 1);
                }
                else {
                    this.atkstg = Math.max(-2, this.atkstg - 1);
                }
                break;
            }
            case 'DEF': {
                if (direction){
                    this.defstg = Math.min(2, this.defstg + 1);
                }
                else {
                    this.defstg = Math.max(-2, this.defstg - 1);
                }
                break;
            }
            case 'SPD': {
                if (direction){
                    this.spdstg = Math.min(2, this.spdstg + 1);
                }
                else {
                    this.spdstg = Math.max(-2, this.spdstg - 1);
                }
                break;
            }
            case 'ACR': {
                if (direction){
                    this.acrstg = Math.min(2, this.acrstg + 1);
                }
                else {
                    this.acrstg = Math.max(-2, this.acrstg - 1);
                }
                break;
            }
            case 'MNA': {
                if (direction){
                    this.mnastg = Math.min(2, this.mnastg + 1);
                }
                else {
                    this.mnastg = Math.max(-2, this.mnastg - 1);
                }
                break;
            }
            default: { }
        }
    }
}


class Team {
  constructor(isPlayer) {
    this.isPlayer = isPlayer; // True for player, false for AI
    this.monsters = [];
    this.activeMonster = 0;
    this.generateTeam();
  }

  // Generate a team of 5 unique monsters
  generateTeam(existingMonsters = []) {
    const availableIndices = Array.from({ length: 32 }, (_, i) => i) // Indices 0–32
      .filter(i => !existingMonsters.includes(i)); // Exclude used indices
    if (availableIndices.length < 5) {
      throw new Error('Not enough unique monsters available');
    }

    // Randomly select 5 indices
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const monsterIndex = availableIndices.splice(randomIndex, 1)[0];
      this.monsters.push(new Monster(monsterIndex));
    }
  }

  // Send out a monster by index
  sendOut(monsterIndex) {
    if (monsterIndex < 0 || monsterIndex >= this.monsters.length) {
      throw new Error('Invalid monster index');
    }
    if (this.monsters[monsterIndex].isDefeated()) {
      throw new Error(`${this.monsters[monsterIndex].name} is knocked out!`);
    }
    if (this.activeMonster == monsterIndex){
        throw new Error('Monster is already out!');
    }

    this.activeMonster = monsterIndex;
  }

  // Check if team is defeated
  isDefeated() {
    return this.monsters.every(monster => monster.isDefeated());
  }



  // Get living monsters
  getLivingMonsters() {
    return this.monsters.filter(monster => !monster.isDefeated());
  }
}

/*
    the main stuff happens here
    all the initialization
    all the internal states
    everything

*/
const playerTeam = new Team(true);
const playerMonsterIndices = playerTeam.monsters.map(mon => monsters.indexOf(mon.name));

// Generate AI team, excluding player's monsters
const aiTeam = new Team(false, playerMonsterIndices);
const terrainNow = Math.floor(Math.random() * 8);
battleMessage = battleMessage.concat(terrains[terrainNow]).concat('.');

var gameState = 'initial';

console.log(playerTeam);




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
        return [attackerSpecs, defenderSpecs];
    }
}

// to demonstrate the damage if a fire type of faction Technology attacks a water type of faction nature during a firestorm
// if the latter is poisoned and the former is healthy
async function checkDamage(){
    const specs = getParticipantSpecs('Cyberflare', 'Sharqueen');
    console.log(specs);
    const specsAtkr = specs[0];
    const specsRcvr = specs[1];
    const dmgMod = damagePercentCalculator(specsAtkr[1], specsRcvr[1], specsAtkr[2], specsRcvr[2], 1, 'None', 'Poisoned');
    const dmg = 50 * ((specsAtkr[3] + specsAtkr[7])/(specsRcvr[7] + specsRcvr[4])) * dmgMod;
    console.log(dmg);
}
window.checkDamage = checkDamage;


async function checkTeams(){
    console.log(playerTeam);
    console.log(aiTeam);
}
window.checkTeams = checkTeams;

function movePlay(atkr, rcvr, terrain, move){
    if (terrain > 7 || terrain < 0) throw new Error('Terrain index illegal: '.concat(terrain));
    if (move > 4 || move < 1) throw new Error('Move index illegal: '.concat(move));
    //if (a > 4 || a < 0) throw new Error('Attacker index illegal: '.concat(a));
    //if (b > 4 || b < 0) throw new Error('Receiver index illegal: '.concat(b));
    //const atkr = playerTeam.monsters[a];
    //const rcvr = aiTeam.monsters[b];
    atkr.incrementFieldCounter();
    //console.log(atkr);
    //console.log(rcvr);
    if (atkr.status == 4 || atkr.status == 5 || atkr.status == 6){
        var statusName = "";
        switch(atkr.status){
            case 4:
                statusName = 'Stun';
                break;
            case 5:
                statusName = 'Sleep';
                break;
            case 6:
                statusName = 'Daze';
                break;
            default:
                statusName = 'None';
        }

        if (atkr.statusCounter < 3){
            atkr.incrementStatusCounter();
            return atkr.name.concat(' is still afflicted with ').concat(statusName).concat(' and could not move.');
        }
        else {
            atkr.removeSSD();
        }
    }
    console.log('move is '.concat(move.toString()));
    var moveName = "";
    switch(move){
        case 1: {
            moveName = atkr.move1;
            break;
        }
        case 2: {
            moveName = atkr.move2;
            break;
        }
        case 3: {
            moveName = atkr.move3;
            break;
        }
        case 4: {
            moveName = atkr.move4;
            break;
        }
        default: moveName = "illegal";
    }


    if (moveName == "illegal") throw new Error("Unknown Move: ".concat(moveName));
    const moveIndex = moves.indexOf(moveName);
    const moveSpecs = movesData[moveIndex];
    //console.log(moveName);
    //console.log(moveIndex);
    //console.log(moveSpecs);
    const acrFinalAtkr = Math.min(atkr.accuracy + (atkr.acrstg * 0.15 * atkr.accuracy), 100);
    const rng1 = Math.random() * 100;
    if (rng1 > acrFinalAtkr){
        console.log("Attack Missed!");
        return atkr.name.concat("'s move missed!");
    }

    var finalMsg = "";
    if (moveSpecs[1] == 1 || moveSpecs[1] == 2){
        if (moveSpecs[3] != 0){
            const rng2 = Math.random() * 100;
            if (rng2 < moveSpecs[4]){
                const e1 = atkr.applyEffect(moveSpecs[3]);
                finalMsg = finalMsg.concat(e1.replace("Subject", atkr.name));
            }
        }
        if (moveSpecs[5] != 0){
            const rng3 = Math.random() * 100;
            if (rng3 < moveSpecs[6]){
                const e2 = atkr.applyEffect(moveSpecs[5]);
                finalMsg = finalMsg.concat('|').concat(e2.replace("Subject", atkr.name));
            }
        }
        if (moveSpecs[7] != 0){
            const rng4 = Math.random() * 100;
            if (rng4 < moveSpecs[8]){
                const e3 = rcvr.applyEffect(moveSpecs[7]);
                finalMsg = finalMsg.concat('|').concat(e3.replace("Subject", rcvr.name));
            }
        }
        if (moveSpecs[9] != 0){
            const rng5 = Math.random() * 100;
            if (rng5 < moveSpecs[10]){
                const e4 = rcvr.applyEffect(moveSpecs[9]);
                finalMsg = finalMsg.concat('|').concat(e4.replace("Subject", rcvr.name));
            }
        }
    }

     //['Malevolent Slumber', 1, 0, 0, 100, 0, 100, 5, 100, 0, 100]
    if (moveSpecs[1] == 0 || moveSpecs[1] == 2){
        const dmgprc = damagePercentCalculator(atkr.type, rcvr.type, atkr.faction, rcvr.faction, terrain, atkr.status, rcvr.status);
        const atkFinalAtkr = atkr.attack + (atkr.atkstg * 0.15 * atkr.attack);
        const mnaFinalAtkr = atkr.mana + (atkr.mnastg * 0.15 * atkr.mana);
        const mnaFinalRcvr = rcvr.mana + (rcvr.mnastg * 0.15 * rcvr.mana);
        const defFinalRcvr = rcvr.defence + (rcvr.defstg * 0.15 * rcvr.defence);
        const dmg = moveSpecs[2] * ((atkFinalAtkr + mnaFinalAtkr)/(mnaFinalRcvr + defFinalRcvr)) * dmgprc;
        rcvr.takeDamage(dmg);
        console.log("damage: ".concat(dmg));
        if (rcvr.hpnow == 0){
            finalMsg = finalMsg.concat('opponent fainted!');

        }
    }
    return finalMsg;

}

async function testMove(){
    movePlay(1, 2, terrainNow, 2);
    /*
    var i = 0;
    while (i < moves.length){
        console.log(moves[i]);
        console.log(movesData[i][0]);
        i++;
    }
    */
}
window.testMove = testMove;

async function toSession(){
    window.location.href = './session.html';
}
window.toSession = toSession;

async function oneTurn(){
    console.log(terrainNow);
    var pm = playerTeam.monsters[playerTeam.activeMonster];
    var am = aiTeam.monsters[aiTeam.activeMonster];
    const el = parseInt(document.getElementById('move').value);
    if (el == 4 && pm.fieldCounter < 2){
        console.log('not charged enough');
        return;
    }
    //if user chose to attack
    if (el >= 1 && el <= 4){
        const pm_spd_now = pm.speed + (pm.spdstg * 0.15 * pm.speed);
        const am_spd_now = am.speed + (am.spdstg * 0.15 * am.speed);
        if (pm_spd_now >= am_spd_now){
            console.log('before:');
            console.log(playerTeam.monsters[playerTeam.activeMonster]);
            console.log(aiTeam.monsters[aiTeam.activeMonster]);
            movePlay(pm, am, terrainNow, parseInt(el));
            console.log('after:');
            console.log(playerTeam.monsters[playerTeam.activeMonster]);
            console.log(aiTeam.monsters[aiTeam.activeMonster]);
            if (am.hpnow != 0){
                console.log('before:');
                console.log(playerTeam.monsters[playerTeam.activeMonster]);
                console.log(aiTeam.monsters[aiTeam.activeMonster]);
                movePlay(am, pm, terrainNow, 1);
                console.log('after:');
                console.log(playerTeam.monsters[playerTeam.activeMonster]);
                console.log(aiTeam.monsters[aiTeam.activeMonster]);
            }
        }
        else {
            console.log('before:');
            console.log(playerTeam.monsters[playerTeam.activeMonster]);
            console.log(aiTeam.monsters[aiTeam.activeMonster]);
            movePlay(am, pm, terrainNow, 1);
            console.log('after:');
            console.log(playerTeam.monsters[playerTeam.activeMonster]);
            console.log(aiTeam.monsters[aiTeam.activeMonster]);
            if (pm.hpnow != 0){
                console.log('before:');
                console.log(playerTeam.monsters[playerTeam.activeMonster]);
                console.log(aiTeam.monsters[aiTeam.activeMonster]);
                movePlay(pm, am, terrainNow, parseInt(el));
                console.log('after:');
                console.log(playerTeam.monsters[playerTeam.activeMonster]);
                console.log(aiTeam.monsters[aiTeam.activeMonster]);
            }
        }
    }
    // if user chose to switch monster
    else if (el >= 5 && el <= 9){
        const newIndex = el - 5;
        if (playerTeam.activeMonster == newIndex){
            console.log("Monster already on field");
            return;
        }
        else if (playerTeam.monsters[newIndex].hpnow == 0){
            console.log("Monster is already defeated");
            return;
        }
        console.log('before:');
        console.log(playerTeam.monsters[playerTeam.activeMonster]);
        console.log(aiTeam.monsters[aiTeam.activeMonster]);

        playerTeam.sendOut(newIndex);
        pm = playerTeam.monsters[playerTeam.activeMonster];
        //console.log(newIndex);

        movePlay(am, pm, terrainNow, 1);
        console.log('after:');
        console.log(playerTeam.monsters[playerTeam.activeMonster]);
        console.log(aiTeam.monsters[aiTeam.activeMonster]);
    }
    console.log(el);
    if (pm.hpnow > 0){
        pm.statusDamage();
    }
    if (am.hpnow > 0){
        am.statusDamage();
    }
}
window.oneTurn = oneTurn;

async function renderAid(){
    const pm = playerTeam.monsters[playerTeam.activeMonster];
    const am = aiTeam.monsters[aiTeam.activeMonster];
    await renderCanvas(pm, am);
}
window.renderAid = renderAid;



async function renderCanvas(pm, am){
    if (isRendering){
        return;
    }

    isRendering = true;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw terrain background
    const terrainImage = terrainSprites[terrainNow];
    ctx.drawImage(terrainImage, 0, 0, canvas.width, canvas.height);



    //font color depending on terrain
    var fontColor;
    if (terrainNow == 6){
        fontColor = 'black';
    }
    else {
        fontColor = 'white';
    }


    if (gameState == 'switch'){
         // Draw 3x2 grid for monster selection
        const gridX = 50;
        const gridY = 100;
        const cellWidth = 500;
        const cellHeight = 160;
        const cellPadding = 10;
        const hpBarWidth = 200;
        const hpBarHeight = 20;
        const lineHeight = 25;

        ctx.fillStyle = 'rgba(200,200,200,0.9)';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.font = '24px Arial';
        var plIndex = 0;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                const index = row * 2 + col; // Cell index (0–5)
                const x = gridX + col * (cellWidth + cellPadding);
                const y = gridY + row * (cellHeight + cellPadding);

                // Draw cell background
                const mnstr = playerTeam.monsters[plIndex];
                if (mnstr.hpnow == 0){
                    ctx.fillStyle = '#cc0000';
                }
                else {
                    ctx.fillStyle = '#5500ee';
                }

                ctx.fillRect(x, y, cellWidth, cellHeight);
                ctx.strokeRect(x, y, cellWidth, cellHeight);

                if (index < 5) {
                // Monster cells (0–4)
                    const monster = playerTeam.monsters[index];
                    if (monster) {
                        // Monster name (with active indicator and fainted status)
                        ctx.fillStyle = monster.hpnow === 0 ? 'gray' : '#000';
                        const nameText = monster.field ? `${monster.name} *` : monster.name;
                        ctx.fillText(`${index + 1}: ${nameText}`, x + 180, y + 40);

                        const monsterImg = monsterSprites[monsters.indexOf(monster.name)];
                        ctx.drawImage(monsterImg, x + 20, y + 10, 140, 140);




                    } else {
                        // Empty team slot
                        ctx.fillStyle = 'gray';
                        ctx.fillText(`${index + 1}: Empty`, x + 20, y + 40);
                    }
            } else {
                // Back option (cell 6)
                ctx.fillStyle = 'black';
                ctx.fillText('6: Back', x + 150, y + 70);
                }
            }
        }

        // 3. Draw battle event text box (rounded rectangle)
        const textBoxX = 50;
        const textBoxY = 620;
        const textBoxWidth = 1000;
        const textBoxHeight = 150;
        const cornerRadius = 20;
        // Draw rounded rectangle
        ctx.fillStyle = 'rgba(200,200,200,0.9)';
        ctx.beginPath();
        ctx.moveTo(textBoxX + cornerRadius, textBoxY);
        ctx.lineTo(textBoxX + textBoxWidth - cornerRadius, textBoxY);
        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + cornerRadius);
        ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - cornerRadius);
        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - cornerRadius, textBoxY + textBoxHeight);
        ctx.lineTo(textBoxX + cornerRadius, textBoxY + textBoxHeight);
        ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - cornerRadius);
        ctx.lineTo(textBoxX, textBoxY + cornerRadius);
        ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + cornerRadius, textBoxY);
        ctx.closePath();
        ctx.fill();

        // Draw border for text box
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw switch messages
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        const lineHeightSw = 25;
        if (instruction == 0){
            if (focalPoint == 1){
                ctx.fillText('Do what with '.concat(playerTeam.monsters[0].name).concat('?'), textBoxX + 70, textBoxY + 60);
                ctx.fillText('a: Send Out', textBoxX + 70, textBoxY + 90);
                ctx.fillText('s: Summary', textBoxX + 270, textBoxY + 90);
                ctx.fillText('d: Cancel', textBoxX + 470, textBoxY + 90);
            }
            else if (focalPoint == 2){
                ctx.fillText('Do what with '.concat(playerTeam.monsters[1].name).concat('?'), textBoxX + 70, textBoxY + 60);
                ctx.fillText('a: Send Out', textBoxX + 70, textBoxY + 90);
                ctx.fillText('s: Summary', textBoxX + 270, textBoxY + 90);
                ctx.fillText('d: Cancel', textBoxX + 470, textBoxY + 90);
            }
            else if (focalPoint == 3){
                ctx.fillText('Do what with '.concat(playerTeam.monsters[2].name).concat('?'), textBoxX + 70, textBoxY + 60);
                ctx.fillText('a: Send Out', textBoxX + 70, textBoxY + 90);
                ctx.fillText('s: Summary', textBoxX + 270, textBoxY + 90);
                ctx.fillText('d: Cancel', textBoxX + 470, textBoxY + 90);
            }
            else if (focalPoint == 4){
                ctx.fillText('Do what with '.concat(playerTeam.monsters[3].name).concat('?'), textBoxX + 70, textBoxY + 60);
                ctx.fillText('a: Send Out', textBoxX + 70, textBoxY + 90);
                ctx.fillText('s: Summary', textBoxX + 270, textBoxY + 90);
                ctx.fillText('d: Cancel', textBoxX + 470, textBoxY + 90);
            }
            else if (focalPoint == 5){
                ctx.fillText('Do what with '.concat(playerTeam.monsters[4].name).concat('?'), textBoxX + 70, textBoxY + 60);
                ctx.fillText('a: Send Out', textBoxX + 70, textBoxY + 90);
                ctx.fillText('s: Summary', textBoxX + 270, textBoxY + 90);
                ctx.fillText('d: Cancel', textBoxX + 470, textBoxY + 90);
            }
            else if (focalPoint == 6){
                if (pm.hpnow > 0){
                    gameState = 'fight';
                    isRendering = false;
                    renderAid();
                }
                else {
                    ctx.fillText(pm.name.concat(' has no HP left!'), textBoxX + 70, textBoxY + 70);
                    ctx.fillText('Please send out a new monster.', textBoxX + 70, textBoxY + 90);
                }
            }
            else {}
        }
        else if (instruction == 1){
            // implement switch
            if (focalPoint >= 1 && focalPoint <= 5) {
                const selectedMonster = playerTeam.monsters[focalPoint - 1];
                if (selectedMonster.hpnow > 0) {
                    leaving = pm.name;
                    try {
                        playerTeam.sendOut(focalPoint - 1);
                        gameState = 'switching';
                        focalPoint = 0;
                        instruction = 0;
                        entering = selectedMonster.name;
                        //movePlay(aiTeam.monsters[aiTeam.activeMonster], playerTeam.monsters[playerTeam.activeMonster], terrainNow, 1);
                        isRendering = false;
                        renderAid();
                    } catch (error) {
                        ctx.fillText(error.message, textBoxX + 70, textBoxY + 70);
                        instruction = 0; // Reset to allow retry
                        setTimeout(() => {
                            isRendering = false;
                            renderAid();
                        }, 2000);
                    }
                } else {
                    ctx.fillText(`${selectedMonster.name} is already defeated!`, textBoxX + 70, textBoxY + 70);
                    ctx.fillText('Please select another monster.', textBoxX + 70, textBoxY + 90);
                    instruction = 0; // Reset to allow retry
                    setTimeout(() => {
                        isRendering = false;
                        renderAid();
                    }, 2000);
                }
            }
        }
        else if (instruction == 2){
            // implement summary
            // Draw summary screen
            const boxX = 100;
            const boxY = 150;
            const boxWidth = 900;
            const boxHeight = 500;
            const cornerRadius = 20;

            // Draw summary box
            ctx.fillStyle = 'rgba(200,200,200,0.9)';
            ctx.beginPath();
            ctx.moveTo(boxX + cornerRadius, boxY);
            ctx.lineTo(boxX + boxWidth - cornerRadius, boxY);
            ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + cornerRadius);
            ctx.lineTo(boxX + boxWidth, boxY + boxHeight - cornerRadius);
            ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - cornerRadius, boxY + boxHeight);
            ctx.lineTo(boxX + cornerRadius, boxY + boxHeight);
            ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - cornerRadius);
            ctx.lineTo(boxX, boxY + cornerRadius);
            ctx.quadraticCurveTo(boxX, boxY, boxX + cornerRadius, boxY);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#333';
            ctx.lineWidth = 5;
            ctx.stroke();

            // Draw monster summary
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            const lineHeight = 30;

            if (focalPoint >= 1 && focalPoint <= 5) {
                const monster = playerTeam.monsters[focalPoint - 1];
                if (monster) {
                const typeName = types[monster.type];
                const factionName = factions[monster.faction];

                const monsterImg2 = monsterSprites[monsters.indexOf(monster.name)];
                ctx.drawImage(monsterImg2, boxX + 50, boxY + 10, 130, 130);


                ctx.fillText(`Attack: ${monster.attack}`, boxX + 550, boxY + 30);
                ctx.fillText(`Defence: ${monster.defence}`, boxX + 550, boxY + 50);
                ctx.fillText(`Speed: ${monster.speed}`, boxX + 550, boxY + 70);
                ctx.fillText(`Accuracy: ${monster.accuracy}`, boxX + 550, boxY + 90);
                ctx.fillText(`Mana: ${monster.mana}`, boxX + 550, boxY + 110);

                ctx.fillText(`${monster.name}${monster.field ? ' *' : ''}`, boxX + 200, boxY + 30);
                ctx.fillText(`Type/Faction: ${typeName}/${factionName}`, boxX + 200, boxY + 90);
                ctx.font = '20px Monospace';
                ctx.fillText('Moves:', boxX + 50, boxY + 175);
                ctx.font = '16px Monospace';
                ctx.fillText(`${monster.move1}:`, boxX + 70, boxY + 210);
                ctx.fillText(movesData[moves.indexOf(monster.move1)][11], boxX + 70, boxY + 230);
                ctx.fillText(`${monster.move2}:`, boxX + 70, boxY + 260);
                ctx.fillText(movesData[moves.indexOf(monster.move2)][11], boxX + 70, boxY + 280);
                ctx.fillText(`${monster.move3}:`, boxX + 70, boxY + 310);
                ctx.fillText(movesData[moves.indexOf(monster.move3)][11], boxX + 70, boxY + 330);
                ctx.fillText(`${monster.move4}:`, boxX + 70, boxY + 360);
                ctx.fillText(movesData[moves.indexOf(monster.move4)][11], boxX + 70, boxY + 380);

                // HP bar
                const hpBarX = boxX + 200;
                const hpBarY = boxY + 40;
                const hpBarWidth = 200;
                const hpBarHeight = 20;
                const hpPercent = monster.hpnow / monster.hpmax;

                ctx.fillStyle = 'red';
                ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                ctx.fillStyle = monster.hpnow === 0 ? 'gray' : 'green';
                ctx.fillRect(hpBarX, hpBarY, hpBarWidth * hpPercent, hpBarHeight);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

                ctx.fillStyle = '#000';
                ctx.font = '20px Arial';
                // Back option
                ctx.fillText('x: Back', boxX + 50, boxY + 450);
                } else {
                ctx.fillText('No monster in this slot!', boxX + 50, boxY + 50);
                ctx.fillText('x: Back', boxX + 50, boxY + 90);
                }
            }
        }
        else if (instruction == 3){
            focalPoint = 0;
            instruction = 0;
            isRendering = false;
            renderAid();
        }
        else {}

    }

    // 2. Draw player and AI monster images
    // Player monster (bottom left)
    else if (gameState != 'switching'){
        const playerImg = monsterSprites[monsters.indexOf(pm.name)];
        ctx.drawImage(playerImg, 50, 450, 150, 150);



        // 3. Draw monster names and HP bars
        // Player monster name and HP bar
        ctx.fillStyle = fontColor;
        ctx.font = '20px Arial';
        ctx.fillText(pm.name, 50, 410); // Name above player sprite

        // Player HP bar
        const playerHpPercent = pm.hpnow / pm.hpmax;
        const hpBarWidth = 150;
        const hpBarHeight = 20;
        var hpBarX = 50;
        var hpBarY = 420;

        // Red background for missing HP
        ctx.fillStyle = 'red';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

        // Green fill for current HP
        ctx.fillStyle = 'green';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * playerHpPercent, hpBarHeight);

        // HP bar border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);





        // AI monster (top right)
        const aiImg = monsterSprites[monsters.indexOf(am.name)];
        ctx.drawImage(aiImg, 900, 150, 150, 150);


        // AI monster name and HP bar
        ctx.fillStyle = fontColor;
        ctx.font = '20px Arial';
        ctx.fillText(am.name, 900, 110); // Name above player sprite

        // Player HP bar
        const aiHpPercent = am.hpnow / am.hpmax;
        hpBarX = 900;
        hpBarY = 120;

        // Red background for missing HP
        ctx.fillStyle = 'red';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

        // Green fill for current HP
        ctx.fillStyle = 'green';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * aiHpPercent, hpBarHeight);

        // HP bar border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

        // 3. Draw battle event text box (rounded rectangle)
        const textBoxX = 50;
        const textBoxY = 620;
        const textBoxWidth = 1000;
        const textBoxHeight = 150;
        const cornerRadius = 20;

        // Draw rounded rectangle
        ctx.fillStyle = 'rgba(200,200,200,0.9)';
        ctx.beginPath();
        ctx.moveTo(textBoxX + cornerRadius, textBoxY);
        ctx.lineTo(textBoxX + textBoxWidth - cornerRadius, textBoxY);
        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + cornerRadius);
        ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - cornerRadius);
        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - cornerRadius, textBoxY + textBoxHeight);
        ctx.lineTo(textBoxX + cornerRadius, textBoxY + textBoxHeight);
        ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - cornerRadius);
        ctx.lineTo(textBoxX, textBoxY + cornerRadius);
        ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + cornerRadius, textBoxY);
        ctx.closePath();
        ctx.fill();

        // Draw border for text box
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw battle messages
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        const lineHeight = 25;



        if (gameState == 'initial'){
            ctx.fillText(battleMessage, textBoxX + 70, textBoxY + 70);
            setTimeout(() => {
                gameState = 'menu';
                renderAid();
            }, 3000);
        }
        else if (gameState == 'menu'){
            ctx.fillText('What will you do?', textBoxX + 70, textBoxY + 50);
            ctx.fillText('z: Fight', textBoxX + 70, textBoxY + 100);
            ctx.fillText('x: Switch', textBoxX + 570, textBoxY + 100);
        }
        else if (gameState == 'fight'){
            if (whoAttacks == 0){
                ctx.fillText('What will '.concat(pm.name).concat(' do?'), textBoxX + 70, textBoxY + 40);
                ctx.fillText('1: '.concat(pm.move1), textBoxX + 70, textBoxY + 80);
                ctx.fillText('2: '.concat(pm.move2), textBoxX + 570, textBoxY + 80);
                ctx.fillText('3: '.concat(pm.move3), textBoxX + 70, textBoxY + 110);
                ctx.fillText('4: '.concat(pm.move4), textBoxX + 570, textBoxY + 110);
                ctx.fillText('x: Switch', textBoxX + 375, textBoxY + 140);
            }
            else if (whoAttacks == 1){
                const res = movePlay(am, pm, terrainNow, aiMove);
                whoAttacks = 0;

                var moveName;
                switch(aiMove){
                    case 1:
                        moveName = am.move1;
                        break;
                    case 2:
                        moveName = am.move2;
                        break;
                    case 3:
                        moveName = am.move3;
                        break;
                    case 4:
                        moveName = am.move4;
                        break
                    default:
                        moveName = '';
                }
                aiMove = whichMove(am, pm.name);
                ctx.fillText(am.name.concat(' used ').concat(moveName), textBoxX + 70, textBoxY + 60);
                await new Promise(resolve => setTimeout(resolve, 2000));
                isRendering = false;
                renderAid();
            }
            else if (whoAttacks == 2){
                if (playerMove == 4){
                    if (pm.fieldCounter < 2){
                        ctx.fillText(`${pm.name} needs at least 2 Spirits to use that move!`, textBoxX + 70, textBoxY + 60);
                        whoAttacks = 0;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        isRendering = false;
                        renderAid();
                    }
                }
                else if (playerMove == 3){
                    if ((movesData[moves.indexOf(pm.move3)][1] == 2) && pm.fieldCounter < 1){
                        ctx.fillText(`${pm.name} needs at least 2 Spirits to use that move!`, textBoxX + 70, textBoxY + 60);
                        whoAttacks = 0;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        isRendering = false;
                        renderAid();
                    }
                }

                const pm_spd_now = pm.speed + (pm.spdstg * 0.15 * pm.speed);
                const am_spd_now = am.speed + (am.spdstg * 0.15 * am.speed);
                if (pm_spd_now >= am_spd_now){

                    const res1 = movePlay(pm, am, terrainNow, playerMove);
                    const plMoveName = [pm.move1, pm.move2, pm.move3, pm.move4][playerMove - 1] || 'a move';
                    // Redraw AI's HP bar after player's move
                    const aiHpPercent = am.hpnow / am.hpmax;
                    const hpBarWidth = 150;
                    const hpBarHeight = 20;
                    let hpBarX = 900;
                    let hpBarY = 120;
                    ctx.fillStyle = 'red';
                    ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                    ctx.fillStyle = am.hpnow === 0 ? 'gray' : 'green';
                    ctx.fillRect(hpBarX, hpBarY, hpBarWidth * aiHpPercent, hpBarHeight);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                    ctx.fillStyle = 'black';
                    ctx.fillText(pm.name.concat(' used ').concat(plMoveName), textBoxX + 70, textBoxY + 60);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    if (res1.length > 2){
                        const plMsgs = res1.split('|');
                        for (let i = 0;i < plMsgs.length; i++){
                            ctx.fillText(plMsgs[i], textBoxX + 70, textBoxY + 90 + i * 25);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    if (am.hpnow != 0){
                        aiMove = whichMove(am, pm.name);
                        const aiMoveName = [am.move1, am.move2, am.move3, am.move4][aiMove - 1] || 'a move';
                        const res2= movePlay(am, pm, terrainNow, aiMove);
                        // clear the text box
                        ctx.clearRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
                        ctx.fillStyle = 'rgba(200,200,200,0.9)';
                        ctx.beginPath();
                        ctx.moveTo(textBoxX + cornerRadius, textBoxY);
                        ctx.lineTo(textBoxX + textBoxWidth - cornerRadius, textBoxY);
                        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + cornerRadius);
                        ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - cornerRadius);
                        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - cornerRadius, textBoxY + textBoxHeight);
                        ctx.lineTo(textBoxX + cornerRadius, textBoxY + textBoxHeight);
                        ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - cornerRadius);
                        ctx.lineTo(textBoxX, textBoxY + cornerRadius);
                        ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + cornerRadius, textBoxY);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 5;
                        ctx.stroke();
                        ctx.fillStyle = '#000';
                        // Redraw player's HP bar after AI's move
                        const playerHpPercent = pm.hpnow / pm.hpmax;
                        hpBarX = 50;
                        hpBarY = 420;
                        ctx.fillStyle = 'red';
                        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                        ctx.fillStyle = pm.hpnow === 0 ? 'gray' : 'green';
                        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * playerHpPercent, hpBarHeight);
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                        ctx.fillStyle = 'black';
                        ctx.fillText(am.name.concat(' used ').concat(aiMoveName), textBoxX + 70, textBoxY + 60);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        if (res2.length > 2){
                            const aiMsgs = res2.split('|');
                            for (let i = 0;i < aiMsgs.length; i++){
                                ctx.fillText(aiMsgs[i], textBoxX + 70, textBoxY + 90 + i * 25);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }
                else {
                    aiMove = whichMove(am, pm.name);
                    const res1 = movePlay(am, pm, terrainNow, aiMove);
                    const aiMoveName = [am.move1, am.move2, am.move3, am.move4][aiMove - 1] || 'a move';
                    const playerHpPercent = pm.hpnow / pm.hpmax;
                    hpBarX = 50;
                    hpBarY = 420;
                    ctx.fillStyle = 'red';
                    ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                    ctx.fillStyle = pm.hpnow === 0 ? 'gray' : 'green';
                    ctx.fillRect(hpBarX, hpBarY, hpBarWidth * playerHpPercent, hpBarHeight);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                    ctx.fillStyle = 'black';
                    ctx.fillText(am.name.concat(' used ').concat(aiMoveName), textBoxX + 70, textBoxY + 60);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    if (res1.length > 2){
                        const aiMsgs = res1.split('|');
                        for (let i = 0;i < aiMsgs.length; i++){
                            ctx.fillText(aiMsgs[i], textBoxX + 70, textBoxY + 90 + i * 25);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    if (pm.hpnow != 0){
                        const res2 = movePlay(pm, am, terrainNow, playerMove);
                        // clear the text box
                        ctx.clearRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
                        ctx.fillStyle = 'rgba(200,200,200,0.9)';
                        ctx.beginPath();
                        ctx.moveTo(textBoxX + cornerRadius, textBoxY);
                        ctx.lineTo(textBoxX + textBoxWidth - cornerRadius, textBoxY);
                        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + cornerRadius);
                        ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - cornerRadius);
                        ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - cornerRadius, textBoxY + textBoxHeight);
                        ctx.lineTo(textBoxX + cornerRadius, textBoxY + textBoxHeight);
                        ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - cornerRadius);
                        ctx.lineTo(textBoxX, textBoxY + cornerRadius);
                        ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + cornerRadius, textBoxY);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 5;
                        ctx.stroke();
                        ctx.fillStyle = '#000';
                        // Redraw player's HP bar after AI's move
                        const aiHpPercent = am.hpnow / am.hpmax;
                        const hpBarWidth = 150;
                        const hpBarHeight = 20;
                        let hpBarX = 900;
                        let hpBarY = 120;
                        ctx.fillStyle = 'red';
                        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                        ctx.fillStyle = am.hpnow === 0 ? 'gray' : 'green';
                        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * aiHpPercent, hpBarHeight);
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
                        ctx.fillStyle = 'black';
                        const plMoveName = [pm.move1, pm.move2, pm.move3, pm.move4][playerMove - 1] || 'a move';
                        ctx.fillText(pm.name.concat(' used ').concat(plMoveName), textBoxX + 70, textBoxY + 60);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        if (res2.length > 2){
                            const plMsgs = res2.split('|');
                            for (let i = 0;i < plMsgs.length; i++){
                                ctx.fillText(plMsgs[i], textBoxX + 70, textBoxY + 90 + i * 25);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }

                //
                whoAttacks = 0;
                isRendering = false;
                renderAid();
            }

        }
    }
        else if (gameState == 'switching'){
            const textBoxX = 50;
            const textBoxY = 620;
            const textBoxWidth = 1000;
            const textBoxHeight = 150;
            const cornerRadius = 20;
            const hpBarWidth = 150;
            const hpBarHeight = 20;
            var hpBarX = 900;
            var hpBarY = 120;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(terrainImage, 0, 0, canvas.width, canvas.height);

             // AI monster (top right)
            const aiImg = monsterSprites[monsters.indexOf(am.name)];
            ctx.drawImage(aiImg, 900, 150, 150, 150);


            // AI monster name and HP bar
            ctx.fillStyle = fontColor;
            ctx.font = '20px Arial';
            ctx.fillText(am.name, 900, 110); // Name above player sprite

            // Player HP bar
            const aiHpPercent = am.hpnow / am.hpmax;
            hpBarX = 900;
            hpBarY = 120;

            // Red background for missing HP
            ctx.fillStyle = 'red';
            ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

            // Green fill for current HP
            ctx.fillStyle = 'green';
            ctx.fillRect(hpBarX, hpBarY, hpBarWidth * aiHpPercent, hpBarHeight);


            // HP bar border
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);



            ctx.clearRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
            ctx.fillStyle = 'rgba(200,200,200,0.9)';
            ctx.beginPath();
            ctx.moveTo(textBoxX + cornerRadius, textBoxY);
            ctx.lineTo(textBoxX + textBoxWidth - cornerRadius, textBoxY);
            ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + cornerRadius);
            ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - cornerRadius);
            ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - cornerRadius, textBoxY + textBoxHeight);
            ctx.lineTo(textBoxX + cornerRadius, textBoxY + textBoxHeight);
            ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - cornerRadius);
            ctx.lineTo(textBoxX, textBoxY + cornerRadius);
            ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + cornerRadius, textBoxY);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.fillStyle = '#000';

            ctx.fillText(`${leaving}, come back!`, textBoxX + 70, textBoxY + 70);
            await new Promise(resolve => setTimeout(resolve, 2000));

            ctx.clearRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
            ctx.fillStyle = 'rgba(200,200,200,0.9)';
            ctx.beginPath();
            ctx.moveTo(textBoxX + cornerRadius, textBoxY);
            ctx.lineTo(textBoxX + textBoxWidth - cornerRadius, textBoxY);
            ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + cornerRadius);
            ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - cornerRadius);
            ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - cornerRadius, textBoxY + textBoxHeight);
            ctx.lineTo(textBoxX + cornerRadius, textBoxY + textBoxHeight);
            ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - cornerRadius);
            ctx.lineTo(textBoxX, textBoxY + cornerRadius);
            ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + cornerRadius, textBoxY);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.fillStyle = '#000';

            ctx.fillText(`Go! ${entering}`, textBoxX + 70, textBoxY + 70);
            await new Promise(resolve => setTimeout(resolve, 2000));
            // AI attacks after messages
            //movePlay(aiTeam.monsters[aiTeam.activeMonster], playerTeam.monsters[playerTeam.activeMonster], terrainNow, 1);
            gameState = 'fight';
            isRendering = false;
            whoAttacks = 1;
            aiMove = whichMove(am, leaving);
            renderAid();

    }
    isRendering = false;

}
window.renderCanvas = renderCanvas;

// Helper function to wrap text
function wrapText(ctx, text, maxWidth, lineHeight, x, y) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // Draw each line
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
    }

    // Return the number of lines for positioning adjustments
    return lines.length;
}


function whichMove(am, monsterName){
    const opm = new Monster(monsters.indexOf(monsterName));
    console.log(opm);
    return 1;
}


document.addEventListener('keydown', (event) => {
    const link = window.location.href;
    if (!link.includes('session.html')){
        return;
    }
    else {
        console.log(gameState);
        if (gameState == 'menu'){
            if (event.key === 'z'){
                gameState = 'fight';
                renderAid();
            }
            else if (event.key === 'x'){
                gameState = 'switch';
                renderAid();
            }
        }
        else if (gameState == 'switch'){
            if (event.key === '1'){
                focalPoint = 1;
                renderAid();
            }
            else if (event.key == '2'){
                focalPoint = 2;
                renderAid();
            }
            else if (event.key == '3'){
                focalPoint = 3;
                renderAid();
            }
            else if (event.key == '4'){
                focalPoint = 4;
                renderAid();
            }
            else if (event.key == '5'){
                focalPoint = 5;
                renderAid();
            }
            else if (event.key == '6'){
                focalPoint = 6;
                renderAid();
            }
            else if (event.key == 'a'){
                instruction = 1;
                renderAid();
            }
            else if (event.key == 's'){
                instruction = 2;
                renderAid();
            }
            else if (event.key == 'd'){
                instruction = 3;
                renderAid();
            }
            else if (event.key == 'x'){
                instruction = 0;
                focalPoint = 0;
                renderAid();
            }
            else {}
        }
        else if (gameState == 'fight'){
            if (event.key === '1'){
                gameState = 'fight';
                playerMove = 1;
                whoAttacks = 2;
                renderAid();
            }
            else if (event.key == '2'){
                gameState = 'fight';
                playerMove = 2;
                whoAttacks = 2;
                renderAid();
            }
            else if (event.key == '3'){
                gameState = 'fight';
                playerMove = 3;
                whoAttacks = 2;
                renderAid();
            }
            else if (event.key == '4'){
                gameState = 'fight';
                playerMove = 4;
                whoAttacks = 2;
                renderAid();
            }
            else if (event.key === 'x'){
                gameState = 'switch';
                focalPoint = 0;
                instruction = 0;
                renderAid();
            }
        }
    }
});
