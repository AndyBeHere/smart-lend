$(function(){
    var selecter = '',downArr = [],already = [],loanArr = [];;

    // $(".selectors").change(function () {  
    //     selecter = $(this).children('option:selected').val();  
    // }); 
    //创建借条按钮
    // $(".createLend").click(function(){
    //     downArr.push(selecter);
    //     var html = '';
    //     for(var i = 0 ; i < downArr.length ; i ++){
    //         html += `<li class="bs-item">
    //         <form class="form-horizontal">
    //             <div class="form-group">
    //                 <label for="inputEmail3" class="col-sm-2 control-label">创建者</label>
    //                 <div class="col-sm-10">
    //                     <input type="text" class="form-control" readonly value="{{downArr[i]}}">
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //             <label for="inputEmail3" class="col-sm-2 control-label">选择借款者</label>
    //             <div class="col-sm-10">
    //                 <select class="form-control ">`;
    //                 for(var j = 0 ; j < loanArr.length ; loanArr ++){
    //                     html += "<option>"+loanArr[j]+"</option>";
    //                 };
    //             html +=    `</select>
    //             </div>
    //             </div>
    //             <div class="form-group">
    //                 <label for="inputEmail3" class="col-sm-2 control-label">借款金额</label>
    //                 <div class="col-sm-10">
    //                     <input type="text" class="form-control totalToPay" placeholder="请输入借款金额">
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //                 <label for="inputEmail3" class="col-sm-2 control-label">借款日期</label>
    //                 <div class="col-sm-10">
    //                     <input type="text" class="form-control startTime" placeholder="text">
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //                 <label for="inputEmail3" class="col-sm-2 control-label">还款期限</label>
    //                 <div class="col-sm-10">
    //                     <input type="text" class="form-control lastTime" placeholder="text">
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //                 <label for="inputEmail3" class="col-sm-2 control-label">月利率</label>
    //                 <div class="col-sm-10">
    //                     <input type="text" class="form-control monthRate" placeholder="请输入月利率">
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //                 <label for="inputEmail3" class="col-sm-2 control-label">违约金月利率</label>
    //                 <div class="col-sm-10">
    //                     <input type="text" class="form-control defaultRate" placeholder="请输入违约金月利率">
    //                 </div>
    //             </div>
    //             <div class="form-group">
    //             <div class="col-sm-offset-2 col-sm-10">
    //                 <button class="btn btn-success toLend">生成借条</button>
    //             </div>
    //             </div>
    //         </form>
    //     </li>`;
    //     };
    //     $(".itemBox").html(html);
    // });
    // //生成借条按钮
    // $(".itemBox").bind("click",".toLend",function(){
    //     var alreadyobj = {};
    //     downArr.remove(selecter);
    //     already.push(alreadyobj);
    //     var html = '';
    //     for(var i = 0 ; i < already.length ; i ++){
    //         html+=`
    //         <li>
    //             <table class="table">
    //                 <tr>
    //                     <td class="fw">贷方</td>
    //                     <td>{{}}</td>
    //                     <td class="fw">借方</td>
    //                     <td>{{}}</td>
    //                 </tr>
    //                 <tr>
    //                     <td class="fw">借款金额</td>
    //                     <td>{{}}</td>
    //                     <td class="fw">借款日期</td>
    //                     <td>{{}}</td>
    //                 </tr>
    //                 <tr>
    //                     <td class="fw">月利率</td>
    //                     <td>{{}}</td>
    //                     <td class="fw">违约金月利率</td>
    //                     <td>{{}}</td>
    //                 </tr>
    //                 <tr>
    //                     <td class="fw">还款期限</td>
    //                     <td>{{}}</td>
    //                     <td class="fw">借条状态</td>
    //                     <td>{{}}</td>
    //                 </tr>
    //             </table>
    //         </li>
    //         `;
    //     };
    //     $('.readyBox').html(html);
    // });

    //web3关联合约
    let rpUrl = "http://127.0.0.1:7545";
    function connect(){
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider(rpUrl));
        }
    }
    console.log(web3.eth.accounts);
    //填充下拉框
    function fillAccounts(toSelectId, excludeAdminAccount){
        // web3.eth.accounts 含有区块链全部的账号
        for (const account of web3.eth.accounts) {
            if(excludeAdminAccount != 'undefined' && excludeAdminAccount == account){
                continue
            };
            $(toSelectId).append("<option>"+account+"</option>");
        }
    }
    //创建合约
    function createLend(forAccount){
        console.log('here');
        var ballotContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"delegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"winningProposal","outputs":[{"name":"_winningProposal","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"toVoter","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toProposal","type":"uint8"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_numProposals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
        var ballot = ballotContract.new(
        {
            from: forAccount, 
            data: '0x608060405234801561001057600080fd5b5060405160208061087c83398101806040528101908080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055508060ff166002816100ec91906100f3565b5050610146565b81548183558181111561011a57818360005260206000209182019101610119919061011f565b5b505050565b61014391905b8082111561013f5760008082016000905550600101610125565b5090565b90565b610727806101556000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635c19a95c14610067578063609ff1bd146100aa5780639e7b8d61146100db578063b3f98adc1461011e575b600080fd5b34801561007357600080fd5b506100a8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061014e565b005b3480156100b657600080fd5b506100bf6104a0565b604051808260ff1660ff16815260200191505060405180910390f35b3480156100e757600080fd5b5061011c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061051c565b005b34801561012a57600080fd5b5061014c600480360381019080803560ff169060200190929190505050610619565b005b600080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002091508160010160009054906101000a900460ff16156101ae5761049b565b5b600073ffffffffffffffffffffffffffffffffffffffff16600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156102dc57503373ffffffffffffffffffffffffffffffffffffffff16600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b1561034b57600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1692506101af565b3373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156103845761049b565b60018260010160006101000a81548160ff021916908315150217905550828260010160026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff161561048357816000015460028260010160019054906101000a900460ff1660ff1681548110151561046457fe5b906000526020600020016000016000828254019250508190555061049a565b816000015481600001600082825401925050819055505b5b505050565b6000806000809150600090505b6002805490508160ff161015610517578160028260ff168154811015156104d057fe5b9060005260206000200160000154111561050a5760028160ff168154811015156104f657fe5b906000526020600020016000015491508092505b80806001019150506104ad565b505090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806105c45750600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff165b156105ce57610616565b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055505b50565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff168061068157506002805490508260ff1610155b1561068b576106f7565b60018160010160006101000a81548160ff021916908315150217905550818160010160016101000a81548160ff021916908360ff160217905550806000015460028360ff168154811015156106dc57fe5b90600052602060002001600001600082825401925050819055505b50505600a165627a7a72305820c046e4654e968965fdca1effe7fde30c85fa335da6d15bdc19c077148e3e95a80029', 
            gas: '4700000'
        }, function (e, contract){
            console.log(e);
            console.log(contract);
            if (typeof contract.address !== 'undefined') {
                console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                fillAccounts("#selectors",$("#toLend").val());
            }
        })
    }

})