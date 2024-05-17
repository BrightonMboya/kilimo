import React from "react";
import { Card } from "./_components/Card";
import FormRow from "./_components/FormRow";
import Input from "./_components/Input";
import { Button } from "./_components/Button";
import Link from "next/link";
import type { ZodCustomIssue, ZodIssue } from "zod";
import { z } from "zod";
import { tw } from "~/utils/utils";
import Header from "~/components/Layout/header/header";

export default function Page() {
  return (
    <main>
      <Header>
        <Button
          role="link"
          variant="ghost"
          aria-label={`new asset`}
         
          // data-test-id="createNewAsset"
        >
        Import
        </Button>
        <Button
          role="link"
          aria-label={`new asset`}
          icon="asset"
          variant="secondary"
          // data-test-id="createNewAsset"
        >
          New asset
        </Button>
      </Header>
      <Card className="w-full md:w-min">
        <form className="flex w-full flex-col gap-2">
          <div className="flex items-start justify-between border-b pb-5">
            <div className=" ">
              <h2 className="mb-1 text-[18px] font-semibold">Basic fields</h2>
              <p>Basic information about your asset.</p>
            </div>
            <div className="hidden flex-1 justify-end gap-2 md:flex">
              <Actions disabled={false} />
            </div>
          </div>

          <FormRow
            rowLabel={"Name"}
            className="border-b-0 pb-[10px]"
            //   required={zodFieldIsRequired(FormSchema.shape.title)}
          >
            <Input
              label="Name"
              hideLabel
              // name={zo.fields.title()}
              // disabled={disabled}
              // error={
              //   actionData?.errors?.title?.message || zo.errors.title()?.message
              // }
              autoFocus
              // onChange={updateDynamicTitle}
              className="w-full"
              // defaultValue={title || ""}
              // required={zodFieldIsRequired(FormSchema.shape.title)}
            />
          </FormRow>

          <FormRow rowLabel={"Main image"} className="pt-[10px]">
            <div>
              <p className="hidden lg:block">
                Accepts PNG, JPG or JPEG (max.4 MB)
              </p>
              <Input
                //   disabled={disabled}
                accept="image/png,.png,image/jpeg,.jpg,.jpeg"
                name="mainImage"
                type="file"
                //   onChange={validateFile}
                label={"Main image"}
                hideLabel
                //   error={fileError}
                className="mt-2"
                inputClassName="border-0 shadow-none p-0 rounded-none"
              />
              <p className="mt-2 lg:hidden">
                Accepts PNG, JPG or JPEG (max.4 MB)
              </p>
            </div>
          </FormRow>

          <div>
            <FormRow
              rowLabel={"Description"}
              subHeading={
                <p>
                  This is the initial object description. It will be shown on
                  the asset’s overview page. You can always change it. Maximum
                  1000 characters.
                </p>
              }
              className="border-b-0"
              // required={zodFieldIsRequired(FormSchema.shape.description)}
            >
              <Input
                inputType="textarea"
                maxLength={1000}
                //   label={zo.fields.description()}
                //   name={zo.fields.description()}
                //   defaultValue={description || ""}
                hideLabel
                placeholder="Add a description for your asset."
                //   disabled={disabled}
                data-test-id="assetDescription"
                className="w-full"
                //   required={zodFieldIsRequired(FormSchema.shape.description)}
              />
            </FormRow>
          </div>

          <FormRow
            rowLabel="Category"
            subHeading={
              <p>
                Make it unique. Each asset can have 1 category. It will show on
                your index.
              </p>
            }
            className="border-b-0 pb-[10px]"
            children={undefined}
            //   required={zodFieldIsRequired(FormSchema.shape.category)}
          >
            {/* <DynamicSelect
            disabled={disabled}
            defaultValue={category ?? undefined}
            model={{ name: "category", queryKey: "name" }}
            label="Categories"
            initialDataKey="categories"
            countKey="totalCategories"
            closeOnSelect
            selectionMode="set"
            allowClear
            extraContent={
              <Button
                // to="/categories/new"
                variant="link"
                // icon="plus"
                className="w-full justify-start pt-4"
              >
                Create new category
              </Button>
            }
          /> */}
          </FormRow>

          <FormRow
            rowLabel="Tags"
            subHeading={
              <p>
                Tags can help you organise your database. They can be combined.{" "}
                <Link href="/tags/new" className="text-gray-600 underline">
                  Create tags
                </Link>
              </p>
            }
            className="border-b-0 py-[10px]"
            children={undefined} //   required={zodFieldIsRequired(FormSchema.shape.tags)}
          >
            {/* <TagsAutocomplete existingTags={tags ?? []} /> */}
          </FormRow>

          <FormRow
            rowLabel="Location"
            subHeading={
              <p>
                A location is a place where an item is supposed to be located.
                This is different than the last scanned location{" "}
                <Link href="/locations/new" className="text-gray-600 underline">
                  Create locations
                </Link>
              </p>
            }
            className="border-b-0 py-[10px]"
            //   required={zodFieldIsRequired(FormSchema.shape.newLocationId)}
          >
            <input
              type="hidden"
              name="currentLocationId"
              // value={location || ""}
            />
            {/* <DynamicSelect
            disabled={disabled}
            fieldName="newLocationId"
            defaultValue={location || undefined}
            model={{ name: "location", queryKey: "name" }}
            label="Locations"
            initialDataKey="locations"
            countKey="totalLocations"
            closeOnSelect
            allowClear
            extraContent={
              <Button
                to="/locations/new"
                variant="link"
                icon="plus"
                className="w-full justify-start pt-4"
              >
                Create new location
              </Button>
            }
            renderItem={({ name, metadata }) => (
              <div className="flex items-center gap-2">
                <Image
                  imageId={metadata.imageId}
                  alt="img"
                  className={tw(
                    "size-6 rounded-[2px] object-cover",
                    metadata.description ? "rounded-b-none border-b-0" : "",
                  )}
                />
                <div>{name}</div>
              </div>
            )}
          /> */}
          </FormRow>

          <FormRow
            rowLabel={"Value"}
            subHeading={
              <p>
                Specify the value of assets to get an idea of the total value of
                your inventory.
              </p>
            }
            className="border-b-0 py-[10px]"
            //   required={zodFieldIsRequired(FormSchema.shape.valuation)}
          >
            <div className="relative w-full">
              <Input
                type="number"
                label="value"
                inputClassName="pl-[70px] valuation-input"
                hideLabel
                //   name={zo.fields.valuation()}
                //   disabled={disabled}
                //   error={zo.errors.valuation()?.message}
                step="any"
                min={0}
                className="w-full"
                //   defaultValue={valuation || ""}
                //   required={zodFieldIsRequired(FormSchema.shape.valuation)}
              />
              {/* <span className="absolute bottom-0 border-r px-3 py-2.5 text-[16px] text-gray-600 lg:bottom-[11px]">
              {currency}
            </span> */}
            </div>
          </FormRow>

          {/* <AssetCustomFields zo={zo} schema={FormSchema} /> */}

          <FormRow className="border-y-0 pb-0 pt-5" rowLabel="">
            <div className="ml-auto">
              <Button type="submit">Save</Button>
            </div>
          </FormRow>
        </form>
      </Card>
    </main>
  );
}

