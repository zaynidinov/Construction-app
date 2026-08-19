let tg = window.Telegram.WebApp;
tg.expand();

let calculations = {};

function updateCalculation(serviceName, pricePerSqm, inputId) {
    let sqmInput = document.getElementById(inputId);
    let sqm = parseFloat(sqmInput.value);

    if (!isNaN(sqm) && sqm > 0) {
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
        document.getElementById('checkout-total-price').innerText = grandTotal.toLocaleString('uz-UZ') + " so'm";
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
    
    let grandTotal = 0;
    for (let service in calculations) { grandTotal += calculations[service].total; }
    if (grandTotal > 0) {
        document.getElementById('bottom-bar').classList.remove('hidden');
    }
}

// Telefon raqami formatini tekshirish va qizil qilish
document.getElementById('client-phone').addEventListener('input', function(e) {
    let input = e.target;
    let val = input.value.replace(/\D/g, ''); // Faqat raqamlarni qoldirish
    
    if (val.length === 9) {
        input.classList.remove('invalid');
        document.getElementById('phone-error').classList.add('hidden');
    } else {
        input.classList.add('invalid');
        document.getElementById('phone-error').classList.remove('hidden');
    }
});

document.getElementById('send-btn').addEventListener('click', function() {
    let name = document.getElementById('client-name').value.trim();
    let phoneInput = document.getElementById('client-phone');
    let phone = phoneInput.value.replace(/\D/g, '');
    let address = document.getElementById('client-address').value.trim();
    let payment = document.getElementById('payment-method').value;

    if (!name) {
        alert("Iltimos, ismingizni kiriting!");
        return;
    }

    if (phone.length !== 9) {
        phoneInput.classList.add('invalid');
        document.getElementById('phone-error').classList.remove('hidden');
        alert("Telefon raqamini to'g'ri shaklda kiriting (masalan: 90 123 45 67)!");
        return;
    }

    if (!address) {
        alert("Iltimos, manzilni kiriting!");
        return;
    }

    let orderData = {
        name: name,
        phone: "+998" + phone,
        address: address,
        payment: payment,
        items: calculations
    };

    tg.sendData(JSON.stringify(orderData));
});
