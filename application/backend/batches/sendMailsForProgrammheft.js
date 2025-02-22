import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import store from "../lib/programmheft/kalenderstore.js";
import mailtransport from "../lib/mailsender/mailtransport.js";
import MailMessage from "jc-shared/mail/mailMessage.js";
import userstore from "../lib/users/userstore.js";
import map from "lodash/map.js";
import filter from "lodash/filter.js";
export class EmailEvent {
    constructor(event) {
        this.event = event;
    }
    get datumUhrzeitToSend() {
        return this.start.minus({ tage: this.event.emailOffset });
    }
    shouldSendOn(datumUhrzeit) {
        return Math.abs(this.datumUhrzeitToSend.differenzInTagen(datumUhrzeit)) === 0;
    }
    get start() {
        return DatumUhrzeit.forISOString(this.event.start);
    }
    selectedUsers(allUsers) {
        return filter(allUsers, (user) => this.event?.users?.includes(user.id));
    }
    email(allUsers) {
        return map(this.selectedUsers(allUsers), "email");
    }
    names(allUsers) {
        return map(this.selectedUsers(allUsers), "name").join(", ");
    }
    body(allUsers) {
        return `Hallo ${this.names(allUsers)},

hier eine automatische Erinnerungsmail:
${this.event.was}

Vielen Dank für Deine Arbeit und Unterstützung,
Damit alles reibungslos klappt, sollte dies bis zum ${this.start.tagMonatJahrLang} erledigt sein.

Danke & keep swingin'`;
    }
}
async function sendMail(eventsForToday) {
    const allUsers = userstore.allUsers();
    const messages = map(eventsForToday, (e) => {
        const message = new MailMessage({
            subject: "Programmheft Action Reminder",
        });
        message.body = e.body(allUsers);
        message.to = map(e.email(allUsers), (email) => ({ name: "", address: email ?? "" }));
        return message;
    });
    return Promise.all(map(messages, mailtransport.sendMail));
}
function eventsToSend(aDatumUhrzeit, events) {
    const result = map(filter(events, "users.length"), (e) => new EmailEvent(e));
    return filter(result, (emailEvent) => emailEvent.shouldSendOn(aDatumUhrzeit));
}
export async function remindForProgrammheft(now = new DatumUhrzeit()) {
    const current = store.getCurrentKalender(now);
    const next = store.getNextKalender(now);
    try {
        if (!current && !next) {
            return {};
        }
        return { result: await sendMail(eventsToSend(now, current?.events).concat(eventsToSend(now, next?.events))) };
    }
    catch (e) {
        return { error: e };
    }
}
