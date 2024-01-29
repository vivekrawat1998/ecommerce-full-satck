  const dotenv = require("dotenv");
  const app = require("./app");
  const connectDatabase = require("./config/Database")
  


//HANDLING UNCAUGHT ERRROR//

process.on("uncaughtException",(err) =>{
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to uncaught exception`)
  process.exit(1)
})

  process.env.PORT =3000
  dotenv.config({ path:"Backend/config/config.env" });

  connectDatabase()

  const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });

//UNHANDLED REJECTION ERROR ///

  process.on("unhandledRejection", (err) =>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the server due to Unhandled promise rejection`)
    server.close(()=>{
      process.exit(1)
    })
  })