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
 
      `https://quotecatalog.com/quotes/tv/rick-and-morty/`
    );

    // await page.waitForSelector("#inf-container");
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);


    var quotes = await page.evaluate(() => {
      var quoteNodes = document.querySelectorAll(
        `.card`
      );
      var arr = [];
      const regex = /“|”/gi;
      quoteNodes.forEach((node) => {
          let quote = node.querySelector("a")
          arr.push({ quote: quote.innerText.replace(regex, "").trim() });
      });
      return arr;
    });
    await browser.close();
    //Writing the quotes inside a json file
    fs.writeFile("rickandmortyquotescatalog.json", JSON.stringify(quotes), function (
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



async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
