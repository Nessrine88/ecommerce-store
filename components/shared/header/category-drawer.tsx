import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async() => {
    const categories = await getAllCategories();
  return (
    <Drawer swipeDirection= 'left'>
      <DrawerTrigger >
        <Button>
            <MenuIcon  />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='w-full max-w-sm'>
        <DrawerHeader>
            <DrawerTitle>
                Select a category
            </DrawerTitle>
            <div className="sapce-y-1">
                {categories.map((x)=>(
                    <Button variant='ghost' className='w-full justify-start' key={x.category} >
                        <DrawerClose>
                            <Link href = {`/search?category=${x.category}`}>
                              {x.category} ({x.count})
                            </Link>
                        </DrawerClose>
                    </Button>
                ))}
            </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export default CategoryDrawer
