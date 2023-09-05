const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); //for password hashing
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'jaeisagood$boy'; //we will sign our web token with this secret string...ideally it should be in an env file

//ROUTE 1 : CREATE USER
//Create a User using POST ".api/auth/createUser". No login required
router.post('/createuser', [
  body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success, error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create and save the new user
    const newUser = new User({ name, email, password: secPass });


    await newUser.save();

    //CHANGES
    const data = {
      user:{
        id: newUser.id
      }
    }
    //sign method jwt
    const authtoken = jwt.sign(data, JWT_SECRET);
    // console.log(authtoken);
    success = true;
    res.json({success, message: 'User created successfully', authtoken });
    // res.send(User);
  } catch (error) {

    console.error(error);
    res.status(500).send('Server Error');
  }
});


//ROUTE 2: USER LOGIN
//Authenticate a User //POST "/api/auth/login" . No login required
router.post('/login', [
  // body('name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  
  let success = false;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructuring
  const {email, password} = req.body;
  
  try {
    let user = await User.findOne({email});

    if(!user){
      return res.status(400).json({error: "Invalid credentials"});
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      //password doesn't match
      success = false;
      return res.status(400).json({success, error: "Invalid credentials"});
    }

    //CHANGES
    const data = {
      user:{
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken});
    // res.json({ message: 'Logged in successfully', authtoken });

    
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


//ROUTE 3: DEATAILS OF LOGGED IN USER
//POST "/api/auth/getuser" . Login Required

router.post('/getuser', fetchuser, async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
  console.log('User:', user);
  
 } catch (error) {
  console.error(error);
  res.status(500).send('Server Error');
  
 }
});

module.exports = router;