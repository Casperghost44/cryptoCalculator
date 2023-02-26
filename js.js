const wrapper = document.querySelector(".wrapper"),
selectbtn = wrapper.querySelector(".currency"),
searchInp = wrapper.querySelector(".inp-curr"),
confirmBtn = wrapper.querySelector(".galochka"),
amount = wrapper.querySelector("#amount"),
submitBtn = wrapper.querySelector(".calc"),
output = wrapper.querySelector(".output"),
options = document.querySelector(".options");

var burl = "https://api.binance.com";
var info = "/api/v1/exchangeInfo";
var query = "/api/v3/depth";
var arrayC = [];
var param = "?symbol=BTCUSDT&limit=1";
var url;
var activeCurr = "";
var amountN = 0;
var indexofComma;
var ourRequest = new XMLHttpRequest();

function getData(){
    options.innerHTML = "";
    url = burl + info;
    ourRequest.open('GET', url, true);
    ourRequest.onload = function(){
    var res = ourRequest.responseText;
    var obj = JSON.parse(res);
    var symbols = obj.symbols;
    for(let i = 0; i < symbols.length; ++i){
        arrayC.push(symbols[i].symbol);
        let li = `<li name="${symbols[i].symbol}" onclick="updateName(this)" class="animate__animated animate__fadeInLeft">${symbols[i].symbol}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    };
};
    ourRequest.send();
};

getData();

function updateName(selectedLi){
    searchInp.value = "";
    getData();
    wrapper.classList.remove("active");
    activeCurr = selectedLi.innerText;
    selectbtn.innerText = selectedLi.innerText;
    selectbtn.innerHTML += `<i class="uil uil-angle-down" id="arrow"></i>`;
    if((amountN != 0) && (activeCurr != "")){
        submitBtn.classList.remove("hide");
    }
};

searchInp.addEventListener("keyup", () => {
    let arr = [];
    let searchVal = searchInp.value.toUpperCase();
    arr = arrayC.filter(data => {
        return data.startsWith(searchVal);
    }).map(data => `<li onclick="updateName(this)" class="animate__animated animate__fadeInLeft">${data}</li>`).join("");
    options.innerHTML = arr;
});


selectbtn.addEventListener("click", () =>{
    wrapper.classList.toggle("active");
});


function checkInput(str){
    let ligal = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", ","];
    var flag = true;
    if(str === ""){
        return false;
    }
    for(let i = 0; i < str.length; ++i){
        if(!(ligal.indexOf(str[i]) >= 0)){
            flag = false;
        }
        if(str[i] === ","){
            indexofComma = i;
        }
    }
    return flag;
}



amount.addEventListener("keyup", () =>{
    confirmBtn.innerHTML = `<i class="uil uil-check">`;
    confirmBtn.classList.remove("declined");
    confirmBtn.classList.remove("pressed");
});

amount.addEventListener("keyup", (e) => {
    if(e.keyCode == 13){
        confirmBtn.click();
    }
    if((amountN != 0) && (activeCurr != "")){
        submitBtn.classList.remove("hide");
    }
})

function confirmPress(){
    var temp = amount.value;
    if(checkInput(temp)){
        confirmBtn.classList.toggle("pressed");
        if(indexofComma >= 0){
            temp = temp.substring(0, indexofComma) + "." + temp.substring(indexofComma + 1);
        }
        amountN = parseFloat(temp);
    }
    else{
        confirmBtn.innerHTML = `<i class="uil uil-multiply"></i>`;
        confirmBtn.classList.add("declined");
    }
    if((amountN != 0) && (activeCurr != "")){
        submitBtn.classList.remove("hide");
    }
};

function getOutput(){
    var ourRequest = new XMLHttpRequest();
    url = burl + query + `?symbol=${activeCurr}&limit=1`;
    ourRequest.open('GET', url, true);
    ourRequest.onload = function(){
    var res = ourRequest.responseText;
    var obj = JSON.parse(res);
    if(obj.asks.length <= 0 || obj.bids.length <= 0){
        output.innerHTML = `<p class="animate__animated animate__fadeInTopRight">Data not found!</p>`;
        return;
    }
    else{
        var ask = obj.asks[0][0];
        var bid = obj.bids[0][0];
        var med = Number((parseFloat(ask) + parseFloat(bid))/2).toFixed(1);
        var result = Number(amountN * med).toFixed(2);
        var text1 = `${activeCurr}: ${med}`;
        var text2 = `Result is: ${result}`;
        output.innerHTML = `<p class="animate__animated animate__fadeInTopRight">${text1}</p>
        <p class="animate__animated animate__fadeInTopRight">${text2}</p>`;
    }}
    ourRequest.send();
}



submitBtn.addEventListener("click", () => {
    getOutput();
    getData();
    
})

