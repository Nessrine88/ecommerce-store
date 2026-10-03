import React from 'react'

type Item = { id: number; price: string; src: string; height: string }

const columns: { offset: string; items: Item[] }[] = [
  {
    offset: 'pt-[14vh]',
    items: [
      { id: 1, price: '$134.00', src: '/plants/plant-1.png', height: 'h-[30vh]' },
      { id: 4, price: '$134.00', src: '/plants/plant-4.png', height: 'h-[30vh]' },
    ],
  },
  {
    offset: 'pt-[4vh]',
    items: [
      { id: 2, price: '$134.00', src: '/plants/plant-2.png', height: 'h-[34vh]' },
      { id: 5, price: '$134.00', src: '/plants/plant-5.png', height: 'h-[46vh]' },
    ],
  },
  {
    offset: 'pt-[20vh]',
    items: [
      { id: 3, price: '$134.00', src: '/plants/plant-3.png', height: 'h-[30vh]' },
      { id: 6, price: '$134.00', src: '/plants/plant-6.png', height: 'h-[30vh]' },
    ],
  },
]

const PlantCard = ({ price, src, height }: Omit<Item, 'id'>) => (
  <div
    className={`${height} relative w-[200px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#3a7a58] to-[#1f4d38] shadow-xl shadow-black/30 ring-1 ring-white/10`}
  >
    {/* shelf / floor */}
    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-black/15" />

    {/* plant */}
    <img
      src={src}
      alt="plant"
      className="absolute inset-x-0 bottom-[18%] mx-auto h-[65%] object-contain drop-shadow-2xl"
    />

    {/* price */}
    <p className="absolute inset-x-0 bottom-3 text-center text-[10px] tracking-wide text-white/70">
      {price}
    </p>
  </div>
)

const Page = () => {
  return (
    <div className="flex h-screen justify-center gap-5 overflow-hidden bg-[radial-gradient(ellipse_at_center,#1d4a36_0%,#0f2b1f_70%,#091c14_100%)]">
      {columns.map((col, i) => (
        <div key={i} className={`flex flex-col gap-5 ${col.offset}`}>
          {col.items.map(({ id, ...item }) => (
            <PlantCard key={id} {...item} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Page