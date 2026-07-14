import ProductCard from "./product-card";
import { Product } from "@/types";

const ProductList = ({data, title, limit}: {data:Product[] ; title?: string, limit?:number}) => {
const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="md:my-5 min-h-screen px-4" >
    <h2 className="text-[clamp(1vw,38px,8vw)] font-bold my-10">{title}  </h2>  
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data && data.length > 0 ? (limitedData.map((product:Product) => (
                   <ProductCard key={product.slug} product={product} />    
        ))):(
            <div>No product found</div>
        )}
     </div>
    </div>
  )
}

export default ProductList
