const express = require('express');
const app = express();
const port = process.env.port || 8000;
const todos = require('./todo.json');
const fs = require('fs');
const date = new Date();
const Datastore = require('nedb');

app.use(express.json()) //Tolkar allt i body som JSON

const db = new Datastore('todo.db');
db.loadDatabase();

app.get('/api/todo', (request, response) => {
    db.find({}, (err, data) => {
        response.json({ success: true, data: data });
    });
    // response.json({ success: true, todos: todos });
});

app.post('/api/todo', (request, response) => {
    const todo = request.body;
    let newTodo = {...todo, date}
    db.insert(newTodo);
    // todos.push(newTodo);
    
    // fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
    //     if (err) console.log(err);
    // });
    // console.log('Added todo');
    
    response.json({ success: true, message: 'todo saved' });
});

app.delete('/api/todo/:id', (request, response) => {
    const paramId = request.params.id;

    db.remove({ _id: paramId }, (err, numDeleted) => {
        console.log(numDeleted);
        response.json({ numDeleted: numDeleted });
    });

    // const index = todos.findIndex(todo => todo.id == paramId);
    // todos.splice(index, 1);

    // fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
    //     if (err) console.log(err);
    // });
    // response.json({ success: true, message: 'Deleted'});
});

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});