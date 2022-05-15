exports.Category = {
  products: ({ id: categoryId }, { filter }, { db }) => {
    const productsList = db.products.filter((item) => item.categoryId === categoryId)
    if (filter) {
      if (filter.onSale) {
        return productsList.filter((item) => item.onSale)
      }
    }
    return productsList
  }
}
