// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(function () {
    var publicKey = localStorage.getItem('publicKey');
    if (publicKey != null) {
        $('#loginMenu').css('display', 'none');
        $('#logoutMenu').css('display', 'block');
    }
    else {
        $('#loginMenu').css('display', 'block');
        $('#logoutMenu').css('display', 'none');
    }
})

var covalentAPI = 'ckey_756a9fcc593742108e6204976ff';

const caver = new Caver('https://api.baobab.klaytn.net:8651/');

function createNewAccount() {
    const keyring = caver.wallet.keyring.generate();
    $('.newAccountPublicKey').text(keyring.address);
    $('.newAccountPrivateKey').text(keyring.key.privateKey);
}

function confirmNewAccount() {
    var publicKey = $('.newAccountPublicKey').text();
    var privateKey = $('.newAccountPrivateKey').text();
    localStorage.setItem('publicKey', publicKey);
    localStorage.setItem('privateKey', privateKey);
    location.href = "/Wallet/Index";
}

function login() {
    var publicKey = $('.publicKey').val();
    var privateKey = $('.privateKey').val();
    localStorage.setItem('publicKey', publicKey);
    localStorage.setItem('privateKey', privateKey);
    location.href = "/Wallet/Index";
}

function logout() {
    var publicKey = localStorage.getItem('publicKey');
    caver.wallet.remove(publicKey);
    localStorage.clear();
    location.href = "/Home/Login";
}

function getBalances() {
    var publicKey = localStorage.getItem('publicKey');
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.covalenthq.com/v1/8217/address/" + publicKey + "/balances_v2/?key=" + covalentAPI,
        "method": "GET"
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        var klayToken = response.data.items.find(x => x.contract_ticker_symbol === 'KLAY');
        var klayBalance = caver.utils.convertFromPeb(klayToken.balance);
        $('#klayBalanceAccount').text(klayBalance);
        var list = document.querySelector('.tokenList');
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        var theadTr = document.createElement('tr');
        var contractNameHeader = document.createElement('td');
        contractNameHeader.innerHTML = 'Token';
        theadTr.appendChild(contractNameHeader);
        var contractTickerHeader = document.createElement('td');
        contractTickerHeader.innerHTML = 'Ticker';
        theadTr.appendChild(contractTickerHeader);
        var balanceHeader = document.createElement('td');
        balanceHeader.innerHTML = 'Balance';
        theadTr.appendChild(balanceHeader);
        var usdHeader = document.createElement('td');
        usdHeader.innerHTML = 'USD';
        theadTr.appendChild(usdHeader);

        thead.appendChild(theadTr)

        table.className = 'table';
        table.appendChild(thead);
        for (j = 0; j < response.data.items.length; j++) {
            var tbodyTr = document.createElement('tr');
            var contractTd = document.createElement('td');
            contractTd.innerHTML = response.data.items[j].contract_name;
            tbodyTr.appendChild(contractTd);
            var contractTickerTd = document.createElement('td');
            contractTickerTd.innerHTML = response.data.items[j].contract_ticker_symbol;
            tbodyTr.appendChild(contractTickerTd);
            var balanceTd = document.createElement('td');
            balanceTd.innerHTML = caver.utils.convertFromPeb(response.data.items[j].balance);
            tbodyTr.appendChild(balanceTd);
            var balanceUSDTd = document.createElement('td');
            balanceUSDTd.innerHTML = response.data.items[j].quote;
            tbodyTr.appendChild(balanceUSDTd);
            tbody.appendChild(tbodyTr);
        }
        table.appendChild(tbody);

        list.appendChild(table);
    });
}

