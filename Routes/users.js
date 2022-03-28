const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("hey ts user route")
})
//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.pasword = await bcrypt.hash(req.body.password, salt);
            } catch (err){
                return res.status(500).json(err);
            }

        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has benn updated");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can update only your account")

    }

});
//delete user
router.delete("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id ||req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted");
        }catch(err){

            return res.status(500).json(err);
        }
    }else{
        return res.status(500).json("you can only delete your account");
    }
});
//get a user

//follow a user

router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers : req.body.userId}});
                await currentUser.updateOne({$push:{following: req.body.userId}});
                res.status(200).json("User has been followed");
            }else{
                res.status(403).json("You already follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Ypu cannot follow yourself");
    }
})
//unfollow a user
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull :{followers: req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(403).json("You dont follow this user");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You cant unfollow yourself");
    }
})


module.exports = router