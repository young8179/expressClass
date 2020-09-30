const http = require("http");
const express = require("express");
const data = require("./data")

const hostname = "127.0.0.1"
const port = 3000;

const app = express()

const server = http.createServer(app)

app.get("/", (req, res)=>{
    res.send("Hello World")
})

app.get("/cats", (req, res)=>{
    res.send("Meow!!!!")
})

app.get("/dogs", (req, res)=>{
    res.send("Woof!!!")
})

app.get("/cats_and_dogs", (req, res)=>{
    res.send("Dogs and cats living together...mass hysteria!!")
})

app.get("/greet/luck", (req, res)=>{
    res.send(`<h1>Hello, Luke!!!!</h1>`)
})
app.get("/greet/Ahsoka", (req, res)=>{
    res.send(`<h1>Hello, Ahsoka!!!!</h1>`)
})
app.get("/greet/Han", (req, res)=>{
    res.send(`<h1>Hello, Han!!!!</h1>`)
})
app.get("/greet/Tiana", (req, res)=>{
    res.send(`<h1>Hello, Tiana!!!!</h1>`)
})

app.get("/friends", (req, res)=>{
    let friends = "";
    for (let index = 0; index < data.length; index++) {
        const friend = data[index];
        friends += `<li><a href="/friends/${friend.name}">${friend.name}</a></li>`
    }
    res.send(`
        <ul>${friends}</ul>
    `) 
        
})

app.get("/friends/:name", (req, res)=>{
    const { name } = req.params;
    console.log(name);
    const friend = data.find(element =>{
        if(element.name === name){
            return true;
        }
        return false;
    })
    if(!friend){
        res
            .status(404)
            .send("<h1>No friend found</h1>")
    }else {
        res.send(`
            <h1>${friend.name}</h1>
            <h1>${friend.handle}</h1>
            <h1>${friend.skill}</h1>
        `)
    }
})

app.get("/year", (req, res)=>{
    const { age } = req.query;
    const year = 2020;
    const calcAge = year - parseInt(age, 10);
    res.send(`you were born in ${calcAge}`)
})


app.get("*", (req, res)=>{
    res.send(`<h1>404-Page Not Found!!!!</h1>`)
})

server.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}`)
})