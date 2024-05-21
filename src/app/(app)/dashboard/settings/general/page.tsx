import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";
import { Button } from "~/components/ui";
import { CustomTooltip } from "~/components/shared/custom-tooltip";
import { Spinner } from "~/components/ui/icons/icons-map";
import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "~/components/ui/select";

export default function Page() {
    let isPersonalOrganization;
    let disabled
   
  return (
    <div className="mb-2.5 flex mt-5 flex-col justify-between bg-white md:rounded md:border md:border-gray-200 md:px-6 md:py-5">
      <div className=" mb-6">
        <h3 className="text-text-lg font-semibold">General</h3>
        <p className="text-sm text-gray-600">
          Manage general workspace settings.
        </p>
      </div>
      <form method="post" className="border-t">
        <FormRow rowLabel={"Workspace Name"} className="border-b-0 pb-[10px]">
          <div className="flex flex-col">
            {isPersonalOrganization ? (
              <CustomTooltip content={<TooltipContent />}>
                <Input
                  label="Workspace Name"
                  hideLabel
                  // name={zo.fields.name()}
                  disabled={true}
                  error={zo.errors.name()?.message}
                  className="w-full"
                  defaultValue={
                    isPersonalOrganization && `${user.firstName}'s Workspace`
                  }
                  placeholder="Enter workspace name"
                  required={false}
                />
              </CustomTooltip>
            ) : (
              <Input
                label="Workspace Name"
                hideLabel
                // name={zo.fields.name()}
                // disabled={disabled}
                // error={zo.errors.name()?.message}
                autoFocus
                className="w-full"
                // defaultValue={currentOrganization.name || undefined}
                placeholder="Enter workspace name"
                required={true}
              />
            )}
            <p className="text-sm text-gray-600">
              This name will be used in QR tags and other documentations.
            </p>
          </div>
        </FormRow>

        <FormRow rowLabel={"Main image"} className="border-b">
          <div>
            {isPersonalOrganization ? (
              <>
                <p className="hidden lg:block">
                  Accepts PNG, JPG or JPEG (max.4 MB)
                </p>
                <Input
                  disabled={true}
                  accept="image/png,.png,image/jpeg,.jpg,.jpeg"
                  name="image"
                  type="file"
                  label={"Main image"}
                  hideLabel
                //   error={fileError}
                  className="mt-2"
                  inputClassName="border-0 shadow-none p-0 rounded-none"
                />
              </>
            ) : (
              <>
                <p className="hidden lg:block">
                  Accepts PNG, JPG or JPEG (max.4 MB)
                </p>
                <Input
                //   disabled={disabled}
                  accept="image/png,.png,image/jpeg,.jpg,.jpeg"
                  name="image"
                  type="file"
                //   onChange={validateFile}
                  label={"Main image"}
                  hideLabel
                //   error={fileError}
                  className="mt-2"
                  inputClassName="border-0 shadow-none p-0 rounded-none"
                />
              </>
            )}
          </div>
        </FormRow>
        {isPersonalOrganization && (
          <input type="hidden"
          
        //   value={currentOrganization.name}
           name="name" />
        )}
        <div>
          <label className="lg:hidden">Currency</label>
          {/* <FormRow rowLabel={"Currency"}>
            <Select
              defaultValue={currentOrganization.currency || "USD"}
              disabled={disabled}
              name={zo.fields.currency()}
            >
              <SelectTrigger className="px-3.5 py-3">
                <SelectValue placeholder="Choose a field type" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="w-full min-w-[300px]"
                align="start"
              >
                <div className=" max-h-[320px] overflow-auto">
                  {Object.keys(Currency).map((value) => (
                    <SelectItem value={value} key={value}>
                      <span className="mr-4 text-[14px] text-gray-700">
                        {Currency[value as $Enums.Currency]}
                      </span>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </FormRow> */}
        </div>
        <input type="hidden" 
        // value={currentOrganization.id}
         name="id" />
        <div className="mt-5 text-right">
          <Button type="submit" disabled={disabled}>
            {disabled ? <Spinner /> : "Save"}
          </Button>
        </div>
      </form>

      <div className=" mb-6">
        <h4 className="text-text-lg font-semibold">Asset backup</h4>
        <p className=" text-sm text-gray-600">
          Download a backup of your assets. If you want to restore a backup,
          please get in touch with support.
        </p>
        <p className=" font-italic mb-2 text-sm text-gray-600">
          IMPORTANT NOTE: QR codes will not be included in the export. Due to
          the nature of how Shelf's QR codes work, they currently cannot be
          exported with assets because they have unique ids. <br />
          Importing a backup will just create a new QR code for each asset.
        </p>
        {/* <ExportButton canExportAssets={canExportAssets} /> */}
      </div>
    </div>
  );
}



function TooltipContent() {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-gray-700">
        Unable to change the Name or Logo of Personal workspace.
      </p>
      <p className="text-sm">
        Create a Team workspace to fully customize them and enjoy extra
        features. Check out{" "}
        <Link
          className="text-primary-400 font-bold"
          href="/settings/subscription"
        >
          Subscriptions
        </Link>{" "}
        to learn more.
      </p>
    </div>
  );
}
