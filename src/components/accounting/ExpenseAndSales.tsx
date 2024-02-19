import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/components/ui/Card";
import Label from "~/components/ui/label";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";

export default function ExpenseAndSales() {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Record Expenses</CardTitle>
          <CardDescription>Input your expenses details here</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Label htmlFor="expenseName">Expense Name</Label>
            <Input id="expenseName" placeholder="Expense Name" />
            <Label htmlFor="expenseAmount">Amount</Label>
            <Input id="expenseAmount" placeholder="Amount" type="number" />
            <Label htmlFor="expenseDate">Date</Label>
            <Input id="expenseDate" placeholder="Date" type="date" />
            <Button className="w-full" type="submit">
              Submit Expense
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Record Sales</CardTitle>
          <CardDescription>Input your sales details here</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Label htmlFor="saleName">Sale Name</Label>
            <Input id="saleName" placeholder="Sale Name" />
            <Label htmlFor="saleAmount">Amount</Label>
            <Input id="saleAmount" placeholder="Amount" type="number" />
            <Label htmlFor="saleDate">Date</Label>
            <Input id="saleDate" placeholder="Date" type="date" />
            <Button className="w-full" type="submit">
              Submit Sale
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
