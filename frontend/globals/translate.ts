import { createElement, type ReactNode } from "react";

// Lexeme - an [en, ru] pair
type Lexemes = Record<string, string[]>;

export default function translate<T extends Lexemes>(lexemes: T): Record<keyof T, ReactNode> {
  return new Proxy(lexemes, {
    get: (_, prop: string) => {
      const lexeme = lexemes[prop];
      if (lexeme == undefined) throw new Error(`LEXEM "${prop}" NOT FOUND`);
      const lang = window.navigator.language.includes('ru') ? 1 : 0;

      const translation = lexeme[lang];
      if (translation == undefined) throw new Error(`LEXEM "${prop}" HAS NO TRANSLATION ${lang}`);

      const html = translation.includes('<') && translation.includes('>');

      return html ? createElement("span", {
        style: {display: "inline"},
        dangerouslySetInnerHTML: {__html: translation}
      }) : translation
    }
  }) as unknown as Record<keyof T, ReactNode>;
}
