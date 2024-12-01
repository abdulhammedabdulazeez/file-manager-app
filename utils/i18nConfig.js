const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["en", "es", "fr"], 
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  cookie: "lang",
  queryParameter: "lang",
  autoReload: true,
  syncFiles: true,
  objectNotation: true,
});

module.exports = i18n;
