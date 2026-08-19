document.addEventListener('DOMContentLoaded', function() {
    let tg = window.Telegram ? window.Telegram.WebApp : null;
    if (tg) {
        tg.expand();
    }

    const inputs = document.querySelectorAll('.sqm-input');
    const bottomBar = document.getElementById('bottom-bar');
    const barTotal = document.getElementById('bar-total');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    
    let grandTotal = 0;
    let selectedItems = {};

    // 1. Hisob-kitob va yonidagi narxni yangilash
    function updateCalculations() {
        grandTotal = 0;
        selectedItems = {};

        inputs.forEach(input => {
            const price = parseFloat(input.dataset.price);
            const name = input.dataset.name;
            const val = parseFloat(input.value);
            const subtotalEl = input.nextElementSibling;

            if (!isNaN(val) && val > 0) {
                const itemTotal = val * price;
                grandTotal += itemTotal;
                subtotalEl.innerText = itemTotal.toLocaleString('uz-UZ') + " so'm";
                selectedItems[name] = { sqm: val, total: itemTotal };
            } else {
                subtotalEl.innerText = "0 so'm";
            }
        });

        const formattedTotal = grandTotal.toLocaleString('uz-UZ') + " so'm";
        barTotal.innerText = formattedTotal;
        checkoutTotalPrice.innerText = formattedTotal;

        if (grandTotal > 0) {
            bottomBar.classList.remove('hidden');
        } else {
            bottomBar.classList.add('hidden');
        }
    }

    // Inputlarga hodisa bog'lash
    inputs.forEach(input => {
        input.addEventListener('input', updateCalculations);
    });

    // 2. "Rejaga qo'shish" tugmasi bosilganda
    bottomBar.addEventListener('click', function() {
        document.getElementById('step-services').classList.add('hidden');
        bottomBar.classList.add('hidden');
        document.getElementById('step-checkout').classList.remove('hidden');
    });

    // 3. Orqaga qaytish
    document.getElementById('back-btn').addEventListener('click', function() {
        document.getElementById('step-checkout').classList.add('hidden');
        document.getElementById('step-services').classList.remove('hidden');
        if (grandTotal > 0) {
            bottomBar.classList.remove('hidden');
        }
    });

    // 4. Telefon raqami tekshiruvi (faqat 9 ta raqam)
    const phoneInput = document.getElementById('client-phone');
    const phoneWrap = document.getElementById('phone-wrap');
    const phoneError = document.getElementById('phone-error');

    phoneInput.addEventListener('input', function(e) {
        let val = e.target.value.replace(/\D/g, ''); // faqat raqam qoldirish
        e.target.value = val;

        if (val.length === 9) {
            phoneWrap.classList.remove('invalid-wrap');
            phoneError.classList.add('hidden');
        } else {
            phoneWrap.classList.add('invalid-wrap');
            phoneError.classList.remove('hidden');
        }
    });

    // 5. Buyurtmani tasdiqlash
    document.getElementById('send-btn').addEventListener('click', function() {
        const name = document.getElementById('client-name').value.trim();
        const phone = phoneInput.value.trim();
        const address = document.getElementById('client-address').value.trim();
        const payment = document.getElementById('payment-method').value;

        if (!name) {
            alert("Iltimos, ismingizni kiriting!");
            return;
        }

        if (phone.length !== 9) {
            phoneWrap.classList.add('invalid-wrap');
            phoneError.classList.remove('hidden');
            alert("Telefon raqamini 9 ta raqam shaklida kiriting!");
            return;
        }

        if (!address) {
            alert("Iltimos, manzilni kiriting!");
            return;
        }

        const orderData = {
            name: name,
            phone: "+998" + phone,
            address: address,
            payment: payment,
            items: selectedItems,
            totalPrice: grandTotal
        };

        if (tg) {
            tg.sendData(JSON.stringify(orderData));
        } else {
            alert("Buyurtma qabul qilindi!");
            console.log(orderData);
        }
    });
});
