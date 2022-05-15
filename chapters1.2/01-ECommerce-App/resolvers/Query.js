exports.Query = {
  hello: () => 'World!',
  products: (parent, { filter }, { db }) => {
    let filterProducts = db.products
    if (filter) {
      const { onSale, avgRating } = filter
      if (onSale) {
        filterProducts = filterProducts.filter((item) => item.onSale)
      }
      if ([1, 2, 3, 4, 5].includes(avgRating)) {
        // 算出平均分，然后比较大小
        filterProducts = filterProducts.filter((item) => {
          let sumRating = 0,
            numberOfReviews = 0
          db.reviews.forEach((review) => {
            if (review.productId === item.id) {
              sumRating += review.rating
              numberOfReviews++
            }
          })
          const avgProductRating = sumRating / numberOfReviews
          return avgProductRating >= avgRating
        })
      }
    }
    return filterProducts
  },
  product: (parent, { id }, { db }) => {
    return db.products.find((item) => item.id === id)
  },
  categories: (parent, args, { db }) => db.categories,
  category: (parent, { id }, { db }) => {
    return db.categories.find((item) => item.id === id)
  }
}
