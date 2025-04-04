import { validateEmail } from "../services/auth.service.js";

export const validateRegistration = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLogin = (data) => {
  const errors = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
