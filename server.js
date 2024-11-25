// index.js
const express = require("express"); // Import the database connection function
const routes = require("./routes/index");

const app = express();

app.use(express.json());

// Add your routes here...
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
