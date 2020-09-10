import { spanish } from "./i18n.es";
import { english } from "./i18n.en";

export enum languages {
  spanish = "es",
  english = "en"
}

export const getLanguageLibrary = () => {
  const currentLang = localStorage.getItem("language");
  switch (currentLang) {
    case languages.spanish:
      return spanish;
    case languages.english:
      return english;
    default:
      return spanish;
  }
};
