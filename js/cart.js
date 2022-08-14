import { Product } from './product.class.js';
import { getProducts, removeProduct, removeAllProducts } from './productManager.js';

/* ------------ GESTION DE LA PAGE PANIER ------------ */

/* DECLARATION DES CONSTANTES */
const HOST = 'http://localhost:3000';
const DOMAIN = '/api/products';
/*---------------------------------------------------------------------------------------- */



/* DECLARATION DES VARIABLES */

let productLines = [];//contiens les informations de la commande + les détails du produit
//console.log('orderLines', orderLines);
let cartItems = document.getElementById('cart__items');
let content = "";
let totalPrice = 0;
let totalQuantity = 0;
let spanTotalQuantity = document.getElementById('totalQuantity');
let spanTotalPrice = document.getElementById('totalPrice');
/* enregistrement de la valeur de la balise ayant pour ID firstName*/
let inputFirstName = document.getElementById('firstName');
/* enregistrement de la valeur de la balise ayant pour ID lastName*/
let inputLastName = document.getElementById('lastName');
/* enregistrement de la valeur de la balise ayant pour ID address*/
let inputAddress = document.getElementById('address');
/* enregistrement de la valeur de la balise ayant pour ID city*/
let inputCity = document.getElementById('city');
/* enregistrement de la valeur de la balise ayant pour ID email*/
let inputEmail = document.getElementById('email');
let itemQuantities = document.getElementsByClassName('itemQuantity');
//objet regroupant les infos  de contact du formulaire
let contact = {};

/*---------------------------------------------------------------------------------------- */



/* APPEL DES FONCTIONS */

//Appel de la fonction listProd + autre action suite à l'appel
listProds().then(function () {
  setTimeout(addProductsOnPage, 2000);
});

//Gère la validation du formulaire
validationForm();

/*---------------------------------------------------------------------------------------- */





/* DECLARATION DES FONCTIONS */

//Créé une liste de tous les produits dans le panier
async function listProds() {
  //Récupérer le panier (stocké dans le localStorage) : la liste de produits
  let orderLines = getProducts();
  for (let line of orderLines) {
    //console.log('line', line)
    //créé un ligne de commande et l'ajoute à une liste de commande 
    let product = await getProd(line);
  };
  //console.log('productLines in end of productLines', productLines);
}

//créé un ligne de commande et l'ajoute à une liste de commande 
async function getProd(line) {
  let product;
  fetch(HOST + DOMAIN + '/' + line.id)
    .then(res => res.json())
    .then(jsonProduct => {
      //console.log("jsonProduct : ", jsonProduct);
      //récupération du product en format JSON et conversion en objet product
      product = new Product(jsonProduct);
      //console.log("product : ", product);
      //création d'une ligne de commande
      let productLine = {
        prod: product,
        id: line.id,
        color: line.color,
        qty: parseInt(line.quantity)
      };
      //ajout du produit à la liste de produits
      productLines.push(productLine);
      //génération du HTML pour le produit
      generateProductHtmlContent(productLine);
      //Incrémente le nombre total de produit
      totalQuantity += parseInt(line.quantity);
      //Incrémente le prix total du panier
      totalPrice += (parseFloat(product.price) * line.quantity);

    })
    .catch(function (err) {
      console.log("Une erreur est survenue.", err); /* indique en détail l'erreur */
    });
  return product;
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
      console.log('input', input);
      let errorMessageContainer = input.nextElementSibling;
      console.log('errorMessageContainer', errorMessageContainer);
      //s'il y a un changement, vérifier la validité du changement apporté dans le champs /sinon message d'erreur
      //exemple : le champs nom ne prends pas de chiffres
      if (!input.checkValidity()) {
        console.log("non valide : ", input.validationMessage);
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
        console.log('productIds', productIds);
      }

      //création de l'objet contenant les données pour valider le formulaire
      let data = { contact: contact, products: productIds };
      console.log('data', data);
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
      //console.log("orderid ", orderId);
      alert("Commande passée avec succès");
      //redirige vers la page confirmation
      window.location.href = "./confirmation.html?orderId=" + orderId;

    })
    //s'il y a une erreur par rapport à l'envoie du formulaire
    .catch(function (err) {
      console.log("Une erreur est survenue. sendForm", err); /* indique en détail l'erreur */
    });
}


