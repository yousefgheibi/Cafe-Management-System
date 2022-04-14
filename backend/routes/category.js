const express = require('express');
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");


router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let catrgory = req.body;
    let query = `insert into category (name) values(?)`;
    connection.query(query, [catrgory.name], (err, result) => {
        if (!err) {
            return res.status(200).json({ message: "Category Added Successfully" });
        }
        else {
            return res.send(500).json(err);
        }
    })
})


router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let query = "select * from category order by name";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    let query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: "Category id does not found" });
            }
            return res.status(200).json({ message: "Category Updated Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})


module.exports = router;