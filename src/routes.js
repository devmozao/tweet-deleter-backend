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
  const result = await twit
    .get('statuses/user_timeline', { screen_name: 'devmozao', count: 50 })
    .then(response => {
      const tweets = response.data
      const result = []

      for (const tweet of tweets) {
        result.push(tweet)
      }
      return {
        data: result,
        remaining: response.resp.headers['x-rate-limit-remaining']
      }
    })
    .catch(error => {
      return res.send(error)
    })

  return res.json(result)
})

routes.post('/deleteTweets', async (req, res) => {
  const value = req.body.data

  const result = await Promise
    .all(value.map(item => {
      return twit.post('statuses/destroy/:id', { id: item })
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
