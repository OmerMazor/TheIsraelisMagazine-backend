const path = require("path");
const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts")
const userRoutes = require("./routes/user");
const dotenv = require("dotenv");
// const i18next = require('i18next');
// const i18nBackend = require('i18next-fs-backend');
// const i18nmiddleware = require('i18next-http-middleware');
// i18next.use(i18nBackend).use(i18nmiddleware.LanguageDetector)
// .init({
//   fallbackLng: 'en',
//   backend: {
//     loadPath: './locale/{{lang}}/translation.json'
//   }
// })

dotenv.config();

const app = express();


// 1uzEfuAi98IlKcEu
//https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile
// mongoose.connect('mongodb+srv://max:1uzEfuAi98IlKcEu@onlinedatingapp.gcz5a.mongodb.net/node-angular?retryWrites=true&w=majority', {useNewUrlParser : true, useUnifiedTopology: true}).then(() => {

//   console.log('server is connected to mongoDB');


// }).catch((err) => {
//   console.log(err);
// });
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser : true, useUnifiedTopology: true}).then(() => {

  console.log('server is connected to mongoDB');


}).catch((err) => {
  console.log(err);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));
app.use(express.static(path.join(__dirname, "src/app/posts/post-create")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
 next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);
// app.use(i18nmiddleware.handle(i18next));


const publicVapidKey = 'BAIvjXC8VkxH6h_JIJVxhfnoo52DsOi4kmzbwDd3f46W8MKIERfSXT_jEXJA1DlHUU6YkqNabZjWcSBR6R-KNaM';
const privateVapidKey = 'QA9O_nECt45Uava4IMjV5i051SvQTBQj7NpfsXWKhSg';


module.exports = app;
