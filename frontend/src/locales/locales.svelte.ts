export type Locale = "en" | "de";
let locale : Locale = $state("de");
export function getLocale(): Locale {
    return locale;
}
export function updateLocale(newLocale: Locale) {
    locale = newLocale;
}
