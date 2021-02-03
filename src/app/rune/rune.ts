/**
 * pri_effとかは[effectType, 数値]となっている。
 */
import { Unit } from 'src/app/unit/unit';
import { Validators } from '@angular/forms';

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

    calcScore(rate: ScoreRate) {
        let result = 0;
        result += this.calc(this.prefixType, this.prefixValue, rate);
        result += this.calc(this.sub1Type, this.sub1Value, rate);
        result += this.calc(this.sub2Type, this.sub2Value, rate);
        result += this.calc(this.sub3Type, this.sub3Value, rate);
        result += this.calc(this.sub4Type, this.sub4Value, rate);
        return result;
    }

    calcPotentialScore(rate: ScoreRate) {
        return this._calcPotentialScore(rate, {});
    }

    calcPotentialScore2(rate: ScoreRate) {
        return this._calcPotentialScore(rate, { isUseEnhance: true });
    }

    calcPotentialScore3(rate: ScoreRate) {
        return this._calcPotentialScore(rate, { isUseEnhance: true, isUseGem: true });
    }

    private _calcPotentialScore(rate: ScoreRate, { isUseEnhance = false, isUseGem = false }) {
        let result = this.calcScore(rate);
        // 強化段階が12未満
        let enhanceableCount = this.upgrade_curr >= 12 ? 0 : (4 - this.upgrade_curr / 3);
        let emptySubOptionCount = (this.sub1Type === 0 ? 1 : 0) + (this.sub2Type === 0 ? 1 : 0)
            + (this.sub3Type === 0 ? 1 : 0) + (this.sub4Type === 0 ? 1 : 0);
        let potentialOptions = [];
        while (enhanceableCount > 0) {
            if (emptySubOptionCount >= enhanceableCount) {
                result += this.maxValue({ isNewOption: true, potentialOptions: potentialOptions });
                emptySubOptionCount--;
            } else {
                result += this.maxValue({});
            }
            enhanceableCount--;
        }
        // ジェム・練磨
        if (isUseGem) {
        }
        return result;
    }

    private calc(type, value, rate: ScoreRate) {
        return value * rate.fromRuneEffectType(type);
    }

    private maxValue({ isNewOption = false, potentialOptions = [] }): number {
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
        const type = types.sort(this.sortEffectType)[0];
        if (isNewOption) {
            potentialOptions.push(type[0]);
        }
        return type[1].maximumGrow * type[1].scoreRate;
    }

    sortByScore(scoreRate: ScoreRate) {
        return (a: Rune, b: Rune) => { return b.calcScore(scoreRate) - a.calcScore(scoreRate) };
    }

    sortEffectType(a, b) {
        return b[1].maximumGrow * b[1].scoreRate - a[1].maximumGrow * a[1].scoreRate;
    }

    sortEffectTypeWithEnhanceHero(a, b) {
        return (b[1].maximumGrow + b[1].enhanceHero) * b[1].scoreRate - (a[1].maximumGrow + a[1].enhanceHero) * a[1].scoreRate;
    }

    sortEffectTypeWithEnhanceLegend(a, b) {
        return (b[1].maximumGrow + b[1].enhanceLegend) * b[1].scoreRate - (a[1].maximumGrow + a[1].enhanceLegend) * a[1].scoreRate;
    }
}

export function sortByScore(scoreRate: ScoreRate) {
    return (a: Rune, b: Rune) => { return b.calcScore(scoreRate) - a.calcScore(scoreRate) };
}

export class ScoreRate {
    hp: number = 1;
    hpFlat: number = 0.01;
    atk: number = 1;
    atkFlat: number = 0.2;
    def: number = 1;
    defFlat: number = 0.2;
    spd: number = 2;
    cliRate: number = 1.5;
    cliDmg: number = 1.2;
    resist: number = 1;
    accuracy: number = 1;
    fromRuneEffectType(key: number) {
        switch (key) {
            case 1: return this.hpFlat;
            case 2: return this.hp;
            case 3: return this.atkFlat;
            case 4: return this.atk;
            case 5: return this.defFlat;
            case 6: return this.def;
            case 8: return this.spd;
            case 9: return this.cliRate;
            case 10: return this.cliDmg;
            case 11: return this.resist;
            case 12: return this.accuracy;
            default: return 0;
        }
    }
}

export const runeSet = {
    1: '元気',
    2: '守護',
    3: '迅速',
    4: '刃',
    5: '激怒',
    6: '集中',
    7: '忍耐',
    8: '猛攻',
    10: '絶望',
    11: '吸血',
    13: '暴走',
    14: '果報',
    15: '意志',
    16: '保護',
    17: '反撃',
    18: '破壊',
    19: '闘志',
    20: '決意',
    21: '高揚',
    22: '命中',
    23: '根性'
};

export const runeSetEn = {
    1: 'Energy',
    2: 'Guard',
    3: 'Swift',
    4: 'Blade',
    5: 'Rage',
    6: 'Focus',
    7: 'Endure',
    8: 'Fatal',
    10: 'Despair',
    11: 'Vampire',
    13: 'Violent',
    14: 'Nemesis',
    15: 'Will',
    16: 'Shield',
    17: 'Revenge',
    18: 'Destroy',
    19: 'Fight',
    20: 'Determination',
    21: 'Enhance',
    22: 'Accuracy',
    23: 'Tolerance'
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

export const runeColumnAllFields = [
    {
        label: 'セット',
        key: 'setView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'スロット',
        key: 'slot_no',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'メイン',
        key: 'mainView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: '接頭',
        key: 'prefixView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ1',
        key: 'sub1View',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ1（タイプ）',
        key: 'sub1TypeView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ1（数値）',
        key: 'sub1Value',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: 'サブ2',
        key: 'sub2View',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ2（タイプ）',
        key: 'sub2TypeView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ2（数値）',
        key: 'sub2Value',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: 'サブ3',
        key: 'sub3View',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ3（タイプ）',
        key: 'sub3TypeView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ3（数値）',
        key: 'sub3Value',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: 'サブ4',
        key: 'sub4View',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ4（タイプ）',
        key: 'sub4TypeView',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: 'サブ4（数値）',
        key: 'sub4Value',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: '強化段階',
        key: 'upgrade_curr',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: '純正ランク',
        key: 'extraView',
        sortable: false,
        valueAccessor: null,
    },
];

export function runeColumnFields(useSimpleSubView: boolean = false, excludeFields: string[] = []) {
    let fields = runeColumnAllFields.filter(f => !excludeFields.includes(f.key));
    if (useSimpleSubView) {
        fields = fields.filter(f => !['sub1Value', 'sub2Value', 'sub3Value', 'sub4Value', 'sub1TypeView', 'sub2TypeView', 'sub3TypeView', 'sub4TypeView'].includes(f.key));
    } else {
        fields = fields.filter(f => !['sub1View', 'sub2View', 'sub3View', 'sub4View'].includes(f.key));
    }
    return fields;
}
