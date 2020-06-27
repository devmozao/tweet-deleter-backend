'use strict'

const routes = require('express').Router()

const { api, request } = require('./services/handlerRequest')

routes.get('/', async (req, res) => {
  console.log(req.params)
  console.log(req.query)
  console.log(req.body)

  try {
    const response = await api.getTimeline('devmozao')
    console.log(response)
    return res.json(response)
  } catch (error) {
    console.log('error', error)
    return res.send(error)
  }
})

module.exports = routes
