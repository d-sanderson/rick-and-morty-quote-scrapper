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
      `https://en.wikiquote.org/wiki/Rick_and_Morty`
    );
    await page.waitForSelector("#mw-content-text");

    var quotes = await page.evaluate(() => {
      var quoteNodes = document.querySelectorAll(
        `dl`
      );
      var arr = [];
      const regex = /“|”/gi;
      quoteNodes.forEach((node) => {
          arr.push({ quote: node.innerText.replace(regex, "").trim() });
      });
      return arr;
    });
    // console.log(quotes);
    await browser.close();
    // Writing the quotes inside a json file
    
    fs.writeFile("rickandmortyquoteswiki.json", JSON.stringify(quotes), function (
      err
    ) {
      if (err) throw err;
      console.log(quotes.length)
      console.log("Saved!");
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();
