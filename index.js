const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

let people = [{
    id: "1",
    name: "Sam",
    age: 26,
    hobbies: []
}]; // This is your in-memory database. DO NOT CHANGE THE INITIAL STATE

app.set("db", people);

// TODO: Implement CRUD operations for person

app.get("/person", (req, res) => {
    res.json(people);
});

app.get("/person/:id", (req, res) => {
    let filteredPerson = people.filter(p => p.id == req.params.id);
    if (filteredPerson.length) {
        res.json(filteredPerson[0]);
    } else {
        res.sendStatus(404);
    }
});

app.post("/person", (req, res) => {
    const { name, age, hobbies } = req.body;
    if (!name || !age || !hobbies) {
        res.status(400).json({ error: 'Invalid request body' });
    } else if (typeof age !== 'number') {
        res.status(400).json({ error: 'Age must be a number' });
    } else if (!Array.isArray(hobbies)) {
        res.status(400).json({ error: 'Hobbies must be an array' });
    } else {
        let newPerson = {
            id: uuid.v4(),
            name: name,
            age: age,
            hobbies: hobbies
        };
        people.push(newPerson);
        res.sendStatus(200);
    }
});

app.put("/person/:id", (req, res) => {
    let personIndex = people.findIndex(p => p.id == req.params.id);
    const { name, age, hobbies } = req.body;

    if (personIndex == -1) {
        res.sendStatus(404);
    } else if (!name || !age || !hobbies) {
        res.status(400).json({ error: 'Invalid request body' });
    } else if (typeof age !== 'number') {
        res.status(400).json({ error: 'Age must be a number' });
    } else if (!Array.isArray(hobbies)) {
        res.status(400).json({ error: 'Hobbies must be an array' });
    } else {
        let oldPerson = people[personIndex];
        let updatedPerson = {
            id: oldPerson.id,
            name: name,
            age: age,
            hobbies: hobbies
        };
        people[personIndex] = updatedPerson;
        res.sendStatus(200);
    }
});

app.delete("/person/:id", (req, res) => {
    let personIndex = people.findIndex(p => p.id == req.params.id);
    if (personIndex == -1) {
        res.sendStatus(404);
    } else {
        people.splice(personIndex, 1);
        res.sendStatus(200);
    }
});

if (require.main === module) {
    app.listen(3000);
}

module.exports = app;
