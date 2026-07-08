import { Button } from "@/components/ui/button"
import { Menu, ShoppingCart, UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <div className= "space-x-2 backdrop-blur-2xl  shadow-2xl text-accent w-full py-2" >
  <div className="max-w-7xl mx-auto flex  justify-between items-center">
     
<div  className="flex items-center gap-2">
  <Link href={'/'}>
   <Image src= "/logo.svg" width= {500}  height= {500} alt= "Logo Image" className=" flex justify-center items-center m-auto p-auto w-12 h-12 border-accent border   rounded-full "/>
  </Link>
  hello 
</div>
      <div className="w-fit ml-auto">
           <div className="md:hidden">
            <Menu />
        </div>
        <div className="hidden md:block space-x-2">
 <Button variant="ghost">
            <Link href= "/sign-in" className="flex gap-2 hover:text-primary">
                <ShoppingCart /> Cart
            </Link>
        </Button>
         <Button variant="ghost">
            <Link href= "/sign-in" className="flex gap-2 hover:text-primary">
                <UserIcon /> <span className="">Sign-in</span>
            </Link>
        </Button>
        </div>
       
        
      </div>
       </div>
    </div>
  )
}

export default Header
