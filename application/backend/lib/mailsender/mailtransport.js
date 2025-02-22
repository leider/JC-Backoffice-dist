import * as nodemailer from "nodemailer";
import * as winston from "winston";
import conf from "jc-shared/commons/simpleConfigure.js";
import MailBodyRenderer from "./mailbodyRenderer.js";
const logger = winston.loggers.get("application");
const transport = nodemailer.createTransport(conf.transportOptions ?? {
    streamTransport: true,
});
// exported for testing
export function toTransportObject(mailMessage, isForDatev) {
    const mbRenderer = new MailBodyRenderer(mailMessage.body);
    const senderAddress = conf.senderAddress;
    const senderName = `${conf.senderName}${isForDatev ? " für Datev" : ""}`;
    const attachments = mailMessage.attachments ?? [];
    return {
        from: mailMessage.from ? mailMessage.from : { name: senderName, address: senderAddress },
        to: mailMessage.to ?? [conf.sender],
        bcc: mailMessage.bcc ?? [conf.sender],
        subject: mailMessage.subject,
        replyTo: mailMessage.replyTo,
        text: mbRenderer.text,
        html: mbRenderer.html,
        attachments,
    };
}
async function sendMail(message) {
    return sendMailInternal(message, false);
}
async function sendDatevMail(message) {
    return sendMailInternal(message, true);
}
async function sendMailInternal(mailMessage, isForDatev) {
    const transportObject = toTransportObject(mailMessage, isForDatev);
    if (conf.doNotSendMails) {
        const withoutAttachments = JSON.parse(JSON.stringify(transportObject));
        delete withoutAttachments.attachments;
        logger.info("MAILSENDING\n" + JSON.stringify(withoutAttachments, null, 2));
        delete transportObject.to;
        transportObject.bcc = conf.doNotSendMails;
    }
    try {
        return transport.sendMail(transportObject);
    }
    catch (e) {
        logger.error(e.stack);
        throw e;
    }
}
export default {
    sendMail,
    sendDatevMail,
};
