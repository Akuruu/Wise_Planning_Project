let submitBtn = document.querySelector('#submitBtn');
let input = document.querySelector('.input');
let infoList = document.querySelector('#info-list');
let hideStock = document.querySelector('hide-stock');
let articleCard = document.querySelector('#article');
let gainerCard = document.querySelector('#gainer');
let loserCard = document.querySelector('#loser');
const infoTickerUrl = 'https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=M_EhIQKuJcODpxzxwlrUpvo8tpGkSqet';
const infoCompName = 'https://financialmodelingprep.com/api/v3/search-name?query=meta&limit=10&exchange=NASDAQ&apikey=${apiKey}';
const infoFinNews = 'https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=5&apikey=${apiKey}';
const infoCompRating = 'https://financialmodelingprep.com/api/v3/rating/${ticker}?apikey=${apiKey}'
let newsArticle = {
  content: "",
  date: "",
  link: "",
  tickers: "",
  title: "",
};

submitBtn.addEventListener('click', retrieve);

function retrieve(e){
  infoList.innerHTML = "";
  // searchResults = [
  //   {symbol: 'AAPL', name: 'Apple Inc.', currency: 'USD', stockExchange: 'NASDAQ Global Select', exchangeShortName: 'NASDAQ'},
  //   {symbol: 'MLP', name: 'Maui Land & Pineapple Company, Inc.', currency: 'USD', stockExchange: 'New York Stock Exchange', exchangeShortName: 'NYSE'},
  //   {symbol: 'APLE', name: 'Apple Hospitality REIT, Inc.', currency: 'USD', stockExchange: 'New York Stock Exchange', exchangeShortName: 'NYSE'}];
  // e.preventDefault();
	if (input.value == ''){
		alert('Input field is empty')
		return
	}

	// const apiKey = '0d784df591c50ec5f238976a008df8c3'
  // apiKey2 = '7mQ2Tt2MghpA3cI9pyKMcJf4kalR3euf'
	let searchTerm = input.value;
//US has these 3 exchanges, so we would need to call the 3 markets to show all the companies in those exchanges 
  let queryNasqad = `https://financialmodelingprep.com/api/v3/search-name?query=${searchTerm}&limit=10&exchange=NASDAQ&apikey=0d784df591c50ec5f238976a008df8c3`;
  // let queryNyse = `https://financialmodelingprep.com/api/v3/search-name?query=${searchTerm}&limit=10&exchange=NYSE&apikey=7mQ2Tt2MghpA3cI9pyKMcJf4kalR3euf`;
  // let queryAmex = `https://financialmodelingprep.com/api/v3/search-name?query=${searchTerm}&limit=10&exchange=AMEX&apikey=${apiKey}`;
  let exchangesArr = [queryNasqad]; //queryNyse];

  for (exchange in exchangesArr) {
    fetch(exchangesArr[exchange]).then((res)=>{
      return res.json()
    }).then((data)=>{
      console.log(data);
      displaySearchRes(data);
    }).catch((error)=>{
      console.log(error);
    })
  }
  
}

//this shows/creates html elements
function displaySearchRes(searchResult){
  // for loop when more than one company matches search, it will bring all possible companies
  for (searchRes in searchResult){
  let ul = document.createElement('ul');
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.setAttribute('data-ticker', searchResult[searchRes]["symbol"]);
  a.textContent = searchResult[searchRes]["name"];
  li.appendChild(a);
  ul.appendChild(li);
  infoList.appendChild(ul);
  }
}
//listener that listens to any click given to any a element in the infoList
infoList.addEventListener("click", function(event) {
  var element = event.target;
  if (element.matches("a") === true) {
      var ticker = element.getAttribute("data-ticker");
      polyData(ticker);
  }
});

//function that calls polygon by ticker

function polyData(ticker) {
  var queryTicker = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=4384b9dd05a38aabc997c0dbb99252cc`;
    fetch(queryTicker)
      .then(function(res) {
          console.log(res);
          return res.json()
      })
      // adding API's Dom values to html for display
      .then(function(data){
          
          let companyTicker = data.results[0].T
          let lastClose = data.results[0].c
          let stockHigh = data.results[0].h
          let stockLow = data.results[0].l
          T.setAttribute('data-ticker', searchResult[searchRes]["companyTicker"]);
          t.textContent = searchResult[searchRes]["T"];
          c.setAttribute('data-ticker', searchResult[searchRes]["lastClose"]);
          c.textContent = searchResult[searchRes]["c"];
          h.setAttribute('data-ticker', searchResult[searchRes]["stockHigh"]);
          h.textContent = searchResult[searchRes]["h"];
          l.setAttribute('data-ticker', searchResult[searchRes]["stockLow"]);
          l.textContent = searchResult[searchRes]["T"];
          function createListItem (text) {
            let li = document.createElement("li");
            li.textContent = text;
            return li;
          }

          function appendChildren (parent, children) {
            children.forEach(function (child) {
              parent.appendChild(child);
            });
              }

              let infoList =document.getElementById("info-list");

              let items = [
                createListItem("T"),
                createListItem("c"),
                createListItem("h"),
                createListItem("l")
              ];

             appendChildren(infoList, items);
          })
            
          }

      
    

    

  //to do:
  //display Polygon Data: closing price, highest, lowest

  //create call for news from FMP
  function stockArticles() {
    var queryArticle = `https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=5&apikey=0d784df591c50ec5f238976a008df8c3`;
      fetch(queryArticle)
        .then(function(res) {
            console.log(res);
            return res.json()
        })
        .then(function(data){
            console.log(data);
            handleArticleData(data);
        });
      }
      stockArticles();


//show news in the main page
function handleArticleData(data){
  console.log(data);
  for(d in data["content"]){
    var articleDiv = document.createElement('div');
    articleCard.append(articleDiv);
    articleDiv.innerHTML = "<h3>" +  data["content"][d]["title"] +  "</h3>" + "<a href='"+ data["content"][d]["link"] +"'>" + " Read full article"+ "</a>" + "<p>" + data["content"][d]["date"] + "</p>";
  }
}

  //create call for gainers and losers to be displayed on main page
function getLosers(){
  var queryLosers = 'https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=0d784df591c50ec5f238976a008df8c3';
  fetch(queryLosers)
        .then(function(res) {
            console.log(res);
            return res.json()
        })
        .then(function(data){
            console.log(data);
            displayLosers(data);
        });
}
getLosers();

function displayLosers(data){
  console.log(data);
  for(d in data.slice(0, 5)){
    console.log(data[d]);
    var loserDiv = document.createElement('div');
    loserCard.append(loserDiv);
    loserDiv.innerHTML = "<h4>" +  data[d]["name"] +  "</h4>" + "<ul>"+ "<li>" + data[d]["symbol"]+ "</li>" + "<li>" + data[d]["change"] + "</li>" + "<li>" + data[d]["price"]+ "</li>" + "<li>" + data[d]["changesPercentage"]+ "</li>" + "</ul>";
  }
}
  //rotating phrase
  var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 300 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };
  
  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.typeT = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
  };

