import ProductCard from "./product-card";


const ProductList = ({data, title, limit}: {data:any ; title?: string, limit?:number}) => {
const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-5 min-h-screen" >
    <h2 className="text-7xl font-bold my-10">{title}  </h2>  
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data && data.length > 0 ? (limitedData.map((product:any) => (
                   <ProductCard key={product.slug} product={product} />    
        ))):(
            <div>No product found</div>
        )}
     </div>
    </div>
  )
}

export default ProductList
