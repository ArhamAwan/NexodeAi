import Image from "next/image";

type LogoMarkProps = {
  className?: string;
  size?: number;
};

/** Transparent N mark — uses the extracted asset (no black plate). */
export function LogoMark({ className = "", size = 28 }: LogoMarkProps) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      priority
    />
  );
}
