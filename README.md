# MonzoSaver

Monzo saver is a little node application to send yourself an allowance from a pot every morning and
the next day reset your balance from that same pot so you **always** have the exact same daily allowance. 

Depending of you being above 10 or below 10 it will automatically detect your balannce and either deposit or withdraw as required.

This was born to make smarter the IFTTT applet "pay me a daily allowance" which doesn't allow for this.  
###Example 1 

1. Allowance = 10 GBP
2. You spend 6 pounds, your account has 4 pounds left
3. Next day you'll be added 6 pounds so you restart the day with another 10 pounds, not a penny more. 

### Example 2

1. You spend 11 pounds, so your account is on -1
2. Next day you're deposited 11 pounds, so you again have 10 pounds. 



## Requirements
* You ave node and npm installed. 
* The computer you're using is connected to the internet by the time the utility runs.
* You know your Monzo API access codes (https://developer.monzo.com)

## Note

In order for it to run as you intend it to do you'll need a scheduler, either cron, supervisor or whichever scheduler flavour you prefer. 


1. Clone it to a computer or server with permanent access to internet. 
2. Run **npm install**
3. Run **sudo npm link**. This will create the commmand "monzo"
4. Create your .env file as in the given example 
5. Run **crontab -e** to edit your crontab scheduler. 
6. At the end of the file, changing username for your linux username, add: 
    
    1 6    * * *   USERNAME  monzo -r
   
## Possible issues
Receiving the payment at a different time that you set it up?
Ensure your server is running with your timezone by running **date** on your terminal. If not, there are plenty of online resources about how to change it.    