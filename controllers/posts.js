const bcrypt = require("bcryptjs");
const Post = require('../models/post');
const Song = require('../models/song');
const nodemailer = require("nodemailer");
const User = require("../models/user");
const Image = require("../models/image");
const Article = require("../models/article");
const Opinion = require("../models/opinion");
const General = require("../models/general");
const cloudinary = require("../middleware//cloudinary");
const { use } = require("../routes/user");
const Poll = require("../models/poll");
const  ObjectID = require("mongodb").ObjectId;
var random;
var contentOfUser;
exports.checkEmail = async (req, res, next) => {
  // User.findOne({email: req.body.email}).then((user) => {
  //   if(user) {
  //     return res.status(404).json({
  //       message: "Email already exist!"
  //     })
  //   }
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
      secure: false,
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
  console.log(1);
  try {
  let isEmailExist = await User.findOne({email: req.body.email})
  if(isEmailExist) {
    return res.status(401).json({
      message: "Email is already exist!"
    });
  }
  let imagePath = [];
  let profile;
  let idImage;
  // let result = await cloudinary.uploader.upload(`backend/images/${req.files.image[0].filename}`);
   let result = await cloudinary.uploader.upload(req.files.image[0].path);
  profile = result.secure_url;
  for(var i = 0; i < req.files.files.length; i++) {
//  let result2 = await cloudinary.uploader.upload(`backend/images/${req.files.files[i].filename}`)
let result2 = await cloudinary.uploader.upload(req.files.files[i].path);
imagePath.push(result2.secure_url);
  }
  // let result3 = await cloudinary.uploader.upload(`backend/images/${req.files.idImage[0].filename}`);
  let result3 = await cloudinary.uploader.upload(req.files.idImage[0].path);
  idImage = result3.secure_url;
    bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      profile: profile,
      email: req.body.email,
      password: hash,
      fullname: req.body.name,
      gender: req.body.gender,
      country: "israel",
      birthday: req.body.birthday,
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      instagram:{username: req.body.instagram},
      images: imagePath,
      about: req.body.about,
      idImage: idImage,
      isModel: true
    });

     user.save().then((user) => {
     return res.status(201).json({
        message: 'User created!',
        result: user,
        isSignup: true
      });
    })
   })
  }
  catch (err) {
    console.log(err);
  }
}



exports.getModels = (req, res, next) => {
  console.log(req.headers);
  const usersQuery = User.find({isModel: true});
  let fetchUsers;
  usersQuery.then(documents => {
    fetchUsers = documents;
    fetchUsers.forEach(user => {
       user.idImage = undefined;
       user.email = undefined;
       user.password = undefined;
    })
    return User.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched succesfuly',
      users: fetchUsers,
      count: count
    });
  }).catch(err => {
    alert(err)
  })


}

exports.getUsers = (req, res, next) => {
  const usersQuery = User.find();
  let fetchUsers;
  usersQuery.then(documents => {
    fetchUsers = documents;
    fetchUsers.forEach(user => {
      user.email = undefined;
      user.password = undefined;
      if(user.isModel) {
        user.idImage = undefined;
      }
    })
    return User.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched succesfuly',
      users: fetchUsers,
      count: count
    });
  })


}

exports.getUserAuth = (req, res, next) => {

  User.findById(req.userData.userId).then(user => {
    if (user) {
      user.idImage = undefined;
      user.password = undefined;
      user.email = undefined;
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found!'});
    }
  })

}

exports.getProfile = (req, res, next) => {

  User.findById(req.params.id).then(user => {
    if (user) {
      user.idImage = undefined;
      user.email = undefined;
      user.password = undefined;
      res.status(200).json(user);
    } else {
      res.status(404).json({message: 'User not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching user failded!"
    });
  })

}





exports.addImage = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let imagePath = ""
  if(req.file === undefined){
    imagePath = url + "/images/" + "no-hfgimage.png";
  }
  else {
    imagePath = url + "/images/" + req.file.filename;
  }
  const image = new Image({
    image: imagePath,
    creator: req.userData.userId,

  });

  image.save().then((result) => {
  }).catch(err => {
    console.log(err);
  });
  User.findOne({_id: req.userData.userId}).then((user) => {
    user.content.push(image)
    user.save(() => {
      return res.status(201).json({
      })
  })
  })
}


