/* recup orderId depuis l'url */
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});


let orderId = params.orderId;

//recup span qui doit contenir orderId
let spanOrderId = document.getElementById('orderId');

//inserer l'odrerId dans le span
spanOrderId.textContent = orderId;