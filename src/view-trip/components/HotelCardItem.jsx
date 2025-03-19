import GlobalApi from '@/service/GlobalApi'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({hotel}) {
     const [photoUrl, setPhotoUrl] = useState("/download.jpg");
  return (
    <div>
        
        <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=" +
              hotel?.name +',' + hotel?.address
            }
            target='_blank'
            className="text-black hover:text-black"
          >
            <div className="border rounded-xl p-4 mx-5 my-6  hover:scale-110 transition-all  cursor-pointer hover:shadow-md">
            <GlobalApi name={hotel?.name} address={hotel?.address} onPhotoFetched={setPhotoUrl} />
            
              <img src={photoUrl} className="rounded-xl h-[180px] w-full object-cover" />
              <div className="my-2 flex flex-col gap-2">
                <h2 className="text-lg">{hotel?.name}</h2>
                <h2 className="text-sm text-gray-500">📍 {hotel?.address}</h2>
                <h2 className="text-sm">🪙 {hotel.price}</h2>
                <h2 className="text-sm">⭐ {hotel.rating}</h2>
              </div>
            </div>
        </Link>
    </div>
  )
}

export default HotelCardItem