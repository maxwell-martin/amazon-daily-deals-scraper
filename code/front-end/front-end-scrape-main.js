/*  
    Web Scraping Project

    FRONT-END SCRAPER

    Solution: Programmatically click the next button to go to the next page
    
        To run code:
            -Go to: https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb_azl
            -Open up developer tools
            -Open up the console
            -Copy and paste this code into the console
            -Press enter key on keyboard
            -Wait until csv file appears in downloads or a popup asks if you want to save or download the csv file

        What this code does:
            -Scrapes the first page.
            -Clicks the next button to go to the next page.
            -Scrapes the next page.
            -Continues this process until the last page.
            -Scrapes the last page.
            -Formats data in csv format.
            -Downloads csv file with scraped data (ALL 1000 DAILY DEALS).

        * WORKING AS OF O5/22/2019 AT 9:14PM *
*/




// Main scraper function; Async so that await can be used to prevent loop from continuing execution until page load and page scrapes are complete
async function runScraper() {
    console.log("Starting scrape...");

    await scrapePageData(document, results);

    var nextButton = document.querySelector("div[id*='pagination-next'] > ul > li.a-last > a");

    await loadNextPage(nextButton);

    var endOfPagesDiv = document.querySelector("div[id*='pagination-prev']");

    while (endOfPagesDiv.classList.contains("hidden")) {
        await scrapePageData(document, results);

        nextButton = document.querySelector("div[id*='pagination-next'] > ul > li.a-last > a");

        await loadNextPage(nextButton);

        endOfPagesDiv = document.querySelector("div[id*='pagination-prev']");

        if (!endOfPagesDiv.classList.contains("hidden")) {      // We are on the last page, so scrape it before loop ends...
            console.log("Scraping last page...");
            await scrapePageData(document, results);
        }
    }

    console.log("Scraping complete.")
    console.log("Creating file name...")
    var today = new Date();
    var month = (today.getMonth() + 1).toString();
    var day = today.getDate().toString();
    var year = today.getFullYear().toString().substring(2,4);
    var strDate = month + day + year;

    var fileName = "amazon-results-" + strDate + ".csv";

    exportToCsv(fileName, results);
}

// Scrapes data from any daily deals page
function scrapePageData(doc, arr) {
    return new Promise(resolve => {
        
        var pageNumber = document.querySelector("div[id*='pagination'] > ul > li.a-selected").innerText;
        
        console.log("Scraping page " + pageNumber + "...");

        var numOfItems = doc.querySelectorAll("div.a-section.a-spacing-none.tallCellView").length;

        // Beginning of deal ids change so this gets the starting digits
        var wholeID = doc.querySelector("#widgetContent > div:nth-of-type(1)").id;
        var divIdBegNums = wholeID.substring(0, wholeID.indexOf("_"));

        // Loop through all items, insert data into item array, and insert item array into results array.
        for(var i=0; i<numOfItems; i++) {
    
            var item = [];

            // Description
            if(doc.querySelectorAll("#dealTitle > span")[i] === null) {
                item.push("NA");
            } else {
                item.push(doc.querySelectorAll("#dealTitle > span")[i].innerText);
            }
    
            // Deal Link
            if(doc.querySelectorAll("#dealTitle")[i] === null) {
                item.push("NA");
            } else {
                item.push(doc.querySelectorAll("#dealTitle")[i].href);
            }
    
            // Current Price
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span") === null) {
                item.push("NA");
            } else {
                var priceStr = doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span").innerText
                var regExLetters = /[a-zA-Z]+/;
                var regExDash = /-+/;

                if (regExLetters.test(priceStr)) {
                    item.push("NA");
                } else if (regExDash.test(priceStr)) {
                    item.push(getAvgPrice(priceStr));
                } else {
                    item.push(priceStr.substring(priceStr.indexOf("$") + 1));
                }
            }
    
            // Previous Price
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(3) > div.a-row.a-spacing-top-mini.unitLineHeight > span.a-size-base.a-color-base.inlineBlock.unitLineHeight.a-text-strike") === null) {
                item.push("NA");
            } else {
                var priceStr = doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(3) > div.a-row.a-spacing-top-mini.unitLineHeight > span.a-size-base.a-color-base.inlineBlock.unitLineHeight.a-text-strike").innerText
                var regExLetters = /[a-zA-Z]+/;
                var regExDash = /-+/;

                if (regExLetters.test(priceStr)) {
                    item.push("NA");
                } else if (regExDash.test(priceStr)) {
                    item.push(getAvgPrice(priceStr));
                } else {
                    item.push(priceStr.substring(priceStr.indexOf("$") + 1));
                }
            }
    
            // Percentage Off
            if (doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(3)") === null) {
                item.push("NA");
            } else {
                var percOffStr = doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(3)").innerText
                var idxFirstParenth = percOffStr.indexOf("(");
                var idxPercSymb = percOffStr.indexOf("%");
                var percOff = percOffStr.substring(idxFirstParenth + 1, idxPercSymb);

                item.push(percOff);
            }
    
            // Percent Claimed
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(6) > div.a-column.a-span5.a-text-left.unitLineHeight > div > span") === null) {
                item.push("NA");
            } else {
                var percClaimedStr = doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(6) > div.a-column.a-span5.a-text-left.unitLineHeight > div > span").innerText;
                var idxPercSymb = percClaimedStr.indexOf("%");
                var percClaimed = percClaimedStr.substring(0, idxPercSymb);

                item.push(percClaimed);
            }
    
            // Time Remaining
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + "_dealClock") === null) {
                item.push("NA");
            } else {
                var timeRemStr = doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + "_dealClock").innerText;
                
                if (timeRemStr.length < 7) {
                    item.push("00:" + timeRemStr);
                } else if (timeRemStr.length == 7) {
                    item.push("0" + timeRemStr);
                } else {
                    item.push(timeRemStr);
                }
            }
    
            // Sold By
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " #shipSoldInfo") === null) {
                item.push("NA");
            } else {
                item.push(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " #shipSoldInfo").innerText);
            }
    
            // Number of Reviews
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " span.a-size-small.a-color-base") === null) {
                item.push("NA");
            } else {
                item.push(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " span.a-size-small.a-color-base").innerText);
            }
    
            // Image Link
            if(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " img") === null) {
                item.push("NA");
            } else {
                item.push(doc.querySelector("#\\3" + divIdBegNums[0] + " " + divIdBegNums.substring(1,divIdBegNums.length) + "_dealView_" + i + " img").src);
            }
    
            arr.push(item);
        }
    
        console.log("Completed page " + pageNumber + " scrape.");

        resolve("");
    });
}

