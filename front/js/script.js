import { Product } from './product.class.js';

/* DECLARATION DES CONSTANTES */

const HOST = 'http://localhost:3000';
const DOMAIN = '/api/products';

/*---------------------------------------------------------------------------------------- */


/* DECLARATION DES FONCTIONS */

//récupère les products dans l'API
async function getProducts() {
  try {
    let response = await fetch(HOST + DOMAIN);
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      console.error('Retour du server :', response.status);
    }
  } catch (error) {
    alert("getProducts : ERROR : Impossible de récupérer les produits");
  }

}


//fonction qui génère le code HTML pour afficher les produits sur la page et les affiche
async function generateHtmlForProducts() {
  let jsonListProduct = await getProducts() ;
  for (let jsonProduct of jsonListProduct) {
    //créé un objet produit à partir d'un produit au format JSON
    let product = new Product(jsonProduct);
    document.getElementById("items").innerHTML += ` <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.trunc(50)}</p>
            </article>
          </a> `;
  }

} 

/*---------------------------------------------------------------------------------------- */


/* APPEL DES FONCTIONS */
generateHtmlForProducts()

/*---------------------------------------------------------------------------------------- */




