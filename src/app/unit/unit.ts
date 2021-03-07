import { Rune, runeSet } from 'src/app/rune/rune';
import BigNumber from 'bignumber.js';

export class Unit {
    attribute = 0;  //属性？
    building_id = 0;    //?
    class = 0;  //? 星の数？
    costume_master_id = 0;  //?
    create_time = 0;
    exp_gain_rate = 0;  //?
    exp_gained = 0; //?
    experience = 0;
    homunculus = 0; //ホムンクルスかどうかのboolean値？
    homunculus_name = "";
    unit_id = 0;    //ユニット毎に振られているID？
    unit_level = 0;
    unit_master_id = 0; //ユニットの種類毎に振られているID？（同じユニットは同じIDになっている）
    wizard_id = 0;  //召喚士のID？なので全部同じになっている？
    get id() { return this.unit_id.toString() }

    artifacts = [];
    trans_items = [];   //?
    runes: Rune[] = [];
    get applicableRunes() {
        const ret = [];
        Object.entries(runeSet).forEach(set => {
            let count = this.runes.filter(rune => rune.set_id.toString() === set[0]).length;
            while (count - set[1].setNumber >= 0) {
                ret.push(set[1].label);
                count -= set[1].setNumber;
            }
        });
        return ret;
    }
    skills = [];
    awakening_info = {
        date_add: "",
        date_mod: "",
        exp: 0,
        is_awakened: 0,
        max_exp: 0,
        rid: 0,
        unit_id: 0,
        unit_master_id: 0,
        wizard_id: 0,
    };
    get runesScoreSum() {
        return BigNumber.sum(...this.runes.map(rune => rune.score)).toNumber();
    }
    source = "";    //?

    atk = 0;
    con = 0;
    get hp(): number {
        return this.con * 15;
    }
    def = 0;
    spd = 0;
    critical_rate = 0;
    critical_damage = 0;
    resist = 0;
    accuracy = 0;

    get hpView(): string { return this.statusView('hp', 'hp', 'hpPercent'); }
    get atkView(): string { return this.statusView('atk', 'atk', 'atkPercent'); }
    get defView(): string { return this.statusView('def', 'def', 'defPercent'); }
    get spdView(): string { return this.statusView('spd', 'speed', ''); }
    get cliRateView(): string { return this.statusView('critical_rate', 'cliRate', ''); }
    get cliDamageView(): string { return this.statusView('critical_damage', 'cliDamage', ''); }
    get resistView(): string { return this.statusView('resist', 'resist', ''); }
    get accuracyView(): string { return this.statusView('accuracy', 'accuracy', ''); }

