declare namespace App {
  interface Locals {
    // Language of the notes rendered on the page when it differs from the
    // page language (fallback translations). Read it with contentLang().
    contentLang?: import("./i18n/locales").Locale;
  }
}
