import { Product } from './product.class.js';
import { addProductToCart } from './productManager.js';

/* DECLARATION DES CONSTANTES */

console.log("in product js for one product");
const HOST = 'http://localhost:3000';
const DOMAIN = '/api/products';
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

/*---------------------------------------------------------------------------------------- */


/* DECLARATION DES VARIABLES */

let id = params.id;
let colorSelect = document.getElementById("colors");
/* enregistrement de la valeur du select*/
let selectColors = document.getElementById("colors");
/* enregistrement de la valeur quantity*/
let inputQuantity = document.getElementById("quantity");
/* enregistrement de la valeur du bouton*/
let buttonCart = document.getElementById("addToCart");


/*---------------------------------------------------------------------------------------- */


/* APPEL DES FONCTIONS */
dislayProduct();


/*---------------------------------------------------------------------------------------- */


/* DECLARATION DES LISTENERS */

//Ecoute s'il y a eu un changement de la valeur de couleur
selectColors.addEventListener('change', function (ev) {
    console.log('selectColors:', ev.target.value);
    checkColorAndQuantity(ev.target.value, inputQuantity.value);
});
//Ecoute s'il y a eu un changement de la valeur de la quantité
inputQuantity.addEventListener('change', function (ev) {
    console.log('inputQuantity:', ev.target.value);
    checkColorAndQuantity(selectColors.value, ev.target.value);
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

/*---------------------------------------------------------------------------------------- */


/* DECLARATION DES FONCTIONS */

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
function checkQuantity(quantity) {
    return quantity > 1;
}

/* true false color */
function checkColor(color) {
    return color != "";
}

/* foction quantity + color*/
function checkColorAndQuantity(color, quantity) {
    if (checkQuantity(quantity) || checkColor(color)) {

        buttonCart.removeAttribute('disabled');
    }
    else {
        /* désactiver le bouton panier */
        buttonCart.setAttribute('disabled', "");
    }
}

//récupère le product dans l'API
async function getProduct() {
    try {
        let response = await fetch(HOST + DOMAIN +'/'+ id);
        if (response.ok) {
            let data = await response.json();
            console.log('product :', data);
            return data;
        } else {
            console.error('Retour du server :', response.status);
        }
    } catch (error) {
        console.log('Erreur dans getProduct() :', error);
    }

}

//Récupère et affiche le produit
async function dislayProduct() {
    let jsonProduct = await getProduct();
    let product = new Product(jsonProduct);
    addProductContent(product);
}

