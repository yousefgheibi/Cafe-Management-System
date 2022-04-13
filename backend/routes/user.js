const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); 
require("dotenv").config();

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



router.post('/login', (req, res) => {
    const user = req.body;
    let query = `select email,password,role,status from user where email=?`;
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0 || result[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or password" });
            }
            else if (result[0].status === 'false') {
                return res.status(401).json({ message: "Wait for admin Approval" });
            }
            else if (result[0].password == user.password) {
                const responce = { email: result[0].email, role: result[0].role }
                const accessToken = jwt.sign(responce, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again later." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })

})



var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword',(req,res)=>{
    const user = req.body;
    let query = `select email,password from user where email=?`;
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length <=0){
                return res.status(200).json({message : "Password sent successfully to your email."});
            }
            else{
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: result[0].email,
                    subject: 'Password by Cafe Management System',
                    html: `<p><b>Your Login details for Cafe MAnagement System</b><br><b>Email : </b> ${result[0].email}<br><b>Password : </b>${result[0].password}<br><a href="">Click here to login</a></p>`
                };
                transporter.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(`Email sent : ${info.responce}`);
                    }
                });
                return res.status(200).json({message : "Password sent successfully to your email."});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;