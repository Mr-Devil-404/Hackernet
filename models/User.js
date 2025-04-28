const User = require("../models/User");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: "Login Successful"
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { loginUser };
