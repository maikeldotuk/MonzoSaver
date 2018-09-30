#!/usr/bin/env node
require('dotenv').config()
const rp = require('request-promise')
const program = require('commander')

const accessToken = process.env.ACCESS_TOKEN
const accountID = process.env.ACCOUNT_ID // TODO: Not sure if this has to do with renewing the token.
const dailyAllowancePot = process.env.pot
const allowance = Number(process.env.ALLOWANCE) * 100
const currentAccountID = process.env.CURRENT_ACCOUNT_ID
const headers = {
    Authorization: 'Bearer ' + accessToken
}
const monzoAPI = 'https://api.monzo.com'

class App {
    async getBalance() {
        let response = await rp({
            uri: monzoAPI + '/balance?account_id=' + currentAccountID,
            headers: headers,
            json: true
        })
        return parseInt(response.balance, 10)
    }

    async depositOrWithdraw() {
        let balance = await this.getBalance()
        let niceBalance = 'You have not spent a penny'
        if (balance < 1000) {
            await this.withdraw(allowance - balance)
            niceBalance = '£' + ((allowance - balance) / 100).toFixed(2)
            await this.feed('You have overspent: ' + niceBalance)
        } else if (balance === allowance) {
            await this.feed(niceBalance)
        } else {
            await this.deposit(balance - allowance)
            niceBalance = '£' + ((balance - allowance) / 100).toFixed(2)
            await this.feed('You have saved: ' + niceBalance)
        }
        console.log(niceBalance)
        process.exit(0)
    }

    async deposit(amount) {
        let response = await rp.put({
            uri: monzoAPI + '/pots/' + dailyAllowancePot + '/deposit',
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
            uri: monzoAPI + '/pots/' + dailyAllowancePot + '/withdraw',
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
        await rp.post({
            uri: monzoAPI + '/feed',
            form: {
                account_id: currentAccountID,
                type: "basic",
                "params[title]": "Monzo Auto Saver",
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
