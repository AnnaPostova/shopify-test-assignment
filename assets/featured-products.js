class FeaturedProducts extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', (event) => {
            const button = event.target.closest('.featured-products__add-to-cart');
            if (!button) return;

            event.preventDefault();

            const variantId = button.dataset.variantId;
            if (!variantId) return;

            this.addToCart(variantId);
        });
    }

    async addToCart(variantId) {
        try {
            const res = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {'Content-Type': 'application/json','Accept': 'application/json'},
                body: JSON.stringify({
                    id: variantId,
                    quantity: 1,
                    sections: ['cart-drawer', 'cart-icon-bubble'],
                    sections_url: window.location.pathname
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const state = await res.json();
            const drawer = document.querySelector('cart-drawer');

            if (!drawer?.renderContents) {
                window.location.href = '/cart';
                return;
            }

            drawer.renderContents(state);

            drawer.classList.remove('is-empty');

            if (drawer.open) drawer.open();

            await this.updateFeaturedSection();

        } catch (e) {
            console.error('Add to cart error:', e);
        }
    }

    async updateFeaturedSection() {
        const section = document.querySelector('.featured-products');
        if (!section) return;

        const sectionId = section.dataset.sectionId;

        const response = await fetch(`${window.location.pathname}?section_id=${sectionId}`);
        const html = await response.text();

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newSection = doc.querySelector('.featured-products');

        if (newSection) {
            section.replaceWith(newSection);
        }
    }
}

customElements.define('featured-products', FeaturedProducts);