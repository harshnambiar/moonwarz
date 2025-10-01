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


const monsters = ['Abyss', 'Banshit', 'Cuck-oo', 'Dumdum', 'Sharqueen', 'Cyberflare', 'Mermina', 'Wormhell', 'Seraphix', 'Cosyz', 'Tungstongue', 'Aria', 'Satun', 'Storja', 'Gaia', 'Despire', 'Feris'];

const monsterStats = [
    ['Abyss', 7, 0, 50, 104, 82, 88, 73, 101, 'Dark Punch', 'Rile Up', 'Solid Smash', 'Dark Phantasm'],
    ['Banshit', 5, 2, 77, 80, 103, 85, 90, 92, 'Dark Wail', 'Shadow Veil', 'Dark Daze', 'Dark Phantasm'],
    ['Cuck-oo', 2, 3, 60, 80, 120, 96, 60, 78, 'Storm Strike', 'Storm Steps', 'Super Stun', 'Lightning Pulse'],
    ['Dumdum', 3, 2, 107, 88, 55, 60, 99, 82, 'Stone Throw', 'Dust Guard', 'Quake', 'Landslide'],
    ['Sharqueen', 1, 3, 90, 49, 93, 79, 66, 69, 'Water Tackle', 'Hydro Veil', 'Frost Fangs', 'Tsunami Surge'],
    ['Cyberflare', 0, 0, 110, 98, 70, 75, 64, 97, 'Flame Punch', 'Flame Up', 'Burning Uppercut', 'Infernal Storm'],
    ['Mermina', 1, 1, 80, 100, 80, 75, 62, 60, 'Water Tackle', 'Rising Tide', 'Steam Blast', 'Tsunami Surge'],
    ['Wormhell', 7, 5, 20, 140, 93, 90, 100, 79, 'Dark Slash', 'Rile Up', 'Eternal Cannon', 'Dark Phantasm'],
    ['Seraphix', 6, 4, 45, 120, 101, 81, 107, 77, 'Light Burst', 'Clear Soul', 'Aura Blind', 'Infinite Light'],
    ['Cosyz', 4, 5, 90, 40, 109, 73, 90, 51, 'Gravity Beam', 'Cosmo Guard', 'Galactic Storm', 'Black Hole'],
    ['Tungstongue', 5, 0, 70, 120, 60, 80, 80, 120, 'Metal Slash', 'Sharpen Blade', 'Metal Debris', 'Magnetic Annihilation'],
    ['Aria', 1, 4, 67, 101, 98, 92, 93, 90, 'Water Pulse', 'Steaming Ice', 'Cyclone Slash', 'Tsunami Surge'],
    ['Satun', 0, 2, 100, 60, 65, 78, 100, 66, 'Flame Punch', 'Flame Up', 'Searing Burn', 'Infernal Storm'],
    ['Storja', 2, 3, 80, 65, 111, 65, 80, 75, 'Storm Strike', 'Charge Up', 'Paralyzing Wave', 'Lightning Pulse'],
    ['Gaia', 3, 4, 84, 90, 68, 98, 94, 90, 'Rockfall', 'Nature Sync', 'Calm of Green', 'Landslide'],
    ['Despire', 4, 2, 70, 70, 113, 89, 123, 105, 'Gravity Beam', 'Destabilizing Wave', 'Galactic Storm', 'Black Hole'],
    ['Feris', 6, 3, 91, 65, 70, 70, 130, 51, 'Light Burst', 'Clear Soul', 'Malevolent Slumber', 'Infinite Light']

]

const moves = ['Dark Punch', 'Rile Up', 'Solid Smash', 'Dark Phantasm', 'Dark Wail', 'Shadow Veil', 'Dark Daze', 'Storm Strike', 'Storm Steps', 'Super Stun', 'Lightning Pulse', 'Stone Throw', 'Dust Guard', 'Quake', 'Landslide', 'Water Tackle', 'Hydro Veil', 'Frost Fangs', 'Tsunami Surge', 'Flame Punch', 'Flame Up', 'Burning Uppercut', 'Infernal Storm', 'Steam Blast', 'Rising Tide', 'Dark Slash', 'Eternal Cannon', 'Light Burst', 'Clear Soul', 'Aura Blind', 'Infinite Light', 'Gravity Beam', 'Cosmo Guard', 'Galactic Storm', 'Black Hole', 'Metal Slash', 'Sharpen Blade', 'Metal Debris', 'Magnetic Annihilation', 'Water Pulse', 'Steaming Ice', 'Cyclone Slash', 'Searing Burn', 'Charge Up', 'Paralyzing Wave', 'Rockfall', 'Nature Sync', 'Calm of Green', 'Destabilizing Wave', 'Malevolent Slumber'];

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
*/

