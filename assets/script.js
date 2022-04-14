let submitBtn = document.querySelector('#submitBtn');
let input = document.querySelector('.input');
let infoList = document.querySelector('#info-list');
let articleCard = document.querySelector('#article');
let gainerCard = document.querySelector('#gainer');
let titleArticle = document.querySelector('#title-article');
let titleArtGainers = document.querySelector('#title-gainer')


submitBtn.addEventListener('click', retrieve);

function retrieve(e) {
  infoList.innerHTML = "";
  articleCard.innerHTML = "";
  gainerCard.innerHTML = "";
  titleArtGainers.innerHTML = "";
  titleArticle.innerHTML = "";

  if (input.value == '') {
    alert('Input field is empty')
    return
  }

  // const apiKey - Evelyn FMP = '0d784df591c50ec5f238976a008df8c3'
  let searchTerm = input.value;
  //US has these 3 exchanges, so we would need to call the 3 markets to show all the companies in those exchanges 
  let queryNasqad = `https://financialmodelingprep.com/api/v3/search-name?query=${searchTerm}&limit=10&exchange=NASDAQ&apikey=0d784df591c50ec5f238976a008df8c3`;
  // let queryNyse = `https://financialmodelingprep.com/api/v3/search-name?query=${searchTerm}&limit=10&exchange=NYSE&apikey=7mQ2Tt2MghpA3cI9pyKMcJf4kalR3euf`;
  // let queryAmex = `https://financialmodelingprep.com/api/v3/search-name?query=${searchTerm}&limit=10&exchange=AMEX&apikey=${apiKey}`;
  let exchangesArr = [queryNasqad]; //queryNyse];

  for (exchange in exchangesArr) {
    fetch(exchangesArr[exchange]).then((res) => {
      return res.json()
    }).then((data) => {
      console.log(data);
      displaySearchRes(data);
    }).catch((error) => {
      console.log(error);
    })
  }

}

//this shows/creates html elements
function displaySearchRes(searchResult) {
  // for loop when more than one company matches search, it will bring all possible companies
  for (searchRes in searchResult) {
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
infoList.addEventListener("click", function (event) {
  var element = event.target;
  if (element.matches("a") === true) {
    var ticker = element.getAttribute("data-ticker");
    polyData(ticker);
  }
});

//function that calls polygon by ticker
//Edwin's key to Polygon M_EhIQKuJcODpxzxwlrUpvo8tpGkSqet

function polyData(ticker) {
  var queryTicker = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=M_EhIQKuJcODpxzxwlrUpvo8tpGkSqet`;
  fetch(queryTicker)
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      console.log(data);
      handleTickerData(data);
    })
}

function handleTickerData(data) {
  console.log(data);
  for (d in data["results"]) {
    var infoListDiv = document.createElement('div');
    infoList.append(infoListDiv);
    infoListDiv.innerHTML = "<h3>" + data["results"][0]["T"] + "</h3>" + "<li>" + data["results"][0]["c"] + "</li>"+ "<p>" + data["results"][0]["h"] + "</p>";
  }
}

// create call for news from FMP
function stockArticles() {
  var queryArticle = `https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=5&apikey=6b5b1e9afa1a31cc4e5f0033e2ee6e9b`;
  fetch(queryArticle)
    .then(function (res) {
      console.log(res);
      return res.json()
    })
    .then(function (data) {
      console.log(data);
      handleArticleData(data);
    });
}
stockArticles();

//show news in the main page 
function handleArticleData(data) {
  console.log(data);
  var titleArt = document.createElement('h2');
  titleArt.innerHTML = "Latest News";
  titleArticle.prepend(titleArt);
  for (d in data["content"]) {
    var articleDiv = document.createElement('div');
    articleCard.append(articleDiv);
    articleDiv.innerHTML = "<h3>" + data["content"][d]["title"] + "</h3>" + "<a href='" + data["content"][d]["link"] + "'>" + " Read full article" + "</a>" + "<p>" + data["content"][d]["date"] + "</p>";
  }
}

//create call for gainers to be displayed on main page 
function getGainers() {
  var queryGainers = 'https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=00bd83fe665028f00039a626fdabd48e';
  fetch(queryGainers)
    .then(function (res) {
      console.log(res);
      return res.json()
    })
    .then(function (data) {
      console.log(data);
      displayGainers(data);
    });
}
getGainers();

function displayGainers(data) {
  console.log(data);
  var titleGainer = document.createElement('h2');
  titleGainer.innerHTML = "Most Gainer Stock Companies";
  titleArtGainers.prepend(titleGainer);
  for (d in data.slice(0, 5)) {
    console.log(data[d]);
    var gainerDiv = document.createElement('div');
    gainerCard.append(gainerDiv);
    gainerDiv.innerHTML = "<h3>" + data[d]["name"] + "</h3>" + "<ul>" + "<li>" + data[d]["symbol"] + "</li>" + "<li>" + data[d]["change"] + "</li>" + "<li>" + "$" + data[d]["price"] + "</li>" + "<li>" + data[d]["changesPercentage"] + "%" +"</li>" + "</ul>";
  }
}

//rotating phrase
var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

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

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i = 0; i < elements.length; i++) {
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
  