import map from "lodash/map.js";
export default class MailMessage {
    constructor({ subject }) {
        this.body = ""; // can be markdown
        this.subject = subject;
        this.attachments = [];
        return this;
    }
    static forJsonAndUser({ subject, body, bcc }, user) {
        const message = new MailMessage({ subject });
        message.body = body;
        message.bcc = bcc;
        message.replyTo = MailMessage.formatEMailAddress(user.name, user.email);
        return message;
    }
    static formatEMailAddress(name, email) {
        return { name, address: email };
    }
    static formatEMailAddressCommaSeparated(nameWithCommas, emailWithCommas) {
        const names = nameWithCommas.split(",");
        const emails = emailWithCommas.split(",");
        return map(names, (name, index) => ({ name: name, address: emails[index] }));
    }
    attach(attachment) {
        this.attachments.push(attachment);
    }
}