const movesData = [
    ['Dark Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Rile Up', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100],
    ['Solid Smash', 0, 40, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Dark Phantasm', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Dark Wail', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Shadow Veil', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100],
    ['Dark Daze', 2, 25, 0, 100, 0, 100, 6, 100, 0, 100],
    ['Storm Strike', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Storm Steps', 1, 0, 9, 100, 0, 100, 0, 100, 0, 100],
    ['Super Stun', 1, 0, 0, 100, 0, 100, 4, 100, 0, 100],
    ['Lightning Pulse', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Stone Throw', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Dust Guard', 1, 0, 8, 100, 0, 100, 0, 100, 0, 100],
    ['Quake', 0, 45, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Landslide', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Water Tackle', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Hydro Veil', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100],
    ['Frost Fangs', 2, 35, 0, 100, 0, 100, 3, 50, 0, 100],
    ['Tsunami Surge', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Flame Punch', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Flame Up', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100],
    ['Burning Uppercut', 0, 50, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Infernal Storm', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Steam Blast', 2, 45, 0, 100, 0, 100, 1, 50, 0, 100],
    ['Rising Tide', 1, 0, 9, 100, 0, 100, 0, 100, 0, 100],
    ['Dark Slash', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Eternal Cannon', 0, 70, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Light Burst', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Clear Soul', 1, 0, 11, 100, 0, 100, 0, 100, 0, 100],
    ['Aura Blind', 1, 0, 0, 100, 0, 100, 16, 100, 0, 100],
    ['Infinite Light', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Gravity Beam', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Cosmo Guard', 1, 0, 8, 100, 0, 100, 0, 100, 0, 100],
    ['Galactic Storm', 2, 35, 0, 100, 0, 100, 4, 50, 0, 100],
    ['Black Hole', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Metal Slash', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Sharpen Blade', 1, 0, 7, 100, 0, 100, 0, 100, 0, 100],
    ['Metal Debris', 2, 35, 0, 100, 0, 100, 15, 50, 0, 100],
    ['Magnetic Annihilation', 0, 100, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Water Pulse', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Steaming Ice', 1, 0, 0, 100, 0, 100, 21, 100, 0, 100],
    ['Cyclone Slash', 0, 45, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Searing Burn', 2, 35, 0, 100, 0, 100, 1, 100, 0, 100],
    ['Charge Up', 1, 0, 11, 100, 0, 100, 0, 100, 0, 100],
    ['Paralyzing Wave', 2, 35, 0, 100, 0, 100, 4, 100, 0, 100],
    ['Rockfall', 0, 20, 0, 100, 0, 100, 0, 100, 0, 100],
    ['Nature Sync', 1, 0, 35, 100, 0, 100, 0, 100, 0, 100],
    ['Calm of Green', 1, 0, 0, 100, 0, 100, 5, 100, 0, 100],
    ['Destabilizing Wave', 1, 0, 0, 100, 0, 100, 28, 100, 0, 100],
    ['Malevolent Slumber', 1, 0, 0, 100, 0, 100, 5, 100, 0, 100]
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
        this.active = false;
        this.move1 = m1;
        this.move2 = m2;
        this.move3 = m3;
        this.move4 = m4;
    }

    getState(){
        return [this.name, this.type, this.faction, this.attack, this.defence, this.speed, this.mana, this.accuracy, this.hpmax, this.atkstg, this.defstg, this.spdstg, this.mnastg, this.acrstg, this.hpnow, this.status, this.statusCounter, this.active,        this.move1, this.move2, this.move3, this.move4]
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

    applyEffect(k){
        console.log("Yo");
        if (k >= 1 && k <= 6){
            if (this.status == 0){
                this.status = k;
                console.log('Status is now '.concat(k.toString()));
            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 7){
            if (this.atkstg < 2){
                this.atkstg = this.atkstg + 1;
                console.log("Attack rose!");
            }
            else {
                console.log("Attack already max!");
            }
            return;
        }
        else if (k == 8){
            if (this.defstg < 2){
                this.defstg = this.defstg + 1;
                console.log("Defence rose!");
            }
            else {
                console.log("Defence already max!");
            }
            return;
        }
        else if (k == 9){
            if (this.spdstg < 2){
                this.spdstg = this.spdstg + 1;
                console.log("Speed rose!");
            }
            else {
                console.log("Speed already max!");
            }
            return;
        }
        else if (k == 10){
            if (this.acrstg < 2){
                this.acrstg = this.acrstg + 1;
                console.log("Accuracy rose!");
            }
            else {
                console.log("Accuracy already max!");
            }
            return;
        }
        else if (k == 11){
            if (this.mnastg < 2){
                this.mnastg = this.mnastg + 1;
                console.log("Mana rose!");
            }
            else {
                console.log("Mana already max!");
            }
            return;
        }
        else if (k == 13){
            if (this.atkstg > -2){
                this.atkstg = this.atkstg - 1;
                console.log("Attack fell!");
            }
            else {
                console.log("Attack already min!");
            }
            return;
        }
        else if (k == 14){
            if (this.defstg > -2){
                this.defstg = this.defstg - 1;
                console.log("Defence fell!");
            }
            else {
                console.log("Defence already min!");
            }
            return;
        }
        else if (k == 15){
            if (this.spdstg > -2){
                this.spdstg = this.spdstg - 1;
                console.log("Speed fell!");
            }
            else {
                console.log("Speed already min!");
            }
            return;
        }
        else if (k == 16){
            if (this.acrstg > -2){
                this.acrstg = this.acrstg - 1;
                console.log("Accuracy fell!");
            }
            else {
                console.log("Accuracy already min!");
            }
            return;
        }
        else if (k == 17){
            if (this.mnastg > -2){
                this.mnastg = this.mnastg - 1;
                console.log("Mana fell!");
            }
            else {
                console.log("Mana already min!");
            }
            return;
        }
        else if (k == 19){
            this,status = 0;
            console.log("Status back to healthy!");
            return;
        }
        else if (k == 20){
            this.hpnow = 0;
            console.log("Your monster fainted!");
            return;
        }
        else if (k == 21){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 1;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 3;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;

        }
        else if (k == 22){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 1;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 2;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 23){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 2;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 3;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 24){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 4;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 1;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 25){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 5;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 1;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 26){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 6;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 1;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 27){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 6;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 5;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 28){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 6;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 4;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 29){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 2;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 4;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 30){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 2;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 5;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 31){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 2;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 6;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 32){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 3;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 5;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 33){
            if (this.status == 0){
                const rng6 = Math.floor(0, 100);
                if (rng6 > 50){
                    this.status = 3;
                    console.log('Status is now effect 1');
                }
                else {
                    this.status = 6;
                    console.log('Status is now effect 2');
                }

            }
            else {
                console.log('There is already a Negative Status.');
            }
            return;
        }
        else if (k == 34){
            const rng6 = Math.floor(0,120);
            if (rng6 >=0 && rng6 < 20){
                this.status = 1;
            }
            else if (rng6 >= 20 && rng6 < 40){
                this.status = 2;
            }
            else if (rng6 >= 40 && rng6 < 60){
                this.status = 3;
            }
            else if (rng6 >= 60 && rng6 < 80){
                this.status = 4;
            }
            else if (rng6 >= 80 && rng6 < 100){
                this.status = 5;
            }
            else {
                this.status = 6;
            }
            console.log("Random status afflicted!");
            return;
        }
        else if (k == 35){
            const rng6 = Math.floor(0, 100);
            if (rng6 > 50){
                if (this.atkstg < 2){
                    this.atkstg = this.atkstg + 1;
                    console.log("Attack rose!");
                }
                else {
                    console.log("Attack already max!");
                }
            }
            else {
                if (this.mnastg < 2){
                    this.mnastg = this.mnastg + 1;
                    console.log("Mana rose!");
                }
                else {
                    console.log("Mana already max!");
                }
            }
            return;
        }
        else {
            console.log("no effects");
        }


    }

    sendOut(){
        this.active = true;
    }

    recall(){
        this.active = false;
        this.status = 0;
        this.statusCounter = 0;
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
    this.activeMonster = null;
    this.generateTeam();
  }

  // Generate a team of 5 unique monsters
  generateTeam(existingMonsters = []) {
    const availableIndices = Array.from({ length: 17 }, (_, i) => i) // Indices 0–14
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
    if (this.activeMonster) {
      this.activeMonster.recall();
    }
    this.activeMonster = this.monsters[monsterIndex];
    this.activeMonster.sendOut();
    return `${this.activeMonster.name} was sent out!`;
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

const playerTeam = new Team(true);
const playerMonsterIndices = playerTeam.monsters.map(mon => monsters.indexOf(mon.name));

// Generate AI team, excluding player's monsters
const aiTeam = new Team(false, playerMonsterIndices);


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

function movePlay(a, b, terrain, move){
    if (terrain > 7 || terrain < 0) throw new Error('Terrain index illegal: '.concat(terrain));
    if (move > 4 || move < 1) throw new Error('Move index illegal: '.concat(move));
    if (a > 4 || a < 0) throw new Error('Attacker index illegal: '.concat(a));
    if (b > 4 || b < 0) throw new Error('Receiver index illegal: '.concat(b));
    const atkr = playerTeam.monsters[a];
    const rcvr = aiTeam.monsters[b];
    console.log(atkr);
    console.log(rcvr);
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
    console.log(moveName);
    console.log(moveIndex);
    console.log(moveSpecs);
    const acrFinalAtkr = Math.min(atkr.accuracy + (atkr.acrstg * 0.15 * atkr.accuracy), 100);
    const rng1 = Math.random(0, 100);
    if (rng1 > acrFinalAtkr){
        console.log("Attack Missed!");
        return;
    }
    //['Malevolent Slumber', 1, 0, 0, 100, 0, 100, 5, 100, 0, 100]
    if (moveSpecs[1] == 0 || moveSpecs[1] == 2){
        const dmgprc = damagePercentCalculator(atkr.type, rcvr.type, atkr.faction, rcvr.faction, terrain, atkr.status, rcvr.status);
        const atkFinalAtkr = atkr.attack + (atkr.atkstg * 0.15 * atkr.attack);
        const mnaFinalAtkr = atkr.mana + (atkr.mnastg * 0.15 * atkr.mana);
        const mnaFinalRcvr = rcvr.mana + (rcvr.mnastg * 0.15 * rcvr.mana);
        const defFinalRcvr = rcvr.defence + (rcvr.defstg * 0.15 * rcvr.defence);
        const dmg = moveSpecs[2] * ((atkFinalAtkr + mnaFinalAtkr)/(mnaFinalRcvr + defFinalRcvr)) * dmgprc;
        console.log("damage: ".concat(dmg));
    }
    if (moveSpecs[1] == 1 || moveSpecs[1] == 2){
        if (moveSpecs[3] != 0){
            const rng2 = Math.random(0, 100);
            if (rng2 < moveSpecs[4]){
                atkr.applyEffect(moveSpecs[3]);
                console.log("Self Effect: ".concat(moveSpecs[3].toString()));
            }
        }
        if (moveSpecs[5] != 0){
            const rng3 = Math.random(0, 100);
            if (rng3 < moveSpecs[6]){
                atkr.applyEffect(moveSpecs[5]);
                console.log("Self Effect: ".concat(moveSpecs[5].toString()));
            }
        }
        if (moveSpecs[7] != 0){
            const rng4 = Math.random(0, 100);
            if (rng4 < moveSpecs[8]){
                rcvr.applyEffect(moveSpecs[7]);
                console.log("Enemy Effect: ".concat(moveSpecs[7].toString()));
            }
        }
        if (moveSpecs[9] != 0){
            const rng5 = Math.random(0, 100);
            if (rng5 < moveSpecs[10]){
                rcvr.applyEffect(moveSpecs[9]);
                console.log("Enemy Effect: ".concat(moveSpecs[9].toString()));
            }
        }
    }

}

async function testMove(){
    movePlay(1, 2, 2, 2);
}
window.testMove = testMove;
