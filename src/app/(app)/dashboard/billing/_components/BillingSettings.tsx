import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/Card";

import Label from "~/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "~/components/ui/select";

import { Textarea } from "~/components/ui/TextArea";
import Button from "~/components/ui/Button";


export default function BillingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Settings</CardTitle>
        <CardDescription>
          Update your payment method and billing address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa ending in 1234</SelectItem>
                <SelectItem value="mastercard">
                  Mastercard ending in 5678
                </SelectItem>
                <SelectItem value="amex">Amex ending in 9012</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billing-address">Billing Address</Label>
            <Textarea
              id="billing-address"
              placeholder="Enter your billing address"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
