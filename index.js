/*
  Socket Simon Server
  Original version by Adam Soutar
*/

const express = require('express')
var app = express()
var http = require('http').Server(app)
const io = require('socket.io')(http)
var port = process.env.PORT || 3000

// Static pages from directory
app.use('/app', express.static('web'))

// Socket handlers
var playing = false
var players = []
var simonColours = ['#7dcc6c', '#cc6c6c', '#dbd56f', '#6ab5d1']
var patternPos = 0
var patternLength = 3
var pattern = []
var patternDelay = 500

function randomHex () {
  var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  function randomHexChar () {
    return hexChars[Math.floor(Math.random() * hexChars.length)]
  }
  var returnString = '#'
  for (let i = 0; i < 6; i++) {
    returnString += randomHexChar()
  }
  return returnString
}

function getColour () {
  var colour = (simonColours.length > 0) ? simonColours[0] : randomHex()
  if (simonColours.length !== 0) {
    simonColours.shift()
  }
  return colour
}

function doRound () {
  var i = 1
  for (let p of pattern) {
    // Random player
    setTimeout(() => {
      p.emit('fire')
    }, i * patternDelay)
    i++
  }
}

function setupGame () {
  // Initialise pattern
  for (let i = 0; i < patternLength; i++) {
    addToPattern()
  }
  // Tell the client which colour to light up
  for (let p of players) {
    let clientColour = getColour()
    console.log(`Assigning ${clientColour}`)
    p.emit('colour', clientColour)
  }
}

function addToPattern () {
  let thisP = players[Math.floor(Math.random() * players.length)]
  pattern.push(thisP)
}

io.on('connection', (socket) => {
  console.log('New web client connection')
  players.push(socket)

  socket.on('start', () => {
    if (!playing) {
      console.log('Received a play command.')
      playing = true
      setupGame()
      doRound()
    }
  })

  socket.on('patternInput', () => {
    console.log('Pattern input')
    if (pattern[patternPos] === socket) {
      // Correct
      console.log('Correct')
      patternPos++
      if (patternPos >= patternLength) {
        // Done
        console.log('Pattern over')
        patternPos = 0
        patternLength++
        addToPattern()
        doRound()
      }
    } else {
      console.log('Incorrect, restarting pattern')
      // Wrong pattern! Start again
      patternPos = 0
      doRound()
    }
  })

  socket.on('disconnect', () => {
    console.log('Web client disconnected')
    // Remove from players array
    players.splice(players.indexOf(socket), 1)
  })
})

// Start server
http.listen(port, () => {
  // TODO: Display server local IP
  console.log(`Socket Simon is up! Play from: http://localhost:${port}/app`)
})
