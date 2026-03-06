class s{constructor(t){this.veranstaltung=t}get presseTemplate(){if(this.veranstaltung.isVermietung)return`### ${this.veranstaltung.kopf.titelMitPrefix}
#### ${this.veranstaltung.startDatumUhrzeit.fuerPresse} ${this.veranstaltung.kopf.presseInEcht}

`;const t=this.veranstaltung.eintrittspreise;let e;return t.istKooperation?e=`Gemäß Kooperationspartner (${this.veranstaltung.kopf.kooperationspartnerText})`:e=t.frei?"freier Eintritt":`${t.regulaer},- (Ermässigt: ${t.ermaessigt},-, Mitglieder: ${t.mitglied},-) €`,`### ${this.veranstaltung.kopf.titelMitPrefix}
#### ${this.veranstaltung.startDatumUhrzeit.fuerPresse} ${this.veranstaltung.kopf.presseInEcht}
**Eintritt:** ${e}

`}presseTextForMail(t){const e=this.veranstaltung.presse;return this.presseTemplate+e.text+`

`+(e.firstImage?e.imageURL(t):"")+`

`+(e.jazzclubURL?`**URL:** ${e.fullyQualifiedJazzclubURL}`:"")}get description(){return`${this.veranstaltung.startDatumUhrzeit.tagMonatJahrLangMitKW} ${this.veranstaltung.kopf.titelMitPrefix}`}}export{s as V};
