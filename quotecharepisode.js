const puppeteer = require("puppeteer");
const chalk = require("chalk");
const autoScroll = require("./helpers").autoScroll;
var fs = require("fs");
// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

const url = `https://quotecatalog.com/quotes/tv/rick-and-morty/`;
(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: false });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(url);

    await page.setViewport({
      width: 1200,
      height: 800,
    });

    await autoScroll(page);

    var quotes2 = await page.evaluate(() => {
      var quoteNodes = document.querySelectorAll(`.card`);
      var arr = [];
      const regex = /“|”/gi;
      quoteNodes.forEach((node) => {
        console.log(node);
        let quote = node.querySelector("a");
        let character = node.querySelector(
          ".font-bold"
        );
        let episode = node.querySelector(".italic")
        arr.push({
          quote: quote.innerText.replace(regex, "").trim(),
          character: character.innerText.trim(),
          episode: episode.innerText.trim()
        });
      });
      return arr;
    });
    await browser.close();

    // COMBINE AND CLEANUP
    let cleaned = Array.from(new Set(quotes2.map((a) => a.quote))).map(
      (quote) => {
        return quotes2.find((a) => a.quote === quote);
      }
    );
    // Writing the quotes inside a json file

    fs.writeFile("quotecharepisode.json", JSON.stringify(cleaned), function (err) {
      if (err) throw err;

      console.log(success(`${cleaned.length} quotes saved!`));
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(
      error(`Browser Closed. Quotes could not be gathered :( ${err}`)
    );
  }
})();
