class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

class Cart {
    constructor() {
        this.items = [];
    }

    addProduct(product) {
        this.items.push(product);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }
}

export { Product, Cart };
