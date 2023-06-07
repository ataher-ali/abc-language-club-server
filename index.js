const express = require('express')
require('dotenv').config()
const app = express();
const port =process.env.PORT || 4040

var cors = require('cors')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('abc server on!')
  })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })