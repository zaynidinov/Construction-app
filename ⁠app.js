let tg = window.Telegram.WebApp;
tg.expand();

const services = [
    { id: 'sqm-oboy', name: 'Oboy yopishtirish', price: 15000 },
    { id: 'sqm-plitka', name: 'Plitka terish', price: 50000 },
    { id: 'sqm-shpak', name: 'Shpaklyovka qilish', price: 20000 },
    { id: 'sqm-boyoq', name: 'Bo\'yoq berish', price: 18000 }
];

let calculations = {};

function calculateTotal() {
    let grandTotal = 0;
    calculations = {};

    services.forEach(service => {
        let input = document.getElementById(service.id);
        let val = parseFloat(input.value);

        if (!isNaN(val) && val > 0) {
            let total = val * service.price;
            grandTotal += total;
            calculations[service.name] = { sqm: val, total: total };
        }
    });

    let bar = document.getElementById('bottom-bar');
    let formattedTotal = grandTotal.toLocaleString('uz-UZ') + " so'm";

    if (grandTotal > 0) {
        bar.classList.remove('hidden');
        document.getElementById('bar-total').innerText = formattedTotal;
        document.getElementById('checkout-total-price').innerText = formattedTotal;
    } else {
        bar.classList.add('hidden');
    }
}

// Barcha inputlarga dinamik hisoblashni bog'lash
services.forEach(service => {
    let input = document.getElementById(service.id);
    if (input) {
        input.addEventListener('input', calculateTotal);
    }
});

// "Rejaga olish" tugmasi bosilganda 2-bosqichga o'tish
document.getElementById('bottom-bar').addEventListener('click', function() {
    document.getElementById('step-services').classList.add('hidden');
    document.getElementById('bottom-bar').classList.add('hidden');
    document.getElementById('step-checkout').classList.remove('hidden');
});

// Orqaga qaytish
document.getElementById('back-btn').addEventListener('click', function() {
    document.getElementById('step-checkout').classList.add('hidden');
    document.getElementById('step-services').classList.remove('hidden');
    calculateTotal();
});

// Telefon raqamini tekshirish (XX XXX XX XX -> 9 ta raqam)
document.getElementById('client-phone').addEventListener('input', function(e) {
    let input = e.target;
    let val = input.value.replace(/\D/g, ''); // Faqat raqamlar

    if (val.length === 9) {
        input.classList.remove('invalid');
        document.getElementById('phone-error').classList.add('hidden');
    } else {
        input.classList.add('invalid');
        document.getElementById('phone-error').classList.remove('hidden');
    }
});

// Buyurtmani tasdiqlash
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
