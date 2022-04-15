const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v4();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    let query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.total, orderDetails.productDetails, orderDetails.createdBy], (err, result) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactnumber: orderDetails.contactNumber, paymentmethod: orderDetails.paymentMethod, totalAmount: orderDetails.total }, (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(result).toFile('./generated_pdf/' + generatedUuid + ".pdf", (err, data) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    })
                }
            })
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.post('/getPdf', auth.authenticateToken, (req, res) => {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactnumber: orderDetails.contactNumber, paymentmethod: orderDetails.paymentMethod, totalAmount: orderDetails.total }, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            else {
                pdf.create(result).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }

})



router.get('/getBills',auth.authenticateToken , (req,res)=>{
    let query = "select * from bill order by id DESC";
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }     
        else{
            return res.status(500).json(err);
        }
    })
})




router.delete('/delete/:id',auth.authenticateToken,(req,res)=>{
    const id = req.params.id;
    let query = "delete from bill where id=?";
    connection.query(query,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows == 0){
                return res.status(400).json({message:" Bill id does not found"});
            }
            return res.status(200).json({ message : "Bill Deleted Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;