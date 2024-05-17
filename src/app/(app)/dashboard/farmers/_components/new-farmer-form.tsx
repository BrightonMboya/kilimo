import { ItemLayout, AssetLabel } from "~/components/Layout/ItemLayout";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { Textarea } from "~/components/ui/TextArea";
import { Icons } from "~/components/ui/icons";
import { GenderDropDown } from "./GenderDropDown";
import {
  type UseFormRegister,
  type UseFormHandleSubmit,
  type UseFormSetError,
  type SubmitHandler,
  type FieldErrors,
} from "react-hook-form";
import { type ValidationSchema } from "./schema";
import React from "react";

interface Props {
  handleSubmit: UseFormHandleSubmit<ValidationSchema>;
  onSubmit: SubmitHandler<ValidationSchema>;
  errors: FieldErrors<ValidationSchema>;
  register: UseFormRegister<ValidationSchema>;
  isLoading: boolean;
  setGender: React.Dispatch<React.SetStateAction<string>>;
}
export default function NewFarmerForm({
  handleSubmit,
  onSubmit,
  errors,
  register,
  setGender,
  isLoading,
}: Props) {
  return (
    <h3>
      Forms are tricky. They are one of the most common things you'll build in a
      web application, but also one of the most complex.
    </h3>
    // <form
    //   className="relative mt-[50px] flex flex-col space-y-[50px] "
    //   onSubmit={handleSubmit(onSubmit)}
    // >
    //   <ItemLayout>
    //     <AssetLabel label="Full Name" />
    //     <div>
    //       <Input placeholder="John Doe" {...register("fullName")} />
    //       {errors.fullName && (
    //         <p className="pt-3 text-sm text-red-500">
    //           Farmer's full name is required
    //         </p>
    //       )}
    //     </div>
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel label="Phone Number" />
    //     <Input placeholder="+260780348912" {...register("phoneNumber")} />
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel label="Gender"
    //     // caption="Gender of the farmer"
    //     />
    //     <div>
    //       <GenderDropDown setGender={setGender} />
    //       {errors?.gender && (
    //         <p className="pt-3 text-sm text-red-500">
    //           Farmer's gender is required
    //         </p>
    //       )}
    //     </div>
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel
    //       label="Quantity"
    //       // caption="Quantity in kg this farmer produce on a single harvest"
    //     />
    //     <div>
    //       <Input
    //         placeholder="50"
    //         {...register("quantityCanSupply", { valueAsNumber: true })}
    //         type="number"
    //       />
    //       {errors?.quantityCanSupply?.message && (
    //         <span className="text-sm text-red-500">
    //           <p>
    //             You can give an estimate of the harvest of this farmer for easy
    //             forecasting and analysis
    //           </p>
    //         </span>
    //       )}
    //     </div>
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel
    //       label="Farm Size"
    //       // caption="What is the farm size of this farmer in Acres"
    //     />

    //     <div>
    //       <Input
    //         placeholder="30"
    //         {...register("farmSize", { valueAsNumber: true })}
    //         type="number"
    //       />
    //       {errors?.farmSize?.message && (
    //         <span className="text-sm text-red-500">
    //           <p>What is the estimated farm size of this farmer in acres</p>
    //         </span>
    //       )}
    //     </div>
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel label="Country" caption="" />
    //     <div>
    //       <Input placeholder="Rwanda" />
    //       {errors?.country && (
    //         <p className="pt-3 text-sm text-red-500">
    //           What is the country of this farmer
    //         </p>
    //       )}
    //     </div>
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel
    //       label="Province"
    //       // caption="Which province is this farmer from"
    //     />
    //     <div>
    //       <Input placeholder="Musanze" {...register("province")} />
    //       {errors.province && (
    //         <p className="pt-3 text-sm text-red-500">
    //           Please enter the province in which this farmer is located
    //         </p>
    //       )}
    //     </div>
    //   </ItemLayout>

    //   <ItemLayout>
    //     <AssetLabel
    //       label="Notes"
    //       // caption="Enter additional details about this farmer"
    //     />

    //     <Textarea
    //       placeholder="Add short notes about this farmer"
    //       {...register("description")}
    //     />
    //   </ItemLayout>
    //   <Button className="mt-[50px] w-full" type="submit">
    //     {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
    //     Save
    //   </Button>
    // </form>
  );
}
