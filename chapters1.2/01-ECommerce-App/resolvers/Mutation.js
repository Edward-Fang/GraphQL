const { v4: uuid } = require('uuid')

exports.Mutation = {
  addCategory: (parent, { input }, { db }) => {
    const { name } = input
    const newCategory = {
      id: uuid(),
      name
    }
    db.categories.push(newCategory)
    return newCategory
  },
  addProduct: (parent, { input }, { db }) => {
    const { name, description, quantity, price, image, onSale, categoryId } = input
    const newProduct = {
      id: uuid(),
      name,
      description,
      quantity,
      price,
      image,
      onSale,
      categoryId
    }
    db.products.push(newProduct)
    return newProduct
  },
  addReview: (parent, { input }, { db }) => {
    const { date, title, comment, rating, productId } = input
    const newReview = {
      id: uuid(),
      date,
      title,
      comment,
      rating,
      productId
    }
    db.reviews.push(newReview)
    return newReview
  },
  deleteCategory: (parent, { id }, { db }) => {
    db.categories = db.categories.filter((item) => item.id !== id)
    db.products = db.products.map((item) => {
      if (item.categoryId === id) {
        return {
          ...item,
          categoryId: null
        }
      } else return item
    })
    return true
  },
  deleteProduct: (parent, { id }, { db }) => {
    db.products = db.products.filter((item) => item.id !== id)
    db.reviews = db.reviews.filter((item) => item.productId !== id)
    return true
  },
  deleteReview: (parent, { id }, { db }) => {
    db.reviews = db.reviews.filter((item) => item.id !== id)
    return true
  },
  updateCategory: (parent, { id, input }, { db }) => {
    const index = db.categories.findIndex((item) => item.id === id)
    if (index === -1) return null
    db.categories[index] = {
      ...db.categories[index],
      ...input
    }
    return db.categories[index]
  },
  updateProduct: (parent, { id, input }, { db }) => {
    const index = db.products.findIndex((item) => item.id === id)
    if (index === -1) return null
    db.products[index] = {
      ...db.products[index],
      ...input
    }
    return db.products[index]
  },
  updateReview: (parent, { id, input }, { db }) => {
    const index = db.reviews.findIndex((item) => item.id === id)
    if (index === -1) return null
    db.reviews[index] = {
      ...db.reviews[index],
      ...input
    }
    return db.reviews[index]
  }
}
