/*  
    Web Scraping Project

    MISCELLANEOUS CODE

    This file contains random code that we wrote in the process of creating a scraping solution.

*/




/*
    Random notes:

    Starting Url: https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb_azl

    To access pages 2 through the last page of the daily deals, change the page number in the URL:
    "https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_" +
    "page_2" +
    "?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL," +
    "page:2" +
    ",sortOrder:BY_SCORE,dealsPerPage:48&pf_rd_p=a7e1c818-e7bc-4318-ae47-1f5300505baf&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=834E99JBJXDT1TJZG5BA&ie=UTF8";

    Full link ^^: https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_2?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:2,sortOrder:BY_SCORE,dealsPerPage:48&pf_rd_p=a7e1c818-e7bc-4318-ae47-1f5300505baf&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=834E99JBJXDT1TJZG5BA&ie=UTF8

    To get exact CSS paths to elements, right click on element in "Inspector," click "Copy," and then click "CSS Path".

*/










//////////////////////////////////////////////////////////////////////////////////////////////////////////////// BEGIN WORKING CODE










/*  
    Scrape data from any page user is on.

        * WORKING AS OF 04/28/2019 @ 11:46AM *
    
        What this code does:
        -Code from "var subpages" to end of first for loop does nothing important in this code block.
        -The rest of the code scrapes whatever daily deals page the user is on.
*/




// Get the total number of pages containing daily deals items.
var numOfPages = parseInt(document.querySelector('li.a-disabled:nth-child(6)').innerText);
console.log("Number of Pages: " + numOfPages);

// Array to hold pages
var subPages = [];

// URL parts for subsequent pages; must concatenate with page number: pt1 + # + pt2 + #
var urlPt1 = "https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_";
var urlPt2 = "?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:";

//Loop to add all subsequent pages to the subPages array
for (var i=2; i<numOfPages; i++) {
    var pageURL = urlPt1 + i + urlPt2 + i;
    subPages.push(pageURL);
}

// Array to store results
var results = [];

var numOfItems = document.querySelectorAll("div.a-section.a-spacing-none.tallCellView").length;

// Loop through all items, insert data into item array, and insert item array into results array.
for(var i=0; i<numOfItems; i++) {
    
    console.log("Inside scrapePageData function for loop... Scraping...");

    var item = [];

    // Item number
    item.push(i);

    // Description
    if(document.querySelectorAll("#dealTitle > span")[i] === null) {
        item.push(null);
    } else {
        item.push(document.querySelectorAll("#dealTitle > span")[i].innerText);
    }

    // Link behind description
    if(document.querySelectorAll("#dealTitle")[i] === null) {
        item.push(null);
    } else {
        item.push(document.querySelectorAll("#dealTitle")[i].href);
    }

    // Price
    if(document.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span").innerText);
    }

    // Original Price
    if(document.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(3) > div.a-row.a-spacing-top-mini.unitLineHeight > span.a-size-base.a-color-base.inlineBlock.unitLineHeight.a-text-strike") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(3) > div.a-row.a-spacing-top-mini.unitLineHeight > span.a-size-base.a-color-base.inlineBlock.unitLineHeight.a-text-strike").innerText);
    }

    // Percentage off
    if (document.querySelector("#\\31 00_dealView_" + i + " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(3)") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(3)").innerText);
    }

    // Percent Claimed
    if(document.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(6) > div.a-column.a-span5.a-text-left.unitLineHeight > div > span") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(6) > div.a-column.a-span5.a-text-left.unitLineHeight > div > span").innerText);
    }

    // Time Remaining
    if(document.querySelector("#\\31 00_dealView_" + i + "_dealClock") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + "_dealClock").innerText);
    }

    // Sold by
    if(document.querySelector("#\\31 00_dealView_" + i + " #shipSoldInfo") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + " #shipSoldInfo").innerText);
    }

    // Number of reviews
    if(document.querySelector("#\\31 00_dealView_" + i + " span.a-size-small.a-color-base") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + " span.a-size-small.a-color-base").innerText);
    }

    // Link for image
    if(document.querySelector("#\\31 00_dealView_" + i + " img") === null) {
        item.push(null);
    } else {
        item.push(document.querySelector("#\\31 00_dealView_" + i + " img").src);
    }

    results.push(item);

    console.log("Item scraped...");
}

