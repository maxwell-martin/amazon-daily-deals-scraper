/*  
    Web Scraping Project

    BACK-END SCRAPER

    Solution: Mimic Amazon POST requests for product data.

        To run code:
            -Go to: https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb_azl
            -Open up developer tools
            -Open up the console
            -Copy and paste this code into the console
            -Press enter key on keyboard
            -Wait until csv file appears in downloads or a popup asks if you want to save or download the csv file
    
        What this code does:
            -Gets source code from all pages.
            -Parses out everything but dealIds.
            -Compares dealIds from source code of each page and keeps unique ids
            -Requests deal data using dealIds from Amazon's API.
            -Parses deal data for each deal.
            -Converts deal data into csv format.
            -Downloads file containing csv formatted data to computer.

        Issues:
            -This code only gets 300 deals out of 1000.
            -Amazon uses dynamic rendering of pages to load the daily deals. Only 300 dealIds appear in the non-js-rendered source code. Where are the other 700 dealIds?

        * WORKING AS OF O5/22/2019 AT 9:14PM *
*/




// START SCRAPE...
console.log("Starting scrape...");

// Get all urls and put into an array

// Get the total number of pages containing daily deals items.
var numOfPages = parseInt(document.querySelector('li.a-disabled:nth-child(6)').innerText);
console.log("Number of Pages: " + numOfPages);

// Array to hold pages
var pages = [];

// URL parts for subsequent pages; must concatenate with page number: pt1 + # + pt2 + #
var urlPt1 = "https://www.amazon.com/gp/goldbox/ref=gbps_ftr_s-5_5baf_page_";
var urlPt2 = "?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT%252CUPCOMING,includedAccessTypes:GIVEAWAY_DEAL,page:";

// Loop to add all subsequent pages to the subPages array
for (var i=1; i<=numOfPages; i++) {
    console.log("Getting page urls...");
    var pageURL = urlPt1 + i + urlPt2 + i;
    pages.push(pageURL);
}

// Send xhr request to get source code of every page

function getPageData_GET(url) {         // GET xhr request to get source code for every page
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send(null);
    return xhttp.responseText;
}

// Array to hold response text for every page
var arrResponseText = [];

pages.forEach(function(page) {
    console.log("Getting source code for all pages...");
    var pageResponseText = getPageData_GET(page);
    arrResponseText.push(pageResponseText);
});

// Extract dealIds from each page's response text

var arrDealIds = [];

arrResponseText.forEach(function(responseText) {
    console.log("Extracting unique deal IDs...");
    var regEx = /\"sortedDealIDs\"\s:\s[^\]]+\]/;
    var arrUnformattedIds = responseText.match(regEx);
    var strDealIds = arrUnformattedIds[0].substring(18, arrUnformattedIds[0].length);
    var jsonArrDealIds = JSON.parse(strDealIds); //jsonArrDealIds is an array

    jsonArrDealIds.forEach(function(dealId) {
        if (!arrDealIds.includes(dealId)) {
            arrDealIds.push(dealId);
        }
    });
}); // At the end of this, arrDealIds should only contain 

// Create arrays with only 100 deals at a time since API only allows 100 at a time.

var arr100deals_1 = [];
var arr100deals_2 = [];
var arr100deals_3 = [];

for (var i=0; i<arrDealIds.length; i++) {
    console.log("Filling arrays of 100 dealIds each...");
    if (i >= 0 && i < 100) {
        arr100deals_1.push({dealID:arrDealIds[i]});
    } else if (i >= 100 && i < 200) {
        arr100deals_2.push({dealID:arrDealIds[i]});
    } else {
        arr100deals_3.push({dealID:arrDealIds[i]});
    }
}

var arrOfArrOf100deals = [arr100deals_1, arr100deals_2, arr100deals_3];

// Send xhr request for each set of 100 deals

function getPageData_POST(url, jsonBody) {      // POST xhr request to get deal data.
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);
    xhttp.send(jsonBody);
    return xhttp.responseText;
}

