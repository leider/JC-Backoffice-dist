import OptionValues from "jc-shared/optionen/optionValues.js";
import Orte from "jc-shared/optionen/orte.js";
import FerienIcals from "jc-shared/optionen/ferienIcals.js";
import pers from "../persistence/sqlitePersistence.js";
import misc from "jc-shared/commons/misc.js";
const persistence = pers("optionenstore");
export default {
    get: function get() {
        const result = persistence.getById("instance");
        return misc.toObject(OptionValues, result);
    },
    orte: function orte() {
        const result = persistence.getById("orte");
        return misc.toObject(Orte, result);
    },
    icals: function icals() {
        const result = persistence.getById("ferienIcals");
        return misc.toObject(FerienIcals, result);
    },
    save: function save(object, user) {
        persistence.save(object, user);
        return object;
    },
};
