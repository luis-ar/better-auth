import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return redirect("/");
  const user = session?.user;
  return (
    <div className="mt-10 text-center">
      <h1 className="text-3xl font-bold underline">Welcome to the Dashboard</h1>

      <ul>
        <li>Email: {user?.email}</li>
        <li>Name: {user?.name}</li>
      </ul>
    </div>
  );
};

export default DashboardPage;
