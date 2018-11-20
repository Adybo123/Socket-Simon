/*
  Socket Simon Client Script
  Original version by Adam Soutar
*/

var myColour = ''
var playing = false
var socket

function inputHandler() {
  if (!playing) {
    socket.emit('start')
    return
  }
  socket.emit('patternInput')
}

$(() => {
  socket = io()

  $(document).click(inputHandler)
  $(document).keydown(inputHandler)

  socket.on('colour', (data) => {
    playing = true
    myColour = data
    $('body').css('background-color', myColour)
    $('#startHeader').addClass('off')
  })

  socket.on('fire', () => {
    $('#led').removeClass('off')
    setTimeout(() => {
      $('#led').addClass('off')
    }, 250)
  })
})
