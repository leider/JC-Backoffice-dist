import MailRule from "jc-shared/mail/mailRule.js";
import pers from "../persistence/sqlitePersistence.js";
import misc from "jc-shared/commons/misc.js";
const persistence = pers("mailstore");
export default {
    all: function all() {
        const result = persistence.list();
        return misc.toObjectList(MailRule, result);
    },
    removeById: function removeById(id, user) {
        persistence.removeById(id, user);
    },
    removeAll: function removeAll(ids, user) {
        persistence.removeAllByIds(ids, user);
    },
    save: function save(mailRule, user) {
        persistence.save(mailRule, user);
        return mailRule;
    },
    saveAll: function saveAll(mailRules, user) {
        persistence.saveAll(mailRules, user);
        return mailRules;
    },
};
