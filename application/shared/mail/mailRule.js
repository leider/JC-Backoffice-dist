import constant from "lodash/constant.js";
import keys from "lodash/keys.js";
class RuleLogicEmpty {
    constructor() {
        this.shouldSend = constant(false);
    }
    startAndEndDay(datumUhrzeit) {
        return { start: datumUhrzeit, end: datumUhrzeit };
    }
}
class RuleLogic1 {
    shouldSend(datumUhrzeit) {
        return datumUhrzeit.wochentag === 3;
    }
    startAndEndDay(datumUhrzeit) {
        if (!this.shouldSend(datumUhrzeit)) {
            return { start: datumUhrzeit, end: datumUhrzeit };
        }
        return {
            start: datumUhrzeit.plus({ tage: 5 }), // nächster Montag
            end: datumUhrzeit.plus({ tage: 11 }), // übernächster Sonntag
        };
    }
}
class RuleLogic2 {
    shouldSend(datumUhrzeit) {
        return datumUhrzeit.tag === 5;
    }
    startAndEndDay(datumUhrzeit) {
        if (!this.shouldSend(datumUhrzeit)) {
            return { start: datumUhrzeit, end: datumUhrzeit };
        }
        return {
            start: datumUhrzeit.plus({ monate: 1 }).setTag(1),
            end: datumUhrzeit.plus({ monate: 2 }).setTag(1).minus({ tage: 1 }),
        };
    }
}
class RuleLogic3 {
    shouldSend(datumUhrzeit) {
        return datumUhrzeit.tag === 5;
    }
    startAndEndDay(datumUhrzeit) {
        if (!this.shouldSend(datumUhrzeit)) {
            return { start: datumUhrzeit, end: datumUhrzeit };
        }
        return {
            start: datumUhrzeit.plus({ monate: 1 }).setTag(1),
            end: datumUhrzeit.plus({ monate: 3 }).setTag(1).minus({ tage: 1 }),
        };
    }
}
class RuleLogic4 {
    shouldSend(datumUhrzeit) {
        return datumUhrzeit.tag === 16;
    }
    startAndEndDay(datumUhrzeit) {
        if (!this.shouldSend(datumUhrzeit)) {
            return { start: datumUhrzeit, end: datumUhrzeit };
        }
        return {
            start: datumUhrzeit.plus({ monate: 1 }).setTag(15),
            end: datumUhrzeit.plus({ monate: 2 }).setTag(15),
        };
    }
}
class RuleLogic5 {
    shouldSend(datumUhrzeit) {
        return datumUhrzeit.wochentag === 1;
    }
    startAndEndDay(datumUhrzeit) {
        if (!this.shouldSend(datumUhrzeit)) {
            return { start: datumUhrzeit, end: datumUhrzeit };
        }
        return {
            start: datumUhrzeit.plus({ tage: 4 }),
            end: datumUhrzeit.plus({ tage: 11 }),
        };
    }
}
class RuleLogic6 {
    shouldSend(datumUhrzeit) {
        return datumUhrzeit.wochentag === 1;
    }
    startAndEndDay(datumUhrzeit) {
        if (!this.shouldSend(datumUhrzeit)) {
            return { start: datumUhrzeit, end: datumUhrzeit };
        }
        return {
            start: datumUhrzeit.plus({ tage: 14 }),
            end: datumUhrzeit.plus({ tage: 21 }),
        };
    }
}
const logicArray = {
    "": new RuleLogicEmpty(),
    "Mittwochs für die nächste Woche": new RuleLogic1(),
    "Am 5. den Folgemonat": new RuleLogic2(),
    "Am 5. zwei Folgemonate": new RuleLogic3(),
    "Am 16. den Folgemonat ab 15.": new RuleLogic4(),
    "Montags die Folgewoche ab Freitag": new RuleLogic5(),
    "Montags die übernächste Folgewoche": new RuleLogic6(),
};
export const allMailrules = keys(logicArray);
export default class MailRule {
    static fromJSON(object) {
        return new MailRule(object);
    }
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any*/
    toJSON() {
        return Object.assign({}, this);
    }
    constructor(object) {
        this.id = "";
        this.name = "";
        this.email = "";
        this.rule = "";
        if (object) {
            Object.assign(this, object);
        }
        this.updateId();
    }
    updateId() {
        if (!this.id) {
            this.id = encodeURIComponent(this.name + this.email + this.rule);
        }
    }
    rules() {
        return allMailrules;
    }
    subject(datumUhrzeit) {
        const startAndEnd = this.startAndEndDay(datumUhrzeit);
        const startKW = startAndEnd.start.kw;
        const endKW = startAndEnd.end.kw;
        return "[Jazzclub Karlsruhe] KW " + startKW + " bis " + endKW;
    }
    shouldSendUntil(now, other) {
        let day = now;
        const end = other.plus({ tage: 1 });
        while (day.istVor(end)) {
            if (this.shouldSend(day)) {
                return true;
            }
            day = day.plus({ tage: 1 });
        }
        return false;
    }
    logic() {
        return logicArray[this.rule] || new RuleLogicEmpty();
    }
    shouldSend(datumUhrzeit) {
        return this.logic().shouldSend(datumUhrzeit);
    }
    startAndEndDay(datumUhrzeit) {
        return this.logic().startAndEndDay(datumUhrzeit);
    }
}
