const request = require('request');
const { rd } = require('../redis');

const simpleGetREST = ({
    url, body, token
}) =>
    new Promise((resolve, reject) => {
        return request(url,
            {
                json: true, body,
                headers: { 'authorization': 'bearer ' + token }
            },
            (err, res, body) => {
                if (err) reject(err)
                if (res.statusCode !== 200) reject("SERVICE COMMUNICATION ERROR")
                resolve(body)
            })
    })

const authGuard = () => async ({ url, body }) => {
    const token = await rd.getAsync("auth_token")
    if (!token) {
        return simpleGetREST({
            url: process.env.GENERATE_TOKEN_ENDPOINT,
            body: {
                "secret": process.env.AUTHENTICATION_PASSWORD,
                "identifier": "instance-1"
            }
        }).then(async ({ auth_token, refresh_token }) => {
            await rd.set("auth_token", auth_token)
            await rd.set("refresh_token", refresh_token)
            return simpleGetREST({ url, body, token: auth_token })
        })
    }
    return simpleGetREST({ url, body, token })

}

exports.simpleGetREST = simpleGetREST
exports.authGuard = authGuard