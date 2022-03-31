
const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
var corsOptions = {
  origin: "https://theisraelis-front.vercel.app",
  // origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port , () => {
console.log(`server run on port ${port}`);
});






const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "backend/images");
  },
  filename: function (req, file, cb){
    cb(null, ` ${Date.now()} ${file.originalname}`);
  }
})
const upload = multer({storage});
app.post("/multifiles", upload.array("files"), (req, res) => {
  const files = req.files;
  console.log(files);
  if (Array.isArray(files) && files.length > 0){
    res.json(files);
  }else {
    throw new Error("File upload unsuccessfull");
  }
})
