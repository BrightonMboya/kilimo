
import Button from "~/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/Card";

export default function BillingInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          Manage your subscription and payment details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <div className="font-medium">Current Plan</div>
            <div>
              <div className="font-medium">Pro</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                $99/month
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <div className="font-medium">Subscription</div>
            <div>
              <div className="font-medium">Active</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Renews on June 23, 2023
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <div className="font-medium">Payment Method</div>
            <div>
              <div className="font-medium">Visa ending in 1234</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Expires 06/2025
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <div className="font-medium">Billing Address</div>
            <div>
              <div className="font-medium">123 Main St, Anytown USA 12345</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Upgrade Plan</Button>
      </CardFooter>
    </Card>
  );
}
