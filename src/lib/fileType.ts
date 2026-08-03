export function isImageUrl(value?: string | null) {
  if (!value) return false;
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif|ico)(\?.*)?$/i.test(value);
}

export function isPdfUrl(value?: string | null) {
  if (!value) return false;
  return /\.pdf(\?.*)?$/i.test(value);
}

export function getFileLabel(value?: string | null) {
  if (isPdfUrl(value)) return "PDF";
  if (isImageUrl(value)) return "Gambar";
  return "File";
}
