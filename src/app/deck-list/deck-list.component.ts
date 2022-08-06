import { Component, OnInit } from '@angular/core';
import { DeckDataService } from "../../services/deck-data.service";

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss']
})
export class DeckListComponent implements OnInit {

  decks: any[] = [
    {
      "id": 51,
      "friendly_name": "Najeela's Warriors",
      "commander": "Najeela, the Blade-Blossom",
      "url": "https://www.archidekt.com/decks/2899541#Najeela_Warriors",
      "build_rating": 5,
      "play_rating": 4,
      "win_rating": 4,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/b/e/be898edb-35dd-4896-96d9-323aca64a2ce.png?1612229871",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 155,
          "name": "Warrior Tokens"
        },
        {
          "id": 184,
          "name": "Warrior Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 54,
      "friendly_name": "Discard Upgraded",
      "commander": "Crosis, the Purger",
      "url": "https://www.archidekt.com/decks/2822705#Crosis_-_Grixis_-_Discard_Upgraded",
      "build_rating": 5,
      "play_rating": 3,
      "win_rating": 5,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/e/f/ef55cb9e-27ab-4a85-9246-873f699be0f3.png?1651796695",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 42,
          "name": "Wheels"
        },
        {
          "id": 53,
          "name": "Discard"
        },
        {
          "id": 121,
          "name": "Card Draw"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 49,
      "friendly_name": "Dragon Combo",
      "commander": "Miirym, Sentinel Wyrm",
      "url": "https://www.archidekt.com/decks/2936221#Dragon_Combination",
      "build_rating": 5,
      "play_rating": 5,
      "win_rating": 5,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/9/6/96f0daf2-36c5-4b3e-ab81-7317682a406b.png?1653521108",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 72,
          "name": "Clones"
        },
        {
          "id": 159,
          "name": "Dragon Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 47,
      "friendly_name": "Angel Dangel",
      "commander": "Kaalia of the Vast",
      "url": "https://www.archidekt.com/decks/2941878#Angel_Dangel",
      "build_rating": 5,
      "play_rating": 4,
      "win_rating": 2,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/8/6/86f670f9-c5b7-4eb0-a7d0-d16513fadf74.png?1599711214",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 36,
          "name": "Lifegain"
        },
        {
          "id": 70,
          "name": "Snow"
        },
        {
          "id": 165,
          "name": "Angel Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 60,
      "friendly_name": "Lifegain",
      "commander": "Treva, the Renewer",
      "url": "",
      "build_rating": 1,
      "play_rating": 4,
      "win_rating": 1,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/2/b/2b4d2c34-c9a9-4de3-a6df-7b815cd043af.png?1562543773",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 36,
          "name": "Lifegain"
        },
        {
          "id": 39,
          "name": "+1/+1 Counters"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 50,
      "friendly_name": "SilverDay",
      "commander": "Gisela, Blade of Goldnight",
      "url": "https://www.archidekt.com/decks/2909155#SilverDay",
      "build_rating": 2,
      "play_rating": 1,
      "win_rating": 1,
      "active": false,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/3/6/365c43c2-1a65-4f6a-860d-39dcb15255c3.png?1562273405",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 77,
          "name": "Burn"
        },
        {
          "id": 165,
          "name": "Angel Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 61,
      "friendly_name": "Dinosaurs",
      "commander": "Gishath, Sun's Avatar",
      "url": "",
      "build_rating": 1,
      "play_rating": 1,
      "win_rating": 1,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/7/3/7335e500-342d-476d-975c-817512e6e3d6.png?1562558022",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 59,
          "name": "Big Mana"
        },
        {
          "id": 113,
          "name": "Stompy"
        },
        {
          "id": 168,
          "name": "Dinosaur Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 59,
      "friendly_name": "Flying Tribal",
      "commander": "Ojutai, Soul of Winter",
      "url": "",
      "build_rating": 2,
      "play_rating": 3,
      "win_rating": 0,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/7/e/7eb90a6b-da46-44ab-88b8-31aaffdee75b.png?1562614387",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 65,
          "name": "Flying"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 62,
      "friendly_name": "Chromium",
      "commander": "Chromium, the Mutable",
      "url": "",
      "build_rating": 1,
      "play_rating": 3,
      "win_rating": 0,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/5/0/50c1de2c-1acc-47c8-9b5e-a9dae3da8a49.png?1562302164",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 53,
          "name": "Discard"
        },
        {
          "id": 79,
          "name": "Madness"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 52,
      "friendly_name": "Army of the Damned",
      "commander": "Lord of Tresserhorn",
      "url": "https://www.archidekt.com/decks/2121627#Army_of_the_Damned",
      "build_rating": 5,
      "play_rating": 5,
      "win_rating": 4,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/5/f/5fc9497a-42bf-4d78-afaf-67645514ade4.png?1562768726",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 44,
          "name": "Sacrifice"
        },
        {
          "id": 52,
          "name": "Zombie Tokens"
        },
        {
          "id": 160,
          "name": "Zombie Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 55,
      "friendly_name": "Keyword",
      "commander": "Kathril, Aspect Warper",
      "url": "https://www.archidekt.com/decks/1743800#Kathril_Mk_11",
      "build_rating": 1,
      "play_rating": 1,
      "win_rating": 2,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/e/b/ebc57f73-a517-463e-8d55-56aa996d091e.png?1591946565",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 63,
          "name": "Graveyard"
        },
        {
          "id": 74,
          "name": "Reanimator"
        },
        {
          "id": 116,
          "name": "Self-Mill"
        },
        {
          "id": 117,
          "name": "Keywords"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 53,
      "friendly_name": "Gilty of All Charges",
      "commander": "Nath of the Gilt-Leaf",
      "url": "https://www.archidekt.com/decks/2903608#Gilty_of_All_Charges",
      "build_rating": 5,
      "play_rating": 2,
      "win_rating": 0,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/2/9/294ccc67-6fc9-411b-9100-ae6a9b7fadfc.png?1562392895",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 53,
          "name": "Discard"
        },
        {
          "id": 147,
          "name": "Elf Tokens"
        },
        {
          "id": 161,
          "name": "Elf Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 48,
      "friendly_name": "Cocaine Condom",
      "commander": "Falco Spara, Pactweaver",
      "url": "https://www.archidekt.com/decks/2946009#Cocaine_Condom",
      "build_rating": 5,
      "play_rating": 3,
      "win_rating": 3,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/a/e/ae25db8c-3d10-4196-b002-9d2aabd5f4de.png?1649364262",
      "creator": 1,
      "partner_commander": null,
      "partner_image_url": null,
      "themes": [
        {
          "id": 39,
          "name": "+1/+1 Counters"
        },
        {
          "id": 70,
          "name": "Snow"
        },
        {
          "id": 165,
          "name": "Angel Tribal"
        }
      ],
      "deleteThemes": []
    },
    {
      "id": 89,
      "friendly_name": "Pako Partner",
      "commander": "Haldan, Avid Arcanist",
      "url": "",
      "build_rating": 0,
      "play_rating": 3,
      "win_rating": 0,
      "active": true,
      "image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/1/6/16a86a35-f7e5-434d-bf44-61ae7cb0f98b.png?1618057606",
      "creator": 1,
      "partner_commander": "Pako, Arcane Retriever",
      "partner_image_url": "https://c1.scryfall.com/file/scryfall-cards/png/front/0/6/066c8f63-52e6-475e-8d27-6ee37e92fc05.png?1591234280",
      "themes": [
        {
          "id": 41,
          "name": "Spellslinger"
        },
        {
          "id": 111,
          "name": "Counterspells"
        }
      ],
      "deleteThemes": []
    }
  ];


  constructor(private deckData: DeckDataService) { }

  ngOnInit(): void {
    this.deckData.getDecks().then(
      (temp) => {
        console.log(temp);
      }
    );
    for (let deck of this.decks) {
      deck.hovered = false;
    }
  }

}
