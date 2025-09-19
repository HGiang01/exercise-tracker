// Import required modules
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Configure and init app
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const userList = [];

// Set up middlewares
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use('/public', express.static(path.join(process.cwd(), '/public')));

// Define routers
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  try {
    const username = req.body.username;
  
    // Check username field
    if (!username) {
      throw new Error('username is invalid');
    };

    // Create user
    const user = {
      username,
      _id: uuidv4(),
    };
  
    userList.push({
      ...user,
      count: 0,
      log: [],
    });
  
    return res.json(user);
  }
  catch(error) {
    return res.json({ error: error.message });
  };
});

app.get('/api/users', (req, res) => {
  return res.json(
    userList.map((user) => {
      return {
        username: user.username,
        _id: user._id,
      };
    })
  );
});

app.post('/api/users/:_id/exercises', (req, res) => {
  try {
    const userId = req.params._id;
    
    // Check id param
    if (!userId) {
      throw new Error('missing id in router param');
    };
    
    // Find user by id
    const indexOfUser = userList.findIndex((user) => user._id === userId);
    if (indexOfUser === -1) {
      throw new Error('invalid id');
    };

    let user = userList[indexOfUser];

    // Checking fields
    let { description, duration, date } = req.body;
    if (!description) {
      throw new Error('missing description');
    } else if (!duration) {
      throw new Error('missing duration');
    } else {
      duration = Number(duration);
    };

    // Return current date for exercise if date field is missing
    if (!date) {
      const current = Date.now();
      date = new Date(current);
    } else {
      date = new Date(date);
    };

    // Reformat date
    date = date.toDateString();

    // Update user object
    // Add exercise
    const exercise = {
      description,
      duration,
      date,
    };
    user.log.push(exercise);

    // Update count of exercise
    user.count = user.log.length;

    return res.json({
      username: user.username,
      _id: user._id,
      ...exercise,
    });
  } catch(error) {
    return res.json({ error: error.message });
  };
});

app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;

  // Check id param
  if (!userId) {
    throw new Error('invalid id');
  };

  // Find user by id
  const indexOfUser = userList.findIndex((user) => user._id === userId);
  if (indexOfUser === -1) {
    throw new Error('invalid id');
  };

  // Return empty array if a user don't have any exercise
  let user = userList[indexOfUser];
  if (!user.log) {
    return res.json([]);
  };

  let { from, to, limit } = req.query;
  let filteredLog = user.log;

  // Convert query params into convenient type
  if (from) {
    from = new Date(from);
    filteredLog = filteredLog.filter((exercise) => new Date(exercise.date) >= from);
  } else if (to) {
    to = new Date(to);
    filteredLog = filteredLog.filter((exercise) => new Date(exercise.date) <= to);
  } else if (limit) {
    const n = Number(limit);
    if (n >= 0) { filteredLog = filteredLog.slice(0, n);}
  };

  return res.json({
    username: user.username,
    count: user.count,
    _id: user._id,
    log: filteredLog,
  });
});

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
