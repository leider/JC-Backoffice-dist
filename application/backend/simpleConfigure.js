import path from "node:path";
import assign from "lodash/assign.js";
export class SimpleConfigure {
    constructor() {
        this.storage = {};
        this.baseDir = "";
    }
    setBaseDirectory(baseDirectory) {
        this.baseDir = baseDirectory;
    }
    addProperties(properties) {
        this.storage = assign(this.storage, properties);
    }
    get(property) {
        return this.storage[property];
    }
    getString(property) {
        return this.get(property);
    }
    // explicitly known
    get port() {
        return this.get("port") || "1969";
    }
    get publicUrlPrefix() {
        return this.getString("publicUrlPrefix");
    }
    get bearer() {
        return this.getString("bearer");
    }
    get salt() {
        return this.getString("salt");
    }
    get refreshTTL() {
        return this.get("refreshTTL");
    }
    get jwtTTL() {
        return this.get("jwtTTL");
    }
    createRealPath(thePath) {
        return path.isAbsolute(thePath) ? thePath : path.join(this.baseDir, thePath);
    }
    inCorrectLocation(prop) {
        const thePath = this.getString(prop);
        if (!thePath) {
            return;
        }
        return this.createRealPath(thePath);
    }
    get sqlitedb() {
        return this.inCorrectLocation("sqlitedb");
    }
    get pdfuploadpath() {
        return this.inCorrectLocation("pdfuploadpath");
    }
    get wikipath() {
        return this.inCorrectLocation("wikipath");
    }
    get additionalstatic() {
        if (this.getString("additionalstatic")) {
            return this.inCorrectLocation("additionalstatic") ?? "";
        }
        return this.createRealPath("./static");
    }
    get uploadDir() {
        return path.join(this.additionalstatic, "upload");
    }
    get filesDir() {
        return path.join(this.additionalstatic, "files");
    }
    get wikiUploadDir() {
        return path.join(this.additionalstatic, "wiki");
    }
    // E-Mail
    get transportOptions() {
        return this.get("transport-options");
    }
    get senderName() {
        return this.getString("sender-name");
    }
    get senderAddress() {
        return this.getString("sender-address");
    }
    get sender() {
        return { name: this.senderName, address: this.senderAddress };
    }
    get kassenzettelEmail() {
        return this.getString("kassenzettel-email");
    }
    get belegEmail() {
        return this.getString("beleg-email");
    }
    get barEmail() {
        return this.getString("bar-email");
    }
    get barName() {
        return this.getString("bar-name");
    }
    get fotografEmail() {
        return this.getString("fotograf-email");
    }
    get fotografName() {
        return this.getString("fotograf-name");
    }
    get stimmerEmail() {
        return this.getString("stimmer-email");
    }
    get stimmerName() {
        return this.getString("stimmer-name");
    }
    // dev options
    get doNotSendMails() {
        return this.getString("doNotSendMails") || "";
    }
    get nowForDevelopment() {
        return this.getString("nowForDevelopment");
    }
}
export default new SimpleConfigure();
