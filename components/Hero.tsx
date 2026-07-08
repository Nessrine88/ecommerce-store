import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div className='max-w-7xl mx-auto flex md:flex-row flex-col  justify-center items-center h-full mt-10 gap-28 '>
        <div className='order-2'>
            <h1 className='font-bold italic text-[clamp(2vw,72px,8vw)] md:text-left text-center text-accent'>Our top sellings</h1>
            <p className='md:max-w-3-4 md:mt-5 text-muted'>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam animi quibusdam fuga sint veritatis error omnis? Voluptate, consequatur dolorum delectus perferendis saepe itaque maiores doloribus velit culpa assumenda, ullam architecto!
            </p>
        </div>
        <div className='relative w-full h-auto order-1 md:order-2'>
             <Image src= "/plant1.png" width={500} height= {500} alt= "side Image" className='w-full h-full relative z-20' />
             <div className='w-full  h-full  absolute bg-amber-50/10 rounded-full top-0  blur-2xl '>

             </div>
        </div>
    </div>
  )
}

export default Hero
