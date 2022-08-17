// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let mtg_api_url = 'https://example.com/api'

export const environment = {
  production: false,
  users_url: mtg_api_url + '/users',
  decks_url: mtg_api_url + '/decks/',
  deck_themes_url: mtg_api_url + '/deckthemesname/',
  themes_url: mtg_api_url + '/themes',
  bans_url: mtg_api_url + '/bans',
  games_url: mtg_api_url + '/games',

  auth_url: mtg_api_url + '/auth/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
