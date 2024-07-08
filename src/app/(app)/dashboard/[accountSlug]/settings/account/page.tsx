import FormRow from "~/components/shared/FormRow";
import Input from "~/components/shared/Input";

import { z } from "zod";
import ProfilePicture from "~/components/user/profile-picture";
import { Button } from "~/components/ui";
import PasswordResetForm from "~/components/user/password-reset-form";

export const UpdateFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email.")
    .transform((email) => email.toLowerCase()),
  username: z
    .string()
    .min(4, { message: "Must be at least 4 characters long" }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export default function Page() {
  let user;
  return (
    <div className="mb-2.5 flex flex-col justify-between bg-white md:rounded md:border md:border-gray-200 md:px-6 md:py-5 mt-5">
      <div className=" mb-6">
        <h3 className="text-text-lg font-semibold">My details</h3>
        <p className="text-sm text-gray-600">
          Update your photo and personal details here.
        </p>
      </div>
      <form className="">
        <FormRow rowLabel={"Full name"} className="border-t">
          <div className="flex gap-6">
            <Input
              label="First name"
              type="text"
              // // name={zo.fields.firstName()}
              // defaultValue={user?.firstName || undefined}
              // error={zo.errors.firstName()?.message}
            />
            <Input
              label="Last name"
              type="text"
              // name={zo.fields.lastName()}
              // defaultValue={user?.lastName || undefined}
              // error={zo.errors.lastName()?.message}
            />
          </div>
        </FormRow>

        <FormRow rowLabel="Email address">
          {/* Actial field used for resetting pwd and updating user */}
          <input
            type="hidden"
            // name={zo.fields.email()}
            // defaultValue={user?.email}
            className="hidden w-full"
          />
          {/* Just previews the email address */}
          <Input
            // label={zo.fields.email()}
            label="Email address"
            icon="mail"
            hideLabel={true}
            placeholder="zaans@huisje.com"
            type="text"
            // defaultValue={user?.email}
            className="w-full"
            disabled={true}
            title="To change your email address, please contact support."
          />
        </FormRow>

        <FormRow rowLabel="Username">
          <Input
            label="Username"
            hideLabel={true}
            addOn="shelf.nu/"
            type="text"
            // name={zo.fields.username()}
            // defaultValue={user?.username || undefined}
            // error={usernameError}
            className="w-full"
            inputClassName="flex-1"
          />
        </FormRow>

        <FormRow
          rowLabel="Profile picture"
          // subHeading="This will be displayed on your profile."
          className="border-t"
        >
          <div className="flex gap-3">
            <ProfilePicture />
            <div>
              <p>Accepts PNG, JPG or JPEG (max.4 MB)</p>
              <Input
                // disabled={disabled}
                accept="image/png,.png,image/jpeg,.jpg,.jpeg"
                name="profile-picture"
                type="file"
                // onChange={validateFile}
                label={"profile-picture"}
                hideLabel
                // error={fileError}
                className="mt-2"
                inputClassName="border-0 shadow-none p-0 rounded-none"
              />
            </div>
          </div>
        </FormRow>

        <div className="mt-4 text-right">
          <Button
            // disabled={disabled}
            type="submit"
            name="intent"
            value="updateUser"
          >
            Save
          </Button>
        </div>
      </form>

      <div className=" my-6">
        <h3 className="text-text-lg font-semibold">Password</h3>
        <p className="text-sm text-gray-600">Update your password here</p>
      </div>
      <PasswordResetForm userEmail={user?.email || ""} />
    </div>
  );
}
