//**Menager passowrd: kosdpvker pogktropg rkwopr fkwfop 4kfc2op4rfk42cpor */


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require('../models/post');
const Image = require("../models/image");
const Article = require("../models/article");
const Opinion = require("../models/opinion");
const General = require("../models/general");
const nodemailer = require("nodemailer");
const cloudinary = require("../middleware//cloudinary");

const user = require("../models/user");
const { deleteMany } = require("../models/user");
var random;

async function sendEmail (email) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smpt.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: "omermazorgroup@gmail.com",
      pass: 'sdeuchbhqwuzorxv'
    }
  });
  random = Math.floor(Math.random() * 100000);
  let info = await transporter.sendMail({
    from: '"Nodemailer Contact" <omermazorgroup@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "your code from The Israelis Magazine ", // Subject line
    text: "your code is 2334", // plain text body
    html: `<div style='background-color:yellow;'> <b>Your code is:${random}</b> </7div>`, // html body
  });
  transporter.sendMail(info, (error, info) => {
    if (error){
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  })
}

exports.getUsernames = (req, res, next) => {
  const usersQuery = User.find();
  let fetchUsernames = [];
  usersQuery.then(documents => {
    documents.forEach(user => {
      fetchUsernames.push(user.fullname)
    })
    res.status(200).json({
      usernames: fetchUsernames
    });
  })
}
exports.checkEmail = async (req, res, next) => {
  let user = await User.findOne({email: req.body.email})
  if(user) {
    return res.status(201).json({
      isEmailExist: true
    })
  }
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smpt.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: "omermazorgroup@gmail.com",
      pass: 'sdeuchbhqwuzorxv'
    }
  });
  random = Math.floor(Math.random() * 100000);
  let info = await transporter.sendMail({
    from: '"Nodemailer Contact" <omermazorgroup@gmail.com>', // sender address
    to: `${req.body.email}`, // list of receivers
    subject: "your code from The Israelis Magazine ", // Subject line
    text: "your code is 2334", // plain text body
    html: `<div style='background-color:yellow;'> <b>Your code is:${random}</b> </7div>`, // html body
  });
  transporter.sendMail(info, (error, info) => {
    if (error){
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  })
  return res.status(201).json({
    email: req.body.email,
    isEmailExist: false
  })
}

exports.onVerify = async (req, res, next) => {
  console.log(random);
  if(random !== req.body.random) {
    return res.status(200).json({
      isVerify: false
    })
  }
  return res.status(200).json({
    isVerify: true
  })
}

exports.createUser = async (req, res, next) => {
  try {
  let isEmailExist = await User.findOne({email: req.body.email})
  if(isEmailExist) {
    return res.status(401).json({
      message: "Email is already exist!"
    });
  }
  // let result = await cloudinary.uploader.upload(`backend/images/${req.file.filename}`);
  let result = await cloudinary.uploader.upload(req.file.path);
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      profile: result.secure_url,
      fullname: req.body.username,
      country: req.body.country,
      birthday: req.body.birthday,
      age: req.body.age,
      gender: req.body.gender,
      email: req.body.email,
      password: hash,
      isVerified: true,
      isModel: false
    });

    user.save().then((result) => {
     return res.status(201).json({
        message: 'User created!',
        result: result,
        isSignup: true
      });
    }).catch(err => {
      return res.status(500).json({
          message: "User name or email already exits!"

      });
    });
  }).catch(e => {
    console.log(e);
  })
  }
catch(err) {
 console.log(err);
}

}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.username}).then((user) => {
    if(!user){
      return res.status(401).json({
        message: "Auth failed!"
      });
    }
    fetchedUser = user;

    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
    if(!isMatch){
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    };
    if(user && isMatch){
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, "secret_this_should_be_longer",
    {expiresIn: "1h" });
     return res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      email: fetchedUser.email,
      isManager: fetchedUser.email === 'omermazor144@gmail.com' ? true : false
    })
  }

   })


  })



}

exports.forgot = (req, res, next) => {

  User.findOne({ email: req.body.email}).then((user) => {
  if(user){
    sendEmail(req.body.email)
    console.log(random);
    return res.status(200).json({
      email: req.body.email,
      isEmailExist: true
    })
  }
  else {
    return res.status(200).json({
      email: req.body.email,
      isEmailExist: false
    })
  }

  })
}

exports.changePsw = (req, res, next) => {
  User.findOne({email: req.body.email}).then((user) => {
    if(user) {
    bcrypt.hash(req.body.password, 10).then(hash => {
      user.password = hash;
    })
      user.save().then((result) => {
        return res.status(201).json({
           isChanged: true
         });
       }).catch(err => {
          console.log(err);
       })
    }
    else {
      res.status(401).json({
        isChanged: false,
        message: "Auth failed!"
      })
    }
  })
}

exports.checkIfLike = (req, res, next) => {
  User.findOne({_id: req.body.id}).then((user) => {
    User.findOne({_id: req.body.id2}).then((user2) => {
      var temp = 0;

      for (let index = 0; index < user2.likes.length; index++) {
      if(user2.likes[index]?.likeUser == user.id){
            temp = 1;
        }
      }
      if(temp === 0){

        return res.status(201).json({isLike: true})
    }
    else {

      return res.status(201).json({isLike: false})

    }
    })
  })
}

exports.editUser = async (req, res, next) => {
  var profile = "";
  if(req.file){
  let result = await cloudinary.uploader.upload(req.file.path);
  profile = result.secure_url;
  }
  User.findById(req.userData.userId).then(user => {
  try{
    if(profile === "") {
      profile = user.profile
    }
    user.profile = profile
    user.fullname = req.body.username
    user.age = req.body.age
    user.birthday = req.body.birthday
    user.country = req.body.country,
    user.range = req.body.range,
    user.about = req.body.about
    user.save().then((result) => {
      return res.status(201).json({
         message: 'User edited!'
       });
     })
  }
  catch (err){
    console.log(err);
    }
  })
  }


  exports.deleteUser = async (req, res, next) => {


   let user = await User.findById(req.userData.userId)
   if(!user) {
     return res.status(200).json({})
   }
   await General.updateMany({},
    { $pull: { comments:{ commentUser: req.userData.userId }  }},
    { multi: true } )
    await Post.updateMany({},
      { $pull: { comments:{ commentUser: req.userData.userId }  }},
      { multi: true } )
    await Article.updateMany({},
        { $pull: { comments:{ commentUser: req.userData.userId }  }},
        { multi: true } )
    await Opinion.updateMany({},
          { $pull: { comments:{ commentUser: req.userData.userId }  }},
          { multi: true } )
    await Image.updateMany({},
          { $pull: { comments:{ commentUser: req.userData.userId }  }},
          { multi: true } )
    if(user.isModel){
      await Article.deleteMany({creator: user})
      await Post.deleteMany({creator: user})
      await Opinion.deleteMany({creator: user})
      await Image.deleteMany({creator: user})
      user.delete();
      return res.status(200).json({text: "User deleted!"})
    }
    else {
      await General.deleteMany({creator: user})
      user.delete()
      return res.status(200).json({text: "User deleted!"})
    }
  }
