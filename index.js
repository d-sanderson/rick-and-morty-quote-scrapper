const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");
// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(
      `https://www.needsomefun.net/best-100-rick-and-morty-quotes/`
    );
    await page.waitForSelector("#post-53789");

    var quotes1 = await page.evaluate(() => {
      var quoteNodes = document.querySelectorAll(
        `div.entry-content.clearfix > p`
      );
      var arr = [];
      const regex = /“|”/gi;
      quoteNodes.forEach((node) => {
        if (node.innerText.length > 3) {
          arr.push({ quote: node.innerText.replace(regex, "").trim() });
        }
      });
      return arr;
    });
    await page.goto(`https://quotecatalog.com/quotes/tv/rick-and-morty/`);

    // await page.waitForSelector("#inf-container");
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
        let quote = node.querySelector("a");
        arr.push({ quote: quote.innerText.replace(regex, "").trim() });
      });
      return arr;
    });

    await page.goto(`https://en.wikiquote.org/wiki/Rick_and_Morty`);
    await page.waitForSelector("#mw-content-text");

    var quotes3 = await page.evaluate(() => {
      var quoteNodes = document.querySelectorAll(`dl`);
      var arr = [];
      const regex = /“|”/gi;
      quoteNodes.forEach((node) => {
        arr.push({ quote: node.innerText.replace(regex, "").trim() });
      });
      return arr;
    });

    await browser.close();

    // COMBINE AND CLEANUP
    let combined = [...quotes1, ...quotes2, ...quotes3];
    let cleaned = Array.from(new Set(combined.map((a) => a.quote))).map(
      (quote) => {
        return combined.find((a) => a.quote === quote);
      }
    );
    // Writing the quotes inside a json file

    fs.writeFile("quotes.json", JSON.stringify(cleaned), function (err) {
      if (err) throw err;

      console.log(success(`${cleaned.length} quotes saved!`));
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
