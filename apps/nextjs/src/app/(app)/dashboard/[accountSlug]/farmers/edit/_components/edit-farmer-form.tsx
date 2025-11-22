import FormRow from "~/components/shared/FormRow";
import { Card } from "~/components/shared/empty/Card";
import Input from "~/components/shared/Input";
import { FarmerFormProps } from "../../_components/new-farmer-form";
import  Button  from "~/components/ui/Button";

export default function EditFarmerForm(props: FarmerFormProps) {
    return (
      <Card className="w-full md:w-min">
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={props.handleSubmit(props.onSubmit)}
        >
          <div className="flex items-start justify-between border-b pb-5">
            <div className=" ">
              <h2 className="mb-1 text-[18px] font-semibold">Basic fields</h2>
              <p>Enter the basic information about the farmer.</p>
            </div>
          </div>

          <FormRow rowLabel={"Full Name"} className="border-b-0 pb-[10px]">
            <Input
              label="Full Name"
              hideLabel
              {...props.register("fullName")}
              error={props.errors.fullName?.message}
              autoFocus
              className="w-full"
            />
          </FormRow>

          <FormRow rowLabel={"Phone Number"} className="border-b-0 pb-[10px]">
            <Input
              label="Phone Number"
              hideLabel
              {...props.register("phoneNumber")}
              error={props.errors.phoneNumber?.message}
              autoFocus
              className="w-full"
            />
          </FormRow>
          <FormRow rowLabel={"Country"} className="border-b-0 pb-[10px]">
            <Input
              label="Country"
              hideLabel
              {...props.register("country")}
              error={props.errors.country?.message}
              autoFocus
              className="w-full"
            />
          </FormRow>

          <FormRow
            rowLabel={"Farm Size"}
            className="border-b-0 pb-[10px]"
            subHeading={
              <p>What is the estimated farm size of this farmer in acres</p>
            }
          >
            <Input
              label="Farm Size"
              hideLabel
              {...props.register("farmSize", { valueAsNumber: true })}
              error={props.errors.farmSize?.message}
              autoFocus
              className="w-full"
              type="number"
            />
          </FormRow>

          <FormRow
            rowLabel={"Province"}
            className="border-b-0 pb-[10px]"
            subHeading={<p>What is the province or region of this farmer</p>}
          >
            <Input
              label="Provinve"
              hideLabel
              {...props.register("province")}
              error={props.errors.province?.message}
              autoFocus
              className="w-full"
            />
          </FormRow>

          <FormRow
            rowLabel={"Crops"}
            className="border-b-0 pb-[10px]"
            subHeading={<p>What are the crops this farmer is growing</p>}
          >
            <Input
              label="Crops"
              hideLabel
              {...props.register("crops")}
              error={props.errors.crops?.message}
              autoFocus
              className="w-full"
            />
          </FormRow>
          <FormRow
            rowLabel={"Quantity the crops are produced"}
            className="border-b-0 pb-[10px]"
            subHeading={
              <p>
                What is the quantity of crops this farmer can harvest in a
                single season in kilograms.
              </p>
            }
          >
            <Input
              label="quantityCanSupply"
              hideLabel
              {...props.register("quantityCanSupply", {
                valueAsNumber: true,
              })}
              error={props.errors.quantityCanSupply?.message}
              autoFocus
              type="number"
              className="w-full"
            />
          </FormRow>

          <FormRow className="border-y-0 pb-0 pt-5" rowLabel="">
            <div className="ml-auto"></div>
          </FormRow>
          <Button type="submit" disabled={props.isLoading}>
            Save
          </Button>
        </form>
      </Card>
    );
}