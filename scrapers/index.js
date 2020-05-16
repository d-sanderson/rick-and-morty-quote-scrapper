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

    var quotes = await page.evaluate(() => {
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
    await browser.close();
    // Writing the quotes inside a json file
    
    fs.writeFile("rickandmortyquotes.json", JSON.stringify(quotes), function (
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
