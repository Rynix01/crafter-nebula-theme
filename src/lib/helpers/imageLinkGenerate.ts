export default function imageLinkGenerate(path: string) {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}