import { DeleteAccountButton } from "./DeletAccountButton";

export default function DangerZone() {
  return (
    <div className="rounded-md border border-red-300 bg-white ">
      <div className="rounded-t-md border-b border-b-red-300 bg-red-100 px-4 py-2 sm:px-6 md:py-3 ">
        <span className="mb-4  font-medium  ">Danger Zone</span>
      </div>

      <div className="p-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-4 text-sm sm:text-base">
          <div>You can delete your account below</div>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
