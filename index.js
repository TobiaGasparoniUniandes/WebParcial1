const listado = "data.json";

const cats = ["Burgers", "Tacos", "Salads", "Desserts", "Drinks and Sides"];

let cur_cat = null;

let cart = [];

function readJson (url) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function() {
            (req.status===200) ? (resolve(JSON.parse(req.responseText))) : (reject(req.statusText));
        };
        req.send();
    });
}

for(let i = 0; i < cats.length; i++) {
    let item = document.getElementById(cats[i]);
    item.addEventListener("click", () => {
        menuClick(cats[i]);
    });
}

function menuClick(cat) {
    if(cat != cur_cat) {
        cur_cat = cat;
        document.getElementById("list").innerHTML = "";
        renderCategory(cat);
    }
}

function renderCategory(category) {
    document.getElementById("table").style.display = "none";
    readJson(listado).then((listadoArr) => {
        for(let i = 0; i < listadoArr.length; i++) {
            if(listadoArr[i].name === category) {
                let title = document.getElementById("cat-title");
                title.style.display = "block";
                title.innerHTML = "<hr/>" + listadoArr[i].name + "<hr/>";

                let row = document.createElement("div");
                row.className = "row";

                let products = listadoArr[i].products;
                for(let j = 0; j < products.length; j++) {

                    let cardContainer = document.createElement("div");
                    cardContainer.className = "col-3";
                    cardContainer.style.padding = "3px";

                    let card = document.createElement("div");
                    card.className = "card";

                    let img = document.createElement("img");
                    img.className = "card-img-top";
                    img.style.width = "100%";
                    img.style.height = "15rem";
                    img.alt = products[j].name;
                    img.src = products[j].image;
                    img.style.objectFit = "cover";
                    img.alt = "Food item";
                    card.appendChild(img);

                    let cardBody = document.createElement("div");
                    cardBody.className = "card-body";

                    let h5 = document.createElement("h5");
                    h5.className = "card-title";
                    h5.appendChild(document.createTextNode(products[j].name));
                    cardBody.appendChild(h5);

                    let desc = document.createElement("p");
                    desc.className = "card-text";
                    desc.appendChild(document.createTextNode(products[j].description));
                    cardBody.appendChild(desc);

                    let strong = document.createElement("strong");
                    strong.appendChild(document.createTextNode("$" + products[j].price));
                    cardBody.appendChild(strong);

                    card.appendChild(cardBody);

                    let button = document.createElement("button");
                    button.className = "btn btn-dark";
                    button.appendChild(document.createTextNode("Add to cart"));
                    button.addEventListener("click", () => {
                        addToCart(products[j]);
                        updateNumItems();
                    });

                    card.appendChild(button);

                    cardContainer.appendChild(card);
                    row.appendChild(cardContainer);
                }
                document.getElementById("list").appendChild(row);
            }
        }
    });
}

function addToCart(product) {
    let prodInList = null;
    
    for(let i = 0; i < cart.length; i++) {
        if(cart[i].name === product.name) {
            prodInList = cart[i];
            prodInList.quantity += 1;
        }
    }

    if(prodInList == null) {
        product.quantity = 1;
        cart.push(product);
    }
}

function removeOneFromCart(prodName) {
    let isOne = false;

    for(let i = 0; i < cart.length; i++) {
        prodInList = cart[i];
        if(prodInList.name === prodName) {
            if(prodInList.quantity === 1) {
                isOne = true;
            }
            else {
                prodInList.quantity -= 1;
            }
        }
    }

    if(isOne) {
        cart = cart.filter(function(elem) { return elem.name != prodName; }); 
    }
}

function updateNumItems() {
    let numItems = 0;

    for(let i = 0; i < cart.length; i++) {
        numItems += cart[i].quantity;
    }

    let itemsElem = document.getElementById("numItems");
    itemsElem.innerHTML = numItems;
}

