

/* GESTION DES PRODUITS DANS LE LOCAL STORAGE */

/* DECLARATION DES CONSTANTES */

const LIST_PRODUCTS = "listProducts";

/*-------------------------------------------------------------------------*/


/* DECLARATION DES FONCTIONS */

//fonction pour récuperer une liste de produits 
 export function getProducts() {
    let listProduct = localStorage.getItem(LIST_PRODUCTS);
    if (listProduct == null) {
        return [];
    } else {
        return JSON.parse(listProduct);
    }
}

// ajout d'un produit dans le panier (comparaison/ajout/modification) 
export function addProductToCart(id, color, quantity) {
    quantity = parseInt(quantity);
    //récuperer la liste Panier
    let listProducts = getProducts();
    //parcourrid le panier pour trouver si l'product existe déja (id/couleur)
    let existingProduct = getExistingProduct(id, color);


    //Si le produit existe ajouter la nouvelle quantité à celle déja existante
    if (existingProduct) {
        quantity += parseInt(existingProduct.quantity);
        removeProduct(id, color);
        listProducts = getProducts();
    }
    //ajout du produit dans la liste
    listProducts.push({ id: id, color: [color], quantity: quantity });

    //savegarde du panier dans le local storage
    saveProduct(listProducts);
}

//fonction pour supprimer un produit en fonction de son id et de sa couleur
export function removeProduct(id, color) {
    let listProduct = getProducts();
    listProduct = listProduct.filter(product => !(product.id == id && product.color == color));
    saveProduct(listProduct);
}
//Supprime l'intégralité de la liste de produits du le local storage
export function removeAllProducts() {
    localStorage.removeItem(LIST_PRODUCTS);
}

//fonction qui cherche si un existe deja dans la liste de produits du local storage et le retourne 
export function getExistingProduct(id, color) {
    //récuperer le Panier actuel
    let listProduct = getProducts();
    //parcourrid le panier pour trouver si le product existe déja (id/couleur)
    return listProduct.find(product => product.id == id && product.color == color);
}

//Enregistre un produit dans la liste
export function saveProduct(listProducts) {
    localStorage.setItem(LIST_PRODUCTS, JSON.stringify(listProducts));
}

/*-------------------------------------------------------------------------*/

