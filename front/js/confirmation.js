const reponse = await fetch("http://localhost:3000/api/products");
const produit = await reponse.json();

console.log(JSON.parse(localStorage.getItem("articleStoredConfirm"))); 

console.log(produit);

//Récupération du paragraphe destiné à l'ID de commande
const getOrderSpan = document.querySelector('#orderId');
getOrderSpan.innerText = "Tqt BG !";


/* 
Pour la suite il faudra recup le LS articleStoredConfirm, recup l'api /order 
et comparer
pour trouver l'id de la commande et l'afficher

Soucis ? => Rien ne se met dans l'api /order...
*/