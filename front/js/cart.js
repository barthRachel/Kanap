/*Le fichier cart.js sert à l'affichage du panier*/

//Récupération des produits depuis l'API en ligne
const reponse = await fetch("http://localhost:3000/api/products");
const produits = await reponse.json();

showCart();
verificationBeforeSend();

function showCart(){   
    //Récupération du localStorage 
    let cartContent = JSON.parse(localStorage.getItem("articleStored")) || []; // On cible le localStorage et son tableau
    //  [id ; name ; quantity ; color]

    let productInfos;
    let quantityInt = 0;
    let quantityItem = 0;
    let totalPriceInt = 0;

    for(let i = 0 ; i < produits.length ; i ++){
        for(let j = 0 ; j < cartContent.length ; j ++){
            if(cartContent[j].id == produits[i]._id){
                productInfos = produits[i];

                //Création d'une variable qui accueillera le prix total de chaque produit
                quantityInt += parseInt(cartContent[j].quantity);
                quantityItem = parseInt(cartContent[j].quantity);
                totalPriceInt += quantityItem * parseInt(productInfos.price); 

                //Récupération de la section dédiée au panier
                const cartSection = document.querySelector("#cart__items");

                //Création des éléments dans l'ordre du html
                const itemArticle = document.createElement("article");
                const divImg = document.createElement("div");
                const imgProduit = document.createElement("img");
                const divCartContent = document.createElement("div");
                const divCartContentDescription = document.createElement("div");
                const titleProduct = document.createElement("h2");
                const colorChoose = document.createElement("p");
                const priceUnit = document.createElement("p");
                const divCartContentOptions = document.createElement("div");
                const divCartOptionsQuantity = document.createElement("div");
                const pQuantity = document.createElement("p");
                const inputQuantity = document.createElement("input");
                const divCartOptionsDelete = document.createElement("div");
                const pDelete = document.createElement("p");

                //Attribution des classes si besoin
                itemArticle.className = "cart__item";
                divImg.className = "cart__item__img";
                divCartContent.className = "cart__item__content";
                divCartContentDescription.className = "cart__item__content__description";
                divCartContentOptions.className = "cart__item__content__settings";
                divCartOptionsQuantity.className = "cart__item__content__settings__quantity";
                inputQuantity.className = "itemQuantity";
                divCartOptionsDelete.className = "cart__item__content__settings__delete";
                pDelete.className = "deleteItem";

                //Ajouts des attributs si besoin
                itemArticle.setAttribute('data-id', productInfos._id);
                itemArticle.setAttribute('data-color', cartContent[j].color);
                inputQuantity.setAttribute("type", "number");
                inputQuantity.setAttribute("name", "itemQuantity");
                inputQuantity.setAttribute("min", "1");
                inputQuantity.setAttribute("max", "100");
                inputQuantity.setAttribute("value", cartContent[j].quantity);

                //Modifications des différentes informations
                imgProduit.src = productInfos.imageUrl;
                imgProduit.alt = productInfos.altTxt;
                titleProduct.innerText = productInfos.name;
                colorChoose.innerText = cartContent[j].color;
                priceUnit.innerText = productInfos.price + " €";
                pQuantity.innerText = "Qté : ";
                pDelete.innerText = "Supprimer";

                //Ajout de chaque element à son parent
                divCartContentDescription.appendChild(titleProduct);
                divCartContentDescription.appendChild(colorChoose);
                divCartContentDescription.appendChild(priceUnit);
                divCartOptionsQuantity.appendChild(pQuantity);
                divCartOptionsQuantity.appendChild(inputQuantity);
                divCartOptionsDelete.appendChild(pDelete);
                divCartContentOptions.appendChild(divCartOptionsQuantity);
                divCartContentOptions.appendChild(divCartOptionsDelete);
                divCartContent.appendChild(divCartContentDescription);
                divCartContent.appendChild(divCartContentOptions);
                divImg.appendChild(imgProduit);
                itemArticle.appendChild(divImg);
                itemArticle.appendChild(divCartContent);
                cartSection.appendChild(itemArticle);

                //Récupération des élements dans le but de donner le total
                const totalQuantitySpan = document.querySelector("#totalQuantity");
                const totalPriceSpan = document.querySelector("#totalPrice");

                totalQuantitySpan.innerText = quantityInt;
                totalPriceSpan.innerText = totalPriceInt;

                //Listener sur le bouton supprimer qui supprime l'element sur lequel on clique
                pDelete.addEventListener("click", () => {
                    const idProductClick = itemArticle.getAttribute("data-id");
                    const colorChooseClick = itemArticle.getAttribute("data-color");
                    
                    for(let k = 0 ; k < cartContent.length ; k++){
                        if(cartContent[k].id == idProductClick && cartContent[k].color == colorChooseClick){
                            cartContent.splice(k,1);
                            localStorage.setItem("articleStored", JSON.stringify(cartContent));

                            window.location.reload();
                        }
                    }
                });

                //Listener sur l'ajout ou la soustraction d'un item
                inputQuantity.addEventListener("click", () => {
                    let numberQuantityInput = parseInt(inputQuantity.value); //récupère la valeur du input

                    if(parseInt(cartContent[j].quantity) !== numberQuantityInput){
                        let diff = parseInt(numberQuantityInput) - parseInt(cartContent[j].quantity);

                        if(diff > 0){
                            quantityInt += 1;
                            totalPriceInt += parseInt(produits[i].price);
                        } else {
                            quantityInt -= 1;
                            totalPriceInt -= parseInt(produits[i].price);
                        }
                        cartContent[j].quantity = numberQuantityInput;
                        totalQuantitySpan.innerText = quantityInt;
                        totalPriceSpan.innerText = totalPriceInt;
                        localStorage.setItem("articleStored", JSON.stringify(cartContent));
                    }
                });
            }
        }
    }
}

