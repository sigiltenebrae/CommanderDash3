import { Injectable } from '@angular/core';

const EDHREC_STATIC_BASE = 'https://static.edhrec.com';
const EDHREC_JSON_BASE = 'https://json.edhrec.com/v2';
//https://cards.edhrec.com/atraxa-praetors-voice
//https://json.edhrec.com/v2/commanders/atraxa-praetors-voice.json
//https://json.edhrec.com/v2/commanders/brg.json
const EDHREC_CARDS_BASE = 'https://cards.edhrec.com/';

const COMMANDER_TYPEAHEAD_URL = EDHREC_STATIC_BASE + '/typeahead/commanders';
const PARTNER_TYPEAHEAD_URL = EDHREC_STATIC_BASE + 'https://static.edhrec.com/typeahead/partners';

const TOP_COMMANDERS_YEAR_URL = EDHREC_JSON_BASE + '/commanders/year.json';



@Injectable({
  providedIn: 'root'
})
export class EdhrecService {

  constructor() { }
}