//fonction générant le code HTML pour inserer un nouvel article contenant le produit sur la page
async function generateProductHtmlContent(line) {
  console.log('line in displayProductsOnCart ', line);
  content += `
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


function addProductsOnPage() {

  cartItems.innerHTML += content;
  console.log('cartItems', cartItems);
  //màj quantité total et prix total lors de la màj  quantité d'un produit
  majTotalPriceAndTotalQuantity();
  deleteProductOnPage();
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
      console.log('article', article);
      //récup l'id
      let id = article.dataset.id;
      console.log('id', id);
      //récup product via l'API pour récup le prix
      fetch(HOST + DOMAIN + '/' + id)
        .then(res => res.json())
        .then(jsonProduct => {
          console.log("jsonProduct : ", jsonProduct);
          let product = new Product(jsonProduct);
          console.log("product : ", product);

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
          console.log('quantityTotal', quantityTotal);
          //maj de  la variable quantité totale
          quantityTotal = quantityTotal - oldQuantity + newQuantity;
          console.log('quantityTotal', quantityTotal);
          //maj du span contenant quantité totale
          spanTotalQuantity.textContent = quantityTotal;
          //maj de la variable prixTotal
          totalPrice = totalPrice - oldSubTotal + newSubTotal;
          //maj du span contenant prix totale
          spanTotalPrice.textContent = totalPrice;

          console.log('newQuantity', newQuantity);
          //maj de l'ancienne quantité dans l'attribut oldValue
          ev.target.setAttribute('oldValue', newQuantity);

          console.log('cartItemContent', cartItemContent);
          console.log('priceContent', priceContent);
          console.log('price', price);
          console.log('newQuantity', newQuantity);
          console.log('oldQuantity', oldQuantity);

        })

        .catch(function (err) {
          console.log("Une erreur est survenue.", err); /* indique en détail l'erreur */
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
      console.log('id', id);
      console.log('color', color);

      //faire une requète à l'API pour récuperer un objet en particulier grace a son id
      fetch(HOST + DOMAIN + '/' + id)
        .then(res => res.json())
        .then(jsonProduct => {
          console.log("jsonProduct : ", jsonProduct);
          let product = new Product(jsonProduct);
          console.log("product : ", product);

          let price = product.price;
          //récuperer container ayant pour classe cartItemContentSetting 
          let cartItemContentSetting = ev.target.parentNode.parentNode;
          //récuperer container ayant pour classe (itemQuantity)
          let itemQuantity = cartItemContentSetting.querySelector('.itemQuantity');
          //récuperer la valeur de itemQuantity dans une variable (quantité d'un objet en particulier)
          let quantity = itemQuantity.value;
          //calcule du sousTotal (prix total  = d'un article * la quantité souhaité)
          let subTotal = quantity * price;
          //console.log('subTotal', subTotal);
          //recuperer le champs de quantityTotal
          let quantityTotal = spanTotalQuantity.textContent;
          //console.log('quantityTotal', quantityTotal);
          //maj de la quantitéTotal : soustraire sa quantitéTotal à quantitéTotal de tous les articles
          quantityTotal -= quantity;
          //console.log('quantityTotal', quantityTotal);

          //enlever le sousTotal à totPrice
          totalPrice -= subTotal;
          //console.log('totalPrice', totalPrice);

          //mettre le prix actualisé  dans la balise spanTotalPrice
          spanTotalPrice.textContent = totalPrice;
          //console.log('spanTotalPrice', spanTotalPrice);
          //mettre la quantité actualisé  dans la balise spanTotalQuantity
          spanTotalQuantity.textContent = quantityTotal;
          //console.log('spanTotalQuantity', spanTotalQuantity);

          //récuperer la balise article contenant le produit
          let article = ev.target.parentNode.parentNode.parentNode.parentNode;
          //console.log('article', article);
          //supprimer l'affichage du produit
          cartItems.removeChild(article);

          //supprimer le produit du local storage 
          removeProduct(id, color);
          //xconsole log de la variable
          //console.log('deleteItem', deleteItem);
          //console.log('deleteItems', deleteItems);
          //console.log('quantity', quantity);
          //console.log('price', price);

        })
        .catch(function (err) {
          console.log("Une erreur est survenue.", err); /* indique en détail l'erreur */
        });
    });
  }
}

/*---------------------------------------------------------------------------------------- */