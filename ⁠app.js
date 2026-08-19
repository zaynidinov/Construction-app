let tg = window.Telegram.WebApp;
tg.expand();

let selectedOrder = null;

function calculate(serviceName, pricePerSqm, inputId) {
    let sqmInput = document.getElementById(inputId);
    let sqm = parseFloat(sqmInput.value);

    if (!sqm || sqm <= 0) {
        alert("Iltimos, kvadraturani to'g'ri kiriting!");
        return;
    }

    let totalPrice = sqm * pricePerSqm;
    let formattedPrice = totalPrice.toLocaleString('uz-UZ');

    let resultBox = document.getElementById('result-box');
    let resTitle = document.getElementById('res-title');
    let resDetails = document.getElementById('res-details');

    resTitle.innerText = serviceName;
    resDetails.innerText = sqm + " kv.m × " + pricePerSqm.toLocaleString('uz-UZ') + " so'm = " + formattedPrice + " so'm";
    
    resultBox.classList.remove('hidden');

    selectedOrder = {
        service: serviceName,
        sqm: sqm,
        totalPrice: formattedPrice
    };
}

document.getElementById('send-btn').addEventListener('click', function() {
    if (selectedOrder) {
        let orderText = "Buyurtma: " + selectedOrder.service + "\nMaydon: " + selectedOrder.sqm + " kv.m\nUmumiy narx: " + selectedOrder.totalPrice + " so'm";
        tg.sendData(orderText);
    }
});
