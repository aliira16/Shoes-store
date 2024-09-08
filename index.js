let inconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let productsHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span')


let products = [];
let cart = [];


inconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
});
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart')
});

const addDataToHTML = () => {
    productsHTML.innerHTML = '';
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                    <img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="price">${product.price}$</div>
                    <button class="addCart">Add TO Card</button>
            `;
            productsHTML.appendChild(newProduct);
        })
    }
};

productsHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCard(product_id);
    }

}
);

const addToCard = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        })
    } else {
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCardToHTML();
    andCardToMemoir();    
}

const andCardToMemoir = () =>{
    localStorage.setItem('carts', JSON.stringify(cart));

}

const addCardToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(cart => {
            let newCart = document.createElement('div');
            totalQuantity =totalQuantity + cart.quantity;
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = products.findIndex((value) => value.id == cart.product_id);
            let info = products [positionProduct];
            newCart.innerHTML = `
                    <div class="image">
                        <img
                            src="${info.image}"
                            alt>
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        ${info.price * cart.quantity}$
                    </div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${cart.quantity}</span>
                        <span class="plus">></span>
                    </div> 
            `
        listCartHTML.appendChild(newCart);
        })

    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event)=>{
    let positionClick = event.target;
    if (positionClick.classList.contains('minus')|| positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
}})

const changeQuantity = (product_id, type) =>{
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id)
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity+1;
                break;
        
            default:
                let valueChange = cart[positionItemInCart].quantity -1;
                if (valueChange > 0) {
                    cart[positionItemInCart].quantity = valueChange;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    andCardToMemoir();
    addCardToHTML();
}
const initApp = () => {
    // to add the data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            console.log(products);
            addDataToHTML();
        })
        if (localStorage.getItem('carts')) {
            cart = JSON.parse( localStorage.getItem('carts'))
        }
        addCardToHTML();
};
initApp();