exports.createContent = async (req, res, next) => {

  try {
  let user = await User.findOne({_id: req.userData.userId});
  let tagedUser;
  if(req.body.userTag !== "") {
     tagedUser = await User.findById(req.body.userTag);
    if(tagedUser) {
      let message = {
        creator: user,
        text: `${user.fullname} tagged you`,
        seen: false
      }
      tagedUser.notifications.push(message);
      tagedUser.save();
    }
  }

  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

 today = dd + '/' + mm + '/' + yyyy;;
 if (req.body.type === 'Photo'){
  let result = await cloudinary.uploader.upload(req.file.path);


    let subject = "";
  if(req.body.subject === "") {
    subject = "General"
  }
  else {
    subject = req.body.subject
  }
  const image = new Image({
    image: result.secure_url,
    subject: subject,
    creator: req.userData.userId,
    usetTag: tagedUser,
    creatorDetails: {
      fullname: user.fullname,
      age: user.age,
      profileImage: user.images[0]
    },
    isVerified: false,
    likes: user.likes.length,
    date: today
  })
  image.save().then((result) => {
  }).catch(err => {
    console.log(err);
  });

    user.content.push(image);
    user.save(() => {
      return res.status(201).json({
      })
  })
}
  if (req.body.type === 'Article'){

    const article = new Article({
      date: today,
      subject: req.body.subject,
      content: req.body.content,
      creator: req.userData.userId,
      userTag: tagedUser,
      creatorDetails: {
        fullname: user.fullname,
        age: user.age,
        profileImage: user.images[0]
      },
      isVerified: false
    });
    article.save().then((result) => {
    }).catch(err => {
      console.log(err);
    });
      user.content.push(article)
      user.save(() => {
        return res.status(201).json({
        })
    })

  }
  else if (req.body.type === 'Opinion'){
    const opinion = new Opinion({
      date: today,
      subject: req.body.subject,
      content: req.body.content,
      creator: req.userData.userId,
      userTag: tagedUser,
      creatorDetails: {
        fullname: user.fullname,
        age: user.age,
        profileImage: user.images[0]
      },
      isVerified: false
    });
    opinion.save().then((result) => {
    }).catch(err => {
      console.log(err);
    });

      user.content.push(opinion)
      user.save(() => {
        return res.status(201).json({
        })
    })
  }
  else if (req.body.type === 'Post'){
    let result = await cloudinary.uploader.upload(req.file.path);
    let subject = "";
    if(req.body.subject === "") {
      subject = "General"
    }
    else {
      subject = req.body.subject
    }
    const post = new Post({
      date: today,
      image: result.secure_url,
      subject: subject,
      status: req.body.content,
      creator: req.userData.userId,
      userTag: tagedUser,
      creatorDetails: {
        fullname: user.fullname,
        age: user.age,
        profileImage: user.images[0]
      },
      isVerified: false
    });
    post.save().then((result) => {
    }).catch(err => {
      console.log(err);
    });

      user.content.push(post)
      user.save(() => {
        return res.status(201).json({
        })
    })
  }
  if (req.body.type === 'General'){
          const general = new General({
          date: today,
          subject: req.body.subject,
          content: req.body.content,
          smiley: req.body.smiley,
          userTag: tagedUser,
          creator: req.userData.userId,
          isVerified: true
        });
        general.save().then((result) => {
        }).catch(err => {
          console.log(err);
        });
          user.content.push(general)
          user.save(() => {
            return res.status(201).json({
            })
        })

  }

}
catch (err) {
  console.log(err);
}
}

