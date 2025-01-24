const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken, jwtAuthMiddleware } = require('../jwt');

// Send data from client to server 
router.post('/signup', async (req, res) => {
    try {
        const data = req.body //Assuming user data is rn stored in req body hence, body parser

        // Creating newUser document using mongoose model 
        const newUser = new User(data);

        // Save new person to the database 
        const response = await newUser.save();
        console.log('data saved')

        //keeping id in payload
        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        res.status(200).json({ response: response, token: token });
        console.log("Token is: ", token)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//login route
router.post('/login', async (req, res) => {
    try {
        //extract citizenshipNum, and psw from request body
        const { citizenshipNum, password } = req.body;

        //find user by citizenshipNum
        const user = await User.findOne({ citizenshipNum: citizenshipNum });

        //if user does not exist or psw does not match return error
        if (!user || !(user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid citizenshipNum or password' });
        }

        //if both correct generate token
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        //return token as response
        res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interna server error' })
    }
})

//profile route
router.get('/profile', jwtAuthMiddleware, async (req, res,) => {
    try {
        // payload's data
        const userData = req.user;   //this req.user is from jwt.js where we have stored decoded data from token

        //since payload also id, username so 
        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' })
    }
})



router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;  //extract id from token
        const { currentPassword, newPassword } = req.body //extract current and new password from request body

        //find user by userID
        const user = await User.findById(userId)

        //If pass does not match return error
        if (!(await user.comparePassword(currentPassword))) {
            return res.status.json({ error: "Wrong password" });
        }

        //Update user's password
        user.password = newPassword;
        await user.save();
        console.log("Updated");
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})




module.exports = router;