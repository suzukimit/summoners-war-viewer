import {globalScoreRate} from '../rune/rune';

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
    setLabels: string[] = [];
    mainType2Labels: string[] = [];
    mainType4Labels: string[] = [];
    mainType6Labels: string[] = [];

    constructor(init: { key: string, label: string, hp: number, atk: number, def: number, spd: number, cliRate: number, cliDmg: number, resist: number, accuracy: number, setLabels: string[], mainType2Labels: string[], mainType4Labels: string[], mainType6Labels: string[] }) {
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
        this.setLabels = init.setLabels;
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
}
