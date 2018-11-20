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

  $(document).on('click touchstart', inputHandler)
  $(document).keydown(inputHandler)

  socket.on('colour', (data) => {
    playing = true
    myColour = data
    $('#led').css('background-color', myColour)
    $('#startHeader').addClass('off')
  })

  socket.on('fire', () => {
    $('#led').removeClass('off')
    setTimeout(() => {
      $('#led').addClass('off')
    }, 250)
  })

  socket.on('failed', (data) => {
    $('#startHeader').html(`Game over.<br />You got ${data.correct} patterns correct.`)
    $('#startHeader').removeClass('off')
    playing = false
  })
})
