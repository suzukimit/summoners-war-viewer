/**
 * pri_effとかは[effectType, 数値]となっている。
 */
import { Unit } from 'src/app/unit/unit';
import BigNumber from 'bignumber.js';

export class Option {
    type: number = 0;
    value: number = 0;
    isGemed: boolean = false;
    trainedValue: number = 0;

    constructor(eff: number[] = [], value: Object = {}) {
        if (eff && eff.length > 0) {
            this.type = eff[0] ? eff[0] : 0;
            this.value = eff[1] ? eff[1] : 0;
            this.isGemed = eff[2] === 1;
            this.trainedValue = eff[3] ? eff[3] : 0;
        } else {
            Object.assign(this, value);
        }
    }

    get isExist(): boolean {
        return this.type !== 0;
    }
    get runeEffectType(): any {
        return runeEffectType[this.type];
    }
    get score(): number {
        return new BigNumber(this.value + this.trainedValue).multipliedBy(globalScoreRate.fromType(this.type)).dp(2, 1).toNumber()
    }
    get runeView(): string {
        if (this.isExist) {
            return `${this.runeEffectType.label} ${this.value + this.trainedValue}` + (this.trainedValue > 0 ? ` (+${this.trainedValue})` : '') + (this.isGemed ? '🔃' : '');
        } else {
            return '';
        }
    }
}

export class Rune {
    set_id: number;
    slot_no: number;
    pri_eff: number[];  // メインオプション
    prefix_eff: number[];  // 接頭語オプション
    sec_eff: number[][];  // サブオプション [type, value, isGemed, trainedValue]のarray
    upgrade_curr: number;
    rune_id: number;
    class: number; // ★の数 古代の場合は15とか16になる？
    extra: number; // 純正ランク？
    occupied_id: number; // ?
    occupied_type: number; // ?

    unit: Unit;

    init() {
        this.mainOption = new Option(this.pri_eff);
        this.prefixOption = new Option(this.prefix_eff);
        this.sub1Option = new Option(this.sec_eff[0]);
        this.sub2Option = new Option(this.sec_eff[1]);
        this.sub3Option = new Option(this.sec_eff[2]);
        this.sub4Option = new Option(this.sec_eff[3]);
        this.subOptions.forEach(option => {
            this.subOptionsByEnhance.push(new Option(null, option));
            this.subOptionsByEnhanceAndTrain.push(new Option(null, option));
            this.subOptionsByEnhanceAndTrainAndGem.push(new Option(null, option));
        });
        this.calcPotentialScore({});
        this.calcPotentialScore({ isUseTrain: true });
        this.calcPotentialScore({ isUseTrain: true, isUseGem: true });
    }

    mainOption: Option;
    prefixOption: Option;
    sub1Option: Option;
    sub2Option: Option;
    sub3Option: Option;
    sub4Option: Option;
    subOptionsByEnhance: Option[] = [];
    subOptionsByEnhanceAndTrain: Option[] = [];
    subOptionsByEnhanceAndTrainAndGem: Option[] = [];

    get options(): Option[] {
        return [this.mainOption, this.prefixOption, ...this.subOptions].filter(option => option.isExist);
    }
    get subOptions(): Option[] {
        return [this.sub1Option, this.sub2Option, this.sub3Option, this.sub4Option].filter(option => option.isExist);
    }

    get enhanceCount() { return this.upgrade_curr / 3; }

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
        if (this.mainOption.type === type) { value += this.mainOption.value; }
        if (this.prefixOption.type === type) { value += this.prefixOption.value; }
        if (this.sub1Option.type === type) { value += this.sub1Option.value; }
        if (this.sub2Option.type === type) { value += this.sub2Option.value; }
        if (this.sub3Option.type === type) { value += this.sub3Option.value; }
        if (this.sub4Option.type === type) { value += this.sub4Option.value; }
        return value;
    }

    get score() {
        return BigNumber.sum(this.prefixOption.score, ...this.subOptions.map(option => option.score)).toNumber();
    }
    get potentialScore1() {
        return BigNumber.sum(this.prefixOption.score, ...this.subOptionsByEnhance.map(option => option.score)).toNumber();
    }
    get potentialScore2() {
        return BigNumber.sum(this.prefixOption.score, ...this.subOptionsByEnhanceAndTrain.map(option => option.score)).toNumber();
    }
    get potentialScore3() {
        return BigNumber.sum(this.prefixOption.score, ...this.subOptionsByEnhanceAndTrainAndGem.map(option => option.score)).toNumber();
    }
    get scoreToolTip() {
        return this.scoreToolTipView(this.subOptions);
    }
    get potentialScoreToolTip1() {
        return this.scoreToolTipView(this.subOptionsByEnhance);
    }
    get potentialScoreToolTip2() {
        return this.scoreToolTipView(this.subOptionsByEnhanceAndTrain);
    }
    get potentialScoreToolTip3() {
        return this.scoreToolTipView(this.subOptionsByEnhanceAndTrainAndGem);
    }
    scoreToolTipView(subOptions: Option[]) {
        return [this.prefixOption, ...subOptions]
            .filter(option => option.isExist)
            .map(option => `${option.score}(${option.runeView})`)
            .join(' + ');
    }

    calc(type, value): number {
        // とりあえず切り捨てで固定しておく
        return new BigNumber(value).multipliedBy(globalScoreRate.fromType(type)).dp(2, 1).toNumber()
    }

    private calcPotentialScore({ isUseTrain = false, isUseGem = false }) {
        const subOptions = isUseGem ? this.subOptionsByEnhanceAndTrainAndGem : (isUseTrain ? this.subOptionsByEnhanceAndTrain : this.subOptionsByEnhance);

        let enhanceableCount = this.upgrade_curr >= 12 ? 0 : (4 - this.upgrade_curr / 3);
        let emptySubOptionCount = 4 - this.subOptions.length;
        while (enhanceableCount > 0) {
            if (emptySubOptionCount >= enhanceableCount) {
                this.enhance(subOptions, { isNewOption: true, isUseTrain: isUseTrain, isUseGem: isUseGem });
                emptySubOptionCount--;
            } else {
                this.enhance(subOptions, {});
            }
            enhanceableCount--;
        }

        if (isUseTrain) {
            subOptions.filter(option => option.runeEffectType.trainLegend > option.trainedValue).forEach(option => {
                option.trainedValue = option.runeEffectType.trainLegend;
            });
        }

        if (isUseGem) {
            let targetOption = subOptions.find(option => option.isGemed);
            if (!targetOption) {
                targetOption = [...subOptions].sort((a, b) => a.score - b.score)[0];
            }

            const highScoreOption = Object.entries(runeEffectType)
                .filter(entry => this.slot_no !== 1 || ![5, 6].includes(Number(entry[0])))
                .filter(entry => this.slot_no !== 3 || ![3, 4].includes(Number(entry[0])))
                .filter(entry => ![this.mainOption.type, this.prefixOption.type, ...subOptions.map(option => option.type)].includes(Number(entry[0])))
                .map(type => new Option(null, {
                    type: Number(type[0]),
                    value: type[1].gemLegend,
                    isGemed: true,
                    trainedValue: type[1].trainLegend,
                }))
                .sort((a, b) => b.score - a.score)[0];

            if (targetOption && highScoreOption && (targetOption.score < highScoreOption.score)) {
                targetOption.type = highScoreOption.type;
                targetOption.value = highScoreOption.value;
                targetOption.isGemed = true;
                targetOption.trainedValue = highScoreOption.trainedValue;
            }
        }
    }

    // TODO maximumGrowの値はclass（星の数）によって異なるのでそこも考慮すべき
    private enhance(subOptions: Option[], { isNewOption = false, isUseTrain = false, isUseGem = false }) {
        if (isNewOption) {
            let types = Object.entries(runeEffectType);
            if (this.slot_no === 1) {
                //1番スロットは防御+,%を除外
                types = types.filter(type => ![5, 6].includes(Number(type[0])));
            } else if (this.slot_no === 3) {
                //3番スロットは攻撃+,%を除外
                types = types.filter(type => ![3, 4].includes(Number(type[0])));
            }
            types = types.filter(type => ![this.mainOption.type, this.prefixOption.type, ...subOptions.map(option => option.type)].includes(Number(type[0])));
            const candidateOptions = types.map(type => {
                return new Option(null, { type: Number(type[0]), value: type[1].maximumGrow });
            });
            subOptions.push(candidateOptions.sort(isUseTrain ? this.sortByScoreWithTrainLegend : this.sortByScore)[0]);
        } else {
            const option = [...subOptions].sort(isUseTrain ? this.sortByScoreWithTrainLegend : this.sortByScore)[0];
            option.value += option.runeEffectType.maximumGrow;
        }
    }

    sortByScore(a: Option, b: Option) {
        return b.runeEffectType.maximumGrow * globalScoreRate.fromType(b.type)
            - a.runeEffectType.maximumGrow * globalScoreRate.fromType(a.type);
    }
    sortByScoreWithTrainHero(a: Option, b: Option) {
        return (b.runeEffectType.maximumGrow + b.runeEffectType.trainHero) * globalScoreRate.fromType(b.type)
            - (a.runeEffectType.maximumGrow + a.runeEffectType.trainHero) * globalScoreRate.fromType(a.type);
    }
    sortByScoreWithTrainLegend(a: Option, b: Option) {
        return (b.runeEffectType.maximumGrow + b.runeEffectType.trainLegend) * globalScoreRate.fromType(b.type)
            - (a.runeEffectType.maximumGrow + a.runeEffectType.trainLegend) * globalScoreRate.fromType(a.type);
    }
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
    fromType(type: number) {
        switch (type) {
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
    copyFrom(scoreRate: ScoreRate) {
        this.hp = scoreRate.hp;
        this.hpFlat = scoreRate.hpFlat;
        this.atk = scoreRate.atk;
        this.atkFlat = scoreRate.atkFlat;
        this.def = scoreRate.def;
        this.defFlat = scoreRate.defFlat;
        this.spd = scoreRate.spd;
        this.cliRate = scoreRate.cliRate;
        this.cliDmg = scoreRate.cliDmg;
        this.resist = scoreRate.resist;
        this.accuracy = scoreRate.accuracy;
    }
    init() {
        this.copyFrom(new ScoreRate());
    }
}
export const globalScoreRate = new ScoreRate();

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
        trainHero: 0,
        trainLegend: 0,
        trainAncient: 0,
    },
    1: {
        label: 'HP+',
        scoreRate: 0.01,
        maximumGrow: 375,
        gemHero: 420,
        gemLegend: 580,
        gemAncient: 640,
        trainHero: 450,
        trainLegend: 550,
        trainAncient: 610,
    },
    2: {
        label: 'HP%',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 11,
        gemLegend: 13,
        gemAncient: 15,
        trainHero: 7,
        trainLegend: 10,
        trainAncient: 12,
    },
    3: {
        label: '攻撃力+',
        scoreRate: 0.2,
        maximumGrow: 20,
        gemHero: 30,
        gemLegend: 40,
        gemAncient: 44,
        trainHero: 22,
        trainLegend: 30,
        trainAncient: 34,
    },
    4: {
        label: '攻撃力%',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 11,
        gemLegend: 13,
        gemAncient: 15,
        trainHero: 7,
        trainLegend: 10,
        trainAncient: 12,
    },
    5: {
        label: '防御力+',
        scoreRate: 0.2,
        maximumGrow: 20,
        gemHero: 30,
        gemLegend: 40,
        gemAncient: 44,
        trainHero: 22,
        trainLegend: 30,
        trainAncient: 34,
    },
    6: {
        label: '防御力%',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 11,
        gemLegend: 13,
        gemAncient: 15,
        trainHero: 7,
        trainLegend: 10,
        trainAncient: 12,
    },
    8: {
        label: '速度',
        scoreRate: 2,
        maximumGrow: 6,
        gemHero: 8,
        gemLegend: 10,
        gemAncient: 11,
        trainHero: 4,
        trainLegend: 5,
        trainAncient: 6,
    },
    9: {
        label: 'クリ率',
        scoreRate: 1.5,
        maximumGrow: 6,
        gemHero: 7,
        gemLegend: 9,
        gemAncient: 10,
        trainHero: 0,
        trainLegend: 0,
        trainAncient: 0,
    },
    10: {
        label: 'クリダメ',
        scoreRate: 1.2,
        maximumGrow: 7,
        gemHero: 8,
        gemLegend: 10,
        gemAncient: 12,
        trainHero: 0,
        trainLegend: 0,
        trainAncient: 0,
    },
    11: {
        label: '抵抗',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 9,
        gemLegend: 11,
        gemAncient: 13,
        trainHero: 0,
        trainLegend: 0,
        trainAncient: 0,
    },
    12: {
        label: '的中',
        scoreRate: 1,
        maximumGrow: 8,
        gemHero: 9,
        gemLegend: 11,
        gemAncient: 13,
        trainHero: 0,
        trainLegend: 0,
        trainAncient: 0,
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
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => runeSet[rune.set_id],
    },
    {
        label: 'スロット',
        key: 'slot_no',
        toolTipKey: '',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: '主',
        key: 'mainView',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.mainOption.runeView,
    },
    {
        label: '接頭',
        key: 'prefixView',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.prefixOption.runeView,
    },
    {
        label: 'サブ1',
        key: 'sub1View',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.sub1Option.runeView,
    },
    {
        label: 'サブ2',
        key: 'sub2View',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.sub2Option.runeView,
    },
    {
        label: 'サブ3',
        key: 'sub3View',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.sub3Option.runeView,
    },
    {
        label: 'サブ4',
        key: 'sub4View',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.sub4Option.runeView,
    },
    {
        label: 'クラス',
        key: 'class',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => {
            let ret = '';
            for (let i = 0; i < (rune.class % 10); i++) {
                ret += '☆';
            }
            return ret;
        },
    },
    {
        label: '強化段階',
        key: 'upgrade_curr',
        toolTipKey: '',
        sortable: false,
        valueAccessor: null,
    },
    {
        label: '純正ランク',
        key: 'extraView',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => extra[rune.extra],
    },
    {
        label: 'スコア',
        key: 'score',
        toolTipKey: 'scoreToolTip',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: '最大スコア（強化後）',
        key: 'potentialScore1',
        toolTipKey: 'potentialScoreToolTip1',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: '最大スコア（強化・練磨後）',
        key: 'potentialScore2',
        toolTipKey: 'potentialScoreToolTip2',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: '最大スコア（強化・練磨・ジェム後）',
        key: 'potentialScore3',
        toolTipKey: 'potentialScoreToolTip3',
        sortable: true,
        valueAccessor: null,
    },
    {
        label: 'ユニット',
        key: 'unitName',
        toolTipKey: '',
        sortable: false,
        valueAccessor: (rune: Rune) => rune.unit ? rune.unit.name : '',
    },
    // {
    //     label: 'デバッグ',
    //     key: 'debag',
    //     toolTipKey: '',
    //     sortable: false,
    //     valueAccessor: (rune: Rune) => rune.sec_eff,
    // }
];

export function runeColumnFields(excludeFields: string[] = []) {
    return runeColumnAllFields.filter(f => !excludeFields.includes(f.key));
}

export const runeFilterAllFields = [
    {
        label: 'セット',
        key: 'set_id',
        type: 'select',
        options: Object.entries(runeSet).map(e => ({ value: Number(e[0]), viewValue: e[1] })),
    },
    {
        label: 'スロット',
        key: 'slot_no',
        type: 'select',
        options: [1, 2, 3, 4, 5, 6].map(e => ({ value: e, viewValue: e })),
    },
    {
        label: '主オプション',
        key: 'mainType',
        type: 'select',
        options: Object.entries(runeEffectType).filter(e => e[1].label).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        valueAccessor: (rune: Rune) => rune.mainOption.type,
    },
    {
        label: '接頭語オプション',
        key: 'prefixType',
        type: 'select',
        options: Object.entries(runeEffectType).filter(e => e[1].label).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        valueAccessor: (rune: Rune) => rune.prefixOption.type,
    },
    {
        label: 'サブオプション',
        key: 'subType',
        type: 'select',
        options: Object.entries(runeEffectType).filter(e => e[1].label).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        customFunction: (data: Rune, value: []): boolean => {
            return value.length === 0 || value.every(e => data.subOptions.map(option => option.type).includes(e));
        },
    },
    {
        label: '純正ランク',
        key: 'extra',
        type: 'select',
        options: Object.entries(extra).map(e => ({ value: Number(e[0]), viewValue: e[1] })),
    },
    {
        label: '強化段階',
        key: 'enhanceCount',
        type: 'select',
        options: [{value: 4, viewValue: '+12~15'}, {value: 3, viewValue: '+9~11'}, {value: 2, viewValue: '+6~8'}, {value: 1, viewValue: '+3~5'}, {value: 0, viewValue: '+0~2'}],
    },
    {
        label: '装備可能のみ',
        key: 'canBeEquipped',
        type: 'toggle',
        customFunction: (data: Rune, value: any): boolean => data.unit == null,
    },
];

export function runeFilterFields({includeFields = [], excludeFields = []}) {
    return runeFilterAllFields.filter(f => (includeFields.length === 0 || includeFields.includes(f.key)) && !excludeFields.includes(f.key));
}
