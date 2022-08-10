const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { user_name, email, password, first_name, last_name, address, phone } = req.body;

      // Check email, password in db
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "Email đã tồn tại." });

      if (password.length < 6) return res.status(400).json({ msg: "Password tối thiểu 6 kí tự." });

      // Mã hóa pass
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        user_name,
        email,
        password: passwordHash,
        first_name,
        last_name,
        address,
        phone,
      });

      // Save mongodb
      await newUser.save();
      return res.status(200).json({ msg: "Đăng ký thành công. Hãy đăng nhập" });
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  },

  //đăng nhập [POST]/api/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Tài khoản không tồn tại." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không chính xác." });

      // If login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      // res.json({accesstoken})
      return res.status(200).json({ msg: "Đăng nhập thành công", accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // đăng xuất [GET]/api/logout
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Đăng xuất." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //[GET]/api/refresh_token
  refreshToken: (req, res) => {
    try {
      // lấy token lưu ở cookies
      const rf_token = req.cookies.refreshtoken;

      // kiểm tra token
      if (!rf_token) return res.status(400).json({ msg: "Hãy đăng kí hoặc đặng nhập" });

      // xem token có hợp lệ hay k
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Hãy đăng kí hoặc đặng nhập" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

// Create access token
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userController;
