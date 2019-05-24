# R-script to get summary statistics for web scraping project




#Import data
data <- read.csv("fileName", header=T, sep=",")

#Enable chron library
library(chron)

#Convert timeRemaining data to useable dataType
data$timeRemaining <- chron(times=data[,7])

#Summary stats for currentPrice, previousPrice, percentageOff, percentClaimed, timeRemaining, and numberOfReviews
summary(data[,c(3,4,5,6,7,9)])




#Products with summary stat values for currentPrice
data[which(data$currentPrice.avgCurrentPrice == 
        as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[1,1]))),1] #currentPrice, min prod

data[which(data$currentPrice.avgCurrentPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[2,1]))),1] #currentPrice, 1st q prod

data[which(data$currentPrice.avgCurrentPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[3,1]))),1] #currentPrice, median prods

data[which(data$currentPrice.avgCurrentPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[4,1]))),1] #currentPrice, mean prods

data[which(data$currentPrice.avgCurrentPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[5,1]))),1] #currentPrice, 3rd q prods

data[which(data$currentPrice.avgCurrentPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[6,1]))),1] #currentPrice, max prods




#Products with summary stat values for previousPrice
data[which(data$previousPrice.avgPreviousPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[1,2]))),1] #previousPrice, min prod

data[which(data$previousPrice.avgPreviousPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[2,2]))),1] #previousPrice, 1st q prod

data[which(data$previousPrice.avgPreviousPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[3,2]))),1] #previousPrice, median prods

data[which(data$previousPrice.avgPreviousPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[4,2]))),1] #previousPrice, mean prods

data[which(data$previousPrice.avgPreviousPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[5,2]))),1] #previousPrice, 3rd q prods

data[which(data$previousPrice.avgPreviousPrice == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[6,2]))),1] #previousPrice, max prods




#Products with summary stat values for percentageOff
data[which(data$percentageOff == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[1,3]))),1] #percentageOff, min prod

data[which(data$percentageOff == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[2,3]))),1] #percentageOff, 1st q prod

data[which(data$percentageOff == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[3,3]))),1] #percentageOff, median prods

data[which(data$percentageOff == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[4,3]))),1] #percentageOff, mean prods

data[which(data$percentageOff == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[5,3]))),1] #percentageOff, 3rd q prods

data[which(data$percentageOff == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[6,3]))),1] #percentageOff, max prods




#Products with summary stat values for percentClaimed
data[which(data$percentClaimed == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[1,4]))),1] #percentClaimed, min prod

data[which(data$percentClaimed == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[2,4]))),1] #percentClaimed, 1st q prod

data[which(data$percentClaimed == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[3,4]))),1] #percentClaimed, median prods

data[which(data$percentClaimed == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[4,4]))),1] #percentClaimed, mean prods

data[which(data$percentClaimed == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[5,4]))),1] #percentClaimed, 3rd q prods

data[which(data$percentClaimed == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[6,4]))),1] #percentClaimed, max prods




#Products with summary stat values for timeRemaining
data[which(data$timeRemaining == 
             trimws(sub('[a-zA-z]*.[ ]*:', '', summary(data[,c(3,4,5,6,7,9)])[1,5]))),1] #timeRemaining, min prod

data[which(data$timeRemaining == 
             trimws(sub('1st Qu.:', '', summary(data[,c(3,4,5,6,7,9)])[2,5]))),1] #timeRemaining, 1st q prod

data[which(data$timeRemaining == 
             trimws(sub('[a-zA-z]*.[ ]*:', '', summary(data[,c(3,4,5,6,7,9)])[3,5]))),1] #timeRemaining, median prods

data[which(data$timeRemaining == 
             trimws(sub('[a-zA-z]*.[ ]*:', '', summary(data[,c(3,4,5,6,7,9)])[4,5]))),1] #timeRemaining, mean prods

data[which(data$timeRemaining == 
             trimws(sub('3rd Qu.:', '', summary(data[,c(3,4,5,6,7,9)])[5,5]))),1] #timeRemaining, 3rd q prods

data[which(data$timeRemaining == 
             trimws(sub('[a-zA-z]*.[ ]*:', '', summary(data[,c(3,4,5,6,7,9)])[6,5]))),1] #timeRemaining, max prods




#Products with summary stat values for numberOfReviews
data[which(data$numberOfReviews == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[1,6]))),1] #numberOfReviews, min prod

data[which(data$numberOfReviews == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[2,6]))),1] #numberOfReviews, 1st q prod

data[which(data$numberOfReviews == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[3,6]))),1] #numberOfReviews, median prods

data[which(data$numberOfReviews == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[4,6]))),1] #numberOfReviews, mean prods

data[which(data$numberOfReviews == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[5,6]))),1] #numberOfReviews, 3rd q prods

data[which(data$numberOfReviews == 
             as.numeric(sub('.*:', '', summary(data[,c(3,4,5,6,7,9)])[6,6]))),1] #numberOfReviews, max prods


