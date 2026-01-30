class CartPage {

    get items() {
        return $$('.cart_item');
    }

    get itemNames() {
        return $$('.inventory_item_name');
    }

    get itemPrices() {
        return $$('.inventory_item_price');
    }

    removeButton(itemName) {
        return $(`[data-test="remove-${itemName}"]`);
    }
}

module.exports = new CartPage();