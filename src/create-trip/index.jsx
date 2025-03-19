import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import AutoComplete from "./AutoComplete";
import { Input } from "@/components/ui/input";
import { Expand } from "lucide-react";
import {
  SelectBudgetOptions,
  SelectTravelList,
  systemprompt,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { chatSession } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formdata, setformdata] = useState([]);

  const [openDialog, setopenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
 

  const navigate = useNavigate();

  const handleinputchange = (name, value) => {
    setformdata({
      ...formdata,
      [name]: value,
    });
  };

  const handlePlace = (data) => {
    setPlace(data);
    handleinputchange("Location", data);
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setopenDialog(true);
      return;
    }

    if (!formdata.noofdays || !formdata?.Location.description || !formdata?.budget || !formdata?.traveler) {
      toast("Please fill all the details before generating trip!", {
        className: 'sonner-toast-nudge',
        style: {
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fca5a5',
        },
      });
    }
    else if (formdata.noofdays  >= 7 || formdata.noofdays  <0){
      toast("Trip duration should be less than 7", {
        className: 'sonner-toast-nudge',
        style: {
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fca5a5',
        },
      });
    }
    else{
      setLoading(true);

      toast.info('Creating a trip plan...', {
        duration: 5000,
        style: {
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          border: '1px solid #93c5fd',
        },
      });

      setTimeout(() => {
        toast.info('Gathering you info...', {
          duration: 5000,
          style: {
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #93c5fd',
          },
        });
      }, 5000);

      setTimeout(() => {
        toast.info('Getting Hotel Info...', {
          duration: 5000,
          style: {
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #93c5fd',
          },
        });
      }, 10000);
      const FINAL_PROMPT = systemprompt
        .replace("{startingPoint}", "ranchi")
        .replace("{destination}", formdata?.Location.description)
        .replace("{days}", formdata?.noofdays)
        .replace("{budget}", formdata?.budget)
        .replace("{companions}", formdata?.traveler);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result.response.text());
      setLoading(false);
      SaveAiTrip(result.response.text());

    }
    // if(formdata.noofdays  > 5 || !formdata?.location || !formdata?.budget || !formdata?.traveler ){

    //   toast("Please fill all details");

    // }
    
  };

  useEffect(() => {
    console.log(formdata);
  }, [formdata]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => getUserProfile(tokenResponse),

    onError: (error) => console.log(error),
  });

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formdata,
      tripData: JSON.parse(TripData) ,
      userEmail: user.email,
      id: docId,
    });
    setLoading(false);

    navigate('/view-trip/'+ docId);
  };
  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setopenDialog(false);
        onGenerateTrip();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.{" "}
      </p>
      <div className="mt-20">
        <div className="h-40">
          <h2 className="text-xl my-10 font-medium ">
            What is your destination of choice?
            <AutoComplete handlePlace={handlePlace}></AutoComplete>
          </h2>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex-3"}
            type="digit"
            onChange={(e) => handleinputchange("noofdays", e.target.value)}
          />
          {/* <input placeholder={"Ex-3"} type="number" onChange={(e)=> handleinputchange('noofdays' , e.target.value)} /> */}
        </div>

        <div className="mt-10">
          <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  handleinputchange("budget", item.title);
                }}
                className={`p-4 curson-pointer border rounded-lg hover:shadow-lg ${
                  formdata.budget == item.title &&
                  "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl my-3 font-medium">
            Who do you plan travelling with in your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  handleinputchange("traveler", item.people);
                }}
                className={`p-4 curson-pointer border rounded-lg hover:shadow-lg ${
                  formdata.traveler == item.people && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button disabled={loading} onClick={onGenerateTrip}>
          {loading? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"/>: 'Generate Trip'}
          </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <img className="mt-2" src="/logo.svg" />
              <h2 className="font-bold text-lg mt-4">Sign in with google</h2>
              <p>Sign in to the app with Google Authentication securely</p>
              <Button
                className="w-full  mt-5 flex gap-4 items-center"
                
                onClick={login}
              >
                
                <FcGoogle className="h-7 w-7" /> Sign In With Google
                
                
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
