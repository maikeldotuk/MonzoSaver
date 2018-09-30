# MonzoSaver

Monzo saver is a little node application to send yourself an allowance from a pot every morning and
the next day reset your balance from that same pot so you **always** have the same daily allowance. 

For example:
allowance = 10 GBP

You spend 6 pounds, your account has 4 pounds left

Next day you'll be added 6 pounds so you restart the day with another 10 pounds, not a penny more. 

Another example:

You spend 11 pounds, so your account is on -1

Next day you're deposited 11 pounds, so you again have 10 pounds. 

## How to run

1. Create an .env file following the example of .env-example
2. Ensure you have node and npm installed. 
3. Run **sudo npm link** this will create the command "monzo"
4. Run **monzo -r** or **monzo --run** and enjoy. 

## Note

In order for it to run as you intend it to do you'll need a scheduler, either cron, supervisor or whichever scheduler flavour you prefer. 


1. Clone it to a computer or server with permanent access to internet. 
2. Run **npm install**
3. Run **npm link**
4. Create your .env file as in the example
5. Run **crontab -e** to edit your crontab scheduler. 
5. Add a cronjob "01 6    * * *   maikel  monzo -r"

Ensure your server is running with your timezone by running **date** on your terminal. 