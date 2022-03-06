import {globalScoreRate, Rune, RuneEffectType, RuneSet, RuneSetType} from '../rune/rune';

export class UnitBuild {
    key: string = '';
    label: string = '';
    hp: number = 1;
    atk: number = 1;
    def: number = 1;
    spd: number = 2;
    cliRate: number = 1.5;
    cliDmg: number =1.2;
    resist: number = 1;
    accuracy: number = 1;
    runeSets: RuneSetType[] = [];
    mainType2Labels: RuneEffectType[] = [];
    mainType4Labels: RuneEffectType[] = [];
    mainType6Labels: RuneEffectType[] = [];

    constructor(init: { key: string, label: string, hp: number, atk: number, def: number, spd: number, cliRate: number, cliDmg: number, resist: number, accuracy: number, setLabels: RuneSetType[], mainType2Labels: RuneEffectType[], mainType4Labels: RuneEffectType[], mainType6Labels: RuneEffectType[] }) {
        this.key = init.key;
        this.label = init.label;
        this.hp = init.hp;
        this.atk = init.atk;
        this.def = init.def;
        this.spd = init.spd;
        this.cliRate = init.cliRate;
        this.cliDmg = init.cliDmg;
        this.resist = init.resist;
        this.accuracy = init.accuracy;
        this.runeSets = init.setLabels;
        this.mainType2Labels = init.mainType2Labels;
        this.mainType4Labels = init.mainType4Labels;
        this.mainType6Labels = init.mainType6Labels;
    }

    updateGlobalScoreRate() {
        globalScoreRate.hp = this.hp;
        globalScoreRate.atk = this.atk;
        globalScoreRate.def = this.def;
        globalScoreRate.spd = this.spd;
        globalScoreRate.cliRate = this.cliRate;
        globalScoreRate.cliDmg = this.cliDmg;
        globalScoreRate.resist = this.resist;
        globalScoreRate.accuracy = this.accuracy
    }

    match(rune: Rune): boolean {
        switch (rune.slot_no) {
            case 2:
                if (this.mainType2Labels.length > 0 && !this.mainType2Labels.includes(rune.mainOption.type as RuneEffectType)) return false;
                break;
            case 4:
                if (this.mainType4Labels.length > 0 && !this.mainType4Labels.includes(rune.mainOption.type as RuneEffectType)) return false;
                break;
            case 6:
                if (this.mainType6Labels.length > 0 && !this.mainType6Labels.includes(rune.mainOption.type as RuneEffectType)) return false;
                break;
        }
        return this.runeSets.length == 0 || this.runeSets.includes(rune.set_id);
    }
}