//fonction qui permet de vérifier le formulaire avant envoie
function verificationBeforeSend(){
    let cartContent = JSON.parse(localStorage.getItem("articleStored")) || []; // On cible le localStorage et son tableau
    //Récupération du bouton d'envoie
    const btnSubmit = document.querySelector('#order');

    let products= [];

    for(let i = 0; i < cartContent.length; i++){
        products.push(cartContent[i].id);
        console.log(products)
    }


    //Création des booléen
    let boolFirstName = true;
    let boolLastName = true;
    let boolAddress = true;
    let boolCity = true;
    let boolEmail = true;

    //Récupération des textes des inputs 
    const fileFirstName = document.querySelector('#firstName');
    const fileLastName = document.querySelector('#lastName');
    const fileAddress = document.querySelector('#address');
    const fileCity = document.querySelector('#city');
    const fileEmail = document.querySelector('#email');
    
    //Récupération des emplacements pour les messages d'erreurs
    let errorFirstName = document.querySelector('#firstNameErrorMsg');
    let errorLastName = document.querySelector('#lastNameErrorMsg');
    let errorAddress = document.querySelector('#addressErrorMsg');
    let errorCity = document.querySelector('#cityErrorMsg')
    let errorEmail = document.querySelector('#emailErrorMsg');

    //Préparation de l'objet de la commande qui va s'envoyer
    let contact = { };

    //ajout du listener pour vérifier les différents champs
    fileFirstName.addEventListener("change", () => {
        if(fileFirstName.value.match("[0-9]")){
            errorFirstName.innerText = "Votre prénom ne peut contenir de chiffre";
            boolFirstName = false;
        } else if(fileFirstName.value.match(/^\s*$/g)){
            errorFirstName.innerText = "Ce champ est obligatoire";
            boolFirstName = false;
        } else {
            errorFirstName.innerText = "";
            boolFirstName = true;
        }
    });

    fileLastName.addEventListener("change", () => {
        if(fileLastName.value.match("[0-9]")) {
            errorLastName.innerText = "Votre nom ne peut contenir de chiffre";
            boolLastName = false;
        } else if(fileLastName.value.match(/^\s*$/g)){
            errorLastName.innerText = "Ce champ est obligatoire";
            boolLastName = false;
        }
        else {
            errorLastName.innerText = "";
            boolLastName = true;
        }
    });

    fileAddress.addEventListener("change", () => {
        if(fileAddress.value.match(/^\s*$/g)){
            errorAddress.innerText = "Ce champ est obligatoire";
            boolAddress = false;
        }
        else {
            errorAddress.innerText = "";
            boolAddress = true;
        }
    });

    fileCity.addEventListener("change", () => {
        if(fileCity.value.match(/^\s*$/g)){
            errorCity.innerText = "Ce champ est obligatoire";
            boolCity = false;
        }
        else {
            errorCity.innerText = "";
            boolCity = true;
        }
    });

    fileEmail.addEventListener("change", () => {
        if(fileEmail.value.match(/^\s*$/g)) {
            errorEmail.innerText = "Ce champ est obligatoire";
            boolEmail = false;
        } else if(!fileEmail.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            errorEmail.innerText = "Votre mail n'est pas correct";
            boolEmail = false;
        } else {
            errorEmail.innerText = "";
            boolEmail = true;
        }
    });


    //ajout du listener sur le bouton + envoi
    btnSubmit.addEventListener("click", (e) => {

        e.preventDefault();

        let testBool = boolFirstName==true && boolLastName==true && boolAddress==true && boolCity==true && boolEmail==true;

        if(products.length == 0){
            alert("Votre panier est vide !");
        }
        else if(fileFirstName.value == "" && fileLastName.value == "" && fileAddress.value == "" && fileCity.value == "" && fileEmail.value == ""){
            errorFirstName.innerText = "Ce champ est obligatoire"; boolFirstName = false;
            errorLastName.innerText = "Ce champ est obligatoire"; boolLastName = false;
            errorAddress.innerText = "Ce champ est obligatoire"; boolAddress = false;
            errorCity.innerText = "Ce champ est obligatoire"; boolCity = false;
            errorEmail.innerText = "Ce champ est obligatoire"; boolEmail =false;
        } else if(fileFirstName.value == "" || fileLastName.value == "" || fileAddress.value == "" || fileCity.value == "" || fileEmail.value == ""){
            if(fileFirstName.value == ""){
                errorFirstName.innerText = "Ce champ est obligatoire"; boolFirstName = false;
            } else if(fileLastName.value == ""){
                errorLastName.innerText = "Ce champ est obligatoire"; boolLastName = false;
            } else if(fileAddress.value == ""){           
                errorAddress.innerText = "Ce champ est obligatoire"; boolAddress = false;
            } else if(fileCity.value == ""){
                errorCity.innerText = "Ce champ est obligatoire"; boolCity = false;
            } else if(fileEmail.value == ""){
                errorEmail.innerText = "Ce champ est obligatoire"; boolEmail =false;
            }
        }         
        else if(testBool == true){
            contact = { 
                firstName: fileFirstName.value,
                lastName: fileLastName.value,
                address: fileAddress.value,
                city: fileCity.value,
                email: fileEmail.value,
            };            

            const data = {contact: contact, products: products};

            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {'Content-Type': 'application/json',
                        'Accept' : 'application/json' },
                body: JSON.stringify(data)
            })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                console.log(res.orderId);
                //localStorage.setItem("articleStoredConfirm",JSON.stringify({cartContent, contact}));
                localStorage.setItem("articleStored", JSON.stringify([]));
                window.location.href = "../html/confirmation.html?orderId=" + res.orderId;
            })
            .catch((error) => {
                console.log(error);
            })
        }
    })
}