import Containers from "@/components/dashboard/containers";
import Sidebar from "@/components/dashboard/sidebar";
import useSessionHook from "@/hooks/useSessionHook";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const user = useSessionHook();
  if (!user) {
    redirect("/auth/signin");
  }
  return (
    <div className="flex md:flex-cols-2">
      <Sidebar />
      <Containers />
    </div>
  );
};

export default Dashboard;
