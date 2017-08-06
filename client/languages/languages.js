/*jshint esversion: 6 */

import {fr} from './fr_CA.js';
import {en} from './en_GB.js';

export default function language() {

  var language;

  switch (Session.get("language")) {
    case "fr":
      language = fr;
      break;
    case "en":
      language = en;
      break;
    default:
      language = fr;
  }

  return language
}
