const express = require("express");
const UserController = require("../controllers/user")
const router = express.Router();
const extractFile = require("../middleware/file");
const upload = require("../middleware/multer");
const checkAuth = require("../middleware/check-auth");
router.post("/checkEmail", UserController.checkEmail);
router.get("/getUsernames", UserController.getUsernames);
router.post("/onVerify", UserController.onVerify);
router.post("/signup", upload.single("image"), UserController.createUser);
router.post("/login", UserController.userLogin);
router.post("/forgot", UserController.forgot);
router.post("/changePsw", UserController.changePsw);
router.put("/checkIfLike", UserController.checkIfLike);
router.post("/editUser",checkAuth, upload.single("image"), UserController.editUser);
router.delete("/delete:id",checkAuth, UserController.deleteUser);
module.exports = router;