// Loads next daily deals page; prevents scraper from continuing for 5 seconds to let Amazon's AJAX calls complete
function loadNextPage(element) { 
    return new Promise(resolve => {
        var nextPageNumber = parseInt(document.querySelector("div[id*='pagination'] > ul > li.a-selected").innerText) + 1;
        
        console.log("Loading page " + nextPageNumber + "...");

        element.click();

        setTimeout(function() {
            resolve("");
        }, 5000);
    });
}

// Converts data to csv format, creates a downloadable blob, appends blob to DOM, and downloads file
// Found on stack overflow: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side?answertab=active#answer-24922761
function exportToCsv(filename, rows) {
    console.log("Starting csv export...");
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    console.log("Formatting data in csv format...");
    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
    console.log("Formatting complete.")
    
    console.log("Creating downloadable file...");
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    console.log("File created.");
    if (navigator.msSaveBlob) { // IE 10+
        console.log("Downloading file...");
        navigator.msSaveBlob(blob, filename);
        console.log("Download complete. A file named \"" + filename + "\" is now available in your Downloads folder.");
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            console.log("Downloading file...");
            link.click();
            console.log("Download complete. A file named \"" + filename + "\" is now available in your Downloads folder.");
            document.body.removeChild(link);
        }
    }
}

// Used to get average price of a price range; some daily deals have ranges
function getAvgPrice(str) {
    var idxFirstDollarSign = str.indexOf("$");
    var idxFirstSpace = str.indexOf(" ");
    var idxLastDollarSign = str.lastIndexOf("$");

    var lowPrice = parseFloat(str.substring(idxFirstDollarSign + 1, idxFirstSpace));
    var highPrice = parseFloat(str.substring(idxLastDollarSign + 1));

    var avgString = ((lowPrice + highPrice) / 2).toFixed(2);

    return avgString;
}

// START

console.log("Creating array to store results...");
var results = []; // Array to store results

console.log("Adding data headers...");
var lineHeaders = [ // Column headers for data
    "description",
    "dealLink",
    "currentPrice/avgCurrentPrice",
    "previousPrice/avgPreviousPrice",
    "percentageOff",
    "percentClaimed",
    "timeRemaining",
    "soldBy/shipsFrom",
    "numberOfReviews",
    "imageLink",
];

results.push(lineHeaders);

runScraper();

// END