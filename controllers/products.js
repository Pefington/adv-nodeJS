import Product from "../models/product.js";

export const getAddProduct = (_req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
  });
};

export const postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

export const getProducts = (_req, res) => {
  Product.fetchAll((productsArray) => {
    res.render("shop/index", {
      products: productsArray,
      pageTitle: "Shop",
    });
  });
};
