import productModel from "../models/productModel.js";
import { v4 as uuidv4 } from "uuid";
// Example: '3a017b72-1c57-44c1-9a4d-7b1a9e7a682d'

// INFO: Route for adding a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const productImages = [image1, image2, image3, image4].filter(
      (image) => image !== undefined
    );

    let imageUrls = productImages.map((img) => generateUrl(img.originalname));

    const id = uuidv4();
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      image: imageUrls,
      date: Date.now(),
      prevId: id,
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product added" });
  } catch (error) {
    console.log("Error while adding product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).lean().sort({ createdAt: -1 });

    res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.log("Error while fetching all products: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for removing a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log("Error while removing product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching a single product
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      throw Error("Not Found!");
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error while fetching single product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const insertAllProductsToDB = async (req, res) => {
  try {
    const allProducts = await productModel.find();

    await Promise.all(
      allProducts.map(async (product) => {
        const newImages = product.image.map((img) => `${generateUrl(img)}`);

        product.image = newImages;
        await product.save();
      })
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

const generateUrl = (imgName) => {
  return `http://localhost:5000/assets/${imgName}`;
};

export {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
  insertAllProductsToDB,
};
