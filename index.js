// Import required modules
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

// Configure and init app
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Set up middlewares
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use("/public", express.static(path.join(process.cwd(), "/public")));

// Define routers
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
