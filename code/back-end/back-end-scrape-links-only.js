function getLinks(linksArray) {
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

    //Loop through each deal and store links in array.
    arrJsonDeals.forEach(function(obj) {
        Object.keys(obj.dealDetails).forEach(function(prop) {
            console.log("Extracting urls for each deal...");
            linksArray.push(obj.dealDetails[prop].egressUrl);
        });
    });
}

var linksArray = [];
getLinks(linksArray);
console.log(linksArray);

// END SCRAPE.