console.log("Scraping of main page complete.");
console.log("Printing results...");
console.table(results);










////////////////////////////////////////////////////////////////////////////////////////////////////////////////










/*  
    Use an iframe for pagination

        * WORKING AS OF 05/02/2019 AT 11:25PM *
    
        What this code does:
        -Adds an iframe to the bottom of the page.
        -Updates the iframe to the first url.
        -Waits until the page loads in the iframe.
        -Scrapes the data from the page inside the iframe.
        -Loops through this process for every page.
        -Displays results in a table in the console.

        Issues:
        -This code only gets 964 deals.
        -I think it has something to do with the loading of the url manually versus clicking the next button.
        -If you scroll through the data in the table at the end, you will see some deals repeated and some pages scraping less than total number of items on page.
        -It as if the new page being loaded contains some of the next pages items.
        -My thoughts are to use the full url not the minimal one that is in this code.
*/




function scrapePageData(doc, arr) {
    return new Promise(resolve => {
        console.log("Inside scrapePageData function...");

        var numOfItems = doc.querySelectorAll("div.a-section.a-spacing-none.tallCellView").length;
    
        // Loop through all items, insert data into item array, and insert item array into results array.
        for(var i=0; i<numOfItems; i++) {
            
            console.log("Inside scrapePageData function for loop...");
    
            var item = [];
    
            // Item number
            item.push(i);
    
            // Description
            if(doc.querySelectorAll("#dealTitle > span")[i] === null) {
                item.push(null);
            } else {
                item.push(doc.querySelectorAll("#dealTitle > span")[i].innerText);
            }
    
            // Link behind description
            if(doc.querySelectorAll("#dealTitle")[i] === null) {
                item.push(null);
            } else {
                item.push(doc.querySelectorAll("#dealTitle")[i].href);
            }
    
            // Price
            if(doc.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span").innerText);
            }
    
            // Original Price
            if(doc.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(3) > div.a-row.a-spacing-top-mini.unitLineHeight > span.a-size-base.a-color-base.inlineBlock.unitLineHeight.a-text-strike") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(3) > div.a-row.a-spacing-top-mini.unitLineHeight > span.a-size-base.a-color-base.inlineBlock.unitLineHeight.a-text-strike").innerText);
            }
    
            // Percentage off
            if (doc.querySelector("#\\31 00_dealView_" + i + " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(3)") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(3)").innerText);
            }
    
            // Percent Claimed
            if(doc.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(6) > div.a-column.a-span5.a-text-left.unitLineHeight > div > span") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + " > div > div:nth-child(2) > div > div > div:nth-child(6) > div.a-column.a-span5.a-text-left.unitLineHeight > div > span").innerText);
            }
    
            // Time Remaining
            if(doc.querySelector("#\\31 00_dealView_" + i + "_dealClock") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + "_dealClock").innerText);
            }
    
            // Sold by
            if(doc.querySelector("#\\31 00_dealView_" + i + " #shipSoldInfo") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + " #shipSoldInfo").innerText);
            }
    
            // Number of reviews
            if(doc.querySelector("#\\31 00_dealView_" + i + " span.a-size-small.a-color-base") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + " span.a-size-small.a-color-base").innerText);
            }
    
            // Link for image
            if(doc.querySelector("#\\31 00_dealView_" + i + " img") === null) {
                item.push(null);
            } else {
                item.push(doc.querySelector("#\\31 00_dealView_" + i + " img").src);
            }
    
            arr.push(item);
        }
    
        console.log("Completed scrapePageData for loop... Exiting scrapePageData function...");

        //setTimeout(function() {
            resolve("");
        //}, 5000);
    });
}

// Array to store results
var results = [];

// URL parts for subsequent pages; must concatenate with page number: pt1 + # + pt2 + #
var urlPt1 = "https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_";
var urlPt2 = "?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:";

// Get the total number of pages containing daily deals items.
var numOfPages = parseInt(document.querySelector('li.a-disabled:nth-child(6)').innerText);
console.log("Number of Pages: " + numOfPages);

