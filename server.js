const http = require('http'); // core http module
const express = require('express'); // 3rd party express module
const data = require('./data'); // local data module

const hostname = '127.0.0.1'; // localhost (our computer)
const port = 3000; // port to run server on

const app = express(); // creating express app

const server = http.createServer(app); // use app to handle server requests

// homepage route
app.get('/', (req, res) => {
  // sends back html h1 tag
  res.send('<h1>Hello World</h1>')
})

// about page
app.get('/about', (req, res) => {
  // send back h1 for about page
  res.send('<h1>About page</h1>')
})

// friends list
app.get('/friends', (req, res) => {
  // set up empty string
  let friends = '';
  // loop over each item in the data
  for (let index = 0; index < data.length; index++) {
    const friend = data[index];
    // append html to the friend string for each friend in the data
    friends += `<li><a href="/friends/${friend.handle}">${friend.name}</a></li>`
  }
  // send back the list of friends
  res.send(`
  <ul>
    ${friends}
  </ul>
  `)
})

// friend detail page (uses route parameters indicated by :handle )
app.get('/friends/:handle', (req, res) => {
  // destructure the route params to get the handle from the URL
  const { handle } = req.params;

  // find the first friend in the data that matches the route param 'handle'
  const friend = data.find(element => {
    if (element.handle === handle) {
      return true;
    }
    return false;
  })

  // if it couldn't find a friend
  if (!friend) {
    res
      .status(404) // set status to 404 (not found)
      // send back an error
      .send(`<h1>No friend found with handle: ${handle}</h1>`)
  // if we did find a friend
  } else {
    // use the details to send back a page with their info
    res.send(`
      <h1>${friend.name}</h1>
      <h3>${friend.handle}</h3>
      <p>${friend.skill}</p>
    `)
  }
})

// handle all missing pages
app.get('*', (req, res) => {
  res.status(404).send('404 - page not found')
})

// start listening on the given port and hostname
server.listen(port, hostname, () => {
  // once server is listening, log to the console to say so
  console.log(`Server running at http://${hostname}:${port}/`);
});



// const http = require('http');
// const express = require("express");
// const data = require("./data.js")

// const hostname = '127.0.0.1';
// const port = 3000; 

// const app = express();

// const server = http.createServer(app);

// app.get("/", (req, res)=>{
//     res.send("<h1>Hello World</h1>")
// })
// app.get("/about", (req,res)=>{
//     res.send("<h1>about</h1>")
// })
// app.get("/friends", (req, res)=>{
//     let friends = "";
//     for (let index = 0; index < data.length; index++) {
//         const friend = data[index];
//         friends += `<li><a href="/friends/${friend.handle}">${friend.name}</a></li>`
        
//     }
//     res.send(`
//     <ul>
//         ${friends}
//     </ul>
//     `)
// })

// app.get("/friends/:handle", (req, res)=>{
//     const { handle } = req.params;
//     const friend = data.find(element =>{
//         if(element.handle === handle){
//             return true;
//         }
//         return false
//     })
//     if(!friend){
//         res
//             .status(404)
//             .send(`<h1>NO friend found with handle: ${handle}</h1>`)
//     }else {
//         res.send(`
//             <h1>${friend.name}</h1>
//             <h3>${friend.handle}</h3>
//             <h5>${friend.skill}</h5>
//         `)

//     }
// })

// app.get("*", (req, res)=>{
//     res.status(404).send("<h1>404-page not found</h1>")
// })

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

