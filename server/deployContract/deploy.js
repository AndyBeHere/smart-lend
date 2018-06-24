#!/usr/bin/env node

fs = require('fs')
var solc = require('solc');
var Web3 = require("web3");

var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

var source = fs.readFileSync('../../smartLend.sol', 'utf8').toString();
var output = solc.compile(source, 1);

const bytecode = output.contracts[':smartLend'].bytecode;
const abi = JSON.parse(output.contracts[':smartLend'].interface);

var smartLend;
var accos;
web3.eth.getAccounts(function(error, accounts) {

    var contract = new web3.eth.Contract(abi);
    accos = accounts;
    console.log("create smartLend from accounts[0]: " + accounts[0])

    contract.deploy({data: '0x' + bytecode}).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '30000000000000'
    }, function(error, transactionHash) {
        if(error){
            console.log("error: " + error);
        }else{
            console.log("transactionHash: " + transactionHash);
        }
    })
    .then(function(newContractInstance){
        smartLend = newContractInstance;
        console.log("newContractInstance.options.address: " + newContractInstance.options.address);

        var str = {
            address: newContractInstance.options.address,
            abi: abi
        }
        fs.writeFileSync("deploy.info", JSON.stringify(str), 'utf8');

    });
});


