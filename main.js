document.addEventListener('DOMContentLoaded', () => {
    const formatCurrency = (value) => new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    }).format(value);

    const productCards = document.querySelectorAll('.product-card');

    if (productCards.length) {
        const selectedProducts = [];
        const cartCount = document.getElementById('cart-count');
        const orderTotal = document.getElementById('order-total');
        const summaryTotal = document.getElementById('summary-total');
        const selectedItemsList = document.getElementById('selected-items-list');
        const proceedButtons = document.querySelectorAll('#proceed-btn, #proceed-enquiry-btn');

        const renderSelection = () => {
            const total = selectedProducts.reduce((sum, item) => sum + item.price, 0);

            if (cartCount) cartCount.textContent = String(selectedProducts.length);
            if (orderTotal) orderTotal.textContent = formatCurrency(total);
            if (summaryTotal) summaryTotal.textContent = formatCurrency(total);

            if (!selectedItemsList) return;

            if (!selectedProducts.length) {
                selectedItemsList.innerHTML = '<li>No products selected yet. Click “Select” on a menu item to add it.</li>';
                return;
            }

            selectedItemsList.innerHTML = selectedProducts
                .map((item) => `<li>${item.name} — ${formatCurrency(item.price)}</li>`)
                .join('');
        };

        const toggleProduct = (card) => {
            const name = card.dataset.name;
            const price = Number(card.dataset.price);
            const index = selectedProducts.findIndex((item) => item.name === name);

            if (index >= 0) {
                selectedProducts.splice(index, 1);
                card.classList.remove('is-selected');
                const button = card.querySelector('.select-btn');
                if (button) button.textContent = 'Select';
            } else {
                selectedProducts.push({ name, price });
                card.classList.add('is-selected');
                const button = card.querySelector('.select-btn');
                if (button) button.textContent = 'Selected';
            }

            renderSelection();
        };

        productCards.forEach((card) => {
            const button = card.querySelector('.select-btn');

            button?.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleProduct(card);
            });

            card.addEventListener('click', (event) => {
                if (event.target.closest('.select-btn')) return;
                toggleProduct(card);
            });
        });

        proceedButtons.forEach((button) => {
            button.addEventListener('click', () => {
                if (!selectedProducts.length) {
                    alert('Please select at least one product before continuing to the enquiry form.');
                    return;
                }

                const products = selectedProducts.map((item) => item.name).join(', ');
                const total = selectedProducts.reduce((sum, item) => sum + item.price, 0);
                const orderUrl = `enquiry.html?items=${encodeURIComponent(products)}&total=${encodeURIComponent(total)}`;
                window.location.href = orderUrl;
            });
        });

        renderSelection();
    }

    const enquiryForm = document.querySelector('form');
    if (enquiryForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedItems = urlParams.get('items');
        const totalValue = urlParams.get('total');
        const messageField = document.getElementById('message');
        const enquiryTypeField = document.getElementById('enquiry-type');

        if (selectedItems && messageField) {
            const total = Number(totalValue || 0);
            const selectedSummary = `Selected products: ${selectedItems}\nEstimated total: ${formatCurrency(total)}`;
            messageField.value = selectedSummary;
        }

        if (enquiryTypeField && selectedItems) {
            enquiryTypeField.value = 'wholesale';
        }
    }
});
