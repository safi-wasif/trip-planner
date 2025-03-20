import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col items-center mx-56 gap-9">
      <h1 className="font-extrabold mt-16 text-[50px] text-center">
        <span className="text-[#f56551] ">
          Discover Your Next Adventure with AI:
        </span>{" "}
        Personalized Iterinaries at Your Fingertips
      </h1>
      <p className="text-xl text-gray-500 text-center">
        Your personal trip planner and travel curator, creating custom itenaries
        tailored to your own interest and budget
      </p>
      <Link to={"/create-trip"}>
        <Button>Get Started, It's Free</Button>
      </Link>

      <img src="/landing.png" alt="" />
    </div>
  );
}

export default Hero;