async function runScraper() {
    console.log("Starting scrape...");
    //await scrapePageData(document, results); //Scrape current page.

    //console.log("Completed scrape of main page...");

    //console.log("Starting subsequent page scrape...");

    console.log("Adding iframe...");

    await appendIframe();

    for(let i=1; i<=numOfPages; i++) {

        console.log("Inside for loop for iframe scrape...");

        var pageURL = urlPt1 + i + urlPt2 + i;

        var currentIframe = document.querySelector("#myIframe");
        
        await updateIframe(currentIframe, pageURL);

        var updatedIframe = document.querySelector("#myIframe");

        var updatedIframeDocObj = updatedIframe.contentWindow.document;

        await scrapePageData(updatedIframeDocObj, results);
    }

    console.log("Scraping complete...");
    console.log("Printing results...");

    console.table(results);
}

runScraper();

function appendIframe() { 
    return new Promise(resolve => {
        console.log("Inside appendIframe function...");

        var newIframe;
        newIframe = document.createElement('iframe');
        console.log("Created iframe...");

        //iframe.style.display = 'none';
        newIframe.style.width = '100%';
        newIframe.style.height = '100%';
        newIframe.id = "myIframe";

        document.body.appendChild(newIframe);
        console.log("Appended iframe...");

        console.log("Exiting appendIframe function...");

        setTimeout(function() {
            resolve("");
        }, 20000);
    });
}

function updateIframe(iframe, source) {
    return new Promise(resolve => {
        console.log("Inside updateIframe function...");
        iframe.src = source;
        console.log("Updated iframe src...");
        console.log("Waiting 20 seconds for page to load...");
        setTimeout(function() { 
            resolve(""); 
        }, 20000);
    });
}

/*function pause10s() {
    return new Promise(resolve => {
        console.log("Pausing...");
        setTimeout(function() {
            resolve("");
        }, 10000)
    });
}

function checkIframeLoaded(ifr) {
    
    console.log("Inside checkIframeLoaded function...");
    
    var loaded = false;

    while (loaded == false) {

        console.log("Inside checkIframeLoaded while loop...");

        var iframeDoc = ifr.contentWindow.document; // ifr.contentDocument || 

        // Check if loading is complete
        if (iframeDoc.readyState == "complete") {
            loaded = true; // The loading is complete
            console.log("Iframe loading complete...");
        } 
    }

    console.log("Exiting checkIframeLoaded function...");
    return new Promise(function(resolve, reject) { resolve() });
}


var timer = setInterval(function () { // Display results when all items have been scraped.
    if (results.length >= 950 && results.length < 1050) {
        console.log("Scraping complete.");
        console.table(results);
        clearInterval(timer);
    } else {
        console.log("Length is: " + results.length);
        console.log("Scraping...");
    }
}, 500);*/










//////////////////////////////////////////////////////////////////////////////////////////////////////////////// END WORKING CODE










//////////////////////////////////////////// EXTRA STUFF BELOW ////////////////////////////////////////////////////////////////////










//////////////////////////////////////////////////////////////////////////////////////////////////////////////// BEGIN EXTRA CODE










// WITH JQUERY
function main_injectJQueryAndRunScript() {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js";
    script.onload = function() {

        // Page 1 URL
        var baseURL = "https://www.amazon.com/gp/goldbox/ref=gbps_fcr_s-5_5baf_wht_21023130?gb_f_deals1=dea";

        // URL parts for subsequent pages; must concatenate with page number: pt1 + # + pt2 + # + pt3
        var urlPt1 = "https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_";
        var urlPt2 = "?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:";
        var urlPt3 = ",sortOrder:BY_SCORE,dealsPerPage:48&pf_rd_p=a7e1c818-e7bc-4318-ae47-1f5300505baf&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=AGMFSQ7HBAK2WHXY1R07&ie=UTF8";

        // Get the total number of pages containing daily deals items.
        var numOfItems = document.querySelector('#widgetContent').children.length;
        var numOfPages = parseInt(document.querySelector('li.a-disabled:nth-child(6)').innerText);
        alert("Number of items on this page is: " + numOfItems);
        alert("Number of pages is: " + numOfPages);

        // Array to hold all the page URLs;
        var myPages = [];

        // Add page 1 URL first
        myPages.push(baseURL);
        
        // Loop through number of pages, concatenate each subsequent (pgs 2-END) page URL, and add each URL to myPages array.
        for(i=2; i<=numOfPages; i++) {
            var pageURL = urlPt1 + i + urlPt2 + i + urlPt3;
            myPages.push(pageURL);
        }

        // Ajax call that grabs the HTML from the specified URL
        function getPageData(url) {
            return jQuery.ajax({
                type: "GET",
                url: url,
                cache: false,
                async: false,
            }).responseText;
        }

        var pg2 = getPageData("https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_2?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:2,sortOrder:BY_SCORE,dealsPerPage:48&pf_rd_p=a7e1c818-e7bc-4318-ae47-1f5300505baf&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=AGMFSQ7HBAK2WHXY1R07&ie=UTF8");
        var h1 = jQuery(pg2).find("h1").text();
        console.log(h1);
    };

    head.appendChild(script);
}
  
