async function scrape() {
    console.log("Starting scrape...");

    await scrapeLinks(document, linksArray);

    var nextButton = document.querySelector("div[id*='pagination-next'] > ul > li.a-last > a");

    await loadNextPage(nextButton);

    var endOfPagesDiv = document.querySelector("div[id*='pagination-prev']");

    while (endOfPagesDiv.classList.contains("hidden")) {
        await scrapeLinks(document, linksArray);

        nextButton = document.querySelector("div[id*='pagination-next'] > ul > li.a-last > a");

        await loadNextPage(nextButton);

        endOfPagesDiv = document.querySelector("div[id*='pagination-prev']");

        if (!endOfPagesDiv.classList.contains("hidden")) {      // We are on the last page, so scrape it before loop ends...
            console.log("Scraping last page...");
            await scrapeLinks(document, linksArray);
        }
    }

    console.log("Scraping of links complete. Links available inside of \"linksArray\"");
    
    // PUT ALL FUTURE SCRAPING CODE HERE.
    //
    // Async functions allow the use of the keyword "await" which prevents subsequent code 
    // from running until the function after the word "await" has completed... Await can only be used inside async functions.
    // For await to work correctly, you must return resolved Promises as shown in the loadNextPage() and scrapeLinks() functions.
    //
    // Simple example of how await works:
    //
    // await scrapeLinks();
    // console.log("test");             // Does not run until scrapeLinks() function completes.
    //
    // VS.
    //
    // scrapeLinks();
    // console.log("test");             // Runs before scrapeLinks() function completes.
}

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

function scrapeLinks(doc, arr) {
    return new Promise(resolve => {
        
        var pageNumber = document.querySelector("div[id*='pagination'] > ul > li.a-selected").innerText;
        
        console.log("Scraping links from page " + pageNumber + "...");

        var numOfItems = doc.querySelectorAll("div.a-section.a-spacing-none.tallCellView").length;
    
        // Loop through all items, insert data into item array, and insert item array into results array.
        for(var i=0; i<numOfItems; i++) {
    
            // Deal Link
            if(doc.querySelectorAll("#dealTitle")[i] === null) {
                arr.push("NA");
            } else {
                arr.push(doc.querySelectorAll("#dealTitle")[i].href);
            }
        }
    
        console.log("Completed page " + pageNumber + " link scrape.");

        resolve("");
    });
}

// START SCRAPE.
var linksArray = [];
scrape(); // DO NOT PUT ANYTHING AFTER THIS CODE. PUT EVERYTHING INSIDE SCRAPE FUNCTION. SEE NOTE INSIDE SCRAPE FUNCTION.
// END SCRAPE.