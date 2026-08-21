const router = express.Router();
const {
  protect,
  adminOnly
} = require("../middleware/auth");
router.put("/:id", async (req, res) => { 
  router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {

const express = require("express");

const Product = require("../models/Product");

const router = express.Router();


// =================================
// GET ALL PRODUCTS
// =================================

router.get("/", async (req, res) => {

  try {

    const products = await Product.find({
      active: true
    }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      products: products
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


// =================================
// GET SINGLE PRODUCT
// =================================

router.get("/:id", async (req, res) => {

  try {

    const product =
      await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    res.json({
      success: true,
      product: product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


// =================================
// ADD PRODUCT
// =================================

router.post("/", async (req, res) => {

  try {

    const {
      name,
      category,
      description,
      price,
      stock,
      image
    } = req.body;


    if (
      !name ||
      !category ||
      price === undefined
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name, category and price are required"

      });

    }


    const product =
      await Product.create({

        name: name,

        category: category,

        description:
          description || "",

        price: Number(price),

        stock:
          Number(stock) || 0,

        image:
          image || "",

        active: true

      });


    res.status(201).json({

      success: true,

      message:
        "Product added successfully",

      product: product

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error"

    });

  }

});


// =================================
// UPDATE PRODUCT
// =================================

router.put("/:id", async (req, res) => {

  try {

    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true
        }

      );


    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found"

      });

    }


    res.json({

      success: true,

      message:
        "Product updated successfully",

      product: product

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message: "Server error"

    });

  }

});


// =================================
// DELETE PRODUCT
// =================================

router.delete("/:id", async (req, res) => {

  try {

    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );


    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found"

      });

    }


    res.json({

      success: true,

      message:
        "Product deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: "Server error"

    });

  }

});


module.exports = router;
