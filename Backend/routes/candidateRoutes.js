const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidates');
const User = require('../models/user');
const { generateToken, jwtAuthMiddleware } = require('../jwt');

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user.role === 'admin';
    } catch (err) {
        return false;
    }
}

// POST route to add candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (await !checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User not admin' })
        }

        const data = req.body //Assuming user data is rn stored in req body hence, body parser

        // Creating newUser document using mongoose model 
        const newCandidate = new Candidate(data);

        // Save new person to the database 
        const response = await newCandidate.save();
        console.log('data saved')

        //keeping id in payload
        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
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



router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User not admin' })
        }

        const candidateId = req.params.candidateID;  //extract id from url parameter
        const updatedCandidate = req.body;  //updated data for the person

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidate, {
            new: true,  //Return UPDATED document
            runValidators: true,  //Run mongoose validation(required haru type ko lekhya thim ta schema banauda)
        })

        // If tyo id ko manchhe nai chaina bhane 
        if (!updatedCandidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        console.log("Updated");
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User not admin' })
        }

        const candidateId = req.params.candidateID;  //extract id from url parameter

        const response = await Candidate.findByIdAndDelete(candidateId);

        // If tyo id ko manchhe nai chaina bhane 
        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        console.log("Candidate deleted");
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//for voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    //no admin can vote 
    //user can only vote once

    candidateID = req.params.candidateID;
    userID = req.user.id;   //since we have passed id in payload; req.user contains payload data from jwt.js

    try {
        //find candidate with specific candidate id
        const candidate = await Candidate.findById(candidateID);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' })
        }

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.isVoted) {
            return res.status(400).json({ message: 'You have already voted' })
        }

        if (user.role == "admin") {
            return res.status(403).json({ message: 'Admin cannot vote' })
        }


        //update candidate document to record vote
        candidate.votes.push({ user: userID });
        candidate.voteCount++;
        await candidate.save();

        //update user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "Vote recorded sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
})


//vote count 
router.get('/vote/count', async (req, res) => {
    //find all candidates and sort by total vote count in descending order
    try {
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        // map candidate to return only party and votecount 
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json({ voteRecord });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
})


//getting candidate list
router.get('/', async (req, res) => {
    try {
        const candidateList = await Candidate.find();
        const candidateNames = candidateList.map((data) => data.name);
        res.status(200).json({ candidateNames })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;