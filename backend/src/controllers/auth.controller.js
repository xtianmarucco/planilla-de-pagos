import * as AuthService from "../services/auth.service.js";
import { success } from "../utils/response.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.login(email, password);
    req.session.userId = user.id;
    success(res, user);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, data: null });
  });
};

export const me = async (req, res, next) => {
  try {
    const user = await AuthService.getById(req.session.userId);
    success(res, user);
  } catch (err) {
    next(err);
  }
};
