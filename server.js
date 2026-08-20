const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0", function(){

console.log(`Server is running on port ${PORT}`);

});

//npx nodemon server.js