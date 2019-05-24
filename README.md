# Amazon Daily Deals Scraper

The options to scrape data are `code/front-end` and `code/back-end`: 

The file `front-end-scrape-main.js` inside the `code/front-end` folder goes through each daily deals page and scrapes data from the DOM. It gets limited data about all 1000 deals. 

The file `back-end-scrape-main.js` inside the `code/back-end` folder mimics Amazon's API calls. It gets more detailed data about only 300 deals.

The `links only` files scrape only the links of the daily deals. There are two options, front-end and back-end. The links are then available in an array.

---

To run any of these files:
- Go to: https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb_azl
- Open up developer tools
- Open up the console
- Copy and paste the code into the console
- Press enter key on keyboard
- Wait until `amazon-results-[DATE].csv` file appears in downloads or a popup asks if you want to save or download the .csv file

---

The `code/miscellaneous` folder contains two files:
- `miscellaneous.js` contains random code created during the process of doing this project
- `r-script-for-descriptive-stats.R` contains R code to gather descriptive statistics about the scraped data

---

Written using [Vanilla JS](http://vanilla-js.com/) :wink: