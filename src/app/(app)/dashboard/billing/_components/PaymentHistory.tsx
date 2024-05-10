import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "~/components/ui/table";
import Button from "~/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/Card";
import Link from "next/link";
export default function PaymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View your past payments and invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>June 23, 2022</TableCell>
              <TableCell>$99.00</TableCell>
              <TableCell>
                <Link className="text-blue-600 underline" href="#">
                  Invoice #123
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>May 23, 2022</TableCell>
              <TableCell>$99.00</TableCell>
              <TableCell>
                <Link className="text-blue-600 underline" href="#">
                  Invoice #122
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>April 23, 2022</TableCell>
              <TableCell>$99.00</TableCell>
              <TableCell>
                <Link className="text-blue-600 underline" href="#">
                  Invoice #121
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
