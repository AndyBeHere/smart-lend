fs = require('fs')
var express = require('express');
var router = express.Router();


var deployInfo = fs.readFileSync('../deployContract/deploy.info', 'utf8').toString();
console.log("deployInfo: " + deployInfo);
var json = JSON.parse(deployInfo)

var Web3 = require("web3");
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
var abi = json.abi;
var address = json.address;
var smartLend = new web3.eth.Contract(abi, address);


/* GET action page. */

//获取Available Accounts
router.get('/accounts', function(req, res, next) {
    web3.eth.getAccounts(function(error, accounts) {
        res.send(accounts);
    });
});


//创建借条
router.get('/creatLend/:from/:to', function(req, res, next) {
    const from = req.params.from
    const to = req.params.to
    smartLend.methods.creatLend(to, "accept", "creditName", "creditId", "debitName", "debitId", 12345, 54321, 3333333, 100, 200).send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })
});

//借方确认
router.get('/confirmLend/:isConfirmed/:from', function(req, res, next) {
    const isConfirmed = req.params.isConfirmed
    const from = req.params.from
    smartLend.methods.confirmLend(isConfirmed).call({from: from})
    .then(function(result){
        console.log("result: " + result); 
        res.send(result); 
    })
});

//转账到账户
router.get('/addMoney/:from', function(req, res, next) {
    const from = req.params.from
    smartLend.methods.addMoney().send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })

});

//检查账户余额
router.get('/checkBalance/:from', function(req, res, next) {
    const from = req.params.from
    smartLend.methods.checkBalance().call({from: from})
    .then(function(result){
        console.log("result: " + result); 
        res.send(result); 
    })
});

//检查待还款余额
router.get('/checkLend/:from/:id', function(req, res, next) {
    const id = req.params.id
    const from = req.params.from
    smartLend.methods.checkLend(id).call({from: from})
    .then(function(result){
        console.log("result: " + result); 
        res.send(result); 
    })
});

//还款
router.get('/payLoan/:from/:id', function(req, res, next) {
    const id = req.params.id
    const from = req.params.from
    smartLend.methods.payLoan(id).send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })
});

//逾期还款完成或到期之前还款完成或逾期超过两年未追溯
router.get('/closeLend/:from/:id', function(req, res, next) {
    const id = req.params.id
    const from = req.params.from
    smartLend.methods.closeLend(id).send({from: from, gas: 1500000})
    .on('receipt', function(receipt){
        console.log("receipt: " + receipt); 
        res.send(receipt);    
    })
});


module.exports = router;
