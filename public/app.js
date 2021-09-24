const aboutUs = document.getElementById('about-us-modal');
const aboutBtn = document.getElementById('about-btn');
const contactUs = document.getElementById('contact-us-modal');
const contactBtn = document.getElementById('contact-btn');
const clostContactBtn = document.getElementById('close-contact');
const contactForm = document.getElementById('contact-us');
const aboutUsElement = document.getElementById('about-us');
const closeAboutBtn = document.getElementById('close-about')
const cartModal = document.getElementById('cart-modal');
const cart = document.getElementById('cart')
const cartBtn = document.getElementById('cart-btn')
const closeCart = document.getElementById('close-cart')

aboutBtn.addEventListener('click', () =>{
    aboutUs.style.display = "block"
    fadeIn(aboutUsElement);
})

contactBtn.addEventListener('click', () =>{
    contactUs.style.display = "block";
    fadeIn(contactForm)
})

cartBtn.addEventListener('click', () =>{
  cartModal.style.display = "block"
  fadeIn(cart);
})

clostContactBtn.addEventListener('click', () =>{
  resetOpacity(contactUs,contactForm)
})
closeAboutBtn.addEventListener('click', () =>{
  resetOpacity(aboutUs,aboutUsElement);
})
closeCart.addEventListener('click', () => {
  resetOpacity(cartModal,cart);
})

window.onclick = function(event) {
  if (event.target == contactUs) {
    resetOpacity(contactUs,contactForm)
  }
  else if(event.target == aboutUs){
    resetOpacity(aboutUs,aboutUsElement)
  }
  else if(event.target == cartModal){
    resetOpacity(cartModal,cart)
  }
}

function fadeIn(element) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
      if (op >= 1){
          clearInterval(timer);
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
  }, 20);
}

function resetOpacity(modal,element){
  modal.style.display ="none"
  element.style.opacity = "0"
}