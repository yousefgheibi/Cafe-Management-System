const express = require('express');
const connection = require('../connection');
const router = express.Router();


router.post('/signup', (req, res) => {
    let user = req.body;
  
    connection.query(`select email,password,role,status from user where email=?`, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
               let query = `insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')`
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Emaily Already Exist." })
            }
        }
        else {
            res.status(500).json(err);
        }
    })
})
module.exports = router;