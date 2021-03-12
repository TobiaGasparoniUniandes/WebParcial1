const listado = "data.json";

var numItems = 0;

var cats = ["Burguers", "Tacos", "Salads", "Desserts", "Drinks & Sides"]

function readJson (url) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function() {
            (req.status===200) ? (resolve(JSON.parse(req.responseText))) : (reject(req.statusText))
        };
        req.send();
    });
}

for(let cat = 0; cat < cats.length; cat++) {
    let item = document.getElementById(cats[cat]);
    item.addEventListener("click", () => {
        let list = document.getElementById("list");
        list.innerHTML = "";
        renderCategory(cats[cat]);
    });
}

readJson(listado).then((listadoArr) => {
    console.log(listadoArr);
});

function renderCategory(category) {
    readJson(listado).then((listadoArr) => {
        console.log(listadoArr);
        for(let cat = 0; cat < listadoArr.length; cat++) {
            if(listadoArr[cat].name === category) {
        
                let card = document.createElement("div");
                card.style = "width: 18rem;";
                card.className = "card";

                let img = document.createElement("img");
                img.className = "card-img-top";
                img.src = listadoArr[cat].image;
                img.alt = "Food item";
                card.appendChild(img);

                let cardBody = document.createElement("div");
                cardBody.className = "card-body";

                let h5 = document.createElement("h5");
                h5.className = "card-title";
                h5.appendChild(document.createTextNode(listadoArr[cat].name));
                cardBody.appendChild(h5);

                let desc = document.createElement("p");
                desc.className = "card-text";
                desc.appendChild(document.createTextNode(listadoArr[cat].description));
                cardBody.appendChild(desc);

                let strong = document.createElement("strong");
                strong.appendChild(document.createTextNode(listadoArr[cat].price));
                cardBody.appendChild(strong);

                card.appendChild(cardBody);

                let button = document.createElement("button");
                button.appendChild(document.createTextNode("Add to cart"));
                button.addEventListener("click", () => {
                    numItems += 1;
                    let itemsElem = document.getElementById("numItems");
                    itemsElem.innerHTML(numItems);
                });

                card.appendChild(button);

                document.getElementById("list").appendChild(card);
            }
        }
    });
}

/*
<div class="card" style="width: 18rem;">
    <img class="card-img-top" src="oneburger.png" alt="Burger item">
    <div class="card-body">
        <h5 id="burg-title" class="card-title">Card title</h5>
        <p id="burg-desc" class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <strong id="burg-price">Price</strong>
    </div>
    <button>Add to cart</button>
</div>
*/

/*
function createEntry() {
    let entry = {
        "last_name": document.getElementById("last-name").value,
        "first_name": document.getElementById("first-name").value,
        "email": document.getElementById("email").value,
        "photo": "http://dummyimage.com/155x119.png/ff4444/ffffff"
    };
    people.push(entry);
    if(last_name_asc !== NEUTRAL)
        order(LAST_NAME, last_name_asc === ASC);
    if(first_name_asc !== NEUTRAL)
        order(FIRST_NAME, first_name_asc === ASC);
    if(email_asc !== NEUTRAL)
        order(FIRST_NAME, email_asc === ASC);
    display();
}

// Function to add event listener to every heading except photo!
// Also loads event listener to submit button
function loadEventListeners() {
    
    let headLastName = document.createElement("td");
    headLastName.appendChild(document.createTextNode("Last Name"));
    headLastName.addEventListener("click", function () {
        if(last_name_asc <= 0) {
            order(LAST_NAME, true);
            last_name_asc = ASC;
        } else{
            order(LAST_NAME, false);
            last_name_asc = DESC;
        }
        setToNeutral(LAST_NAME);
    });

    let headFirstName = document.createElement("td");
    headFirstName.appendChild(document.createTextNode("First Name"));
    headFirstName.addEventListener("click", function () {
        if(first_name_asc <= 0) {
            order(FIRST_NAME, true);
            first_name_asc = ASC;
        } else if (first_name_asc > 0) {
            order(FIRST_NAME, false);
            first_name_asc = DESC;
        }
        setToNeutral(FIRST_NAME);
    });

    let headEmail = document.createElement("td");
    headEmail.appendChild(document.createTextNode("Email"));
    headEmail.addEventListener("click", function () {
        if(email_asc <= 0) {
            order(EMAIL, true);
            email_asc = ASC;
        } else if (email_asc > 0) {
            order(EMAIL, false);
            email_asc = DESC;
        }
        setToNeutral(EMAIL);
    });

    let headPhoto = document.createElement("td");
    headPhoto.appendChild(document.createTextNode("Photo"));

    let thead = document.getElementById("thead");
    thead.appendChild(headLastName);
    thead.appendChild(headFirstName);
    thead.appendChild(headEmail);
    thead.appendChild(headPhoto);

    const formCreate = document.getElementById('create');
    formCreate.addEventListener('click', createEntry);
}

function setToNeutral(except) {
    if(except !== LAST_NAME) {last_name_asc = NEUTRAL;}
    if(except !== FIRST_NAME) {first_name_asc = NEUTRAL;}
    if(except !== EMAIL) {email_asc = NEUTRAL;}
}

function display() {
    let tbody = document.getElementById("tbody");
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    };

    for(let i = 0; i < people.length; i++) {
        let person = people[i];
        let row = document.createElement("tr");

        let tdLastName = document.createElement("td");
        tdLastName.appendChild(document.createTextNode(person.last_name));
        
        let tdFirstName = document.createElement("td");
        tdFirstName.appendChild(document.createTextNode(person.first_name));
        
        let tdEmail = document.createElement("td");
        tdEmail.appendChild(document.createTextNode(person.email));
        
        let tdPhoto = document.createElement("td");
        let imgPhoto = document.createElement("img");
        imgPhoto.setAttribute("src", person.photo);
        tdPhoto.appendChild(imgPhoto);

        row.appendChild(tdLastName);
        row.appendChild(tdFirstName);
        row.appendChild(tdEmail);
        row.appendChild(tdPhoto);
        
        tbody.appendChild(row);
    }
}

function compare(x, y, asc) {
    if(asc) {
        if (x < y) {return -1;}
        if (x > y) {return 1;}
    } else {
        if (x < y) {return 1;}
        if (x > y) {return -1;}
    }
    return 0;
}

function order(param, asc) {
    if(param === LAST_NAME) {
        people.sort(function(a, b){
            var x = a.last_name;
            var y = b.last_name;
            return compare(x, y, asc);
        });
    } else if((param === FIRST_NAME)) {
        people.sort(function(a, b){
            var x = a.first_name;
            var y = b.first_name;
            return compare(x, y, asc);
        });
    } else if((param === EMAIL)) {
        people.sort(function(a, b){
            var x = a.email;
            var y = b.email;
            return compare(x, y, asc);
        });
    }
    display();
}

loadEventListeners();
display();
*/