    //TODO アーティファクトとルーンセット効果
    statusView(key: string, runeFlatKey: string, runePercentKey: string): string {
        const flatValue = this.runes.map(r => r[runeFlatKey]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const percentValue = runePercentKey ? this.runes.map(r => r[runePercentKey]).reduce((accumulator, currentValue) => accumulator + currentValue, 0) : 0;
        const runeValue = flatValue + Math.ceil(percentValue * this[key] / 100);
        return `${this[key]} + ${runeValue}`;
    }

    regist = 0; //?

    get attributeName(): string {
        return attribute[this.attribute];
    }

    get name(): string {
        const name = monster_names[this.unit_master_id] ? monster_names[this.unit_master_id].en : '';
        if (name) {
            return name;
        } else {
            const familyId = Number(this.unit_master_id.toString().substr(0, 3));
            const familyName = monster_names[familyId] ? monster_names[familyId].en : '';
            if (familyName) {
                return familyName;
            }
        }
        return '';
    }
}

export const attribute = {
    1: '水',
    2: '火',
    3: '風',
    4: '光',
    5: '闇',
};

export const monster_names = {
    "101": {
        en: "Fairy",
        ja: "フェアリー",
    },
    "10111": {
        en: "Elucia",
        ja: "エルーシャ",
    },
    "10112": {
        en: "Iselia",
        ja: "イセリア",
    },
    "10113": {
        en: "Aeilene",
        ja: "エイリン",
    },
    "10114": {
        en: "Neal",
        ja: "ニール",
    },
    "10115": {
        en: "Sorin",
        ja: "ソリン",
    },

    "102": {
        en: "Imp",
        ja: "インプ",
    },
    "10211": {
        en: "Fynn",
        ja: "フィン",
    },
    "10212": {
        en: "Cogma",
        ja: "コグーマ",
    },
    "10213": {
        en: "Ralph",
        ja: "ラルフ",
    },
    "10214": {
        en: "Taru",
        ja: "タール",
    },
    "10215": {
        en: "Garok",
        ja: "ガロック",
    },

    "103": {
        en: "Pixie",
        ja: "ピクシー",
    },
    "10311": {
        en: "Kacey",
        ja: "ケイシー",
    },
    "10312": {
        en: "Tatu",
        ja: "タトゥー",
    },
    "10313": {
        en: "Shannon",
        ja: "シャノン",
    },
    "10314": {
        en: "Cheryl",
        ja: "セリル",
    },
    "10315": {
        en: "Camaryn",
        ja: "カマリン",
    },

    "104": {
        en: "Yeti",
        ja: "イエティ",
    },
    "10411": {
        en: "Kunda",
        ja: "クンダ",
    },
    "10412": {
        en: "Tantra",
        ja: "タントラ",
    },
    "10413": {
        en: "Rakaja",
        ja: "ラカジャ",
    },
    "10414": {
        en: "Arkajan",
        ja: "アルカザン",
    },
    "10415": {
        en: "Kumae",
        ja: "クマエ",
    },

    "105": {
        en: "Harpy",
        ja: "ハーピー",
    },
    "10511": {
        en: "Ramira",
        ja: "ラミーラ",
    },
    "10512": {
        en: "Lucasha",
        ja: "ルーカシャ",
    },
    "10513": {
        en: "Prilea",
        ja: "フリルレア",
    },
    "10514": {
        en: "Kabilla",
        ja: "カビラ",
    },
    "10515": {
        en: "Hellea",
        ja: "ヘレア",
    },

    "106": {
        en: "Hellhound",
        ja: "ヘルハウンド",
    },
    "10611": {
        en: "Tarq",
        ja: "ターク",
    },
    "10612": {
        en: "Sieq",
        ja: "ジーク",
    },
    "10613": {
        en: "Gamir",
        ja: "ガミール",
    },
    "10614": {
        en: "Shamar",
        ja: "シャマール",
    },
    "10615": {
        en: "Shumar",
        ja: "シュマール",
    },

    "107": {
        en: "Warbear",
        ja: "ウォーベア",
    },
    "10711": {
        en: "Dagora",
        ja: "ダゴラ",
    },
    "10712": {
        en: "Ursha",
        ja: "ウルシャー",
    },
    "10713": {
        en: "Ramagos",
        ja: "ラマゴス",
    },
    "10714": {
        en: "Lusha",
        ja: "ルーシャ",
    },
    "10715": {
        en: "Gorgo",
        ja: "ゴルゴ",
    },

    "108": {
        en: "Elemental",
        ja: "エレメンタル",
    },
    "10811": {
        en: "Daharenos",
        ja: "ダハレノース",
    },
    "10812": {
        en: "Bremis",
        ja: "ブレメース",
    },
    "10813": {
        en: "Taharus",
        ja: "タハルース",
    },
    "10814": {
        en: "Priz",
        ja: "プリス",
    },
    "10815": {
        en: "Camules",
        ja: "カミュレス",
    },

    "109": {
        en: "Garuda",
        ja: "ガルーダ",
    },
    "10911": {
        en: "Konamiya",
        ja: "コナミヤ",
    },
    "10912": {
        en: "Cahule",
        ja: "カヒュル",
    },
    "10913": {
        en: "Lindermen",
        ja: "リンダーマン",
    },
    "10914": {
        en: "Teon",
        ja: "テオン",
    },
    "10915": {
        en: "Rizak",
        ja: "リジャーク",
    },

    "110": {
        en: "Inugami",
        ja: "イヌガミ",
    },
    "11011": {
        en: "Icaru",
        ja: "イカル",
    },
    "11012": {
        en: "Raoq",
        ja: "ラオーク",
    },
    "11013": {
        en: "Ramahan",
        ja: "ラマハン",
    },
    "11014": {
        en: "Belladeon",
        ja: "ベラデオン",
    },
    "11015": {
        en: "Kro",
        ja: "クロー",
    },
    "11031": {
        en: "Icaru",
        ja: "イカル",
    },
    "11032": {
        en: "Raoq",
        ja: "ラオーク",
    },
    "11033": {
        en: "Ramahan",
        ja: "ラマハン",
    },
    "11034": {
        en: "Belladeon",
        ja: "ベラデオン",
    },
    "11035": {
        en: "Kro",
        ja: "クロー",
    },

    "111": {
        en: "Salamander",
        ja: "サラマンダー",
    },
    "11111": {
        en: "Kaimann",
        ja: "カイマン",
    },
    "11112": {
        en: "Krakdon",
        ja: "クラークドン",
    },
    "11113": {
        en: "Lukan",
        ja: "ルーカン",
    },
    "11114": {
        en: "Sharman",
        ja: "シャルマン",
    },
    "11115": {
        en: "Decamaron",
        ja: "デカマロン",
    },

    "112": {
        en: "Nine-tailed Fox",
        ja: "九尾の狐",
    },
    "11211": {
        en: "Soha",
        ja: "ソハ",
    },
    "11212": {
        en: "Shihwa",
        ja: "シファ",
    },
    "11213": {
        en: "Arang",
        ja: "アラン",
    },
    "11214": {
        en: "Chamie",
        ja: "シャミエ",
    },
    "11215": {
        en: "Kamiya",
        ja: "カミヤ",
    },

    "113": {
        en: "Serpent",
        ja: "サーペント",
    },
    "11311": {
        en: "Shailoq",
        ja: "シャイロック",
    },
    "11312": {
        en: "Fao",
        ja: "パオ",
    },
    "11313": {
        en: "Ermeda",
        ja: "エルメダ",
    },
    "11314": {
        en: "Elpuria",
        ja: "エルピュイア",
    },
    "11315": {
        en: "Mantura",
        ja: "マンチュラ",
    },

    "114": {
        en: "Golem",
        ja: "ゴーレム",
    },
    "11411": {
        en: "Kuhn",
        ja: "クーン",
    },
    "11412": {
        en: "Kugo",
        ja: "クーゴ",
    },
    "11413": {
        en: "Ragion",
        ja: "ラギオン",
    },
    "11414": {
        en: "Groggo",
        ja: "グロッゴ",
    },
    "11415": {
        en: "Maggi",
        ja: "マギ",
    },

    "115": {
        en: "Griffon",
        ja: "グリフォン",
    },
    "11511": {
        en: "Kahn",
        ja: "カーン",
    },
    "11512": {
        en: "Spectra",
        ja: "スペクトラ",
    },
    "11513": {
        en: "Bernard",
        ja: "バナード",
    },
    "11514": {
        en: "Shamann",
        ja: "シャーマン",
    },
    "11515": {
        en: "Varus",
        ja: "ヴァルス",
    },

    "116": {
        en: "Undine",
        ja: "ウンディーネ",
    },
    "11611": {
        en: "Mikene",
        ja: "ミケネ",
    },
    "11612": {
        en: "Atenai",
        ja: "アテナイ",
    },
    "11613": {
        en: "Delphoi",
        ja: "デルフォイ",
    },
    "11614": {
        en: "Icasha",
        ja: "イカシャー",
    },
    "11615": {
        en: "Tilasha",
        ja: "ティラシャー",
    },

    "117": {
        en: "Inferno",
        ja: "インペルノ",
    },
    "11711": {
        en: "Purian",
        ja: "ピュリアン",
    },
    "11712": {
        en: "Tagaros",
        ja: "タガロス",
    },
    "11713": {
        en: "Anduril",
        ja: "アンドゥリル",
    },
    "11714": {
        en: "Eludain",
        ja: "エルダイン",
    },
    "11715": {
        en: "Drogan",
        ja: "ドゥローガン",
    },

    "118": {
        en: "Sylph",
        ja: "シルフ",
    },
    "11811": {
        en: "Tyron",
        ja: "タイロン",
    },
    "11812": {
        en: "Baretta",
        ja: "バレッタ",
    },
    "11813": {
        en: "Shimitae",
        ja: "シミタエ",
    },
    "11814": {
        en: "Eredas",
        ja: "エレダス",
    },
    "11815": {
        en: "Aschubel",
        ja: "アシュベル",
    },

    "119": {
        en: "Sylphid",
        ja: "シルフィード",
    },
    "11911": {
        en: "Lumirecia",
        ja: "ルミレシア",
    },
    "11912": {
        en: "Fria",
        ja: "プリア",
    },
    "11913": {
        en: "Acasis",
        ja: "アカシス",
    },
    "11914": {
        en: "Mihael",
        ja: "ミハエル",
    },
    "11915": {
        en: "Icares",
        ja: "イカロス",
    },

    "120": {
        en: "High Elemental",
        ja: "ハイエレメンタル",
    },
    "12011": {
        en: "Ellena",
        ja: "エレナ",
    },
    "12012": {
        en: "Kahli",
        ja: "カーリー",
    },
    "12013": {
        en: "Moria",
        ja: "モーリア",
    },
    "12014": {
        en: "Shren",
        ja: "シュレン",
    },
    "12015": {
        en: "Jumaline",
        ja: "ジュマリン",
    },

    "121": {
        en: "Harpu",
        ja: "ハルピュイア",
    },
    "12111": {
        en: "Sisroo",
        ja: "シースルー",
    },
    "12112": {
        en: "Colleen",
        ja: "カリン",
    },
    "12113": {
        en: "Seal",
        ja: "シール",
    },
    "12114": {
        en: "Sia",
        ja: "シア",
    },
    "12115": {
        en: "Seren",
        ja: "セレン",
    },

    "122": {
        en: "Slime",
        ja: "スライム",
    },
    "12211": {
        en: "",
        ja: "",
    },
    "12212": {
        en: "",
        ja: "",
    },
    "12213": {
        en: "",
        ja: "",
    },
    "12214": {
        en: "",
        ja: "",
    },
    "12215": {
        en: "",
        ja: "",
    },

    "123": {
        en: "Forest Keeper",
        ja: "森の番人",
    },
    "12311": {
        en: "",
        ja: "",
    },
    "12312": {
        en: "",
        ja: "",
    },
    "12313": {
        en: "",
        ja: "",
    },
    "12314": {
        en: "",
        ja: "",
    },
    "12315": {
        en: "",
        ja: "",
    },

    "124": {
        en: "Mushroom",
        ja: "キノコ",
    },
    "12411": {
        en: "",
        ja: "",
    },
    "12412": {
        en: "",
        ja: "",
    },
    "12413": {
        en: "",
        ja: "",
    },
    "12414": {
        en: "",
        ja: "",
    },
    "12415": {
        en: "",
        ja: "",
    },

    "125": {
        en: "Maned Boar",
        ja: "タテガミイノシシ",
    },
    "12511": {
        en: "",
        ja: "",
    },
    "12512": {
        en: "",
        ja: "",
    },
    "12513": {
        en: "",
        ja: "",
    },
    "12514": {
        en: "",
        ja: "",
    },
    "12515": {
        en: "",
        ja: "",
    },

    "126": {
        en: "Monster Flower",
        ja: "トゲ地獄花",
    },
    "12611": {
        en: "",
        ja: "",
    },
    "12612": {
        en: "",
        ja: "",
    },
    "12613": {
        en: "",
        ja: "",
    },
    "12614": {
        en: "",
        ja: "",
    },
    "12615": {
        en: "",
        ja: "",
    },

    "127": {
        en: "Ghost",
        ja: "ゴースト",
    },
    "12711": {
        en: "",
        ja: "",
    },
    "12712": {
        en: "",
        ja: "",
    },
    "12713": {
        en: "",
        ja: "",
    },
    "12714": {
        en: "",
        ja: "",
    },
    "12715": {
        en: "",
        ja: "",
    },

    "128": {
        en: "Low Elemental",
        ja: "下級エレメンタル",
    },
    "12811": {
        en: "Tigresse",
        ja: "ティグリス",
    },
    "12812": {
        en: "Lamor",
        ja: "ルーモア",
    },
    "12813": {
        en: "Samour",
        ja: "サモア",
    },
    "12814": {
        en: "Varis",
        ja: "ヴァリス",
    },
    "12815": {
        en: "Havana",
        ja: "アヴァナ",
    },

    "129": {
        en: "Mimick",
        ja: "ミミック",
    },
    "12911": {
        en: "",
        ja: "",
    },
    "12912": {
        en: "",
        ja: "",
    },
    "12913": {
        en: "",
        ja: "",
    },
    "12914": {
        en: "",
        ja: "",
    },
    "12915": {
        en: "",
        ja: "",
    },

    "130": {
        en: "Horned Frog",
        ja: "カエル",
    },
    "13011": {
        en: "",
        ja: "",
    },
    "13012": {
        en: "",
        ja: "",
    },
    "13013": {
        en: "",
        ja: "",
    },
    "13014": {
        en: "",
        ja: "",
    },
    "13015": {
        en: "",
        ja: "",
    },

    "131": {
        en: "Sandman",
        ja: "サンドマン",
    },
    "13111": {
        en: "",
        ja: "",
    },
    "13112": {
        en: "",
        ja: "",
    },
    "13113": {
        en: "",
        ja: "",
    },
    "13114": {
        en: "",
        ja: "",
    },
    "13115": {
        en: "",
        ja: "",
    },

    "132": {
        en: "Howl",
        ja: "ハウル",
    },
    "13211": {
        en: "Lulu",
        ja: "ルル",
    },
    "13212": {
        en: "Lala",
        ja: "ララ",
    },
    "13213": {
        en: "Chichi",
        ja: "チチ",
    },
    "13214": {
        en: "Shushu",
        ja: "シュシュ",
    },
    "13215": {
        en: "Chacha",
        ja: "カカ",
    },

    "133": {
        en: "Succubus",
        ja: "サキュバス",
    },
    "13311": {
        en: "Izaria",
        ja: "イザリア",
    },
    "13312": {
        en: "Akia",
        ja: "アキーア",
    },
    "13313": {
        en: "Selena",
        ja: "セレナ",
    },
    "13314": {
        en: "Aria",
        ja: "アリア",
    },
    "13315": {
        en: "Isael",
        ja: "イザエル",
    },

    "134": {
        en: "Joker",
        ja: "ジョーカー",
    },
    "13411": {
        en: "Sian",
        ja: "シアン",
    },
    "13412": {
        en: "Jojo",
        ja: "ジョジョ",
    },
    "13413": {
        en: "Lushen",
        ja: "ルシェン",
    },
    "13414": {
        en: "Figaro",
        ja: "フィガロ",
    },
    "13415": {
        en: "Liebli",
        ja: "リブリ",
    },

    "135": {
        en: "Ninja",
        ja: "忍者",
    },
    "13511": {
        en: "Susano",
        ja: "スサノ",
    },
    "13512": {
        en: "Garo",
        ja: "ガロ",
    },
    "13513": {
        en: "Orochi",
        ja: "オロチ",
    },
    "13514": {
        en: "Gin",
        ja: "ジン",
    },
    "13515": {
        en: "Han",
        ja: "ハン",
    },

    "136": {
        en: "Surprise Box",
        ja: "サプライズボックス",
    },
    "13611": {
        en: "",
        ja: "",
    },
    "13612": {
        en: "",
        ja: "",
    },
    "13613": {
        en: "",
        ja: "",
    },
    "13614": {
        en: "",
        ja: "",
    },
    "13615": {
        en: "",
        ja: "",
    },

    "137": {
        en: "Bearman",
        ja: "ベアマン",
    },
    "13711": {
        en: "Gruda",
        ja: "グルダ",
    },
    "13712": {
        en: "Kungen",
        ja: "クンゲン",
    },
    "13713": {
        en: "Dagorr",
        ja: "ダゴル",
    },
    "13714": {
        en: "Ahman",
        ja: "アーマン",
    },
    "13715": {
        en: "Haken",
        ja: "ハーケン",
    },

    "138": {
        en: "Valkyrja",
        ja: "",
    },
    "13811": {
        en: "Camilla",
        ja: "",
    },
    "13812": {
        en: "Vanessa",
        ja: "",
    },
    "13813": {
        en: "Katarina",
        ja: "",
    },
    "13814": {
        en: "Akroma",
        ja: "",
    },
    "13815": {
        en: "Trinity",
        ja: "",
    },

    "139": {
        en: "Pierret",
        ja: "",
    },
    "13911": {
        en: "Julie",
        ja: "",
    },
    "13912": {
        en: "Clara",
        ja: "",
    },
    "13913": {
        en: "Sophia",
        ja: "",
    },
    "13914": {
        en: "Eva",
        ja: "",
    },
    "13915": {
        en: "Luna",
        ja: "",
    },

    "140": {
        en: "Werewolf",
        ja: "",
    },
    "14011": {
        en: "Vigor",
        ja: "",
    },
    "14012": {
        en: "Garoche",
        ja: "",
    },
    "14013": {
        en: "Shakan",
        ja: "",
    },
    "14014": {
        en: "Eshir",
        ja: "",
    },
    "14015": {
        en: "Jultan",
        ja: "",
    },
    "14031": {
        en: "Vigor",
        ja: "",
    },
    "14032": {
        en: "Garoche",
        ja: "",
    },
    "14033": {
        en: "Shakan",
        ja: "",
    },
    "14034": {
        en: "Eshir",
        ja: "",
    },
    "14035": {
        en: "Jultan",
        ja: "",
    },

    "141": {
        en: "Phantom Thief",
        ja: "",
    },
    "14111": {
        en: "Luer",
        ja: "",
    },
    "14112": {
        en: "Jean",
        ja: "",
    },
    "14113": {
        en: "Julien",
        ja: "",
    },
    "14114": {
        en: "Louis",
        ja: "",
    },
    "14115": {
        en: "Guillaume",
        ja: "",
    },

    "142": {
        en: "Angelmon",
        ja: "",
    },
    "14211": {
        en: "Blue Angelmon",
        ja: "",
    },
    "14212": {
        en: "Red Angelmon",
        ja: "",
    },
    "14213": {
        en: "Gold Angelmon",
        ja: "",
    },
    "14214": {
        en: "White Angelmon",
        ja: "",
    },
    "14215": {
        en: "Dark Angelmon",
        ja: "",
    },

    "144": {
        en: "Dragon",
        ja: "",
    },
    "14411": {
        en: "Verad",
        ja: "",
    },
    "14412": {
        en: "Zaiross",
        ja: "",
    },
    "14413": {
        en: "Jamire",
        ja: "",
    },
    "14414": {
        en: "Zerath",
        ja: "",
    },
    "14415": {
        en: "Grogen",
        ja: "",
    },

    "145": {
        en: "Phoenix",
        ja: "",
    },
    "14511": {
        en: "Sigmarus",
        ja: "",
    },
    "14512": {
        en: "Perna",
        ja: "",
    },
    "14513": {
        en: "Teshar",
        ja: "",
    },
    "14514": {
        en: "Eludia",
        ja: "",
    },
    "14515": {
        en: "Jaara",
        ja: "",
    },

    "146": {
        en: "Chimera",
        ja: "",
    },
    "14611": {
        en: "Taor",
        ja: "",
    },
    "14612": {
        en: "Rakan",
        ja: "",
    },
    "14613": {
        en: "Lagmaron",
        ja: "",
    },
    "14614": {
        en: "Shan",
        ja: "",
    },
    "14615": {
        en: "Zeratu",
        ja: "",
    },

    "147": {
        en: "Vampire",
        ja: "",
    },
    "14711": {
        en: "Liesel",
        ja: "",
    },
    "14712": {
        en: "Verdehile",
        ja: "",
    },
    "14713": {
        en: "Argen",
        ja: "",
    },
    "14714": {
        en: "Julianne",
        ja: "",
    },
    "14715": {
        en: "Cadiz",
        ja: "",
    },

    "148": {
        en: "Viking",
        ja: "",
    },
    "14811": {
        en: "Huga",
        ja: "",
    },
    "14812": {
        en: "Geoffrey",
        ja: "",
    },
    "14813": {
        en: "Walter",
        ja: "",
    },
    "14814": {
        en: "Jansson",
        ja: "",
    },
    "14815": {
        en: "Janssen",
        ja: "",
    },

    "149": {
        en: "Amazon",
        ja: "",
    },
    "14911": {
        en: "Ellin",
        ja: "",
    },
    "14912": {
        en: "Ceres",
        ja: "",
    },
    "14913": {
        en: "Hina",
        ja: "",
    },
    "14914": {
        en: "Lyn",
        ja: "",
    },
    "14915": {
        en: "Mara",
        ja: "",
    },

    "150": {
        en: "Martial Cat",
        ja: "",
    },
    "15011": {
        en: "Mina",
        ja: "",
    },
    "15012": {
        en: "Mei",
        ja: "",
    },
    "15013": {
        en: "Naomi",
        ja: "",
    },
    "15014": {
        en: "Xiao Ling",
        ja: "",
    },
    "15015": {
        en: "Miho",
        ja: "",
    },

    "152": {
        en: "Vagabond",
        ja: "",
    },
    "15211": {
        en: "Allen",
        ja: "",
    },
    "15212": {
        en: "Kai'en",
        ja: "",
    },
    "15213": {
        en: "Roid",
        ja: "",
    },
    "15214": {
        en: "Darion",
        ja: "",
    },
    "15215": {
        en: "Jubelle",
        ja: "",
    },

    "153": {
        en: "Epikion Priest",
        ja: "",
    },
    "15311": {
        en: "Rina",
        ja: "",
    },
    "15312": {
        en: "Chloe",
        ja: "",
    },
    "15313": {
        en: "Michelle",
        ja: "",
    },
    "15314": {
        en: "Iona",
        ja: "",
    },
    "15315": {
        en: "Rasheed",
        ja: "",
    },

    "154": {
        en: "Magical Archer",
        ja: "",
    },
    "15411": {
        en: "Sharron",
        ja: "",
    },
    "15412": {
        en: "Cassandra",
        ja: "",
    },
    "15413": {
        en: "Ardella",
        ja: "",
    },
    "15414": {
        en: "Chris",
        ja: "",
    },
    "15415": {
        en: "Bethony",
        ja: "",
    },

    "155": {
        en: "Rakshasa",
        ja: "",
    },
    "15511": {
        en: "Su",
        ja: "",
    },
    "15512": {
        en: "Hwa",
        ja: "",
    },
    "15513": {
        en: "Yen",
        ja: "",
    },
    "15514": {
        en: "Pang",
        ja: "",
    },
    "15515": {
        en: "Ran",
        ja: "",
    },

    "156": {
        en: "Bounty Hunter",
        ja: "",
    },
    "15611": {
        en: "Wayne",
        ja: "",
    },
    "15612": {
        en: "Randy",
        ja: "",
    },
    "15613": {
        en: "Roger",
        ja: "",
    },
    "15614": {
        en: "Walkers",
        ja: "",
    },
    "15615": {
        en: "Jamie",
        ja: "",
    },

    "157": {
        en: "Oracle",
        ja: "",
    },
    "15711": {
        en: "Praha",
        ja: "",
    },
    "15712": {
        en: "Juno",
        ja: "",
    },
    "15713": {
        en: "Seara",
        ja: "",
    },
    "15714": {
        en: "Laima",
        ja: "",
    },
    "15715": {
        en: "Giana",
        ja: "",
    },

    "158": {
        en: "Imp Champion",
        ja: "",
    },
    "15811": {
        en: "Yaku",
        ja: "",
    },
    "15812": {
        en: "Fairo",
        ja: "",
    },
    "15813": {
        en: "Pigma",
        ja: "",
    },
    "15814": {
        en: "Shaffron",
        ja: "",
    },
    "15815": {
        en: "Loque",
        ja: "",
    },

    "159": {
        en: "Mystic Witch",
        ja: "",
    },
    "15911": {
        en: "Megan",
        ja: "",
    },
    "15912": {
        en: "Rebecca",
        ja: "",
    },
    "15913": {
        en: "Silia",
        ja: "",
    },
    "15914": {
        en: "Linda",
        ja: "",
    },
    "15915": {
        en: "Gina",
        ja: "",
    },

    "160": {
        en: "Grim Reaper",
        ja: "",
    },
    "16011": {
        en: "Hemos",
        ja: "",
    },
    "16012": {
        en: "Sath",
        ja: "",
    },
    "16013": {
        en: "Hiva",
        ja: "",
    },
    "16014": {
        en: "Prom",
        ja: "",
    },
    "16015": {
        en: "Thrain",
        ja: "",
    },

    "161": {
        en: "Occult Girl",
        ja: "",
    },
    "16111": {
        en: "Anavel",
        ja: "",
    },
    "16112": {
        en: "Rica",
        ja: "",
    },
    "16113": {
        en: "Charlotte",
        ja: "",
    },
    "16114": {
        en: "Lora",
        ja: "",
    },
    "16115": {
        en: "Nicki",
        ja: "",
    },

    "162": {
        en: "Death Knight",
        ja: "",
    },
    "16211": {
        en: "Fedora",
        ja: "",
    },
    "16212": {
        en: "Arnold",
        ja: "",
    },
    "16213": {
        en: "Briand",
        ja: "",
    },
    "16214": {
        en: "Conrad",
        ja: "",
    },
    "16215": {
        en: "Dias",
        ja: "",
    },

    "163": {
        en: "Lich",
        ja: "",
    },
    "16311": {
        en: "Rigel",
        ja: "",
    },
    "16312": {
        en: "Antares",
        ja: "",
    },
    "16313": {
        en: "Fuco",
        ja: "",
    },
    "16314": {
        en: "Halphas",
        ja: "",
    },
    "16315": {
        en: "Grego",
        ja: "",
    },

    "164": {
        en: "Skull Soldier",
        ja: "",
    },
    "16411": {
        en: "",
        ja: "",
    },
    "16412": {
        en: "",
        ja: "",
    },
    "16413": {
        en: "",
        ja: "",
    },
    "16414": {
        en: "",
        ja: "",
    },
    "16415": {
        en: "",
        ja: "",
    },

    "165": {
        en: "Living Armor",
        ja: "",
    },
    "16511": {
        en: "Nickel",
        ja: "",
    },
    "16512": {
        en: "Iron",
        ja: "",
    },
    "16513": {
        en: "Copper",
        ja: "",
    },
    "16514": {
        en: "Silver",
        ja: "",
    },
    "16515": {
        en: "Zinc",
        ja: "",
    },

    "166": {
        en: "Dragon Knight",
        ja: "",
    },
    "16611": {
        en: "Chow",
        ja: "",
    },
    "16612": {
        en: "Laika",
        ja: "",
    },
    "16613": {
        en: "Leo",
        ja: "",
    },
    "16614": {
        en: "Jager",
        ja: "",
    },
    "16615": {
        en: "Ragdoll",
        ja: "",
    },

    "167": {
        en: "Magical Archer Promo",
        ja: "",
    },
    "16711": {
        en: "",
        ja: "",
    },
    "16712": {
        en: "",
        ja: "",
    },
    "16713": {
        en: "",
        ja: "",
    },
    "16714": {
        en: "Fami",
        ja: "",
    },
    "16715": {
        en: "",
        ja: "",
    },

    "168": {
        en: "Monkey King",
        ja: "",
    },
    "16811": {
        en: "Shi Hou",
        ja: "",
    },
    "16812": {
        en: "Mei Hou Wang",
        ja: "",
    },
    "16813": {
        en: "Xing Zhe",
        ja: "",
    },
    "16814": {
        en: "Qitian Dasheng",
        ja: "",
    },
    "16815": {
        en: "Son Zhang Lao",
        ja: "",
    },

    "169": {
        en: "Samurai",
        ja: "",
    },
    "16911": {
        en: "Kaz",
        ja: "",
    },
    "16912": {
        en: "Jun",
        ja: "",
    },
    "16913": {
        en: "Kaito",
        ja: "",
    },
    "16914": {
        en: "Tosi",
        ja: "",
    },
    "16915": {
        en: "Sige",
        ja: "",
    },

    "170": {
        en: "Archangel",
        ja: "",
    },
    "17011": {
        en: "Ariel",
        ja: "",
    },
    "17012": {
        en: "Velajuel",
        ja: "",
    },
    "17013": {
        en: "Eladriel",
        ja: "",
    },
    "17014": {
        en: "Artamiel",
        ja: "",
    },
    "17015": {
        en: "Fermion",
        ja: "",
    },

    "172": {
        en: "Drunken Master",
        ja: "",
    },
    "17211": {
        en: "Mao",
        ja: "",
    },
    "17212": {
        en: "Xiao Chun",
        ja: "",
    },
    "17213": {
        en: "Huan",
        ja: "",
    },
    "17214": {
        en: "Tien Qin",
        ja: "",
    },
    "17215": {
        en: "Wei Shin",
        ja: "",
    },

    "173": {
        en: "Kung Fu Girl",
        ja: "",
    },
    "17311": {
        en: "Xiao Lin",
        ja: "",
    },
    "17312": {
        en: "Hong Hua",
        ja: "",
    },
    "17313": {
        en: "Ling Ling",
        ja: "",
    },
    "17314": {
        en: "Liu Mei",
        ja: "",
    },
    "17315": {
        en: "Fei",
        ja: "",
    },

    "174": {
        en: "Beast Monk",
        ja: "",
    },
    "17411": {
        en: "Chandra",
        ja: "",
    },
    "17412": {
        en: "Kumar",
        ja: "",
    },
    "17413": {
        en: "Ritesh",
        ja: "",
    },
    "17414": {
        en: "Shazam",
        ja: "",
    },
    "17415": {
        en: "Rahul",
        ja: "",
    },

    "175": {
        en: "Mischievous Bat",
        ja: "",
    },
    "17511": {
        en: "",
        ja: "",
    },
    "17512": {
        en: "",
        ja: "",
    },
    "17513": {
        en: "",
        ja: "",
    },
    "17514": {
        en: "",
        ja: "",
    },
    "17515": {
        en: "",
        ja: "",
    },

    "176": {
        en: "Battle Scorpion",
        ja: "",
    },
    "17611": {
        en: "",
        ja: "",
    },
    "17612": {
        en: "",
        ja: "",
    },
    "17613": {
        en: "",
        ja: "",
    },
    "17614": {
        en: "",
        ja: "",
    },
    "17615": {
        en: "",
        ja: "",
    },

    "177": {
        en: "Minotauros",
        ja: "",
    },
    "17711": {
        en: "Urtau",
        ja: "",
    },
    "17712": {
        en: "Burentau",
        ja: "",
    },
    "17713": {
        en: "Eintau",
        ja: "",
    },
    "17714": {
        en: "Grotau",
        ja: "",
    },
    "17715": {
        en: "Kamatau",
        ja: "",
    },

    "178": {
        en: "Lizardman",
        ja: "",
    },
    "17811": {
        en: "Kernodon",
        ja: "",
    },
    "17812": {
        en: "Igmanodon",
        ja: "",
    },
    "17813": {
        en: "Velfinodon",
        ja: "",
    },
    "17814": {
        en: "Glinodon",
        ja: "",
    },
    "17815": {
        en: "Devinodon",
        ja: "",
    },

    "179": {
        en: "Hell Lady",
        ja: "",
    },
    "17911": {
        en: "Beth",
        ja: "",
    },
    "17912": {
        en: "Raki",
        ja: "",
    },
    "17913": {
        en: "Ethna",
        ja: "",
    },
    "17914": {
        en: "Asima",
        ja: "",
    },
    "17915": {
        en: "Craka",
        ja: "",
    },

    "180": {
        en: "Brownie Magician",
        ja: "",
    },
    "18011": {
        en: "Orion",
        ja: "",
    },
    "18012": {
        en: "Draco",
        ja: "",
    },
    "18013": {
        en: "Aquila",
        ja: "",
    },
    "18014": {
        en: "Gemini",
        ja: "",
    },
    "18015": {
        en: "Korona",
        ja: "",
    },

    "181": {
        en: "Kobold Bomber",
        ja: "",
    },
    "18111": {
        en: "Malaka",
        ja: "",
    },
    "18112": {
        en: "Zibrolta",
        ja: "",
    },
    "18113": {
        en: "Taurus",
        ja: "",
    },
    "18114": {
        en: "Dover",
        ja: "",
    },
    "18115": {
        en: "Bering",
        ja: "",
    },

    "182": {
        en: "King Angelmon",
        ja: "",
    },
    "18211": {
        en: "Blue King Angelmon",
        ja: "",
    },
    "18212": {
        en: "Red King Angelmon",
        ja: "",
    },
    "18213": {
        en: "Gold King Angelmon",
        ja: "",
    },
    "18214": {
        en: "White King Angelmon",
        ja: "",
    },
    "18215": {
        en: "Dark King Angelmon",
        ja: "",
    },

    "183": {
        en: "Sky Dancer",
        ja: "",
    },
    "18311": {
        en: "Mihyang",
        ja: "",
    },
    "18312": {
        en: "Hwahee",
        ja: "",
    },
    "18313": {
        en: "Chasun",
        ja: "",
    },
    "18314": {
        en: "Yeonhong",
        ja: "",
    },
    "18315": {
        en: "Wolyung",
        ja: "",
    },

    "184": {
        en: "Taoist",
        ja: "",
    },
    "18411": {
        en: "Gildong",
        ja: "",
    },
    "18412": {
        en: "Gunpyeong",
        ja: "",
    },
    "18413": {
        en: "Woochi",
        ja: "",
    },
    "18414": {
        en: "Hwadam",
        ja: "",
    },
    "18415": {
        en: "Woonhak",
        ja: "",
    },

    "185": {
        en: "Beast Hunter",
        ja: "",
    },
    "18511": {
        en: "Gangchun",
        ja: "",
    },
    "18512": {
        en: "Nangrim",
        ja: "",
    },
    "18513": {
        en: "Suri",
        ja: "",
    },
    "18514": {
        en: "Baekdu",
        ja: "",
    },
    "18515": {
        en: "Hannam",
        ja: "",
    },

    "186": {
        en: "Pioneer",
        ja: "",
    },
    "18611": {
        en: "Woosa",
        ja: "",
    },
    "18612": {
        en: "Chiwu",
        ja: "",
    },
    "18613": {
        en: "Pungbaek",
        ja: "",
    },
    "18614": {
        en: "Nigong",
        ja: "",
    },
    "18615": {
        en: "Woonsa",
        ja: "",
    },

    "187": {
        en: "Penguin Knight",
        ja: "",
    },
    "18711": {
        en: "Toma",
        ja: "",
    },
    "18712": {
        en: "Naki",
        ja: "",
    },
    "18713": {
        en: "Mav",
        ja: "",
    },
    "18714": {
        en: "Dona",
        ja: "",
    },
    "18715": {
        en: "Kuna",
        ja: "",
    },

    "188": {
        en: "Barbaric King",
        ja: "",
    },
    "18811": {
        en: "Aegir",
        ja: "",
    },
    "18812": {
        en: "Surtr",
        ja: "",
    },
    "18813": {
        en: "Hraesvelg",
        ja: "",
    },
    "18814": {
        en: "Mimirr",
        ja: "",
    },
    "18815": {
        en: "Hrungnir",
        ja: "",
    },

    "189": {
        en: "Polar Queen",
        ja: "",
    },
    "18911": {
        en: "Alicia",
        ja: "",
    },
    "18912": {
        en: "Brandia",
        ja: "",
    },
    "18913": {
        en: "Tiana",
        ja: "",
    },
    "18914": {
        en: "Elenoa",
        ja: "",
    },
    "18915": {
        en: "Lydia",
        ja: "",
    },

    "190": {
        en: "Battle Mammoth",
        ja: "",
    },
    "19011": {
        en: "Talc",
        ja: "",
    },
    "19012": {
        en: "Granite",
        ja: "",
    },
    "19013": {
        en: "Olivine",
        ja: "",
    },
    "19014": {
        en: "Marble",
        ja: "",
    },
    "19015": {
        en: "Basalt",
        ja: "",
    },

    "191": {
        en: "Fairy Queen",
        ja: "",
    },
    "19111": {
        en: "",
        ja: "",
    },
    "19112": {
        en: "",
        ja: "",
    },
    "19113": {
        en: "",
        ja: "",
    },
    "19114": {
        en: "Fran",
        ja: "",
    },
    "19115": {
        en: "",
        ja: "",
    },

    "192": {
        en: "Ifrit",
        ja: "",
    },
    "19211": {
        en: "Theomars",
        ja: "",
    },
    "19212": {
        en: "Tesarion",
        ja: "",
    },
    "19213": {
        en: "Akhamamir",
        ja: "",
    },
    "19214": {
        en: "Elsharion",
        ja: "",
    },
    "19215": {
        en: "Veromos",
        ja: "",
    },

    "193": {
        en: "Cow Girl",
        ja: "",
    },
    "19311": {
        en: "Sera",
        ja: "",
    },
    "19312": {
        en: "Anne",
        ja: "",
    },
    "19313": {
        en: "Hannah",
        ja: "",
    },
    "19314": {
        en: "Loren",
        ja: "",
    },
    "19315": {
        en: "Cassie",
        ja: "",
    },

    "194": {
        en: "Pirate Captain",
        ja: "",
    },
    "19411": {
        en: "Galleon",
        ja: "",
    },
    "19412": {
        en: "Carrack",
        ja: "",
    },
    "19413": {
        en: "Barque",
        ja: "",
    },
    "19414": {
        en: "Brig",
        ja: "",
    },
    "19415": {
        en: "Frigate",
        ja: "",
    },

    "195": {
        en: "Charger Shark",
        ja: "",
    },
    "19511": {
        en: "Aqcus",
        ja: "",
    },
    "19512": {
        en: "Ignicus",
        ja: "",
    },
    "19513": {
        en: "Zephicus",
        ja: "",
    },
    "19514": {
        en: "Rumicus",
        ja: "",
    },
    "19515": {
        en: "Calicus",
        ja: "",
    },

    "196": {
        en: "Mermaid",
        ja: "",
    },
    "19611": {
        en: "Tetra",
        ja: "",
    },
    "19612": {
        en: "Platy",
        ja: "",
    },
    "19613": {
        en: "Cichlid",
        ja: "",
    },
    "19614": {
        en: "Molly",
        ja: "",
    },
    "19615": {
        en: "Betta",
        ja: "",
    },

    "197": {
        en: "Sea Emperor",
        ja: "",
    },
    "19711": {
        en: "Poseidon",
        ja: "",
    },
    "19712": {
        en: "Okeanos",
        ja: "",
    },
    "19713": {
        en: "Triton",
        ja: "",
    },
    "19714": {
        en: "Pontos",
        ja: "",
    },
    "19715": {
        en: "Manannan",
        ja: "",
    },

    "198": {
        en: "Magic Knight",
        ja: "",
    },
    "19811": {
        en: "Lapis",
        ja: "",
    },
    "19812": {
        en: "Astar",
        ja: "",
    },
    "19813": {
        en: "Lupinus",
        ja: "",
    },
    "19814": {
        en: "Iris",
        ja: "",
    },
    "19815": {
        en: "Lanett",
        ja: "",
    },

    "199": {
        en: "Assassin",
        ja: "",
    },
    "19911": {
        en: "Stella",
        ja: "",
    },
    "19912": {
        en: "Lexy",
        ja: "",
    },
    "19913": {
        en: "Tanya",
        ja: "",
    },
    "19914": {
        en: "Natalie",
        ja: "",
    },
    "19915": {
        en: "Isabelle",
        ja: "",
    },

    "200": {
        en: "Neostone Fighter",
        ja: "",
    },
    "20011": {
        en: "Ryan",
        ja: "",
    },
    "20012": {
        en: "Trevor",
        ja: "",
    },
    "20013": {
        en: "Logan",
        ja: "",
    },
    "20014": {
        en: "Lucas",
        ja: "",
    },
    "20015": {
        en: "Karl",
        ja: "",
    },

    "201": {
        en: "Neostone Agent",
        ja: "",
    },
    "20111": {
        en: "Emma",
        ja: "",
    },
    "20112": {
        en: "Lisa",
        ja: "",
    },
    "20113": {
        en: "Olivia",
        ja: "",
    },
    "20114": {
        en: "Illiana",
        ja: "",
    },
    "20115": {
        en: "Sylvia",
        ja: "",
    },

    "202": {
        en: "Martial Artist",
        ja: "",
    },
    "20211": {
        en: "Luan",
        ja: "",
    },
    "20212": {
        en: "Sin",
        ja: "",
    },
    "20213": {
        en: "Lo",
        ja: "",
    },
    "20214": {
        en: "Hiro",
        ja: "",
    },
    "20215": {
        en: "Jackie",
        ja: "",
    },

    "203": {
        en: "Mummy",
        ja: "",
    },
    "20311": {
        en: "Nubia",
        ja: "",
    },
    "20312": {
        en: "Sonora",
        ja: "",
    },
    "20313": {
        en: "Namib",
        ja: "",
    },
    "20314": {
        en: "Sahara",
        ja: "",
    },
    "20315": {
        en: "Karakum",
        ja: "",
    },

    "204": {
        en: "Anubis",
        ja: "",
    },
    "20411": {
        en: "Avaris",
        ja: "",
    },
    "20412": {
        en: "Khmun",
        ja: "",
    },
    "20413": {
        en: "Iunu",
        ja: "",
    },
    "20414": {
        en: "Amarna",
        ja: "",
    },
    "20415": {
        en: "Thebae",
        ja: "",
    },

    "205": {
        en: "Desert Queen",
        ja: "",
    },
    "20511": {
        en: "Bastet",
        ja: "",
    },
    "20512": {
        en: "Sekhmet",
        ja: "",
    },
    "20513": {
        en: "Hathor",
        ja: "",
    },
    "20514": {
        en: "Isis",
        ja: "",
    },
    "20515": {
        en: "Nephthys",
        ja: "",
    },

    "206": {
        en: "Horus",
        ja: "",
    },
    "20611": {
        en: "Qebehsenuef",
        ja: "",
    },
    "20612": {
        en: "Duamutef",
        ja: "",
    },
    "20613": {
        en: "Imesety",
        ja: "",
    },
    "20614": {
        en: "Wedjat",
        ja: "",
    },
    "20615": {
        en: "Amduat",
        ja: "",
    },

    "207": {
        en: "Jack-o'-lantern",
        ja: "",
    },
    "20711": {
        en: "Chilling",
        ja: "",
    },
    "20712": {
        en: "Smokey",
        ja: "",
    },
    "20713": {
        en: "Windy",
        ja: "",
    },
    "20714": {
        en: "Misty",
        ja: "",
    },
    "20715": {
        en: "Dusky",
        ja: "",
    },

    "208": {
        en: "Frankenstein",
        ja: "",
    },
    "20811": {
        en: "Tractor",
        ja: "",
    },
    "20812": {
        en: "Bulldozer",
        ja: "",
    },
    "20813": {
        en: "Crane",
        ja: "",
    },
    "20814": {
        en: "Driller",
        ja: "",
    },
    "20815": {
        en: "Crawler",
        ja: "",
    },

    "209": {
        en: "Elven Ranger",
        ja: "",
    },
    "20911": {
        en: "Eluin",
        ja: "",
    },
    "20912": {
        en: "Adrian",
        ja: "",
    },
    "20913": {
        en: "Erwin",
        ja: "",
    },
    "20914": {
        en: "Lucien",
        ja: "",
    },
    "20915": {
        en: "Isillen",
        ja: "",
    },

    "210": {
        en: "Harg",
        ja: "",
    },
    "21011": {
        en: "Remy",
        ja: "",
    },
    "21012": {
        en: "Racuni",
        ja: "",
    },
    "21013": {
        en: "Raviti",
        ja: "",
    },
    "21014": {
        en: "Dova",
        ja: "",
    },
    "21015": {
        en: "Kroa",
        ja: "",
    },

    "211": {
        en: "Fairy King",
        ja: "",
    },
    "21111": {
        en: "Psamathe",
        ja: "",
    },
    "21112": {
        en: "Daphnis",
        ja: "",
    },
    "21113": {
        en: "Ganymede",
        ja: "",
    },
    "21114": {
        en: "Oberon",
        ja: "",
    },
    "21115": {
        en: "Nyx",
        ja: "",
    },

    "212": {
        en: "Panda Warrior",
        ja: "",
    },
    "21211": {
        en: "Mo Long",
        ja: "",
    },
    "21212": {
        en: "Xiong Fei",
        ja: "",
    },
    "21213": {
        en: "Feng Yan",
        ja: "",
    },
    "21214": {
        en: "Tian Lang",
        ja: "",
    },
    "21215": {
        en: "Mi Ying",
        ja: "",
    },

    "213": {
        en: "Dice Magician",
        ja: "",
    },
    "21311": {
        en: "Reno",
        ja: "",
    },
    "21312": {
        en: "Ludo",
        ja: "",
    },
    "21313": {
        en: "Morris",
        ja: "",
    },
    "21314": {
        en: "Tablo",
        ja: "",
    },
    "21315": {
        en: "Monte",
        ja: "",
    },

    "214": {
        en: "Harp Magician",
        ja: "",
    },
    "21411": {
        en: "Sonnet",
        ja: "",
    },
    "21412": {
        en: "Harmonia",
        ja: "",
    },
    "21413": {
        en: "Triana",
        ja: "",
    },
    "21414": {
        en: "Celia",
        ja: "",
    },
    "21415": {
        en: "Vivachel",
        ja: "",
    },

    "215": {
        en: "Unicorn",
        ja: "",
    },
    "21511": {
        en: "Amelia",
        ja: "",
    },
    "21512": {
        en: "Helena",
        ja: "",
    },
    "21513": {
        en: "Diana",
        ja: "",
    },
    "21514": {
        en: "Eleanor",
        ja: "",
    },
    "21515": {
        en: "Alexandra",
        ja: "",
    },
    "21611": {
        en: "Amelia",
        ja: "",
    },
    "21612": {
        en: "Helena",
        ja: "",
    },
    "21613": {
        en: "Diana",
        ja: "",
    },
    "21614": {
        en: "Eleanor",
        ja: "",
    },
    "21615": {
        en: "Alexandra",
        ja: "",
    },

    "218": {
        en: "Paladin",
        ja: "",
    },
    "21811": {
        en: "Josephine",
        ja: "",
    },
    "21812": {
        en: "Ophilia",
        ja: "",
    },
    "21813": {
        en: "Louise",
        ja: "",
    },
    "21814": {
        en: "Jeanne",
        ja: "",
    },
    "21815": {
        en: "Leona",
        ja: "",
    },

    "219": {
        en: "Chakram Dancer",
        ja: "",
    },
    "21911": {
        en: "Talia",
        ja: "",
    },
    "21912": {
        en: "Shaina",
        ja: "",
    },
    "21913": {
        en: "Melissa",
        ja: "",
    },
    "21914": {
        en: "Deva",
        ja: "",
    },
    "21915": {
        en: "Belita",
        ja: "",
    },

    "220": {
        en: "Boomerang Warrior",
        ja: "",
    },
    "22011": {
        en: "Sabrina",
        ja: "",
    },
    "22012": {
        en: "Maruna",
        ja: "",
    },
    "22013": {
        en: "Zenobia",
        ja: "",
    },
    "22014": {
        en: "Bailey",
        ja: "",
    },
    "22015": {
        en: "Martina",
        ja: "",
    },

    "15105": {
        en: "Devilmon",
        ja: "",
    },
    "14314": {
        en: "Rainbowmon",
        ja: "",
    },

    "1000111": {
        en: "Homunculus - Attack (Water)",
        ja: "",
    },
    "1000112": {
        en: "Homunculus - Attack (Fire)",
        ja: "",
    },
    "1000113": {
        en: "Homunculus - Attack (Wind)",
        ja: "",
    },

    "1000214": {
        en: "Homunculus - Support (Light)",
        ja: "",
    },
    "1000215": {
        en: "Homunculus - Support (Dark)",
        ja: "",
    },
};
