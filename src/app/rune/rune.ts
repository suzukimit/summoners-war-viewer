/**
 * pri_effとかは[effectType, 数値]となっている。
 */
import { Unit } from 'src/app/unit/unit';

export class Rune {
    set_id: number;
    slot_no: number;
    pri_eff: number[];  // メインオプション
    prefix_eff: number[];  // 接頭語オプション
    sec_eff: number[];  // サブオプション
    upgrade_curr: number;
    rune_id: number;
    class: number; // ★の数 古代の場合は15とか16になる？
    extra: number; // 純正ランク？
    occupied_id: number; // ?
    occupied_type: number; // ?

    unit: Unit;
    get unitName() {
        return this.unit ? this.unit.name : '';
    }

    get setView() {
        return runeSet[this.set_id];
    }

    get mainType() { return this.pri_eff[0]; }
    get mainValue() { return this.pri_eff[1]; }
    get mainView() { return this.runeView(this.mainType, this.mainValue); }

    get prefixType() { return this.prefix_eff[0]; }
    get prefixValue() { return this.prefix_eff[1]; }
    get prefixView() { return this.runeView(this.prefixType, this.prefixValue); }

    get sub1Type() { return this.subValue(0, 0); }
    get sub1TypeView() { return this.runeTypeView(this.sub1Type); }
    get sub1OriginalValue() { return this.subValue(0, 1); }
    get sub1Value() { return this.sub1OriginalValue + this.subValue(0, 3); }
    get sub1View() { return this.subView(0); }
    get sub1Changed() { return this.subValue(0, 2) === 1; }

    get sub2Type() { return this.subValue(1, 0); }
    get sub2TypeView() { return this.runeTypeView(this.sub2Type); }
    get sub2OriginalValue() { return this.subValue(1, 1); }
    get sub2Value() { return this.sub2OriginalValue + this.subValue(1, 3); }
    get sub2View() { return this.subView(1); }
    get sub2Changed() { return this.subValue(1, 2) === 1; }

    get sub3Type() { return this.subValue(2, 0); }
    get sub3TypeView() { return this.runeTypeView(this.sub3Type); }
    get sub3OriginalValue() { return this.subValue(2, 1); }
    get sub3Value() { return this.sub3OriginalValue + this.subValue(2, 3); }
    get sub3View() { return this.subView(2); }
    get sub3Changed() { return this.subValue(2, 2) === 1; }

    get sub4Type() { return this.subValue(3, 0); }
    get sub4TypeView() { return this.runeTypeView(this.sub4Type); }
    get sub4OriginalValue() { return this.subValue(3, 1); }
    get sub4Value() { return this.sub4OriginalValue + this.subValue(3, 3); }
    get sub4View() { return this.subView(3); }
    get sub4Changed() { return this.subValue(3, 2) === 1; }

    get options() { return [this.mainType, this.prefixType].concat(this.subOptions); }
    get subOptions() { return [this.sub1Type, this.sub2Type, this.sub3Type, this.sub4Type]; }

    get extraView() { return extra[this.extra]; }

    get hp() { return this.calcStatus(1) }
    get hpPercent() { return this.calcStatus(2) }
    get atk() { return this.calcStatus(3) }
    get atkPercent() { return this.calcStatus(4) }
    get def() { return this.calcStatus(5) }
    get defPercent() { return this.calcStatus(6) }
    get speed() { return this.calcStatus(8) }
    get cliRate() { return this.calcStatus(9) }
    get cliDamage() { return this.calcStatus(10) }
    get resist() { return this.calcStatus(11) }
    get accuracy() { return this.calcStatus(12) }
    calcStatus(type: number) {
        let value = 0;
        if (this.mainType === type) { value += this.mainValue; }
        if (this.prefixType === type) { value += this.prefixValue; }
        if (this.sub1Type === type) { value += this.sub1Value; }
        if (this.sub2Type === type) { value += this.sub2Value; }
        if (this.sub3Type === type) { value += this.sub3Value; }
        if (this.sub4Type === type) { value += this.sub4Value; }
        return value;
    }

