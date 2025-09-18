import { en } from "./en";
import { ko } from "./ko";

export const translations = {
    en,
    ko,
} as const;

export type Language = keyof typeof translations;

export type NestedKeyOf<ObjectType extends Record<string, unknown>> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Record<string, unknown>
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<(typeof translations)[Language]>;

export const translate = (
    language: Language,
    key: TranslationKey,
    params?: Record<string, string | number>,
): string => {
    const parts = key.split(".");
    let value: unknown = translations[language];

    for (const part of parts) {
        if (value && typeof value === "object" && part in (value as Record<string, unknown>)) {
            value = (value as Record<string, unknown>)[part];
        } else {
            value = undefined;
            break;
        }
    }

    if (typeof value !== "string") {
        // fallback to english if missing
        if (language !== "en") {
            return translate("en", key, params);
        }
        return key;
    }

    if (!params) {
        return value;
    }

    return value.replace(/\{(\w+)\}/g, (_, param) => String(params[param] ?? ""));
};
