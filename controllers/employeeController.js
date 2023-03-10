const employee = require("../models/employee");
const bcrypt = require("bcryptjs");

const createToken = require("./createToken");

// Add new employee to the database
const post_employee = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const newEmployee = new employee({
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
    district: req.body.district,
  });

  try {
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login employee
const login_employee = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the consumer with the given email
    const foundEmployee = await employee.findOne({ email });

    // If the consumer doesn't exist, return an error
    if (!foundEmployee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the given password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, foundEmployee.password);

    // If the passwords don't match, return an error
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the passwords match, create a token and return it to the client
    const token = createToken(foundEmployee._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all employees - for admin panel
const fetch_employees = async (req, res) => {
  try {
    const employees = await employee.find();

    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch employee by id
const fetch_employee = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const requiredEmployee = await employee.findById(id);
    res.status(200).json(requiredEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch employee based on location- other filteration purposes
const fetch_employee_based_district = async (req, res) => {
  const { district } = req.params;
  try {
    const employees = await employee.find({ district: district });

    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update employee profile
const update_employee_profile = async (req, res) => {
  const { id } = req.params;
  try {
    const updateEmployee = await employee.findByIdAndUpdate(id, {
      $set: {
        "name.fName": req.body.fName,
        "name.lName": req.body.lName,
        district: req.body.district,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
      },
    });
    res.status(200).json(updateEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Disable or Enable employee by admin
const disable_employee = async (req, res) => {
  const { id } = req.params;

  try {
    const requiredEmployee = await employee.findById(id);
    const ableUpdatedEmployee = await employee.findByIdAndUpdate(
      id,
      { isDisabled: !requiredEmployee.isDisabled },
      { new: true }
    );
    res.status(200).json(ableUpdatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  post_employee,
  login_employee,
  fetch_employees,
  fetch_employee,
  update_employee_profile,
  disable_employee,
  fetch_employee_based_district,
};
