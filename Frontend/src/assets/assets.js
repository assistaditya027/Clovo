import logo from './logo.svg';
import hero_img1 from './hero_img1.jpg';
import hero_img2 from './hero_img2.jpg';
import hero_image3 from './hero_image3.jpg';
import cart_icon from './cart_icon.png';
import bin_icon from './bin_icon.png';
import exchange_icon from './exchange_icon.png';
import profile_icon from './profile_icon.png';
import quality_icon from './quality_icon.png';
import search_icon from './search_icon.png';
import star_dull_icon from './star_dull_icon.png';
import star_icon from './star_icon.png';
import support_img from './support_img.png';
import menu_icon from './menu_icon.png';
import about_img from './about_img.png';
import contact_img from './contact_img.png';
import razorpay_logo from './razorpay_logo.png';
import stripe_logo from './stripe_logo.png';

// Static image/file assets used across frontend pages/components.
export const imageAssets = {
  logo,
  hero_img1,
  hero_img2,
  hero_image3,
  cart_icon,
  bin_icon,
  exchange_icon,
  profile_icon,
  quality_icon,
  search_icon,
  star_dull_icon,
  star_icon,
  support_img,
  menu_icon,
  about_img,
  contact_img,
  razorpay_logo,
  stripe_logo,
};

// Backward-compatible export used throughout existing code.
export const assets = imageAssets;

// Re-export all SVG icon components from one central entry-point.
export * from './icons/AboutIcons';
export * from './icons/CartIcons';
export * from './icons/CollectionIcons';
export * from './icons/ContactIcons';
export * from './icons/ForgotPasswordIcons';
export * from './icons/LoginIcons';
export * from './icons/PlaceOrderIcons';
export * from './icons/PrivacyIcons';
export * from './icons/ProductIcons';
export * from './icons/ProfileIcons';
export * from './icons/ResetPasswordIcons';
export * from './icons/TermsIcons';
export * from './icons/WishlistIcons';
export * from './icons/AppIcons';
