/*Le fichier product.js sert à l'affichage d'un produit sélectionner sur l'accueil
et à l'ajout des sélections dans le panier*/

//Récupération de l'id du produit
const id =  window.location.search.split("=")[1];

//Récupération du produit sélectionner depuis l'API en ligne grâce à l'id dans l'URL
const reponse = await fetch("http://localhost:3000/api/products/" + id);
const produit = await reponse.json();

//Changement du titre de l'onglet en fonction du produit
document.title = "Kanap - " + produit.name;

//Récupération de la div qui doit contenir l'image & création de la balise img
const divImg = document.querySelector(".item__img");
const imageElement = document.createElement("img");
imageElement.src = produit.imageUrl;
imageElement.alt = produit.altTxt;

//Ajout de l'image à la div
divImg.appendChild(imageElement);

//Récupération du titre & modification du texte
document.querySelector("#title").innerText = produit.name;

//Récupération du prix & modification du texte
document.querySelector("#price").innerText = produit.price + " ";

//Récupération de la description & modification du texte
document.querySelector("#description").innerText = produit.description;

//Récupération et ajout des couleurs dans la lsite déroulante
const colors = produit.colors;
const selectElement = document.querySelector("#colors");

for (let i = 0; i < colors.length; i++){
    const optionColor = document.createElement("option");
    optionColor.value = colors[i].toLowerCase();
    optionColor.innerText = colors[i];

    selectElement.appendChild(optionColor);
}

//Gestion du bouton ajout
const addToCart = document.querySelector("#addToCart");

/*Fonction qui va ajouter l'article choisis dans le Localstorage 
lors du clic sur le bouton "Ajouter au panier" */
addToCart.addEventListener("click", () => {
    let cartContent = JSON.parse(localStorage.getItem("articleStored")) || []; // On cible le localStorage et son tableau

    const quantity = document.querySelector("#quantity").value;
    const colorChoose = document.querySelector("#colors").options[document.querySelector('#colors').selectedIndex].text;

    const newProduct = { // Objet créé pour sélectionner les informations produit qui seront à transmettre au localStorage
      id: produit._id,
      name: produit.name,
      quantity: quantity,
      color: colorChoose
    };
    
    cartContent = Array.from(cartContent); //on force la mise en array

    //On vérifie le tableau localStorage avant de mettre un item dedans
    let alreadyInCart = cartContent.findIndex(item => item.id == newProduct.id && item.color == newProduct.color);

    if(alreadyInCart == -1){
        cartContent.push(newProduct);
    } else {
        cartContent[alreadyInCart].quantity = parseInt(cartContent[alreadyInCart].quantity);
        newProduct.quantity = parseInt(newProduct.quantity);
        cartContent[alreadyInCart].quantity += newProduct.quantity;
    } 

    // Puis on rajoute les éléments concernés dans le localStorage / Panier 
    localStorage.setItem("articleStored", JSON.stringify(cartContent)); 

    //Affiche une alerte à chaque ajout
    alert(newProduct.quantity + " " + newProduct.name +" ont été ajouter au panier");
});

