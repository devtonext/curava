export const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = v => v.replace(/\D/g, "").length >= 7;