exports.getPosts = (req, res, next) => {
  const postQuery = Post.find();
  let fetchedPosts;
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    res.status(200).json({
      posts: fetchedPosts,
    });
    })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
}
exports.getPhotos = (req, res, next) => {
  const postQuery = Image.find();
  let fetchedPhotos;
  postQuery
  .then(documents => {
    fetchedPhotos = documents;
    res.status(200).json({
      photos: fetchedPhotos,
    });
    })
  .catch(error => {
    res.status(500).json({
      message: "Fetching photos failed!"
    });
  });
}
exports.getOpinions = (req, res, next) => {
  const postQuery = Opinion.find();
  let fetchedOpinions;
  postQuery
  .then(documents => {
    fetchedOpinions = documents;
    res.status(200).json({
      opinions: fetchedOpinions,
    });
    })
  .catch(error => {
    res.status(500).json({
      message: "Fetching opininos failed!"
    });
  });
}
exports.getArticles = (req, res, next) => {
  const postQuery = Article.find();
  let fetchedArticles;
  postQuery
  .then(documents => {
    fetchedArticles = documents;
    res.status(200).json({
      articles: fetchedArticles,
    });
    })
  .catch(error => {
    res.status(500).json({
      message: "Fetching articles failed!"
    });
  });
}
exports.getContent = (req, res, next) => {
  User.find().then(fetchUsers => {
  let data = [];
  Article.find().then(articles => {
    Post.find().then(posts => {
      Opinion.find().then(opinions => {
        Image.find().then(images => {
          General.find().then(generals => {
          // data.concat(articles.concat(posts, opinions, images));
          data.push(...articles, ...posts, ...images, ...opinions, ...generals);
          data.sort(function(a, b) {
            var dateA = new Date(a.realDate), dateB = new Date(b.realDate);
            return dateA - dateB;
        });

          data.forEach(contents => {

            fetchUsers.forEach(user => {
              user.email = undefined;
              user.password = undefined;
              if(user.isModel) {
                user.idImage = undefined;
              }
             if(user._id.toString() === contents.creator.toString()) {
              contents.creator = user
             }
             if(contents.userTag) {
              if(user._id.toString() === contents.userTag.toString()) {
                contents.userTag = user
                console.log(contents.userTag.fullname);
               }
             }

            })
              contents.comments.forEach(comment => {
                fetchUsers.forEach(user => {
                  user.email = undefined;
                  user.password = undefined;
                  if(user.isModel) {
                    user.idImage = undefined;
                  }
                 if(user._id.toString() === comment.commentUser.toString()) {
                  comment.commentUser = user
                 }
                })
              })
          })
          res.status(201).json({
            data: data
          })
        })
        })
      })
    })
  });
  // let fetchedArticles;
  // postQuery
  // .then(documents => {
  //   fetchedArticles = documents;
  //   res.status(200).json({
  //     articles: fetchedArticles,
  //   });
  //   })
  // .catch(error => {
  //   res.status(500).json({
  //     message: "Fetching articles failed!"
  //   });
  // });
})
}

