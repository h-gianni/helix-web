import Image from "next/image";
import LogoImage from "@/assets/shared/logo-circle.svg";

export function BrandLogo() {
  return (
    <span className="flex items-center gap-2 font-bold text-foreground-strong flex-shrink-0 text-xl">
      <Image
        src={LogoImage}
        alt="JustScore"
        className="size-8"
      />
      <span>JustScore</span>
    </span>
  );
}
