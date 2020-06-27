'use strict'

const axios = require('axios')

const api = axios.create({
  // baseURL: 'https://api.twitter.com/1.1/statuses/',
  // consumer-secret="${process.env.CONSUMER_SECRET}",
  // 'token-secret': "${process.env.TOKEN_SECRET}",

  timeout: 1000,
  headers: {
    authorization: `OAuth
    oauth_consumer_key="${process.env.CONSUMER_KEY}",
    oauth_nonce="generated_oauth_nonce",
    oauth_signature="generated_oauth_signature",
    oauth_signature_method="HMAC-SHA1",
    oauth_timestamp="generated_timestamp",
    oauth_token="${process.env.TOKEN}",
    oauth_version="1.0"`
  }
})

function getTimeline() {
  return api
    .get('https://api.twitter.com/1.1/statuses/home_timeline.json')
    .then(result => result.data)
}

function getUserTimeline(username = '') {
  return api
    .get('user_timeline.json')
    .then(result => result.data)
}

module.exports = { getTimeline, getUserTimeline }
