window.translate = function (lexems) {
  return new Proxy(lexems, {
    get: (_, prop) => {
      let lexem = lexems[prop];
      if (lexem == undefined) throw new Error(`LEXEM "${prop}" NOT FOUND`);
      let lang = window.navigator.language.includes('ru') ? 1 : 0;

      let translation = lexem[lang];
      if (translation == undefined) throw new Error(`LEXEM "${prop}" HAS NO TRANSLATION ${lang}`);

      let html = translation.includes('<') && translation.includes('>');

      return html ? React.createElement(prop, {
        dangerouslySetInnerHTML: {__html: translation}
      }) : translation
    }
  })
}