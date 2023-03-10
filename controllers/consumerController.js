const consumer = require("../models/consumer");
const bcrypt = require("bcryptjs");

const createToken = require("./createToken");

// Add new consumer to the database
const post_consumer = async (req, res) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const newConsumer = new consumer({
    name: {
      fName:
        req.body.fName.charAt(0).toUpperCase() +
        req.body.fName.slice(1).toLowerCase(),
      lName:
        req.body.lName.charAt(0).toUpperCase() +
        req.body.lName.slice(1).toLowerCase(),
    },
    password: hashedPassword,
    mobile: req.body.mobile,
    email: req.body.email,
    NIC: req.body.NIC,
    address: {
      district: req.body.district,
      city: req.body.city,
      street: req.body.street,
    },
  });

  try {
    await newConsumer.save();
    res.status(201).json(newConsumer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login consumer
const login_consumer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the consumer with the given email
    const foundConsumer = await consumer.findOne({ email });

    // If the consumer doesn't exist, return an error
    if (!foundConsumer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the given password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, foundConsumer.password);

    // If the passwords don't match, return an error
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the passwords match, create a token and return it to the client
    const token = createToken(foundConsumer._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all consumers - for admin panel
const fetch_consumers = async (req, res) => {
  try {
    const consumers = await consumer.find();

    res.status(200).json(consumers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch consumers based on location- for employee panel
const fetch_consumers_based_district = async (req, res) => {
  const { district } = req.params;
  try {
    const consumers = await consumer.find({ "address.district": district });

    res.status(200).json(consumers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch consumer by id
const fetch_consumer = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const requiredConsumer = await consumer.findById(id);
    res.status(200).json(requiredConsumer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update consumer profile
const update_consumer_profile = async (req, res) => {
  const { id } = req.params;
  try {
    const updateConsumer = await consumer.findByIdAndUpdate(id, {
      $set: {
        "name.fName": req.body.fName,
        "name.lName": req.body.lName,
        "address.district": req.body.district,
        "address.city": req.body.city,
        "address.street": req.body.street,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
      },
    });
    res.status(200).json(updateConsumer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Disable or Enable consumer by admin
const disable_consumer = async (req, res) => {
  const { id } = req.params;

  try {
    const requiredConsumer = await consumer.findById(id);
    const ableUpdatedConsumer = await consumer.findByIdAndUpdate(
      id,
      { isDisabled: !requiredConsumer.isDisabled },
      { new: true }
    );
    res.status(200).json(ableUpdatedConsumer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  post_consumer,
  login_consumer,
  fetch_consumers,
  fetch_consumer,
  update_consumer_profile,
  disable_consumer,
  fetch_consumers_based_district,
};
