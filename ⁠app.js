let tg = window.Telegram.WebApp;
tg.expand();

const services = [
    { id: 'sqm-oboy', subtotalId: 'subtotal-oboy', name: 'Oboy yopishtirish', price: 15000 },
    { id: 'sqm-plitka', subtotalId: 'subtotal-plitka', name: 'Plitka terish', price: 50000 },
    { id: 'sqm-shpak', subtotalId: 'subtotal-shpak', name: 'Shpaklyovka qilish', price: 20000 },
    { id: 'sqm-boyoq', subtotalId: 'subtotal-boyoq', name: 'Bo\'yoq berish', price: 18000 }
];

let calculations = {};

function calculateTotal() {
    let grandTotal = 0;
    calculations = {};

    services.forEach(service => {
        let input = document.getElementById(service.id);
        let subtotalEl = document.getElementById(service.subtotalId);
        let val = parseFloat(input.value);

        if (!isNaN(val) && val > 0) {
            let itemTotal = val * service.price;
            grandTotal += itemTotal;
            subtotalEl.innerText = itemTotal.toLocaleString('uz-UZ') + " so'm";
            calculations[service.name] = { sqm: val, total: itemTotal };
        } else {
            subtotalEl.innerText = "0 so'm";
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

// Har bir inputga hisoblashni bog'lash
services.forEach(service => {
    let input = document.getElementById(service.id);
    if (input) {
        input.addEventListener('input', calculateTotal);
    }
});

// "Rejaga qo'shish" tugmasini bosganda 2-bosqichga o'tish
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

// Telefon raqam validatorini boshqarish (XX XXX XX XX -> 9 ta raqam)
document.getElementById('client-phone').addEventListener('input', function(e) {
    let input = e.target;
    let wrap = input.parentElement;
    let val = input.value.replace(/\D/g, '');

    if (val.length === 9) {
        wrap.classList.remove('invalid-wrap');
        document.getElementById('phone-error').classList.add('hidden');
    } else {
        wrap.classList.add('invalid-wrap');
        document.getElementById('phone-error').classList.remove('hidden');
    }
});

// Buyurtmani tasdiqlash va Telegram'ga yuborish
document.getElementById('send-btn').addEventListener('click', function() {
    let name = document.getElementById('client-name').value.trim();
    let phoneInput = document.getElementById('client-phone');
    let wrap = phoneInput.parentElement;
    let phone = phoneInput.value.replace(/\D/g, '');
    let address = document.getElementById('client-address').value.trim();
    let payment = document.getElementById('payment-method').value;

    if (!name) {
        alert("Iltimos, ismingizni kiriting!");
        return;
    }

    if (phone.length !== 9) {
        wrap.classList.add('invalid-wrap');
        document.getElementById('phone-error').classList.remove('hidden');
        alert("Telefon raqamini to'liq 9 ta raqam shaklida kiriting!");
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
