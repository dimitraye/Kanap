export class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);//crée un objet et lui attribut toutes les valeurs de jsonProduct
    }

    trunc(length) { 
        let text = this.description;
        if(text == null){
            return "";
        } else if (text <= length){
            return text;
        }
        return text.substr(0,length-3) +"\u2026"; 
        
    };
}