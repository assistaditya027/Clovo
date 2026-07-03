const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

const isCloudinaryUrl = (url) => typeof url === 'string' && url.includes(CLOUDINARY_UPLOAD_SEGMENT);

export const transformCloudinaryUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) return url;

  const transforms = ['f_auto', 'q_auto'];

  if (options.crop !== false) transforms.push(`c_${options.crop || 'fill'}`);
  if (options.gravity !== false) transforms.push(`g_${options.gravity || 'auto'}`);
  if (options.width) transforms.push(`w_${Math.round(options.width)}`);
  if (options.height) transforms.push(`h_${Math.round(options.height)}`);
  if (options.extra) transforms.push(options.extra);

  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transforms.join(',')}/`);
};

export const buildCloudinarySrcSet = (url, widths = [], options = {}) =>
  widths
    .map((width) => `${transformCloudinaryUrl(url, { ...options, width })} ${Math.round(width)}w`)
    .join(', ');