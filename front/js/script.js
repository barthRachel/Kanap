//Le fichier script.js sert à l'affichage de la page d'accueil

//Récupération des produits depuis l'API en ligne
const reponse = await fetch("http://localhost:3000/api/products");
const produits = await reponse.json();



//Fonction qui affiche la page entière
function showProducts(){
	for (let i = 0; i < produits.length; i++) {

		// Récupération de l'élément du DOM qui accueillera les fiches produits
		const sectionFiches = document.querySelector(".items");

		//Création d'une balise lien qui englobera
		const lienElement = document.createElement("a");

		//Création d’une balise article qui regroupera les infos d'un produit
		const produitElement = document.createElement("article");

		//Récupération & Création des éléments d'un produit
		const imageElement = document.createElement("img");
		imageElement.src = produits[i].imageUrl;
		imageElement.alt = produits[i].altTxt;

		const nomElement = document.createElement("h3");
		nomElement.innerText = produits[i].name;

		const prixElement = document.createElement("p");
		prixElement.innerText = "Prix : " + produits[i].price + " €";

		const descriptionElement = document.createElement("p");
		descriptionElement.innerText = produits[i].description ?? "Pas de description pour le moment.";

		lienElement.href = "./product.html?id=" + produits[i]._id;

		// On rattache la balise article au lien
		lienElement.appendChild(produitElement);

		// On rattache le lien à la section fiches
		sectionFiches.appendChild(lienElement);

		// Ajout des éléments créés dans le DOM
		produitElement.appendChild(imageElement);
		produitElement.appendChild(nomElement);
		produitElement.appendChild(prixElement);
		produitElement.appendChild(descriptionElement);
	};
}

//Première génération de la page 
showProducts();