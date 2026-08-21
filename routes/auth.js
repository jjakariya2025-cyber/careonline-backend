const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {

  try {

    const {
      name,
      phone,
      email,
      password
    } = req.body;


    // Required fields check

    if (!name || !phone || !password) {

      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required"
      });

    }


    // Check existing user

    const existingUser =
      await User.findOne({ phone });


    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "এই ফোন নম্বর দিয়ে account already আছে"
      });

    }


    // Password hash

    const hashedPassword =
      await bcrypt.hash(password, 12);


    // Create user

    const user =
      await User.create({

        name: name,

        phone: phone,

        email: email || "",

        password: hashedPassword

      });


    res.status(201).json({

      success: true,

      message: "Account created successfully",

      user: {

        id: user._id,

        name: user.name,

        phone: user.phone,

        role: user.role

      }

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error"

    });

  }

});



// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {

  try {

    const {
      phone,
      password
    } = req.body;


    if (!phone || !password) {

      return res.status(400).json({

        success: false,

        message: "Phone and password required"

      });

    }


    // Find user

    const user =
      await User.findOne({ phone });


    if (!user) {

      return res.status(401).json({

        success: false,

        message: "Phone অথবা password ভুল"

      });

    }


    // Check password

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        success: false,

        message: "Phone অথবা password ভুল"

      });

    }


    // Create JWT token

    const token =
      jwt.sign(

        {
          id: user._id,

          role: user.role

        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d"
        }

      );


    res.json({

      success: true,

      message: "Login successful",

      token: token,

      user: {

        id: user._id,

        name: user.name,

        phone: user.phone,

        role: user.role

      }

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server error"

    });

  }

});


module.exports = router;
