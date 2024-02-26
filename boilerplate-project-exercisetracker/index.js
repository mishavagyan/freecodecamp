const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false })); // formaneric data stanalu hamar
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const users = [];
const exercises = [];
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const _id = (users.length + 1).toString();
  const user = { username, _id };
  users.push(user);
  return res.json(user);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const _id = req.params._id;
  const user = users.find(user => user._id === _id);
  if(user) {
    const username = user.username;
    const description = req.body.description;
    const duration = +req.body.duration;
    const date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();
    const exercise = { _id, username, description, duration, date };
    res.json(exercise);
    exercises.push(exercise);
  } else {
    res.json({ error: 'User not found' });
  }
});

app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(user => user._id === req.params._id);
  if(user) { 
    let log = [];
    const from = req.query.from;
    const to = req.query.to;
    const limit = +req.query.limit;

    exercises.forEach(exercise => {
      if(exercise._id === req.params._id) {
        log.push({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date
        });
      }
    });
    
    if(from){
      const fromDate = new Date(from);
      log = log.filter(exe => new Date(exe.date).getTime() > fromDate.getTime());  
    }

    if(to){
      const toDate = new Date(to);
      log = log.filter(exe => new Date(exe.date).getTime() < toDate.getTime()); 
    }

    if(limit){
      log = log.slice(0, limit);
    }
    
    res.json( {username: user.username, count: log.length, _id: user._id, log} );
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
