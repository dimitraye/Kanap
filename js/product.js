import { Product } from './product.class.js';
import {  addProductToCart } from './productManager.js';
//Faire une alerte pour certifier l'ajout de produit au panier


console.log("in product js for one product");
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});


let id = params.id;
let colorSelect = document.getElementById("colors");
let quantityInput = document.getElementById("quantity");

/* enregistrement de la valeur du select*/
let selectColors = document.getElementById("colors");
/* enregistrement de la valeur quantity*/
let inputQuantity = document.getElementById("quantity");
/* enregistrement de la valeur du bouton*/
let buttonCart = document.getElementById("addToCart");


/* Récupérer les canapé dans consollog */
fetch("http://localhost:3000/api/products/" + id)
    .then(res => res.json())
    .then(jsonProduct => {
        console.log("jsonProduct : ", jsonProduct);
        let product = new Product(jsonProduct);
        console.log("product : ", product);
        addProductContent(product);
    })

    .catch(function (err) {
        console.log("Une erreur est survenue.", err); /* indique en détail l'erreur */
    });



//Ecoute s'il y a eu un changement de la valeur de couleur
selectColors.addEventListener('change', function (ev) {
    console.log('selectColors:', ev.target.value);
    checkColorAndQuantity(ev.target.value , inputQuantity.value);
});
//Ecoute s'il y a eu un changement de la valeur de la quantité
inputQuantity.addEventListener('change', function (ev) {
    console.log('inputQuantity:', ev.target.value);
    checkColorAndQuantity(selectColors.value , ev.target.value);
});



//Ecoute si on a cliqué sur le bouton,
//si oui  lance les méthodes checkQuantity et checkColor puis ajoute au panier
//si non renvoie un message d'alerte
buttonCart.addEventListener('click', function (ev) {
    let color = selectColors.value;
    let quantity = inputQuantity.value;
    console.log('buttonCart:', ev.target);
    console.log('id :', id);
    console.log('color :', color);
    console.log('quantity :', quantity);
    if (checkQuantity(quantity) && checkColor(color)) {
        addProductToCart(id, color, quantity);
        alert("Produit ajouté au panier");
    }
    else {
        alert("merci de choisir la couleur et la quantité");
    }

});
/* condition*/


/* display product */
function addProductContent(product) {
    document.querySelector(".item__img").innerHTML =
        `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    document.querySelector("#title").innerHTML =
        product.name;
    document.querySelector("#price").innerHTML =
        product.price;
    document.querySelector("#description").innerHTML =
        product.description;

    for (let color of product.colors) {
        console.log("color: ", color);
        colorSelect.innerHTML +=
            `<option value="${color}">${color}</option>`;
    }
};

/* true false quantity */
function checkQuantity(quantity){
    return quantity > 1;
}

/* true false color */
function checkColor(color){
    return color != "";
}

/* foction quantity + color*/
function checkColorAndQuantity(color , quantity){
    if ( checkQuantity(quantity) || checkColor(color)) {
        
        buttonCart.removeAttribute('disabled');
    }
    else {
        /* désactiver le bouton panier */
        buttonCart.setAttribute('disabled', "");
    }
}