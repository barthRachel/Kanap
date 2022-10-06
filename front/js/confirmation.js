const orderId =  window.location.search.split("=")[1];

//Récupération du paragraphe destiné à l'ID de commande
const getOrderSpan = document.querySelector('#orderId');
getOrderSpan.innerText = orderId;