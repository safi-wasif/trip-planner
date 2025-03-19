import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

import GlobalApi from "@/service/GlobalApi";

function InfoSection({ trip }) {
    const [photoUrl, setPhotoUrl] = useState("/download.jpg");
  return (
    <div>
      <GlobalApi name={trip?.tripData?.destination + ', best tourist spots hd photos'} address={trip?.tripData?.destination} onPhotoFetched={setPhotoUrl} />
      <img
        src={photoUrl}
        className="h-[340px] w-full object-cover rounded"
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {" "}
            {trip?.userSelection?.Location?.description}
          </h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.userSelection?.noofdays} Day
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💲{trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md ">
              🥂 No. of Traveller: {trip?.userSelection?.traveler} people
            </h2>
          </div>
        </div>

        <Button>
          <IoIosSend />{" "}
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