    subValue(i, j) {
        if (this.sec_eff[i]) {
            return this.sec_eff[i][j];
        } else {
            return 0;
        }
    }

    subView(no: number): string {
        if (this.sec_eff[no]) {
            return this.runeView(this.sec_eff[no][0], this.sec_eff[no][1] + this.sec_eff[no][3])
                + (this.sec_eff[no][2] === 1 ? '🔃' : '');
        } else {
            return '';
        }
    }

    runeTypeView(type: number): string {
        if (type === 0) {
            return '';
        } else {
            return runeEffectType[type].label;
        }
    }

    runeView(type: number, value: number): string {
        if (type === 0) {
            return '';
        } else {
            return runeEffectType[type].label + ' ' + value;
        }
    }

    get score() {
        let score = 0;
        score += this.calc(this.prefixType, this.prefixValue);
        score += this.calc(this.sub1Type, this.sub1Value);
        score += this.calc(this.sub2Type, this.sub2Value);
        score += this.calc(this.sub3Type, this.sub3Value);
        score += this.calc(this.sub4Type, this.sub4Value);
        return score;
    }

    get potentialScore() {
        return this.calcPotentialScore({});
    }

    get potentialScore2() {
        return this.calcPotentialScore({ isUseEnhance: true });
    }

    get potentialScore3() {
        return this.calcPotentialScore({ isUseEnhance: true, isUseGem: true });
    }

    calcPotentialScore({ isUseEnhance = false, isUseGem = false }) {
        let score = this.score;
        // 強化段階が12未満
        let enhanceableCount = this.upgrade_curr >= 12 ? 0 : (4 - this.upgrade_curr / 3);
        let emptySubOptionCount = (this.sub1Type === 0 ? 1 : 0) + (this.sub2Type === 0 ? 1 : 0)
            + (this.sub3Type === 0 ? 1 : 0) + (this.sub4Type === 0 ? 1 : 0);
        let potentialOptions = [];
        while (enhanceableCount > 0) {
            if (emptySubOptionCount >= enhanceableCount) {
                score += this.maxValue({ isNewOption: true, potentialOptions: potentialOptions });
                emptySubOptionCount--;
            } else {
                score += this.maxValue({});
            }
            enhanceableCount--;
        }
        // ジェム・練磨
        if (isUseGem) {
        }
        return score;
    }

    calc(type, value) {
        if (type) {
            return value * runeEffectType[type].scoreRate;
        } else {
            return 0;
        }
    }

    maxValue({ isNewOption = false, potentialOptions = [] }): number {
        let types = Object.entries(runeEffectType);
        // スロットによって取得できないタイプは除外
        if (this.slot_no === 1) {
            types = types.filter(type => ![5, 6].includes(Number(type[0])));
        } else if (this.slot_no === 3) {
            types = types.filter(type => ![3, 4].includes(Number(type[0])));
        }
        // 新しいオプションを追加する場合は取得済みのオプションは除外
        if (isNewOption) {
            types = types.filter(type => !this.options.includes(Number(type[0])) && !potentialOptions.includes(type[0]));
        } else {
            types = types.filter(type => this.subOptions.includes(Number(type[0])));
        }
        const type = types.sort(this.sort)[0];
        if (isNewOption) {
            potentialOptions.push(type[0]);
        }
        return type[1].maximumGrow * type[1].scoreRate;
    }

    sort(a, b) {
        return b[1].maximumGrow * b[1].scoreRate - a[1].maximumGrow * a[1].scoreRate;
    }

    sortWithEnhanceHero(a, b) {
        return (b[1].maximumGrow + b[1].enhanceHero) * b[1].scoreRate - (a[1].maximumGrow + a[1].enhanceHero) * a[1].scoreRate;
    }

    sortWithEnhanceLegend(a, b) {
        return (b[1].maximumGrow + b[1].enhanceLegend) * b[1].scoreRate - (a[1].maximumGrow + a[1].enhanceLegend) * a[1].scoreRate;
    }
}

