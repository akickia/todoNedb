const express = require('express');
const app = express();
const todos = require('./todo.json')
const fs = require('fs')
const date = new Date()
const nedb = require('nedb-promise')
const database = new nedb({filename: "todo.db", autoload: true})

app.use(express.json()) //Tolkar allt som kommer i en body som json

app.get('/api/todo', async (request, response) => {
  const result = await database.find({})
  response.json ({ success: true, result: result.splice(0, 10) })
});
//Response.json är det sista man gör, det fungerar som en return
app.post('/api/todo', (request, response) => {
  const todo = request.body;
  const newTodo = {...todo, date}
  console.log(newTodo)
  database.insert(newTodo);
  
  response.json({success: true, newTodo})
})

app.delete('/api/todo/:id', async (request, response) => {
  const id = request.params.id;
  database.remove({_id: id}, function(err, removed) {
    if (err) {
      console.log(err, 'An error occured')
    }
    else {
      console.log(removed)
    }
  })
  response.send("Todo removed")
})


//Starts server = open to requests
app.listen(8000, () => {
  console.log('starting server...')
})

//Success true frivilligt men standard att man lämnar med ett svar på om man lyckats med sin request. 