function getTransactions() {
    var publicKey = localStorage.getItem('publicKey');
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.covalenthq.com/v1/8217/address/" + publicKey + "/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=0&key=" + covalentAPI,
        "method": "GET"
    };
    $.ajax(settings).done(function (response) {
        
        if (response.data.items.length == 0) {
            $('#noTransactions').css('display', 'block');
            $('#noTransactions').text('There is no transaction for this address.');
        }
        else {
            console.log(response);
            $('#noTransactions').css('display', 'none');
            var list = document.querySelector('.transactionList');
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            var tbody = document.createElement('tbody');


            var theadTr = document.createElement('tr');
            var contractNameHeader = document.createElement('td');
            contractNameHeader.innerHTML = 'Trx Hash';
            //theadTr.appendChild(contractNameHeader);
            var contractTickerHeader = document.createElement('td');
            contractTickerHeader.innerHTML = 'From Address';
            theadTr.appendChild(contractTickerHeader);
            var contractTickerHeader = document.createElement('td');
            contractTickerHeader.innerHTML = 'To Address';
            theadTr.appendChild(contractTickerHeader);
            var balanceHeader = document.createElement('td');
            balanceHeader.innerHTML = 'Amount';
            theadTr.appendChild(balanceHeader);
            var usdHeader = document.createElement('td');
            usdHeader.innerHTML = 'USD';
            theadTr.appendChild(usdHeader);
            var usdHeader = document.createElement('td');
            usdHeader.innerHTML = 'Fees';
            theadTr.appendChild(usdHeader);

            thead.appendChild(theadTr);
            table.className = 'table';
            table.appendChild(thead);
            
            for (j = 0; j < response.data.items.length; j++) {
                var tbodyTr = document.createElement('tr');
                var contractTd = document.createElement('td');
                contractTd.innerHTML = response.data.items[j].tx_hash;
                //tbodyTr.appendChild(contractTd);
                var contractFromTickerTd = document.createElement('td');
                contractFromTickerTd.innerHTML = response.data.items[j].from_address;
                tbodyTr.appendChild(contractFromTickerTd);
                var contractTickerTd = document.createElement('td');
                contractTickerTd.innerHTML = response.data.items[j].to_address;
                tbodyTr.appendChild(contractTickerTd);
                var balanceTd = document.createElement('td');
                balanceTd.innerHTML = caver.utils.convertFromPeb(response.data.items[j].value);
                tbodyTr.appendChild(balanceTd);
                var balanceUSDTd = document.createElement('td');
                balanceUSDTd.innerHTML = response.data.items[j].value_quote;
                tbodyTr.appendChild(balanceUSDTd);
                var contractIdTd = document.createElement('td');
                contractIdTd.innerHTML = caver.utils.convertFromPeb(response.data.items[j].fees_paid);
                tbodyTr.appendChild(contractIdTd);
                tbody.appendChild(tbodyTr);
            }
            table.appendChild(tbody);

            list.appendChild(table);
        }
    });
}

function sendTransaction() {
    var recipient = $('#trx_address').val();
    if (recipient == '') {
        $('#errorTrx').css("display", "block");
        $('#errorTrx').text("Recipient is invalid");
        return;
    }
    var amount = $('#trx_amount').val();
    if (amount == '') {
        $('#errorTrx').css("display", "block");
        $('#errorTrx').text("Amount is invalid");
        return;
    }
    var publicKey = localStorage.getItem('publicKey');
    var privateKey = localStorage.getItem('privateKey');
    const keyring = caver.wallet.newKeyring(publicKey, privateKey);
    caver.wallet.updateKeyring(keyring);
    const vt = caver.transaction.valueTransfer.create({
        from: keyring.address,
        to: recipient,
        value: caver.utils.convertToPeb(amount, 'KLAY'),
        gas: 25000,
    });
    caver.wallet.sign(keyring.address, vt).then(
            signed => {
            caver.rpc.klay.sendRawTransaction(signed).then(response => {
                $('#trx_address').val('');
                $('#trx_amount').val('');
                $('#errorTrx').css("display", "none")
            }).catch(err => {
                $('#errorTrx').text(err);
                $('#errorTrx').css("display", "block")
            })
    })
}