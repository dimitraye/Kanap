import { Product } from './product.class.js';
import { getProducts, removeProduct, removeAllProducts } from './productManager.js';


/* ------------ GESTION DE LA PAGE PANIER ------------ */

/* DECLARATION DES CONSTANTES */
const HOST = 'http://localhost:3000';
const DOMAIN = '/api/products';
/*---------------------------------------------------------------------------------------- */



/* DECLARATION DES VARIABLES */

let productLines = [];//contiens les informations de la commande + les détails du produit
let cartItems = document.getElementById('cart__items');
let content = "";
let totalPrice = 0;
let totalQuantity = 0;
let spanTotalQuantity = document.getElementById('totalQuantity');
let spanTotalPrice = document.getElementById('totalPrice');
// récupère la balise ayant pour ID firstName
let inputFirstName = document.getElementById('firstName');
// récupère la balise ayant pour ID lastName
let inputLastName = document.getElementById('lastName');
// récupère la balise ayant pour ID address
let inputAddress = document.getElementById('address');
// récupère la balise ayant pour ID city
let inputCity = document.getElementById('city');
// récupère la balise ayant pour ID email
let inputEmail = document.getElementById('email');
// récupère la balise ayant pour class itemQuantity
let itemQuantities = document.getElementsByClassName('itemQuantity');
//objet regroupant les infos  de contact du formulaire
let contact = {};

/*---------------------------------------------------------------------------------------- */

/* APPEL DES FONCTIONS */

//Appel de la fonction listProd + autre action suite à l'appel
listProds().then(function () {
  setTimeout(manageProductsOnPage, 2000);
});

//Gère la validation du formulaire
validationForm();

/*---------------------------------------------------------------------------------------- */

/* DECLARATION DES FONCTIONS */

//Génère la liste de produit sur la page à partir des produits stockés ddans le local storage
async function listProds() {
  //Récupérer le panier (stocké dans le localStorage) : la liste de produits
  let orderLines = getProducts();
  for (let orderLine of orderLines) {

    let jsonProduct = await getProduct(orderLine.id);
    let product = new Product(jsonProduct);

    //création d'une ligne de commande
    let productLineForHtml = getProductDetails(product, orderLine);
    //génération du HTML pour le produit
    generateProductHtmlContent(productLineForHtml);

    //Incrémente le nombre total de produit
    totalQuantity += parseInt(orderLine.quantity);

    //Incrémente le prix total du panier
    totalPrice += (parseFloat(product.price) * orderLine.quantity);
  };
}

function manageProductsOnPage() {
  //Gestion màj quantité total et prix total lors de la màj  quantité d'un produit
  majTotalPriceAndTotalQuantity();
  //gestion de la suppression d'un produit sur la page lorsqu'on click sur supprimer
  deleteProductOnPage();
}

//Génère un objet contenant les détails nécessaires à l'affichage d'un produit sur la page
function getProductDetails(product, orderLine) {
  return {
    prod: product,
    id: orderLine.id,
    color: orderLine.color,
    qty: parseInt(orderLine.quantity)
  };
}

//validation du formulaire
function validationForm() {
  var valid = true;
  //récupère tout les inputs de type text et email du formulaire où l'on va rentrer nos coordonées 
  let inputs = document.querySelectorAll(`.cart__order__form input[type='text'], 
    .cart__order__form input[type='email']`);
  //pour chacun des champs séléctionnés auparavant, vérifier s'il y a eu un changement  
  for (let input of inputs) {
    input.addEventListener('change', function () {
      let errorMessageContainer = input.nextElementSibling;
      //s'il y a un changement, vérifier la validité du changement apporté dans le champs /sinon message d'erreur
      //exemple : le champs nom ne prends pas de chiffres
      if (!input.checkValidity()) {
        //insert le message d'erreur dans le Paragraphe prévu à cet effet 
        errorMessageContainer.innerHTML = input.validationMessage;
      } else {
        //insert un message vide dans le Paragraphe prévu à cet effet
        errorMessageContainer.innerHTML = "";
      }
    });

  }
  //validation lors du submit
  //écoute l'evenement 'click' sur le bouton submit
  document.querySelector('#order').addEventListener("click", function (ev) {
    //enlève le comportement par défault : rechargement de la page
    ev.preventDefault();
    var valid = true;
    //vérifie la validité des champs
    for (let input of document.querySelectorAll(".cart__order__form input")) {
      if (!input.checkValidity()) {
        valid &= false;
        break;
      }
    }
    //Si tous les inputs sont valides
    if (valid) {
      //récupération des infos de contact
      contact.firstName = inputFirstName.value;
      contact.lastName = inputLastName.value;
      contact.address = inputAddress.value;
      contact.city = inputCity.value;
      contact.email = inputEmail.value;

      //récupération des id Product 
      let productIds = [];
      //récupère la balise qui a la classe cart_item contenant les id
      let articles = document.getElementsByClassName('cart__item');
      for (let article of articles) {
        productIds.push(article.dataset.id);
      }

      //création de l'objet contenant les données pour valider le formulaire
      let data = { contact: contact, products: productIds };
      //envoi les données du formulaire à API Order
      sendForm(data);

    }
  });
}


//fonction qui envoie les données du formulaire à l'API Order
async function sendForm(data) {
  //appel de l'API
  fetch(HOST + DOMAIN + "/order",
    {
      "method": "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      //transforme l'objet au format JSON 
      "body": JSON.stringify(data)
    })
    //
    .then(response => {
      return response.json();
    })
    .then(value => {
      let orderId = value.orderId;
      // efface le panier du localStorage
      removeAllProducts();
      alert("Commande passée avec succès");
      //redirige vers la page confirmation
      window.location.href = "./confirmation.html?orderId=" + orderId;

    })
    //s'il y a une erreur par rapport à l'envoie du formulaire
    .catch(function (err) {
    });
}


