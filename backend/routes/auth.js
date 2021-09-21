const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET="rahul$raj";

// Create a USER using : POST "/api/auth/createUser" : No Login Required 
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({min: 3}),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //   If there are error, return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array()});
    }

    // Check whether the user with this email exists already
    try {
      let success = false;
      // Finding a user with duplicate email.
      let user = await User.findOne({email: req.body.email});
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry, a user with this email already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Creating a new user.
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({success, authtoken});

      //   Catch errors if any at the server end
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occured");
    }
  }
);

// Authenticate a USER using : POST "/api/auth/login" : No Login Required 
router.post('/login', [
    body('email','Enter a valid email.').isEmail(),
    body('password','Password cannot be blank.').exists(),
], async (req, res) => {
    let success=false;
    // if there are errors then return this
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({success,error: "please try to login with correct credentials!"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false;
            return res.status(400).json({success, error: "please try to login with correct credentials!"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// Get logedin USER details using : POST "/api/auth/getuser" : Login Required 
router.post('/getuser', fetchuser, async (req, res) => {
    
    try {
       const userId=req.user.id;
       const user=await User.findById(userId).select("-password");
       res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

module.exports = router