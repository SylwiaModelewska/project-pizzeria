import {select, classNames, templates, settings} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart{

  constructor(element){
    const thisCart = this;

    thisCart.products = [];
    
    thisCart.getElements(element);
    thisCart.initActions();

    //console.log('new Cart: ', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;
    //console.log('adding product: ', menuProduct);

    const generateHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generateHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products: ', thisCart.products);

    thisCart.update();
  }

  update(){
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0, thisCart.subtotalPrice = 0;

    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }

    if(thisCart.totalNumber > 0){
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    }
    else{
      thisCart.totalPrice = thisCart.subtotalPrice;
      thisCart.deliveryFee = 0;
    }

    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

    for(let total of thisCart.dom.totalPrice){
      total.innerHTML = thisCart.totalPrice;
    }

    //console.log('deliveryFee: ', deliveryFee, 'totalNumber: ', totalNumber, 'subtotalPrice: ', subtotalPrice, 'totalPrice: ', thisCart.totalPrice);

  }

  remove(cartProduct){
    const thisCart = this;

    thisCart.products.splice(thisCart.products.indexOf(cartProduct), 1);

    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;
    const payload = {};

    payload.totalPrice = thisCart.totalPrice;
    payload.subtotalPrice = thisCart.subtotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.phone = thisCart.dom.phone.value;
    payload.address = thisCart.dom.address.value;
    payload.products = [];

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    //console.log('payload: ', payload);

    const url = settings.db.url + '/' + settings.db.orders;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse: ', parsedResponse);
      });
    
  }
}

export default Cart;