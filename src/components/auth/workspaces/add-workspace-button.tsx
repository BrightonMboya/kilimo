"use client"
import Button from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/";
import { useAddWorkspaceModal } from "./add-workspace-modal";

export default function AddWorkSpaceButton () {
  const { setShowAddWorkspaceModal, AddWorkspaceModal } =
    useAddWorkspaceModal();
  return (
    <AddWorkspaceModal/>
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <Button variant="outline">Create Workspace</Button>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px]">
    //     {/* <DialogHeader>
    //       <DialogTitle>Edit profile</DialogTitle>
    //       <DialogDescription>
    //         Make changes to your profile here. Click save when you're done.
    //       </DialogDescription>
    //     </DialogHeader> */}
    //     <AddWorkspaceModal />
    //     <DialogFooter>
    //       <Button type="submit">Save changes</Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
}
