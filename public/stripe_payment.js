if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    var addItemToCart = document.getElementsByClassName('buy-btn');
    //looping through the buttons with the same class name
    for (var i = 0; i < addItemToCart.length; i++) {
        var addToCart = addItemToCart[i];
        addToCart.addEventListener('click', GetItemInfo);
    }
}

function RemoveItem(event) {
    var btn = event.target;
    btn.parentElement.parentElement.remove();
    UpdateCart();
}

//creating a function to get the element of the object based on mouse target.
function GetItemInfo(event) {
    var moustTarget = event.target//getting the target of the mouse click
    var selectedItem = moustTarget.parentElement.parentElement;   //targeting the parent element
    var drinkName = selectedItem.getElementsByClassName('drink-name')[0].innerText;
    var drinkPrice = selectedItem.getElementsByClassName('drink-price')[0].innerText.replace("$","");
    var id = selectedItem.dataset.itemId;
    AddToCart(drinkName, drinkPrice, id);
    UpdateCart();
}
function CheckOut() {
    var totalPriceElement = document.getElementsByClassName('total-amount')[0];
    var totalPrice = parseFloat(totalPriceElement.innerText.replace("Total : $", "")) * 100;
    stripeHandler.open({
        amount: totalPrice
    })
}

const pay = document.getElementsByClassName('pay-btn')[0];
pay.addEventListener('click', function () {
    var cart = document.getElementsByClassName('cart')[0];
    var item = document.getElementsByClassName('cart-drinks')[0];
    if (cart.contains(item)) {
        CheckOut();
    } else {
        alert("Your cart is empty");
    }
});

function ClearCart() {
    var cart = document.getElementsByClassName('cart-body')[0];
    do {
        cart.removeChild(cart.firstChild);  //removing the first child on the list with do while loop
        UpdateCart();
    } while (cart.hasChildNodes())
}

function UpdateCart() {
    const cart = document.getElementsByClassName('cart')[0];
    var cartItems = cart.getElementsByClassName('cart-drinks');
    var total = 0;
    for (var i = 0; i < cartItems.length; i++) {
        var currentItem = cartItems[i]
        //getting the text of the element and replaced the dollar sign with nothing to do total calculation
        var itemPrice = document.getElementsByClassName('drink-price')[0].innerText.replace("$", "");
        total = itemPrice * (i + 1);    //total = amount of items * the price i started at 0 so needed to add 1 to it
    }
    //rounding to the nearest 2decimal points
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-amount')[0].innerText = "Total : $" + total;//assigning total amount to the element
}

//needs to add item to the cart
function AddToCart(itemName, itemPrice, id) {
    var cartBody = document.getElementsByClassName('cart-body')[0];
    var cartItem = document.createElement('div')
    cartItem.classList.add("cart-drinks");
    cartItem.dataset.itemId = id;  //setting id for the item

    //create a collection of elements based on user selection 
    var addedItem = `<div class="drink-name" >${itemName}</div>
       <div class="drink-price" >$ ${itemPrice}</div>
       <div class="item-remove"><i class="far fa-trash-alt remove-item"></i></div>`
    //assining collection of elements to a new div as innerHTML
    cartItem.innerHTML = addedItem;
    //adding item list using the append method.
    cartBody.append(cartItem);

    //because the item wasn't added to the cart when the page was loaded. 
    //So I needed to add the eventlistener to the btn in order for the user to remove the item
    cartItem.getElementsByClassName('item-remove')[0].addEventListener('click', RemoveItem);
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto', 
    token: function(token) {
        //once the purchase btn has been submitted, this will send the info to stripe for verification. stripe will send back the outcome
        var itemList = []   //declaring an empty array to hold cart items
        var cartItems = document.getElementsByClassName('cart-body')[0];
        var currentCartItems = cartItems.getElementsByClassName('cart-drinks');  //getting the items from the cart
        //looping through the cart
        for(var i = 0; i < currentCartItems.length; i++){
            var currentItem = currentCartItems[i]
            var id = currentItem.dataset.itemId;    //getting the id of the item and then assign it to the item array
            itemList.push({
                id : id
            })
        }
        fetch('/drinks', {    
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //sending json content type
                'Accept': 'application/json'        //receiving json type
            },
            body: JSON.stringify({
                stripeTokenId: token.id,        //sending token to server
                itemList: itemList                
            })
        }).then(function (res) {    
            return res.json();  //return json 
        }).then(function (data) {   //data response from the server
            ClearCart();
            alert(data.message);    //showing alert message from server
        }).catch(function(error){ //catch error
            console.log(error);
        })
    }
})

