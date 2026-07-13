import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import ProductPrice from './product-price';
import { Product } from '@/app/(root)/types';
const ProductCard = ({product}: {product:Product}) => {
    console.log("PRODUCTS",product)
  return (
    <div>
      <Card>
        <CardHeader>
            <Link href = {`/product/${product.slug}`}>
            <div className='h-42 bg-amber-500'>
                <Image src= {product.images[0]} width={500} height={500} alt={product.name} priority className='w-full h-full object-cover'/>
            </div>
            </Link>
        </CardHeader>
        <CardContent className='p-4 gap-4 grid'>
           <div> {product.brand}</div>
           <Link href={`/product/${product.slug}`} >
           <h2 className="text-sm font-md">{product.name} </h2>
           </Link>
           <div className="flex-between gap-4">
            <p>{product.rating} Stars </p>
            {product.stock >0 ? (
                <ProductPrice value={Number(product.price)} />
            ):(
                <p className='text-red-300 fotn-bold'>Out Of Stock</p>
            )}
           </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductCard
