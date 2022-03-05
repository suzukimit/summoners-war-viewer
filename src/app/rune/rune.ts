/**
 * pri_effとかは[effectType, 数値]となっている。
 */
import { Unit } from 'src/app/unit/unit';
import BigNumber from 'bignumber.js';
import {entry, entryFromKey} from '../common/util';

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

    get id() { return this.rune_id.toString() }
    get title() {
        return `+${this.upgrade_curr} ${runeSet[this.set_id].label}のルーン(${this.slot_no})`;
    }

    unit: Unit;

    init() {
        this.mainOption = new Option(this.pri_eff);
        this.prefixOption = new Option(this.prefix_eff);
        this.sub1Option = new Option(this.sec_eff[0]);
        this.sub2Option = new Option(this.sec_eff[1]);
        this.sub3Option = new Option(this.sec_eff[2]);
        this.sub4Option = new Option(this.sec_eff[3]);
        this.subOptionsByEnhance = [];
        this.subOptionsByEnhanceAndTrain = [];
        this.subOptionsByEnhanceAndTrainAndGem = [];
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
    //ユニット一覧での見せ方
    get unitScoreView() {
        return `${this.score}(${this.potentialScore2}, ${this.potentialScore3})`
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
            const isGemed = subOptions.some(option => option.isGemed);

            //1. 最もスコアが高いオプションで最もスコアが低いオプションを塗り替える戦略
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
            const targetOption = isGemed ? subOptions.find(option => option.isGemed)
                : [...subOptions].sort((a, b) => a.score - b.score)[0];
            const diffScore =  highScoreOption.score - targetOption.score;

            //2. 同じタイプでより高いオプション値に塗り替える戦略
            const sameHighScoreOption = subOptions.filter(option => option.isGemed || !isGemed)
                .map(option => {
                    let type = entryFromKey(runeEffectType, option.type.toString());
                    const o = new Option(null, {
                        type: option.type,
                        value: type.value.gemLegend - option.value,
                        isGemed: true,
                        trainedValue: 0,
                    });
                    return o;
                })
                .sort((a, b) => b.score - a.score)[0];
            sameHighScoreOption.value = entryFromKey(runeEffectType, sameHighScoreOption.type.toString()).value.gemLegend;
            sameHighScoreOption.trainedValue = entryFromKey(runeEffectType, sameHighScoreOption.type.toString()).value.trainLegend;
            const targetOption2 = isGemed ? subOptions.find(option => option.isGemed)
                : subOptions.find(o => o.type == sameHighScoreOption.type);
            const diffScore2 = sameHighScoreOption.score - targetOption2.score;

            //1,2の戦略でよりスコアが高くなる方を採用
            if (highScoreOption && sameHighScoreOption) {
                if (diffScore > diffScore2 && diffScore > 0) {
                    targetOption.type = highScoreOption.type;
                    targetOption.value = highScoreOption.value;
                    targetOption.isGemed = true;
                    targetOption.trainedValue = highScoreOption.trainedValue;
                } else if (diffScore2 > diffScore && diffScore2 > 0) {
                    targetOption2.value = sameHighScoreOption.value;
                    targetOption2.isGemed = true;
                    targetOption2.trainedValue = sameHighScoreOption.trainedValue;
                }
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
    get hpFlat(): number { return new BigNumber(this.hp * 100).dividedBy(this._baseHp).dp(5, 1).toNumber(); }
    atk: number = 1;
    get atkFlat(): number { return new BigNumber(this.atk * 100).dividedBy(this._baseAtk).dp(2, 1).toNumber(); }
    def: number = 1;
    get defFlat(): number { return new BigNumber(this.def * 100).dividedBy(this._baseDef).dp(2, 1).toNumber(); }
    spd: number = 2;
    cliRate: number = 1.5;
    cliDmg: number = 1.2;
    resist: number = 1;
    accuracy: number = 1;
    private _baseHp: number = 10000;
    private _baseAtk: number = 500;
    private _baseDef: number = 500;
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
        this.atk = scoreRate.atk;
        this.def = scoreRate.def;
        this.spd = scoreRate.spd;
        this.cliRate = scoreRate.cliRate;
        this.cliDmg = scoreRate.cliDmg;
        this.resist = scoreRate.resist;
        this.accuracy = scoreRate.accuracy;
    }
    setBaseStatus(unit: Unit) {
        this._baseHp = unit.hp;
        this._baseAtk = unit.atk;
        this._baseDef = unit.def;
    }
    init() {
        this.copyFrom(new ScoreRate());
    }
}
export const globalScoreRate = new ScoreRate();

export const runeSet = {
    1: {
        label: '元気',
        setNumber: 2,
    },
    2: {
        label: '守護',
        setNumber: 2,
    },
    3: {
        label: '迅速',
        setNumber: 4,
    },
    4: {
        label: '刃',
        setNumber: 2,
    },
    5: {
        label: '激怒',
        setNumber: 4,
    },
    6: {
        label: '集中',
        setNumber: 2,
    },
    7: {
        label: '忍耐',
        setNumber: 2,
    },
    8: {
        label: '猛攻',
        setNumber: 4,
    },
    10: {
        label: '絶望',
        setNumber: 4,
    },
    11: {
        label: '吸血',
        setNumber: 4,
    },
    13: {
        label: '暴走',
        setNumber: 4,
    },
    14: {
        label: '果報',
        setNumber: 2,
    },
    15: {
        label: '意志',
        setNumber: 2,
    },
    16: {
        label: '保護',
        setNumber: 2,
    },
    17: {
        label: '反撃',
        setNumber: 2,
    },
    18: {
        label: '破壊',
        setNumber: 2,
    },
    19: {
        label: '闘志',
        setNumber: 2,
    },
    20: {
        label: '決意',
        setNumber: 2,
    },
    21: {
        label: '高揚',
        setNumber: 2,
    },
    22: {
        label: '命中',
        setNumber: 2,
    },
    23: {
        label: '根性',
        setNumber: 2,
    }
};

export const extraRuneSet = {
    101: {
        label: '2セットルーン',
        setNumber: 2,
    },
    102: {
        label: '4セットルーン',
        setNumber: 4,
    }
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

export function runeSetEntryFromLabel(label: string) {
    return entry(runeSet).concat(entry(extraRuneSet)).find(e => e.value.label === label);
}

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

export function runeEffectTypeEntryFromLabel(label: string) {
    return entry(runeEffectType).find(e => e.value.label === label);
}

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
        label: 'ルーンID',
        key: 'rune_id',
        toolTipKey: '',
        sortable: false,
        showDefault: false,
        valueAccessor: (rune: Rune) => rune.rune_id,
    },
    {
        label: 'セット',
        key: 'setView',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => runeSet[rune.set_id].label,
    },
    {
        label: 'スロット',
        key: 'slot_no',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: null,
    },
    {
        label: '主',
        key: 'mainView',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.mainOption.runeView,
    },
    {
        label: '接頭',
        key: 'prefixView',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.prefixOption.runeView,
    },
    {
        label: 'サブ1',
        key: 'sub1View',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.sub1Option.runeView,
    },
    {
        label: 'サブ2',
        key: 'sub2View',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.sub2Option.runeView,
    },
    {
        label: 'サブ3',
        key: 'sub3View',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.sub3Option.runeView,
    },
    {
        label: 'サブ4',
        key: 'sub4View',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.sub4Option.runeView,
    },
    {
        label: 'クラス',
        key: 'class',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
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
        showDefault: true,
        valueAccessor: null,
    },
    {
        label: '純正ランク',
        key: 'extraView',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => extra[rune.extra],
    },
    {
        label: 'スコア',
        key: 'score',
        toolTipKey: 'scoreToolTip',
        sortable: true,
        showDefault: true,
        valueAccessor: null,
    },
    {
        label: '最大スコア（強化後）',
        key: 'potentialScore1',
        toolTipKey: 'potentialScoreToolTip1',
        sortable: true,
        showDefault: true,
        valueAccessor: null,
    },
    {
        label: '最大スコア（強化・練磨後）',
        key: 'potentialScore2',
        toolTipKey: 'potentialScoreToolTip2',
        sortable: true,
        showDefault: true,
        valueAccessor: null,
    },
    {
        label: '最大スコア（強化・練磨・ジェム後）',
        key: 'potentialScore3',
        toolTipKey: 'potentialScoreToolTip3',
        sortable: true,
        showDefault: true,
        valueAccessor: null,
    },
    {
        label: 'ユニット',
        key: 'unitName',
        toolTipKey: '',
        sortable: false,
        showDefault: true,
        valueAccessor: (rune: Rune) => rune.unit ? rune.unit.name : '',
    },
    {
        label: 'デバッグ用（sec_eff）',
        key: 'debug',
        toolTipKey: '',
        sortable: false,
        showDefault: false,
        valueAccessor: (rune: Rune) => rune.sec_eff,
    }
];

export function runeColumnFields(excludeFields: string[] = []) {
    return runeColumnAllFields.filter(f => !excludeFields.includes(f.key));
}

export const runeFilterAllFields = [
    {
        label: 'セット',
        key: 'set_id',
        type: 'select',
        options: entry(runeSet).concat(entry(extraRuneSet)).map(e => ({ value: Number(e.key), viewValue: e.value.label })),
        customFunction: (data: Rune, value: number[]): boolean => {
            if (value.includes(101)) {
                value.push(1, 2, 4, 6, 7, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23);
            }
            if (value.includes(102)) {
                value.push(3, 5, 8, 10, 11, 13);
            }
            return value.length === 0 || value.includes(data.set_id);
        },
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
