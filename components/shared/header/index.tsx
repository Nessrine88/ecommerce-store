import Menu from "./menu";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <div className="px-4 space-x-2 backdrop-blur-2xl px-4 md:px-0 shadow-2xl text-accent w-full py-2">
      <div className="max-w-7xl mx-auto flex  justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href={"/"}>
            <Image
              src="/logo.svg"
              width={500}
              height={500}
              alt="Logo Image"
              className=" flex justify-center items-center m-auto p-auto w-12 h-12 border-accent border   rounded-full "
            />
          </Link>
          hello
        </div>
        <div className="w-fit ml-auto">
          <div className="">
            <Menu />
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Header;
