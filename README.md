# MonzoSaver

Monzo saver is a little node application to send yourself an allowance from a pot every morning and
the next day reset your balance from that same pot so you **always** have the exact same daily allowance. 

Depending on your account being above or below yout allowance it will either deposit or withdraw as required once per day. 

This was born to make smarter the IFTTT applet "pay me a daily allowance" which doesn't allow for this.  

### Example 1 

1. Allowance = 10 GBP
2. You spend 6 pounds, your account has 4 pounds left
3. Next day you'll be added 6 pounds so you restart the day with another 10 pounds, not a penny more. 

### Example 2

1. You spend 11 pounds, so your account is on -1
2. Next day you're deposited 11 pounds, so you again have 10 pounds. 



## Requirements
* You have node and npm installed. 
* The computer you're using is connected to the internet by the time the utility runs.
* You know your Monzo API access codes (https://developers.monzo.com/).
* Basic knowledge of what a cron job is. 

## How to run it

In order for it to run whenever you want you'll need a scheduler. As cron is fairly simple below there are details of using it with it 

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