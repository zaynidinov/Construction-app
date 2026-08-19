let tg = window.Telegram.WebApp;
tg.expand();

let calculations = {};

function updateCalculation(serviceName, pricePerSqm, inputId, resultDivId) {
    let sqmInput = document.getElementById(inputId);
    let sqm = parseFloat(sqmInput.value);
    let resultDiv = document.getElementById(resultDivId);

    if (sqm && sqm > 0) {
        let total = sqm * pricePerSqm;
        calculations[serviceName] = { sqm: sqm, total: total };
        resultDiv.innerText = "Narxi: " + total.toLocaleString('uz-UZ') + " so'm";
    } else {
        delete calculations[serviceName];
        resultDiv.innerText = "";
    }

    calculateGrandTotal();
}

function calculateGrandTotal() {
    let grandTotal = 0;
    for (let service in calculations) {
        grandTotal += calculations[service].total;
    }
    document.getElementById('grand-total').innerText = grandTotal.toLocaleString('uz-UZ') + " so'm";
}

document.getElementById('send-btn').addEventListener('click', function() {
    let name = document.getElementById('client-name').value.trim();
    let phone = document.getElementById('client-phone').value.trim();
    let address = document.getElementById('client-address').value.trim();
    let payment = document.getElementById('payment-method').value;

    if (Object.keys(calculations).length === 0) {
        alert("Iltimos, kamida bitta xizmat uchun kvadrat metrni kiriting!");
        return;
    }

    if (!name || !phone || !address) {
        alert("Iltimos, ismingiz, telefon raqamingiz va manzilingizni to'liq kiriting!");
        return;
    }

    let orderDetails = "🛠 NEW BUYURTMA:\n\n";
    let grandTotal = 0;

    for (let service in calculations) {
        orderDetails += "• " + service + ": " + calculations[service].sqm + " kv.m (" + calculations[service].total.toLocaleString('uz-UZ') + " so'm)\n";
        grandTotal += calculations[service].total;
    }

    orderDetails += "\n💰 Jami: " + grandTotal.toLocaleString('uz-UZ') + " so'm";
    orderDetails += "\n\n👤 Mijoz: " + name;
    orderDetails += "\n📞 Tel: " + phone;
    orderDetails += "\n📍 Manzil: " + address;
    orderDetails += "\n💳 To'lov: " + payment;

    tg.sendData(orderDetails);
});
