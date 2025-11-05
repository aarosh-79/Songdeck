"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const workspaceList = [
  {
    id: "1",
    title: "Tech Innovators Inc.",
  },
  {
    id: "2",
    title: "The Cozy Corner Cafe",
  },
  {
    id: "3",
    title: "City Fitness Gym",
  },
];

const JoinWorkspace = ({user}) => {
  const router = useRouter();
  const [workspacecode, setworkspacecode] = useState("");

  useEffect(() => {
    // retrieve workspaces for user (fetch from backend later)
  }, []);

  const handleJoin = () => {
    if (!workspacecode) {
      alert("Please enter a workspace code.");
      return;
    }
    // redirect to the workspace page with the code
    router.push(`/workspace/${workspacecode}`);
  };

  return (
    <section className="mt-12">
      <h1 className="text-4xl font-semibold text-center py-12">
        Join a workspace
      </h1>
      <div className="flex flex-col ">
        <Input
          id="join-workspace"
          placeholder="Enter workspace code"
          className={"px-4 py-8 mb-4 !text-xl"}
          onChange={(e) => {
            setworkspacecode(e.target.value);
          }}
        />
        <Button
          className={"text-center py-6 text-lg mx-auto"}
          onClick={handleJoin}
        >
          Join Workspace
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Workspaces</h2>
        <div className="mt-4 flex justify-center flex-col gap-6">
          {workspaceList.map((list) => (
            <div
              key={`${list.id}-${list.title}`}
              className="flex gap-2 text-lg cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/workspace/${list.id}`)} // clickable redirect
            >
              <Hash />
              <span className="text-lg">{list.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoinWorkspace;
