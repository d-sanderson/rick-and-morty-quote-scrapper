const fs = require("fs");

const JSON1 = require("./rickandmortyquotes.json");
const JSON2 = require("./rickandmortyquoteswiki.json");
const JSON3 = require("./rickandmortyquotescatalog.json");
let combined = [...JSON1, ...JSON2, ...JSON3];
let cleaned = Array.from(new Set(combined.map(a => a.quote)))
 .map(quote => {
   return combined.find(a => a.quote === quote)
 })
fs.writeFile("combined.json", JSON.stringify(cleaned), function (
  err
) {
  if (err) throw err;
  console.log(combined.length);
  console.log("Saved!");
});

