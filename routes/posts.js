const express = require("express");

const PostController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();
const upload = require("../middleware/multer");
// const MIME_TYPE_MAP = {
//   'image/png': 'png',
//   'image/jpeg': 'jpeg',
//   'image/jpg': 'jpg'
// };
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if (isValid){
//       error = null;
//     }
//     cb(null, "backend/images");
//   },
//   filename: function (req, file, cb){
//     cb(null, ` ${Date.now()} ${file.originalname}`);
//   }
// })

// const upload = multer({storage});

router.post("/checkEmail", PostController.checkEmail);

 //router.post("/signup", upload.array("files"), PostController.createUser);
 router.post("/onVerify", PostController.onVerify);
 router.post("/signup", upload.fields([{name: "image", maxCount: 1},{name:"idImage", maxCount: 1}, {name: "files", maxCount: 800}]), PostController.createUser);
router.get("/getModels", PostController.getModels);
router.get("/getUsers", PostController.getUsers);
router.get("/getUserAuth/:id",checkAuth, PostController.getUserAuth);
router.get("/profile/:id", PostController.getProfile);
router.put("/addImage",extractFile,checkAuth, PostController.addImage);
router.post("/createContent",checkAuth, upload.single("image"), PostController.createContent);
router.get("/getPosts", PostController.getPosts);
router.get("/getPhotos", PostController.getPhotos);
router.get("/getOpinions", PostController.getOpinions);
router.get("/getArticles", PostController.getArticles);
router.put("/updateUsers", PostController.updateUsers);
router.put("/addLike",checkAuth, PostController.addLike);
router.put("/disLike",checkAuth, PostController.disLike);
router.put("/likeToggle",checkAuth, PostController.likeToggle);
router.get("/getContent", PostController.getContent);
router.get("/getContentOfUser/:id", PostController.getContentOfUser);
router.put("/update", PostController.update);
router.put("/addComment",checkAuth, PostController.addComment);
router.get("/getComments/:id", PostController.getComments);
router.put("/powerUp", PostController.powerUp);
router.put("/powerDown", PostController.powerDown);
router.put("/powerToggle",checkAuth, PostController.powerToggle);
router.put("/checkUsername", PostController.checkUsername);
router.get("/getPolls", PostController.getPolls);
router.put("/vote",checkAuth, PostController.vote);
router.delete("/deleteContent:id",checkAuth, PostController.deleteContent);
router.get("/songs",checkAuth, PostController.getSongs);
router.post("",extractFile, PostController.createPost);
router.put("/:id", extractFile, PostController.updatePost);
router.get("", PostController.getPosts);
router.delete("/:id",checkAuth, PostController.deletePost);


module.exports = router;
