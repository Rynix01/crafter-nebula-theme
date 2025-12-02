import StartToPlay from "./contents/startToPlay";
import FooterLinks from "./contents/footerLinks";
import Copyright from "./contents/copyright";
import { Website } from "@/lib/types/website";

export default function Footer({
  logoImage,
  name,
  description,
  serverConfig,
  socialMedia,
  quickLinks,
}: {
  logoImage: string;
  name: string;
  description: string;
  serverConfig: { ip: string; port: number };
  socialMedia: {
    instagram: string;
    tiktok: string;
    github: string;
    twitter: string;
    youtube: string;
    discord: string;
  };
  quickLinks: Website["theme"]["navbar"];
}) {
  return (
    <footer className="flex-none w-full bg-background border-t border-white/5 relative overflow-hidden">
      {/* Footer Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <StartToPlay serverConfig={serverConfig} websiteName={name} />
      <div className="container mx-auto px-4 relative z-10">
        <FooterLinks
          logoImage={logoImage}
          name={name}
          description={description}
          socialMedia={socialMedia}
          quickLinks={quickLinks}
        />
        <Copyright name={name} />
      </div>
    </footer>
  );
}
