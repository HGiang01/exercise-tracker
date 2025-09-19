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

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
