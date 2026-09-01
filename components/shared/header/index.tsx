
import Menu from "./menu";
import Image from "next/image";
import Link from "next/link";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/10 bg-background/95 text-accent shadow-sm backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
        
        {/* Left */}
        <div className="flex shrink-0 items-center gap-3">
          <CategoryDrawer />

          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.svg"
              width={44}
              height={44}
              alt="Prostore"
              className="h-10 w-10 rounded-full border border-accent/20 object-contain p-1"
            />

            <span className="hidden text-base font-semibold tracking-tight sm:block">
              Prostore
            </span>
          </Link>
        </div>

        {/* Center Search */}
        <div className="absolute left-1/2 hidden w-full max-w-xl -translate-x-1/2 px-4 md:block">
          <Search />
        </div>

        {/* Right */}
        <div className="ml-auto flex shrink-0 items-center">
          <Menu />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t border-accent/5 px-4 py-2 md:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;