export const runeSet = {
    1: 'Energy-元気',
    2: 'Guard-守護',
    3: 'Swift-迅速',
    4: 'Blade-刃',
    5: 'Rage-激怒',
    6: 'Focus-集中',
    7: 'Endure-忍耐',
    8: 'Fatal-猛攻',
    10: 'Despair-絶望',
    11: 'Vampire-吸血',
    13: 'Violent-暴走',
    14: 'Nemesis-果報',
    15: 'Will-意志',
    16: 'Shield-保護',
    17: 'Revenge-反撃',
    18: 'Destroy-破壊',
    19: 'Fight-闘志',
    20: 'Determination-決意',
    21: 'Enhance-高揚',
    22: 'Accuracy-命中',
    23: 'Tolerance-根性'
};

export const runeEffectType = {
    0: {
        label: '',
        scoreRate: 0,
        maximumGrow: 0,
        gemHero: 0,
        gemLegend: 0,
        gemAncient: 0,
        enhanceHero: 0,
        enhanceLegend: 0,
        enhanceAncient: 0,
    },
    1: {
        label: 'HP+',
        scoreRate: 0.01,
        maximumGrow: 375,
        gemHero: 420,
        gemLegend: 580,
        gemAncient: 640,
        enhanceHero: 450,
        enhanceLegend: 550,
        enhanceAncient: 610,
    },
    2: {
        label: 'HP%',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 11,
        gemLegend: 13,
        gemAncient: 15,
        enhanceHero: 7,
        enhanceLegend: 10,
        enhanceAncient: 12,
    },
    3: {
        label: '攻撃力+',
        scoreRate: 0.2,
        maximumGrow: 20,
        gemHero: 30,
        gemLegend: 40,
        gemAncient: 44,
        enhanceHero: 22,
        enhanceLegend: 30,
        enhanceAncient: 34,
    },
    4: {
        label: '攻撃力%',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 11,
        gemLegend: 13,
        gemAncient: 15,
        enhanceHero: 7,
        enhanceLegend: 10,
        enhanceAncient: 12,
    },
    5: {
        label: '防御力+',
        scoreRate: 0.2,
        maximumGrow: 20,
        gemHero: 30,
        gemLegend: 40,
        gemAncient: 44,
        enhanceHero: 22,
        enhanceLegend: 30,
        enhanceAncient: 34,
    },
    6: {
        label: '防御力%',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 11,
        gemLegend: 13,
        gemAncient: 15,
        enhanceHero: 7,
        enhanceLegend: 10,
        enhanceAncient: 12,
    },
    8: {
        label: '速度',
        scoreRate: 2,
        maximumGrow: 6,
        gemHero: 8,
        gemLegend: 10,
        gemAncient: 11,
        enhanceHero: 4,
        enhanceLegend: 5,
        enhanceAncient: 6,
    },
    9: {
        label: 'クリ率',
        scoreRate: 1.5,
        maximumGrow: 6,
        gemHero: 7,
        gemLegend: 9,
        gemAncient: 10,
        enhanceHero: 0,
        enhanceLegend: 0,
        enhanceAncient: 0,
    },
    10: {
        label: 'クリダメ',
        scoreRate: 1.2,
        maximumGrow: 7,
        gemHero: 8,
        gemLegend: 10,
        gemAncient: 12,
        enhanceHero: 0,
        enhanceLegend: 0,
        enhanceAncient: 0,
    },
    11: {
        label: '抵抗',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 9,
        gemLegend: 11,
        gemAncient: 13,
        enhanceHero: 0,
        enhanceLegend: 0,
        enhanceAncient: 0,
    },
    12: {
        label: '的中',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 9,
        gemLegend: 11,
        gemAncient: 13,
        enhanceHero: 0,
        enhanceLegend: 0,
        enhanceAncient: 0,
    },
};

export const extra = {
    1: 'ノーマル',
    2: '魔法',
    3: 'レア',
    4: 'ヒーロー',
    5: 'レジェンド',
    11: '古代ノーマル',
    12: '古代魔法',
    13: '古代レア',
    14: '古代ヒーロー',
    15: '古代レジェンド',
};
