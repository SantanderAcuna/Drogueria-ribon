class Cart {
    constructor() {
        this.items = [];
    }

    addProduct(product, quantity) {
        const existingProduct = this.items.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
    }

    removeProduct(index) {
        this.items.splice(index, 1);
    }

    getTotal() {
        return this.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }
}

export { Cart };
