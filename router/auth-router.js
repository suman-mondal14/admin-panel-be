const express = require("express");
const router  = express.Router();
const { home, postHandler, login } = require("../controllers/auth-controller");

// GET request
router.route("/getAllUser").get(home);
// POST request
router.route("/register").post(postHandler);
router.route("/login").put(login);


// router.get('/',(req, res)=>{
//     res.status(200).send("Response from Router");
// })

// router.route("/").get((req,res)=>{
//     res.status(200).status("Welcome")
// });

module.exports = router;