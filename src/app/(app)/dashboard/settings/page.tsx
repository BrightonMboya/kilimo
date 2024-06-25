"use client";
import Button from "~/components/ui/Button";
import { DeleteAccountButton } from "./_components/DeletAccountButton";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "~/components/ui/Tabs";

import GeneralSettings from "./_components/GeneralSettings";
import DangerZone from "./_components/DangerZone";
import TeamSettings from "./_components/TeamSettings";

export default function Page() {
  
  return (
    <div className="container mx-auto py-12">    
      <h1 className="mb-8 text-4xl">Account Settings</h1>
      {/* <Tabs defaultValue="general">
        <TabsList className="border-b">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="general"><GeneralSettings /></TabsContent>
        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
        <TabsContent value="team">
          <TeamSettings />
        </TabsContent>
      </Tabs> */}
      <GeneralSettings />
    </div>
  );
}
