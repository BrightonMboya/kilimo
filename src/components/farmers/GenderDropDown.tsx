import Label from "~/components/UI/label";
import { RadioGroup, RadioGroupItem } from "~/components/UI/radio-group";

export function GenderDropDown({ setGender }: any) {
  return (
    <RadioGroup
      onValueChange={(value) => {
        setGender(value);
      }}
    >
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Male" id="r1" />
          <Label htmlFor="r1">Male</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Female" id="r2" />
          <Label htmlFor="r2">Female</Label>
        </div>
      </div>
    </RadioGroup>
  );
}
