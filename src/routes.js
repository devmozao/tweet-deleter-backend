'use strict'

const routes = require('express').Router()
const Twitter = require('twitter-lite')

let oauth_token = ''
let oauth_token_secret = ''

let token = ''
let oauthVerifier = ''

let access_token = ''
let access_token_secret = ''

let userId = ''
let screenName = ''

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET
})

function ClientStream () {
  return new Twitter({
    subdomain: 'api',
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: access_token,
    access_token_secret: access_token_secret
  })
}

routes.get('/authAddress', (req, res) => {
  client
    .getRequestToken('http://localhost:3000/ok')
    .then(response => {
      console.log('result', response)
      console.log('token', response.oauth_token)
      console.log('secret', response.oauth_token_secret)

      oauth_token = response.oauth_token
      oauth_token_secret = response.oauth_token_secret

      res.json({
        url: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
      })
    })
    .catch(error => {
      console.log('error', error)
      res.status(500).json({
        description: 'Something went wrong',
        error: error
      })
    })
})

routes.post('/handleLogin', async (req, res) => {
  console.log('body', req.body)
  token = req.body.oauth_token
  oauthVerifier = req.body.oauth_verifier
  console.log('token', token)
  console.log('verifier', oauthVerifier)

  client
    .getAccessToken({
      oauth_token: token,
      oauth_verifier: oauthVerifier
    })
    .then(response => {
      console.log({
        accTkn: response.oauth_token,
        accTknSecret: response.oauth_token_secret,
        userId: response.user_id,
        screenName: response.screen_name
      })
      access_token = response.oauth_token
      access_token_secret = response.oauth_token_secret
      userId = response.user_id
      screenName = response.screen_name

      res.status(200).json('OAuth successful.')
    })
    .catch(error => {
      console.log('Somenthing went wrong:', error)
      res.status(400).send(error)
    })
})

routes.get('/getTimeline', async (req, res) => {
  const client = new ClientStream()
  await client
    .get('statuses/user_timeline', { screen_name: screenName, count: 200 })
    .then(response => {
      const tweets = { ...response }
      const result = []
      let remaining = {}

      for (const [key, value] of Object.entries(tweets)) {
        if (key === '_headers') {
          remaining = value
        } else {
          result.push(value)
        }
      }

      return res.json({
        data: result,
        remaining: remaining
        // remaining: response.resp.headers['x-rate-limit-remaining']
      })
    })
    .catch(error => {
      console.log('Something went wrong:', error)
      return res.send(error)
    })
})

routes.post('/deleteTweets', async (req, res) => {
  const items = req.body.data
  const apiDelete = new ClientStream()
  const result = await Promise
    .all(items.map(item => {
      return apiDelete.post('statuses/destroy', { id: item })
    }))
    .then(response => {
      return response
    })
    .catch(error => {
      return error
    })

  console.log(result)
  return res.json(result)
})

module.exports = routes
