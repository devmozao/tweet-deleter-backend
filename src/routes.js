'use strict'

const routes = require('express').Router()

const Twit = require('twit')

const twit = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.TOKEN,
  access_token_secret: process.env.TOKEN_SECRET,
  timeout_ms: 10000
})

routes.get('/getTimeline', async (req, res) => {
  console.log(req.params)
  console.log(req.query)
  console.log(req.body)

  const result = await twit
    .get('statuses/user_timeline', { screen_name: 'devmozao', count: 200 })
    .then(response => {
      return {
        data: { ...response.data },
        remaining: response.resp.headers['x-rate-limit-remaining']
      }
    })
    .catch(error => {
      return res.send(error)
    })

  console.log(result)
  return res.json(result)
})

module.exports = routes
