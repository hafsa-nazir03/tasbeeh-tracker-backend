/*const app = require('./app');
module.exports = app;

//npx nodemon server.js*/

const app = require("./app");

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});