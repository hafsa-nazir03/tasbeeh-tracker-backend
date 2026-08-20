const app = require('./app');
const PORT = 3000;
app.listen(PORT,function(){

console.log(`Server is running on port ${PORT}`);

});

//npx nodemon server.js