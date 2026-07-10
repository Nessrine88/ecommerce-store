import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-bg">
      <Image
        src="/logo.svg"
        width={500}
        height={500}
        alt="loading image"
        className="w-52 h-auto animate-pulse "
      />
    </div>
  );
}
