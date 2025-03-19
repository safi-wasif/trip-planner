import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";


function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  useEffect(() => {
    tripId && getTripData();
  }, [tripId]);
  const getTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("docu :", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("no such docu");
      toast("no trip found");
    }
  };
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Info Section*/}

      <InfoSection trip={trip} />

      {/* Recommended Hotels */}

      <Hotels trip={trip}></Hotels>

      {/* Daily Plan */}

      <PlacesToVisit trip={trip}></PlacesToVisit>

    </div>
  );
}

export default Viewtrip;
