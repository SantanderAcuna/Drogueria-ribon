class Product {
    constructor(id, name, price,descripcion, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.descripcion = descripcion;
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
