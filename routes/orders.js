const express = require("express");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();


// =================================
// CREATE ORDER
// =================================

router.post("/", async (req, res) => {

  try {

    const {
      customer,
      items,
      phone,
      address,
      paymentMethod
    } = req.body;


    if (
      !customer ||
      !items ||
      !items.length ||
      !phone ||
      !address
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Order information incomplete"

      });

    }


    let totalAmount = 0;

    const orderItems = [];


    // -------------------------------
    // CHECK PRODUCTS & STOCK
    // -------------------------------

    for (const item of items) {

      const product =
        await Product.findById(
          item.product
        );


      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found"

        });

      }


      if (
        product.stock <
        item.quantity
      ) {

        return res.status(400).json({

          success: false,

          message:
            `${product.name} এর পর্যাপ্ত stock নেই`

        });

      }


      const quantity =
        Number(item.quantity);


      totalAmount +=
        product.price * quantity;


      orderItems.push({

        product:
          product._id,

        quantity:
          quantity,

        price:
          product.price

      });

    }


    // -------------------------------
    // CREATE ORDER
    // -------------------------------

    const order =
      await Order.create({

        customer:
          customer,

        items:
          orderItems,

        totalAmount:
          totalAmount,

        phone:
          phone,

        address:
          address,

        paymentMethod:
          paymentMethod ||
          "cash_on_delivery"

      });


    // -------------------------------
    // REDUCE STOCK
    // -------------------------------

    for (const item of items) {

      await Product.findByIdAndUpdate(

        item.product,

        {
          $inc: {
            stock:
              -Number(item.quantity)
          }
        }

      );

    }


    res.status(201).json({

      success: true,

      message:
        "Order placed successfully",

      order:
        order

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

});


// =================================
// GET ALL ORDERS
// =================================

router.get("/", async (req, res) => {

  try {

    const orders =
      await Order.find()

        .populate(
          "customer",
          "name phone email"
        )

        .populate(
          "items.product",
          "name price"
        )

        .sort({
          createdAt: -1
        });


    res.json({

      success: true,

      orders:
        orders

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

});


// =================================
// GET SINGLE ORDER
// =================================

router.get("/:id", async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      )

      .populate(
        "customer",
        "name phone email"
      )

      .populate(
        "items.product",
        "name price"
      );


    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found"

      });

    }


    res.json({

      success: true,

      order:
        order

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Server error"

    });

  }

});


module.exports = router;
