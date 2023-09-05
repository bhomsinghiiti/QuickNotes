const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')

connectToMongo();


const app = express()
const port = 5000


app.use(cors())

//if you want to use request.body (req.body)
app.use(express.json())

//Availbale Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

//Default expreess template->
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`iNoteBook backend listening on port ${port}`)
})