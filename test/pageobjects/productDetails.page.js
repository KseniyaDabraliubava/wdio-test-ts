class ProductDetailsPage {
    get productName() {
        return $('.inventory_details_name');
    }

    get productDescription() {
        return $('.inventory_details_desc');
    }

    get productPrice() {
        return $('.inventory_details_price');
    }

    get addToCartButton() {
        return $('.btn_inventory');
    }
}

module.exports = new ProductDetailsPage();