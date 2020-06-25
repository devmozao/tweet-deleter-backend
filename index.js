const express = require('express')
const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('Teste')
})


app.listen(PORT, function () {
  console.log(`Server is running on PORT:${PORT}`)
})