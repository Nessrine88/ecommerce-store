import Menu from "./menu";
import Image from "next/image";
import Link from "next/link";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

const Header = () => {
  return (
    <header className="w-full border-b border-accent/10 bg-background/80 py-2 text-accent shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 md:px-6">
        
        {/* Left: Categories + Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <CategoryDrawer />

          <Link
            href="/"
            className="flex items-center justify-center"
          >
            <Image
              src="/logo.svg"
              width={500}
              height={500}
              alt="Logo"
              className="h-11 w-11 rounded-full border border-accent object-contain p-1"
            />
          </Link>

          <span className="hidden text-sm font-medium sm:block">
            Hello
          </span>
        </div>

        {/* Center: Search */}
        <div className="hidden flex-1 px-4 md:block">
          <Search />
        </div>

        {/* Right: Menu */}
        <div className="ml-auto flex shrink-0 items-center">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;