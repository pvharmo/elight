
import fr from "./fr_CA.json";
import en from "./en_GB.json";

export default function language() {

  var language;

  switch (Session.get("language")) {
  case "fr":
    language = fr;
    break;
  case "en":
    // language = en;
    break;
  default:
    language = fr;
  }

  return language;
}