var arrJsonDeals = [];

arrOfArrOf100deals.forEach(function(arr) {
    console.log("Sending requests to Amazon API for JSON data of each deal...");
    var url = "https://www.amazon.com/xa/dealcontent/v2/GetDeals";
    var data = {requestMetadata:{marketplaceID:"ATVPDKIKX0DER",clientID:"goldbox_mobile_pc",sessionID:"133-8221658-2482735"},dealTargets:arr,responseSize:"ALL",itemResponseSize:"DEFAULT_WITH_PREEMPTIVE_LEAKING",widgetContext:{pageType:"GoldBox",subPageType:"main",deviceType:"pc",refRID:"3W94XCXTWX4TG8Z3RZS1",widgetID:"a7e1c818-e7bc-4318-ae47-1f5300505baf",slotName:"slot-5"}};
    var responseTextJson = getPageData_POST(url, JSON.stringify(data));
    arrJsonDeals.push(JSON.parse(responseTextJson));
});

//Array to store table data
var results = [];

console.log("Creating data headers...");
var lineHeaders = [
    "dealID",
    "title",
    "description",
    "merchantName",
    "pageUrl",
    "imageUrl",
    "isEligibleForFreeShipping",
    "isFullfilledByAmazon",
    "isPrimeEligible",
    "minCurrentPrice",
    "maxCurrentPrice",
    "minDealPrice",
    "maxDealPrice",
    "minListPrice",
    "maxListPrice",
    "minPercentOff",
    "maxPercentOff",
    "timeToDealStart",
    "timeToDealEnd",
    "reviewRating",
    "totalReviews",
    "dealType",
];

results.push(lineHeaders);

//Convert milliseconds to "h:m:s";
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs; //+ '.' + ms;
}

//Loop through each deal, store data in line array, and add line array to results array
arrJsonDeals.forEach(function(obj) {
    Object.keys(obj.dealDetails).forEach(function(prop) {
        console.log("Extracting details for each deal...");
        var lineItem = [
            obj.dealDetails[prop].dealID,
            obj.dealDetails[prop].title,
            obj.dealDetails[prop].description,
            obj.dealDetails[prop].merchantName,
            obj.dealDetails[prop].egressUrl,
            obj.dealDetails[prop].primaryImage,
            obj.dealDetails[prop].isEligibleForFreeShipping,
            obj.dealDetails[prop].isFulfilledByAmazon,
            obj.dealDetails[prop].isPrimeEligible,
            obj.dealDetails[prop].minCurrentPrice,
            obj.dealDetails[prop].maxCurrentPrice,
            obj.dealDetails[prop].minDealPrice,
            obj.dealDetails[prop].maxDealPrice,
            (obj.dealDetails[prop].minListPrice !== null) ? obj.dealDetails[prop].minListPrice : "NA",
            (obj.dealDetails[prop].maxListPrice !== null) ? obj.dealDetails[prop].maxListPrice : "NA",
            obj.dealDetails[prop].minPercentOff,
            obj.dealDetails[prop].maxPercentOff,
            msToTime(obj.dealDetails[prop].msToStart),
            msToTime(obj.dealDetails[prop].msToEnd),
            obj.dealDetails[prop].reviewRating,
            obj.dealDetails[prop].totalReviews,
            obj.dealDetails[prop].type,
        ];

        results.push(lineItem);
    });
});

function exportToCsv(filename, rows) {
    console.log("Starting csv export...");
    var processRow = function (row) {
        console.log("Formatting data in csv format...");
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

    console.log("Creating csv string...");
    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
    
    console.log("Creating download...");
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
        console.log("Downloading file...");
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            console.log("Downloading file...");
            document.body.removeChild(link);
        }
    }
}

var fileName = "amazon-results.csv";

exportToCsv(fileName, results);

console.log("Scraping complete. A file named \"" + fileName + "\" is now available in your Downloads folder or has popped up on your screen.");

// END SCRAPE.