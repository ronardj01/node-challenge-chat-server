const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get('/messages', (req, res) => {
  return res.json(messages);
});

app.get('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const isValidId = (!isNaN(id) && id >= 0);
  if (isValidId) {
    const message = messages.find((message) => message.id == id);

    return message ? res.json(message) : res.sendStatus(400)
  } else {
    res.send('Id must be a number larger than zero')
  }
});

app.post('/messages', (req, res) => {
  const newId = Math.max(...messages.map((message) => message.id)) + 1;
  const newMessage = req.body;
  newMessage.id = newId;
  messages.push(newMessage);
  return res.status(201).json(messages);
});

app.delete('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const isValidId = (!isNaN(id) && id >= 0);
  if (isValidId) {
    const filteredMessage = messages.filter((message) => message.id != id);

    if (filteredMessage.length !== messages.length) {
      messages = filteredMessage;
      return res.send('id eliminado');
    } else {
      res.sendStatus(500)
    };

  } else {
    res.send('Id must be a number larger than zero')
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000")
});
