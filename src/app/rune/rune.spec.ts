import { Rune } from 'src/app/rune/rune';

describe('score-test', () => {

    it('+0強化 / 接頭: HP+200 / サブオプなし', function() {
        const rune = Object.assign(new Rune(), {
            set_id: 1,
            slot_no: 1,
            pri_eff: [1, 1],
            prefix_eff: [1, 200],
            sec_eff: [],
            upgrade_curr: 0,
        });
        expect(rune.score).toBe(rune.calc(1, 200));
        //速度・クリ率・クリダメ・HP%
        expect(rune.potentialScore1).toBe(
            rune.calc(1, 200)
            + rune.calc(8, 6)
            + rune.calc(9, 6)
            + rune.calc(10, 7)
            + rune.calc(2, 8)
        );
        //速度・クリ率・クリダメ・HP%（練磨）
        expect(rune.potentialScore2).toBe(
            rune.calc(1, 200)
            + rune.calc(8, 6)
            + rune.calc(9, 6)
            + rune.calc(10, 7)
            + rune.calc(2, 8 + 10)
        );
        //速度・クリ率・攻撃%（ジェム練磨）・HP%（練磨）
        expect(rune.potentialScore3).toBe(
            rune.calc(1, 200)
            + rune.calc(8, 6)
            + rune.calc(9, 6)
            + rune.calc(4, 8 + 10)
            + rune.calc(2, 8 + 10)
        );
    });

    it('+9強化 / 接頭なし / サブオプ 攻撃%7, 速度5, クリ率4', function() {
        const rune = Object.assign(new Rune(), {
            set_id: 1,
            slot_no: 1,
            pri_eff: [1, 1],
            prefix_eff: [0, 0],
            sec_eff: [[4, 7, 0, 0], [8, 5, 0, 0], [9, 4, 0, 0]],
            upgrade_curr: 9,
        });
        const expScore = rune.calc(4, 7) + rune.calc(8, 5) + rune.calc(9, 4);
        expect(rune.score).toBe(expScore);
        //クリダメが追加される
        expect(rune.potentialScore1).toBe(expScore + rune.calc(10, 7));
        //体力%が追加され、攻撃%, 速度%, 体力%が練磨される
        expect(rune.potentialScore2).toBe(expScore + rune.calc(2, 18) + rune.calc(8, 5) + rune.calc(4, 10));
        //攻撃%がジェム・練磨される
        expect(rune.potentialScore3).toBe(expScore + rune.calc(2, 18) + rune.calc(8, 5) + rune.calc(4, 10 + (13 - 7)));
    });

});
