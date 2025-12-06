interface FooterBottomProps {
  name: string;
}

export default function FooterBottom({ name }: FooterBottomProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-white/5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <p>
          © {currentYear} {name}. Tüm hakları saklıdır.
        </p>
      </div>
      
      {/* Minecraft Disclaimer */}
      <p className="text-center text-xs text-white/20 mt-4">
        Bu site Mojang Studios veya Microsoft ile resmi olarak ilişkili değildir.
      </p>
    </div>
  );
}
