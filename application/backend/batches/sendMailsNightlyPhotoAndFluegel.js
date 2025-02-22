import { loggers } from "winston";
import conf from "jc-shared/commons/simpleConfigure.js";
import mailtransport from "../lib/mailsender/mailtransport.js";
import usersService from "../lib/users/usersService.js";
import { byDateRangeInAscendingOrder } from "./gigAndRentService.js";
import MailMessage from "jc-shared/mail/mailMessage.js";
import formatMailAddresses from "jc-shared/mail/formatMailAddresses.js";
import map from "lodash/map.js";
const logger = loggers.get("application");
async function sendMail(stuffToSend, variables) {
    const markdownToSend = `${variables.firstLine}

---
${map(stuffToSend, (veranst) => veranst.kopf.titelMitPrefix + " am " + veranst.datumForDisplayShort + " " + veranst.kopf.presseInEcht).join("\n\n---\n")}`;
    const message = new MailMessage({
        subject: variables.subject,
    });
    message.body = markdownToSend;
    const adminAddresses = usersService.emailsAllerAdmins();
    logger.debug(`Email Adressen für ${variables.subject}: ${formatMailAddresses(adminAddresses)}`);
    message.to = [MailMessage.formatEMailAddress(variables.name, variables.email)];
    message.bcc = adminAddresses;
    return mailtransport.sendMail(message);
}
async function checkForFilter(filterFunction, variables, now) {
    if (now.wochentag !== 0) {
        // Sonntag
        return {};
    }
    if (!variables.name || !variables.email) {
        return {};
    }
    const start = now;
    const end = start.plus({ wochen: 6 }); // Sechs Wochen im Voraus
    const zuSendende = byDateRangeInAscendingOrder({
        from: start,
        to: end,
        konzerteFilter: filterFunction,
        vermietungenFilter: filterFunction,
    });
    if (zuSendende.length === 0) {
        return {};
    }
    try {
        return { result: await sendMail(zuSendende, variables) };
    }
    catch (error) {
        return { error: error };
    }
}
export async function checkFotograf(now) {
    const variables = {
        name: conf.fotografName,
        email: conf.fotografEmail,
        subject: "Photographing for Jazzclub",
        firstLine: "## The following concerts may profit from a professional photographer:",
    };
    return checkForFilter((ver) => {
        const satisfied = ver.kopf.fotografBestellen && ver.kopf.confirmed;
        if (ver.isVermietung) {
            return ver.brauchtPresse && satisfied;
        }
        return satisfied;
    }, variables, now);
}
export async function checkFluegel(now) {
    const variables = {
        name: conf.stimmerName,
        email: conf.stimmerEmail,
        subject: "Flügelstimmen im Jazzclub",
        firstLine: "## Bei folgenden Veranstaltungen brauchen wir einen Klavierstimmer:",
    };
    return checkForFilter((ver) => {
        const satisfied = ver.technik.fluegel && ver.kopf.confirmed;
        if (ver.isVermietung) {
            return ver.brauchtTechnik && satisfied;
        }
        return satisfied;
    }, variables, now);
}
