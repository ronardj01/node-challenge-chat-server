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

app.get('/messages/search', (req, res) => {
  const text = req.query.text.toLocaleLowerCase();
  const searchedMessage = messages.filter(m => m.text.toLocaleLowerCase().includes(text))

  searchedMessage.length > 0 ? res.status(200).json(searchedMessage) : res.send('There are not messages with that text')
});

app.get('/messages/latest', (req, res) => {
  const latestMessages = messages.slice(-10);
  return res.send(latestMessages)
});

app.get('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const isValidId = (!isNaN(id) && id >= 0);
  if (isValidId) {
    const message = messages.find((message) => message.id == id);

    return message ? res.json(message) : res.status(400).send('Id does not match with a message')
  } else {
    res.send('Id must be a number larger than zero')
  }
});

app.post('/messages', (req, res) => {
  const newId = Math.max(...messages.map((message) => message.id)) + 1;
  const newMessage = req.body;
  
  newMessage.id = newId;

  isNewMessageValid = (newMessage.text && newMessage.from)
  if(isNewMessageValid) {
    messages.push(newMessage);
    return res.status(201).json(messages);  
  } else {
    res.status(400).send('Text and From propierties are requiere');
  }
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
