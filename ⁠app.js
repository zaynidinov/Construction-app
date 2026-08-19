let tg = window.Telegram.WebApp;
tg.expand();

let calculations = {};

function updateCalculation(serviceName, pricePerSqm, inputId) {
    let sqmInput = document.getElementById(inputId);
    let sqm = parseFloat(sqmInput.value);

    if (sqm && sqm > 0) {
        calculations[serviceName] = { sqm: sqm, total: sqm * pricePerSqm };
    } else {
        delete calculations[serviceName];
    }

    let grandTotal = 0;
    for (let service in calculations) {
        grandTotal += calculations[service].total;
    }

    let bar = document.getElementById('bottom-bar');
    if (grandTotal > 0) {
        bar.classList.remove('hidden');
        document.getElementById('bar-total').innerText = grandTotal.toLocaleString('uz-UZ') + " so'm";
    } else {
        bar.classList.add('hidden');
    }
}

function goToStep2() {
    document.getElementById('step-services').classList.add('hidden');
    document.getElementById('bottom-bar').classList.add('hidden');
    document.getElementById('step-checkout').classList.remove('hidden');
}

function goToStep1() {
    document.getElementById('step-checkout').classList.add('hidden');
    document.getElementById('step-services').classList.remove('hidden');
    document.getElementById('bottom-bar').classList.remove('hidden');
}

document.getElementById('send-btn').addEventListener('click', function() {
    let name = document.getElementById('client-name').value.trim();
    let phone = document.getElementById('client-phone').value.trim();
    let address = document.getElementById('client-address').value.trim();
    let payment = document.getElementById('payment-method').value;

    if (!name || !phone || !address) {
        alert("Iltimos, barcha maydonlarni to'liq kiriting!");
        return;
    }

    let orderData = {
        name: name,
        phone: phone,
        address: address,
        payment: payment,
        items: calculations
    };

    tg.sendData(JSON.stringify(orderData));
});