//fonction générant le code HTML pour inserer un nouvel article contenant le produit sur la page
async function generateProductHtmlContent(line) {
  cartItems.innerHTML += `
        <article class="cart__item" data-id="${line.id}" data-color="${line.color}">
                <div class="cart__item__img">
                  <img src="${line.prod.imageUrl}" alt="${line.prod.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${line.prod.name}</h2>
                    <p>${line.color}</p>
                    <p ><span class='price'>${line.prod.price}</span>€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" 
                      name="itemQuantity" min="1" max="100" 
                      value="${line.qty}" oldValue="${line.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
        `;
}


//gère affichage et maj de la quantité totale et du prix total
function majTotalPriceAndTotalQuantity() {

  spanTotalPrice.textContent = totalPrice;
  spanTotalQuantity.textContent = totalQuantity;
  //màj quantité total et prix total lors de la màj  quantité d'un produit
  //ajout listener à  chaque itemQuantity pour recalculer  prixTotal et  quantityTotal lors de la 
  //maj de la quantité
  for (let itemQuantity of itemQuantities) {
    itemQuantity.addEventListener('change', function (ev) {
      //récupération de la balise article contenant l'id
      let article = ev.target.parentNode.parentNode.parentNode.parentNode;
      //récup l'id
      let id = article.dataset.id;
      //récup product via l'API pour récup le prix
      fetch(HOST + DOMAIN + '/' + id)
        .then(res => res.json())
        .then(jsonProduct => {
          let product = new Product(jsonProduct);

          //récup balise contenant le prix
          let cartItemContent = ev.target.parentNode.parentNode.parentNode;
          let priceContent = cartItemContent.querySelector('.price');
          let price = product.price;
          //récup de la nouvelle quantité
          let newQuantity = parseInt(ev.target.value);
          //récup de l'ancienne quantité
          let oldQuantity = parseInt(ev.target.getAttribute('oldValue'));
          //calcul de l'ancien sous total
          let oldSubTotal = oldQuantity * price;
          //calcul du nouveau sous total
          let newSubTotal = newQuantity * price;
          let quantityTotal = parseInt(spanTotalQuantity.textContent);
          //maj de  la variable quantité totale
          quantityTotal = quantityTotal - oldQuantity + newQuantity;
          //maj du span contenant quantité totale
          spanTotalQuantity.textContent = quantityTotal;
          //maj de la variable prixTotal
          totalPrice = totalPrice - oldSubTotal + newSubTotal;
          //maj du span contenant prix totale
          spanTotalPrice.textContent = totalPrice;

          //maj de l'ancienne quantité dans l'attribut oldValue
          ev.target.setAttribute('oldValue', newQuantity);
          

        })
        .catch(function (err) {
        });
    })
  }
}


//gestion de la suppression d'un produit sur la page lorsqu'on click sur supprimer
function deleteProductOnPage() {
  //Ajout d'un listener sur tous es deleteItems pour gerer la supppression d'un produit en partiuculier
  let deleteItems = document.getElementsByClassName('deleteItem');
  for (let deleteItem of deleteItems) {
    deleteItem.addEventListener('click', function (ev) {

      //recup container contenant l'id
      let cartItem = ev.target.parentNode.parentNode.parentNode.parentNode;
      //récuperer l'id se trouvant dans le container ayant pour classe cartItem
      let id = cartItem.dataset.id;
      //récuperer la couleur se trouvant dans le container ayant pour classe cartItem
      let color = cartItem.dataset.color;
    

      //faire une requète à l'API pour récuperer un objet en particulier grace a son id
      fetch(HOST + DOMAIN + '/' + id)
        .then(res => res.json())
        .then(jsonProduct => {
          let product = new Product(jsonProduct);

          let price = product.price;
          //récuperer container ayant pour classe cartItemContentSetting 
          let cartItemContentSetting = ev.target.parentNode.parentNode;
          //récuperer container ayant pour classe (itemQuantity)
          let itemQuantity = cartItemContentSetting.querySelector('.itemQuantity');
          //récuperer la valeur de itemQuantity dans une variable (quantité d'un objet en particulier)
          let quantity = itemQuantity.value;
          //calcule du sousTotal (prix total  = d'un article * la quantité souhaité)
          let subTotal = quantity * price;
          //recuperer le champs de quantityTotal
          let quantityTotal = spanTotalQuantity.textContent;

          //maj de la quantitéTotal : soustraire sa quantitéTotal à quantitéTotal de tous les articles
          quantityTotal -= quantity;
          //enlever le sousTotal à totPrice
          totalPrice -= subTotal;
          //mettre le prix actualisé  dans la balise spanTotalPrice
          spanTotalPrice.textContent = totalPrice;
          //mettre la quantité actualisé  dans la balise spanTotalQuantity
          spanTotalQuantity.textContent = quantityTotal;
          //récuperer la balise article contenant le produit
          let article = ev.target.parentNode.parentNode.parentNode.parentNode;
          //supprimer l'affichage du produit
          cartItems.removeChild(article);
          //supprimer le produit du local storage 
          removeProduct(id, color);

        })
        .catch(function (err) {
        });
    });
  }
}

async function getProduct(id) {
  try {
    let response = await fetch(HOST + DOMAIN + "/" + id);
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      console.error('Retour du server :', response.status);
    }
  } catch (error) {
  }

}