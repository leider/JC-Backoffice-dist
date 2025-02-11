import konzertestore from "jc-backend/lib/konzerte/konzertestore.js";
import vermietungenstore from "jc-backend/lib/vermietungen/vermietungenstore.js";
import sortBy from "lodash/sortBy.js";
import constant from "lodash/constant.js";
import filter from "lodash/filter.js";
export function byDateRangeInAscendingOrder({ from, to, konzerteFilter, vermietungenFilter, }) {
    const alwaysTrue = constant(true);
    const konzerte = konzertestore.byDateRangeInAscendingOrder(from, to);
    const filteredKonzerte = filter(konzerte, konzerteFilter ?? alwaysTrue);
    const vermietungen = vermietungenstore.byDateRangeInAscendingOrder(from, to);
    const filteredVermietungen = filter(vermietungen, vermietungenFilter ?? alwaysTrue);
    return sortBy([...filteredKonzerte, ...filteredVermietungen], "startDate");
}