function updateTotalPrice() {
    let totPrice = 0;

    for(let i = 0; i < cart.length; i++) {
        totPrice += cart[i].quantity * cart[i].price;
    }

    let totPriceElem = document.getElementById("tot");
    totPriceElem.innerHTML = Math.round(totPrice * 100) / 100;
}

document.getElementById("cart").addEventListener("click", () => {
    displayCart();
});

function displayCart() {
    cur_cat = null;

    document.getElementById("table").style.display = "block";
    document.getElementById("list").innerHTML = "";
    
    let title = document.getElementById("cat-title");
    title.style.display = "block";
    title.innerHTML = "<hr/>" + "Order detail" + "<hr/>";

    let tbody = document.getElementById("tbody");

    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for(let i = 0; i < cart.length; i++) {
        let product = cart[i];
        let row = document.createElement("tr");

        let tdItem = document.createElement("th");
        tdItem.scope = "row";
        tdItem.appendChild(document.createTextNode(i+1));
        
        let tdQuantity = document.createElement("td");
        tdQuantity.appendChild(document.createTextNode(product.quantity));
        
        let tdDescription = document.createElement("td");
        tdDescription.appendChild(document.createTextNode(product.name));
        
        let tdUnitPrice = document.createElement("td");
        tdUnitPrice.appendChild(document.createTextNode(product.price));

        let tdAmount = document.createElement("td");
        let amount = product.price * product.quantity;
        tdAmount.appendChild(document.createTextNode(Math.round(amount * 100) / 100));

        let tdBtns = document.createElement("td");

        let butPlus = document.createElement("button");
        butPlus.appendChild(document.createTextNode("+"));
        butPlus.className = "btn btn-secondary margin-right";
        butPlus.addEventListener("click", () => {
            let elementToBeAdded = Object.assign({}, product);
            delete elementToBeAdded["quantity"];
            addToCart(elementToBeAdded);
            updateNumItems();
            displayCart();
        });

        let butMinus = document.createElement("button");
        butMinus.appendChild(document.createTextNode("-"));
        butMinus.className = "btn btn-secondary";
        butMinus.addEventListener("click", () => {
            removeOneFromCart(product.name);
            updateNumItems();
            displayCart();
        });

        tdBtns.appendChild(butPlus);
        tdBtns.appendChild(butMinus);

        row.appendChild(tdItem);
        row.appendChild(tdQuantity);
        row.appendChild(tdDescription);
        row.appendChild(tdUnitPrice);
        row.appendChild(tdAmount);
        row.appendChild(tdBtns);
        
        tbody.appendChild(row);
    }
    updateTotalPrice();
}

document.getElementById("close-alert").addEventListener("click", () => {
    let cancel = document.getElementById("cancel-background");
    cancel.classList.remove("d-flex");
    cancel.classList.add("d-none");
});

document.getElementById("no-cancel").addEventListener("click", () => {
    let cancel = document.getElementById("cancel-background");
    cancel.classList.remove("d-flex");
    cancel.classList.add("d-none");
});

document.getElementById("yes-cancel").addEventListener("click", () => {
    cart = [];
    displayCart();
    updateNumItems();
    
    let cancel = document.getElementById("cancel-background");
    cancel.classList.remove("d-flex");
    cancel.classList.add("d-none");
});

document.getElementById("btn-cancel").addEventListener("click", () => {
    let cancel = document.getElementById("cancel-background");
    cancel.classList.remove("d-none");
    cancel.classList.add("d-flex");
});

document.getElementById("btn-confirm").addEventListener("click", () => {
    order = [];

    for(let i = 0; i < cart.length; i++) {
        order.push({
            "item": i+1,
            "quantity": cart[i].quantity,
            "description": cart[i].name,
            "unitPrice": cart[i].price
        });
    }

    console.log(order);
});

cur_cat = "Burgers";
renderCategory("Burgers");
document.getElementById("table").style.display = "none";

let cancel = document.getElementById("cancel-background");
cancel.classList.remove("d-flex");
cancel.classList.add("d-none");