import { Product } from './product.class.js';

/* DECLARATION DES CONSTANTES */

const HOST = 'http://localhost:3000';
const DOMAIN = '/api/products';

/*---------------------------------------------------------------------------------------- */


/* DECLARATION DES FONCTIONS */

//fonction qui génère le code HTML pour afficher un produit sur la page
function dislayProduct(product) {
  console.log("Produit : ", product);
  document.getElementById("items").innerHTML += ` <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.trunc(50)}</p>
            </article>
          </a> `;
}

/*---------------------------------------------------------------------------------------- */


/* APPEL DES FONCTIONS */

//récupère les products dans l'API
fetch(HOST + DOMAIN)
  .then(res => res.json())
  .then(jsonListProduct => {
    console.log("jsonListProduct : ", jsonListProduct);
    for (let jsonProduct of jsonListProduct) {
      //créé un objet produit à partir d'un produit au format JSON
      let product = new Product(jsonProduct);
      dislayProduct(product);
    }
  })
  .catch(function (err) {
    console.log("Une erreur est survenue.", err); /* indique en détail l'erreur */
  });

/*---------------------------------------------------------------------------------------- */



