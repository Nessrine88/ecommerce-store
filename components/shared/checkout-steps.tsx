import React from "react";
import { cn } from "@/lib/utils";
const CheckkoutSteps = ({current = 0}) => {
    return ( 
    <div className="flex items-center text-accent  flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
        {['User Login', 'Shipping Address', 'Payement Method', 'Place Order'].map((step,index) =>(
            <React.Fragment key={step}>
                <div className={cn('p-2 w-56 rounded-full text-center text-sm', index === current ? 'bg-secondary': '')} >
                {step}
                </div>
                    {step !== 'Place Order' && (
                        <hr className=" w-16 border-t border-accent mx-2" />
                    )}
            </React.Fragment>
        ))}
    </div> );
}
 
export default CheckkoutSteps;