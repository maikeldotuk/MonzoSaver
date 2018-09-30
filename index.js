#!/usr/bin/env node


require('dotenv').config()
const rp = require('request-promise')

const accessToken = process.env.ACCESS_TOKEN
const accountID = process.env.ACCOUNT_ID
const dailyAllowancePot = 'pot_00009ZDK4C7epnzMPsk4sD'
const headers = {
    Authorization: 'Bearer ' + accessToken
}
const currentAccountID = 'acc_00009Qi4UwzXCv7WB4723N'
const program = require('commander')

class App {
    async getBalance() {
        let response = await rp({
            uri: 'https://api.monzo.com/balance?account_id=' + currentAccountID,
            headers: headers,
            json: true
        })
        return parseInt(response.balance, 10)
    }

    async depositOrWithdraw() {
        let balance = await this.getBalance()
        let niceBalance = 'You have not spent a penny'
        if (balance < 1000) {
            await this.withdraw(1000 - balance)
            niceBalance = '£' + ((1000 - balance) / 100).toFixed(2)
            await this.feed('You have overspent: ' + niceBalance)
        } else if (balance === 1000) {
            await this.feed(niceBalance)
        } else {
            await this.deposit(balance - 1000)
            niceBalance = '£' + ((balance - 1000) / 100).toFixed(2)
            await this.feed('You have saved: ' + niceBalance)
        }
        console.log(niceBalance)
        process.exit(0)
    }

    async deposit(amount) {
        let response = await rp.put({
            uri: 'https://api.monzo.com/pots/' + dailyAllowancePot + '/deposit',
            method: 'PUT',
            form: {
                source_account_id: currentAccountID,
                amount: amount,
                dedupe_id: new Date()
            },
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "content-type": 'application/x-www-form-urlencoded'
            }
        })
        return response
    }

    async withdraw(amount) {
        let response = await rp.put({
            uri: 'https://api.monzo.com/pots/' + dailyAllowancePot + '/withdraw',
            method: 'PUT',
            form: {
                destination_account_id: currentAccountID,
                amount: amount,
                dedupe_id: new Date()
            },
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "content-type": 'application/x-www-form-urlencoded'
            }
        })
        return response
    }

    async feed(message) {
        let response = await rp.post({
            uri: 'https://api.monzo.com/feed',
            form: {
                account_id: currentAccountID,
                type: "basic",
                "params[title]": "AutoSave",
                "params[image_url]": "https://www.maikel.uk/images/dda140675725d995726117c249804e365bf90fb9.png",
                "params[background_color]": "#FFFFFF",
                "params[body_color]": "#000000",
                "params[title_color]": "#000000",
                "params[body]": message
            },
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "content-type": 'application/x-www-form-urlencoded'
            }
        })
    }
}

const app = new App()

program
    .version('0.1.0')
    .option('-r, --run', 'Run autosaver')
    .parse(process.argv);

if (program.run) app.depositOrWithdraw()