import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center ">
      <h3 className="font-bold text-7xl"> NOT FOUND</h3>

      <Image
        src="/plant1.png"
        alt="not found image"
        width={500}
        height={500}
        className="w-42 h-auto"
      />

      <Link href={"/"}>
        {" "}
        <Button>Back to home </Button>
      </Link>
    </div>
  );
};

export default NotFound;