const Actions = ({ disabled }: { disabled: boolean }) => (
  <>
    <ButtonGroup>
      <Button variant="secondary" disabled={disabled}>
        Cancel
      </Button>
      <AddAnother disabled={disabled} />
    </ButtonGroup>

    <Button type="submit" disabled={disabled}>
      Save
    </Button>
  </>
);

const AddAnother = ({ disabled }: { disabled: boolean }) => (
  //   <TooltipProvider delayDuration={100}>
  //     <Tooltip>
  //       <TooltipTrigger asChild>
  <Button
    type="submit"
    variant="secondary"
    disabled={disabled}
    name="addAnother"
    value="true"
  >
    Add another
  </Button>
  //       </TooltipTrigger>
  //       <TooltipContent side="bottom">
  //         <p className="text-sm">Save the asset and add a new one</p>
  //       </TooltipContent>
  //     </Tooltip>
  //   </TooltipProvider>
);

type ZodCustomIssueWithMessage = ZodCustomIssue & { message: string };

export function createFormIssues(
  issues?: ZodIssue[],
): ZodCustomIssueWithMessage[] | undefined {
  return issues?.map(({ message, path }) => ({
    code: "custom",
    message,
    path,
  }));
}

export function zodFieldIsOptional(field: any) {
  return field instanceof z.ZodOptional;
}

export function zodFieldIsRequired(field: any) {
  return (
    !(field instanceof z.ZodOptional) &&
    !(field instanceof z.ZodNullable) &&
    field?._def?.checks?.length > 0
  );
}

export const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof JSON.parse>> => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

export const ButtonGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={tw("button-group", "inline-flex items-center", className)}>
    {children}
  </div>
);
