# Socket Simon

*The 70s toy played across all your web devices with Node and Socket.IO*



### How to play

Clone the repo, and use 'node index.js' in the directory root to host a server on localhost:3000. Use other computers to go to your local IP, with /app on the end. E.g *"http://192.168.x.x:3000/app"*



Hit a key or tap/click to begin, and watch the pattern play out across all the devices connected. You can use phones, PCs, multiple tabs on the same PC, or a mixture of each. Repeat the pattern by pressing a key or clicking on each of the different connected clients. The pattern becomes harder over time.



### How does it work?

The server waits for a game start socket message, and assigns a colour to each client. Then, it sends out the pattern using a delay loop, with each iteration being sent 2 seconds after the other. During the input stag, the clients send a 'pattern input' signal, and the server matches their socket signature to a 'pattern array' which is all of the socket signatures in the correct order, moving along the pattern array as each client submits.
