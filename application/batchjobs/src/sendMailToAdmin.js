/* eslint-disable no-console */
import userstore from "jc-backend/lib/users/userstore.js";
import MailMessage from "jc-shared/mail/mailMessage.js";
import mailtransport from "jc-backend/lib/mailsender/mailtransport.js";
import compact from "lodash/compact.js";
import map from "lodash/map.js";
const receiver = "leider";
export async function informAdmin(allResults) {
    const user = userstore.forId(receiver);
    if (!user) {
        console.error("User not found");
        return;
    }
    let errorHappened = false;
    function createBodyFragment({ type, jobResult }) {
        const error = jobResult.error;
        const infosCompacted = Array.isArray(jobResult.result) ? compact(jobResult.result) : compact([jobResult.result]);
        if (!infosCompacted.length && !error) {
            console.log(`nothing happened for JobType "${type}"`);
            return;
        }
        if (error) {
            errorHappened = true;
            console.error(`error occurred while informing for type: ${type}. ERROR: ${error}`);
        }
        const infos = map(infosCompacted, ({ accepted, rejected, response }) => ({
            accepted,
            rejected,
            response,
        }));
        const count = infos.length;
        return `**${type}** ${count} Mail(s)
            
${error
            ? `### Es gibt Fehler!
${error}`
            : `${"\n```\n" + JSON.stringify(infos, null, 2) + "\n```"}`}`;
    } // end function createBodyFragment
    const bodyFragments = compact(map(allResults, createBodyFragment));
    if (!bodyFragments.length) {
        return;
    }
    const message = new MailMessage({
        subject: `[${errorHappened ? "ERROR" : "INFO"} B-O Jazzclub] Mails sent`,
    });
    message.to = [{ name: user.name, address: user.email }];
    message.body = bodyFragments.join("\n");
    return mailtransport.sendMail(message);
}
