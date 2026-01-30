class InventoryPage {

    get pageTitle() {
        return $('.title');
    }

    get shoppingCart() {
        return $('.shopping_cart_link');
    }

    get cartBadge() {
        return $('.shopping_cart_badge');
    }

    get allItems() {
        return $$('.inventory_item');
    }

    addToCartButton(itemName) {
        return $(`[data-test="add-to-cart-${itemName}"]`);
    }

    itemLink(itemId) {
        return $(`[data-test="item-${itemId}-title-link"]`);
    }

    async addItemToCart(itemName) {
        await this.addToCartButton(itemName).click();
    }

    async goToCart() {
        await this.shoppingCart.click();
    }

    async openItem(itemId) {
        await this.itemLink(itemId).click();
    }
}

module.exports = new InventoryPage();