exports.getContentOfUser = (req, res, next) => {
  User.find().then(fetchUsers => {
  User.findById(req.params.id).then(user => {
    let data = [];
    // let data = [];
    if(user.isModel){
    Article.find({creator: user}).then(articles => {
      Post.find({creator: user}).then(posts => {
        Opinion.find({creator: user}).then(opinions => {
          Image.find({creator: user}).then(images => {
            // data.concat(articles.concat(posts, opinions, images));
            data.push(...articles, ...posts, ...images, ...opinions);
            data.sort(function(a, b) {
              var dateA = new Date(a.realDate), dateB = new Date(b.realDate);
              return dateB - dateA;
          });
            data.forEach(content => {
              fetchUsers.forEach(fetchUser => {
              if(content.userTag) {
                if(fetchUser._id.toString() === content.userTag.toString()) {
                  content.userTag = fetchUser

                 }
               }
                content.comments.forEach(comment => {
                    fetchUser.email = undefined;
                    fetchUser.password = undefined;
                    if(fetchUser.isModel) {
                      fetchUser.idImage = undefined;
                    }
                   if(fetchUser._id.toString() === comment.commentUser.toString()) {
                    comment.commentUser = fetchUser
                   }
                  })
                })
            })
            res.status(201).json({
              data: data
            })
          })
        })
      })
    });
    }
    else {
      General.find({creator: user}).then(contents => {
        data.push(...contents);
        data.forEach(content => {
          fetchUsers.forEach(fetchUser => {
          if(content.userTag) {
            if(fetchUser._id.toString() === content.userTag.toString()) {
              content.userTag = fetchUser

             }
           }
          content.comments.forEach(comment => {

              fetchUser.email = undefined;
              fetchUser.password = undefined;
              if(fetchUser.isModel) {
                fetchUser.idImage = undefined;
              }
             if(fetchUser._id.toString() === comment.commentUser.toString()) {
              comment.commentUser = fetchUser
             }
            })
          })
      })
        res.status(201).json({
          data: data
        })
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching user failded!"
    });
  })
})
}

exports.updateUsers = (req, res, next) => {
  let updatedUsers = [];
  User.find({}).then((users) => {
    for (let index = 0; index < users.length; index++) {
      if(users[index].fullname) {
        if(req.body.input !== undefined) {
          if((users[index].fullname).toLowerCase().includes(req.body.input.toLowerCase())) {
            users[index].idImage = undefined;
            users[index].email = undefined;
            users[index].password = undefined;
            updatedUsers.push(users[index]);
        }
        }
      }
  }
  res.status(201).json({
    updatedUsers: updatedUsers
})
  })
}

// exports.addLike = (req, res, next) => {
//   User.findOne({_id: req.body.id}).then((user) => {
//     User.findOne({_id: req.body.likeUser}).then((likeUser) => {
//       let likesArray = [];
//       var temp = 0;
//       for (let index = 0; index < user.likes.length; index++) {
//         if((user.likes[index].likeUser).toString() === req.body.likeUser) {
//           temp = 1;
//         }
//       }
//         if(temp === 0) {
//           const like = {
//             likeUser: req.body.likeUser,
//             creatorDetails: {
//               fullname: likeUser.fullname,
//               profileImage: likeUser.images[0]
//             }
//           };
//           user.likes.push(like);
//           likesArray = user.likes;
//           user.save(() => {
//            return res.status(201).json({
//              likesArray: likesArray
//            })
//           })
//         }
//         else {
//           const index = user.likes.indexOf(likeUser.id)
//           user.likes.splice(index, 1)
//           likesArray = user.likes;
//           user.save(() => {
//            return res.status(201).json({
//              likesArray: likesArray
//            })
//           })
//         }




//      })
//    })
//   }

exports.likeToggle = async (req, res, next) => {
  let likedUser = await User.findById(req.body.id)
  let like = likedUser.likes.find(l => l.likeUser.toString() === req.userData.userId)
     if(!like) {
      const newLike = {
        likeUser: req.userData.userId,
      };
      likedUser.likes.push(newLike);
      likedUser.save(() => {
        return res.status(200)
       })
     }
     else {
      const index = likedUser.likes.indexOf(like)
      likedUser.likes.splice(index, 1)
      likedUser.save(() => {
       return res.status(201)
      })
     }
}

exports.addLike = (req, res, next) => {
  User.findOne({_id: req.body.id}).then((user) => {
    User.findOne({_id: req.userData.userId}).then((likeUser) => {
      let likesArray = [];
      var temp = 0;
      for (let index = 0; index < user.likes.length; index++) {
          if((user.likes[index].likeUser).toString() === req.body.likeUser) {
              temp = 1;
                }
            }
            if(temp === 0) {
              const like = {
                likeUser: req.body.likeUser,
                creatorDetails: {
                  fullname: likeUser.fullname,
                  profileImage: likeUser.images[0]
                }
              };
              user.likes.push(like);
              likesArray = user.likes;
              user.save(() => {
               return res.status(201).json({
                 likesArray: likesArray
               })
              })
            }
            else {
              return res.status(201).json({})
            }
     })
   })
  }

  exports.disLike = (req, res, next) => {
    console.log(1);
    User.findOne({_id: req.body.id}).then((user) => {
      User.findOne({_id: req.userData.userId}).then((likeUser) => {
        let likesArray = [];
        var temp = 0;
        for (let index = 0; index < user.likes.length; index++) {
            if((user.likes[index].likeUser).toString() === req.body.likeUser) {
                temp = 1;
                  }
              }
              if (temp === 0) {
                return res.status(201).json({})
              }
              else {
                const index = user.likes.indexOf(likeUser.id)
                user.likes.splice(index, 1)
                likesArray = user.likes;
                user.save(() => {
                 return res.status(201).json({
                   likesArray: likesArray
                 })
                })
              }
       })
     })
    }

exports.update = (req, res, next) => {
  User.find().then(fetchUsers => {
  let data = [];
  let updatedContent = [];
  Post.find({}).then((posts) => {
    Article.find().then(articles => {
        Opinion.find().then(opinions => {
            Image.find().then(images => {
              General.find().then(content => {
                data.push(...articles, ...posts, ...images, ...opinions, ...content);
                data.forEach(contents => {
                  fetchUsers.forEach(user => {
                   if(user._id.toString() === contents.creator.toString()) {
                    contents.creator = user
                   }
                  })
                    contents.comments.forEach(comment => {
                      fetchUsers.forEach(user => {
                       if(user._id.toString() === comment.commentUser.toString()) {
                        comment.commentUser = user
                       }
                      })
                    })
                })
                for (let index = 0; index < data.length; index++) {
                        if((data[index].subject.toLowerCase()).includes(req.body.input.toLowerCase())) {
                            updatedContent.push(data[index]);
                        }
                    }

                res.status(201).json({
                    updatedContent: updatedContent
                })
              })
            })
        })
    })
  })
})
}

exports.addComment = (req, res, next) => {
  User.find().then(fetchUsers => {
    User.findById(req.userData.userId).then((creator) => {
    let commentsArray = [];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

     today = dd + '/' + mm + '/' + yyyy;
  if (req.body.type === "Article"){
   Article.findById(req.body.id).then((article) => {
    article.comments.forEach(comment => {
      fetchUsers.forEach(user => {
       if(user._id.toString() === comment.commentUser.toString()) {
        user.email = undefined;
        user.password = undefined;
        if(user.isModel) {
          user.idImage = undefined;
        }
        comment.commentUser = user
       }
      })
    })
     const comment = {
       commentUser: creator,
       content: req.body.comment,
       date: today
     };
     article.comments.push(comment);
     commentsArray = article.comments;
     article.save(() => {
      return res.status(201).json({
        commentsArray: commentsArray
      })
     })

   })
 }
 else if (req.body.type === "Opinion"){
  Opinion.findById(req.body.id).then((opinion) => {
    opinion.comments.forEach(comment => {
      fetchUsers.forEach(user => {
       if(user._id.toString() === comment.commentUser.toString()) {
        user.email = undefined;
        user.password = undefined;
        if(user.isModel) {
          user.idImage = undefined;
        }
        comment.commentUser = user
       }
      })
    })
    const comment = {
      commentUser:creator,
      content: req.body.comment,
      date: today
    };
    opinion.comments.push(comment);
    commentsArray = opinion.comments;
    opinion.save(() => {
     return res.status(201).json({
       commentsArray: commentsArray
     })
    })
  })
}
else if (req.body.type === "Post"){
  Post.findById(req.body.id).then((post) => {
    post.comments.forEach(comment => {
      fetchUsers.forEach(user => {
       if(user._id.toString() === comment.commentUser.toString()) {
        user.email = undefined;
        user.password = undefined;
        if(user.isModel) {
          user.idImage = undefined;
        }
        comment.commentUser = user
       }
      })
    })
    const comment = {
      commentUser: creator,
      content: req.body.comment,
      date: today
    };
    post.comments.push(comment);
    commentsArray = post.comments;
    post.save(() => {
     return res.status(201).json({
       commentsArray: commentsArray
     })
    })
  })
}
else if (req.body.type === "Photo"){
  Image.findById(req.body.id).then((photo) => {
    photo.comments.forEach(comment => {
      fetchUsers.forEach(user => {
        user.email = undefined;
        user.password = undefined;
        if(user.isModel) {
          user.idImage = undefined;
        }
       if(user._id.toString() === comment.commentUser.toString()) {
        comment.commentUser = user
       }
      })
    })
    const comment = {
      commentUser: creator,
      content: req.body.comment,
      date: today
    };
    photo.comments.push(comment);
    commentsArray = photo.comments;
    photo.save(() => {
     return res.status(201).json({
       commentsArray: commentsArray
     })
    })
  })
}
if (req.body.type === "General"){
  General.findById(req.body.id).then((content) => {
    content.comments.forEach(comment => {
      fetchUsers.forEach(user => {
       if(user._id.toString() === comment.commentUser.toString()) {
        user.email = undefined;
        user.password = undefined;
        if(user.isModel) {
          user.idImage = undefined;
        }
        comment.commentUser = user
       }
      })
    })
    const comment = {
      commentUser: creator,
      content: req.body.comment,
      date: today
    };
    content.comments.push(comment);
    commentsArray = content.comments;
    content.save(() => {
     return res.status(201).json({
       commentsArray: commentsArray
     })
    })
  })
}

  })
})
}
exports.getComments = (req, res, next) => {
  User.find().then(fetchUsers => {
  let data = [];
    Article.find().then(articles => {
      Post.find().then(posts => {
        Opinion.find().then(opinions => {
          Image.find().then(images => {
            General.find().then(content => {
            // data.concat(articles.concat(posts, opinions, images));
            data.push(...articles, ...posts, ...images, ...opinions, ...content);
            data.forEach(el => {
              if(el._id.toString() === req.params.id) {
                el.comments.forEach(comment => {
                  fetchUsers.forEach(user => {
                   if(user._id.toString() === comment.commentUser.toString()) {
                    user.email = undefined;
                    user.password = undefined;
                    if(user.isModel) {
                      user.idImage = undefined;
                    }
                    comment.commentUser = user
                   }
                  })
                })
                res.status(201).json({
                  commentsArray: el.comments
                })
              }
            })
          })
          })
        })
      })
    });
  });
}

exports.powerToggle = async (req, res, next) => {
  let poweredUser = await User.findById(req.body.poweredUser)
  let user = await User.findById(req.userData.userId);
  let content = await General.findById(req.body.contentId)
  let power = content.power.find(p => p.user.toString() === req.userData.userId)
     if(!power) {
      const newPower = {
        user: user
      };
      content.power.push(newPower);
      // poweredUser.power +=1
      console.log(poweredUser.power);
     }
     else {
      const index = content.power.indexOf(power)
      content.power.splice(index, 1);
      // poweredUser.power-=1
      console.log(poweredUser.power);
     }
     await content.save();
     await poweredUser.save();
     return res.status(200);
}


exports.powerUp = async (req, res, next) => {
     let poweredUser = await User.findById(req.body.poweredUser)
     let user = await User.findById(req.body.user)
     let content = await General.findById(req.body.contentId)

        var temp = 0;
        for (let index = 0; index < content.power.length; index++) {
            if((content.power[index].user).toString() === req.body.user) {
                temp = 1;
                  }
              }
              if(temp === 0) {
                const power = {
                  user: user
                };
                content.power.push(power);
                console.log("up", poweredUser.power);
                // poweredUser.power +=1
                await poweredUser.save()
                await content.save()
                    console.log("up", poweredUser.power, content.power.length);
                   return res.status(201).json({
                   })

              }
              else {
                return res.status(201).json({})
              }

  }
  exports.powerDown = async (req, res, next) => {
    let poweredUser = await User.findById(req.body.poweredUser)
    let user = await  User.findById(req.body.user)
    let content = await  General.findById(req.body.contentId)
          var temp = 0;

          for (let index = 0; index < content.power.length; index++) {
              if((content.power[index].user).toString() === req.body.user) {
                  temp = 1;
                    }

                }
                if(temp === 1) {
                  const index = content.power.indexOf(user)
                  content.power.splice(index, 1);

                  // poweredUser.power-=1;
                  await poweredUser.save()
                  await content.save();
                  console.log("down",poweredUser.power);
                      console.log("down", poweredUser.power, content.power.length);
                     return res.status(201).json({
                      userPower: poweredUser.power,
                      contentPower: content.power
                     })

                }
                else {
                  return res.status(201).json({})
                }

    }

  exports.checkUsername = async (req, res, next) => {
    let usersArray = [];
    let users = await User.find();
    for (let index = 0; index < users.length; index++) {
      if(users[index].fullname.toLowerCase().includes(req.body.input.toLowerCase()) && req.body.input !== "")
      usersArray.push(users[index])
    }
    // if(users.toLowerCase()).includes(req.body.input.toLowerCase()
    // usersArray.push(...users);
    return res.status(200).json({
        usernames: usersArray
    })
  }

exports.getPolls = (req, res, next) => {
  const pollsQuery = Poll.find();
  let fetchedPolls;
  pollsQuery
  .then(polls => {
    fetchedPolls = polls;
    console.log(fetchedPolls);
    res.status(200).json({
      polls: fetchedPolls,
    });
    })
  .catch(error => {
    res.status(500).json({
      message: "Fetching photos failed!"
    });
  });
}
exports.vote = (req, res, next) => {

}

exports.deleteContent = async (req, res, next) => {
  await Article.deleteOne({_id: req.params.id, creator:req.userData.userId})
  await Post.deleteOne({_id: req.params.id, creator:req.userData.userId})
  await Opinion.deleteOne({_id: req.params.id, creator:req.userData.userId})
  await Image.deleteOne({_id: req.params.id, creator:req.userData.userId})
  await General.deleteOne({_id: req.params.id, creator:req.userData.userId})
  return res.status(200).json({
    text: "Content deleted successfully!"
  })
}

exports.getSongs = (req, res, next) => {
  Song.find({}).then((songs) => {
    var songsArray = [];
    for(var i = 0; i < songs.length; i++){
        songsArray[i] = songs[i].name;
    }
    var songsString = songsArray.toString();
    res.status(201).json({
      songsArray: songsArray
    })
  })

  // const song = new Song({
  //   name: 'reter',
  //   content: 'reter',
  //   translate: 'trret',
  //   imagePath: '',
  //   creator: req.userData.userId
  // })
  // song.save().then( song => {

  // })
}
exports.createPost = (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  let imagePath = ""

  if(req.file === undefined){
    imagePath = url + "/images/" + "no-hfgimage.png";
  }
  else {
    imagePath = url + "/images/" + req.file.filename;

  }
  const post = new Post({
    now: req.body.now,
    turbo: req.body.turbo,
    title: req.body.title,
    content: req.body.content,
     imagePath: imagePath, //url + "/images/" + req.file.filename,
    creator: 'Omer'
    //req.userData.userId

  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        _id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    })
  })
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: 'Omer'
    //req.userData.userId
  });
  Post.updateOne({_id: req.params.id,creator:req.userData.userId}, post).then(result => {
    if (result.n > 0){
    res.status(200).json({message: "Update succesful!"});
    } else {
      res.status(401).json({ message: "Not autorized!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  });
}

// exports.getPosts = (req, res, next) => {
//   const pageSize = +req.query.pagesize;
//   const currentPage = +req.query.page;
//   const postQuery = Post.find();
//   let fetchedPosts;
//   if (pageSize && currentPage){
//     postQuery.skip(pageSize * (currentPage - 1))
//     .limit(pageSize);
//   }
//   postQuery
//   .then(documents => {
//     fetchedPosts = documents;
//     return Post.countDocuments();
//     })
//     .then(count => {
//     res.status(200).json({
//       message: 'Posts fetched succesfuly',
//       posts: fetchedPosts,
//       maxPosts: count
//     });
//   })
//   .catch(error => {
//     res.status(500).json({
//       message: "Fetching posts failed!"
//     });
//   });
// }

// exports.getPost = (req, res, next) => {
//   Post.findById(req.params.id).then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({message: 'Post not found!'});
//     }
//   }).catch(error => {
//     res.status(500).json({
//       message: "Fetching post failded!"
//     });
//   })
// }

exports.deletePost =  (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.n){
    res.status(200).json({message: "Post deleted!"});
    }else{
      res.status(401).json({message: "Not autorization!"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  })

}
