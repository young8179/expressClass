const http = require('http'); // core http module
const express = require('express'); // 3rd party express module
const bodyParser = require('body-parser') // 3rd party body-parser module
const data = require('./data'); // local data module
const radLogger = require('./middleware/radlogger');

const hostname = '127.0.0.1'; // localhost (our computer)
const port = 3000; // port to run server on

const app = express(); // creating express app

const server = http.createServer(app); // use app to handle server requests

// look for static files in 'public' folder first
app.use(express.static('public'))

// parse json body into an object
app.use(bodyParser.json());

// parse url encoded body into an object
app.use(bodyParser.urlencoded({ extended: true }));

// use our logging middleware on all routes
app.use(radLogger);

// // must have ?awesome=true on url to access /friends routes
// app.use('/friends*',(req, res, next) => {
//   // if the the query 'awesome' exists
//   if (req.query.awesome) {
//     // log it and move on to the next request
//     console.log('AWESOME REQUEST!')
//     next()
//   } else {
//     // otherwise, tell express there is an error
//     // by passing something to the 'next' function
//     next('REQUEST NOT AWESOME');
//   }
// })

// homepage route
app.get('/', (req, res) => {
  // get name from query parameters
  // (default to 'World' if no 'name' query param exists)
  const name = req.query.name || 'World';
  // sends back html h1 tag
  res.send(`<h1>Hello, ${name}</h1>`)
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

app.get('/year', (req, res) => {
  const { age } = req.query;
  const year = 2020;
  const calcAge = year - parseInt(age, 10);
  res.send(`You were born in ${calcAge}`);
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

// handle a GET request to get all friends
app.get('/api/friends', (req, res) => {
  res.json(data);
})

// handle a GET request for a specific friend
app.get('/api/friends/:handle', (req, res) => {
  // get handle from route params
  const { handle } = req.params;

  // find friend in data array using 'handle'
  const friend = data.find(element => {
    if (element.handle === handle) {
      return true
    }
    return false
  })

  // this next line does the same thing as the last statement above, just
  // using the implicit return feature of an arrow function. Shorthand FTW!
  // const friend = data.find(element => element.handle === handle)

  // if no friend found
  if (!friend) {
    // return 404
    res.status(404).json()
  } else {
    // otherwise, return the friend obj as a json response
    res.json(friend);
  }
})

// handle POST requests for creating new friends
app.post('/api/friends', (req, res) => {
  // if the required fields have not been set on the body
  if (!req.body.name || !req.body.handle || !req.body.skill) {
    // return a 422 status code
    res.status(422).json()
    // return nothing to stop function from running
    return;
  }

  // create a new friend object using the data we need
  const newFriend = {
    name: req.body.name,
    handle: req.body.handle,
    skill: req.body.skill,
  }

  // add the new friend to the data array
  data.push(newFriend)
  
  // send the response with a 201 (created) status code
  res.status(201).json()
})

// handle DELETE requests for a specific friend
app.delete('/api/friends/:handle', (req, res) => {
  const { handle } = req.params;

  // find index of friend in array based on the 'handle'
  const friendIndex = data.findIndex(element => {
    if (element.handle === handle) {
      return true;
    }
    return false;
  })

  // if the the friend couldn't be found in the array
  // (.findIndex() will return -1 if it can't find a match)
  if (friendIndex === -1) {
    // send a 404 status
    res.status(404).json();
  } else {
    // otherwise, delete the object at the index found
    data.splice(friendIndex, 1);
    // send a 204 (no content) response
    res.status(204).json()
  }
})

// handle a PUT request for a specific friend
app.put('/api/friends/:handle', (req, res) => {
  // get handle from route params
  const { handle } = req.params;

  // find friendIndex using handle
  // (same as delete route handler, but using the implicit return of arrow func
  const friendIndex = data.findIndex(element => element.handle === handle);

  // if the request is missing key fields
  if (!req.body.name || !req.body.handle || !req.body.skill) {
    // send a 422 (unprocessable entity) status code
    res.status(422).json()
    // and stop running the handler function
    return;
  }
  // create a new friend object using the fields from the req.body
  const newFriend = {
    name: req.body.name,
    handle: req.body.handle,
    skill: req.body.skill,
  }

  // if the friend index could not be found
  if (friendIndex === -1) {
    // send a 404 (not found) status code
    res.status(404).json();
  } else {
    // otherwise, replace the old obj at the correct index with
    // the new friend object that we created
    data.splice(friendIndex, 1, newFriend);
    // set a 202 (accepted) response
    res.status(202).json()
  }
})


// handle PATCH request for a specific friend
app.patch('/api/friends/:handle', (req, res) => {
  // get the handle from the route params
  const { handle } = req.params;

  // set up an index variable to change later
  let friendIndex = -1;
  // find the friend using the handle
  const friend = data.find((element, index) => {
    if (element.handle === handle) {
      // update the friendIndex placeholder from earlier
      friendIndex = index
      return true;
    }
    return false;
  })

  // if the body doesn't include ANY of the requested fields, then
  // there will be nothing to update
  if (!req.body.name && !req.body.handle && !req.body.skill) {
    // so return a 422 (unprocessable entity) status code
    res.status(422).json()
    // and stop running the handler function
    return;
  }
  
  // explicitly check for the each property on the request body
  // and replace it on the friend object if it exists
  if (req.body.name) {
    friend.name = req.body.name
  }
  if (req.body.handle) {
    friend.handle = req.body.handle
  }
  if (req.body.skill) {
    friend.skill = req.body.skill
  }

  // same solution as above (explicit checks) using ternary operators
  // friend.name = req.body.name ? req.body.name : friend.name
  // friend.handle = req.body.handle ? req.body.handle : friend.handle
  // friend.skill = req.body.skill ? req.body.skill : friend.skill


  // alternative solution using the keys of the friend object
  // to check if the same key exists on the request body
  // Object.keys(friend).forEach(key => {
  //   friend[key] = req.body[key] ? req.body[key] : friend[key];
  // })

  // if there was no friend found 
  if (friendIndex === -1) {
    // return a 404 (not found) status code
    res.status(404).json();
  } else {
    // otherwise, replace the friend at the appropriate index with
    // the one we just updated
    data.splice(friendIndex, 1, friend);
    // return a 202 (accepted) status code
    res.status(202).json()
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