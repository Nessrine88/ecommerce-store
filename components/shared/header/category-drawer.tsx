import { Button, buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
  const categories = await getAllCategories();
  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger asChild>
        <Button>
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1">
            {categories.map((x) => (
              <DrawerClose asChild key={x.category}>
                <Link
                  href={`/search?category=${x.category}`}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start'
                  )}
                >
                  {x.category} ({x.count})
                </Link>
              </DrawerClose>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;