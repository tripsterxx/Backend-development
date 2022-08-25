const User = require("../models/user");
const BigPromise = require("./bigPromise");
const customError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
	const token =
		req.cookies.token || req.header("Authorization").replace("Bearer ", "");

	if (!token) {
		return next(new customError("login first to access this page", 401));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	req.user = await User.findById(decoded.id);

	next();
});

exports.customRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new customError("you are not allowed for this resource", 403)
			);
		}
		next();
	};
};