main_injectJQueryAndRunScript();










////////////////////////////////////////////////////////////////////////////////////////////////////////////////




 





//Function to do an xhr
function loadDoc(relativeUrl) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", relativeUrl, false);
    xhttp.send(null);
    return xhttp.responseText;
}










////////////////////////////////////////////////////////////////////////////////////////////////////////////////










// Accessing the deals via Amazon API. Works but it's really complicated.
var xhttp = new XMLHttpRequest();
xhttp.open("POST", "https://www.amazon.com/xa/dealcontent/v2/GetDeals", false);
xhttp.send('{"requestMetadata":{"marketplaceID":"ATVPDKIKX0DER","clientID":"goldbox_mobile_pc"},"dealTargets":[{"dealID":"01474c5a"},{"dealID":"2c48907c"},{"dealID":"2e26c527"},{"dealID":"49ab56e2"},{"dealID":"4f938b45"},{"dealID":"7d1d06bb"},{"dealID":"90a44c9c"},{"dealID":"bac7e43e"},{"dealID":"c723546f"},{"dealID":"cea5a6c3"},{"dealID":"dab10d35"},{"dealID":"fab689f7"}],"responseSize":"ALL"}');
var responseJson = JSON.parse(xhttp.responseText);
responseJson;










////////////////////////////////////////////////////////////////////////////////////////////////////////////////








// Parse html into a document object
var p = new DOMParser()
var d = p.parseFromString(page2, 'text/html')
var w = d.querySelector("div#widgetContent");










////////////////////////////////////////////////////////////////////////////////////////////////////////////////










// TRYING TO USE SCRAPING SCRIPT ON SUBSEQUENT PAGES
var iframe;
iframe = document.createElement('iframe');
iframe.src = 'https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_10?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:10';
//iframe.style.display = 'none';
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.id = "newPage";
iframe.onload = function() {
    var results =[];
    var page10Doc = document.getElementById("newPage").contentWindow.document;
    var page10Window = document.getElementById("newPage").contentWindow

    page10Window.setTimeout(function() { 
        var numOfItemsOnPage = page10Doc.querySelectorAll("div.a-section.a-spacing-none.tallCellView").length;
        //console.log(numOfItemsOnPage);

        for(var i=0; i<numOfItemsOnPage; i++) {
        
        var item = [];

        // Price
        if(page10Doc.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span") === null) {
            item.push(null);
        } else {
            item.push(page10Doc.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span").innerText);
        }

        results.push(item);
    }

        console.table(results);
    }, 5000);

    //console.log(page10);
    //var numOfItemsOnPage = page10.querySelectorAll("div.a-section.a-spacing-none.tallCellView");
    //console.log(numOfItemsOnPage);
    //var deal0 = page10.querySelector("#\\31 00_dealView_0");
    //console.log(deal0);
    //var deal0Price = page10.querySelector("#\\31 00_dealView_0 > div > div:nth-child(2) > div > div > div:nth-child(3) > div > span")
    //console.log(deal0Price);

    /*for(var i=0; i<numOfItemsOnPage; i++) {
        
        var item = [];

        // Price
        if(page10.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span") === null) {
            item.push(null);
        } else {
            item.push(page10.querySelector("#\\31 00_dealView_" + i + "> div > div:nth-child(2) > div > div > div:nth-child(3) > div > span").innerText);
        }

        results.push(item);
    }

    console.table(results);*/
};
document.body.appendChild(iframe);










//////////////////////////////////////////////////////////////////////////////////////////////////////////////// END EXTRA CODE