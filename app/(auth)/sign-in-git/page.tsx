"use client";
import React from "react";
import { createAuthClient } from "better-auth/client";
import { Button } from "@/components/ui/button";
const client = createAuthClient();

const SingGit = () => {
  const signin = async () => {
    const data = await client.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };
  return (
    <div>
      <h1>Hello Sing Git</h1>
      <Button onClick={() => signin()}>Sing Git</Button>
    </div>
  );
};

export default SingGit;
