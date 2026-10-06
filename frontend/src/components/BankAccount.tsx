import { Button } from "@heroui/react";
import { CreditCard, Hash, Landmark, User } from "lucide-react";

function BankAccount() {
  const account = {
    bank: "HDFC Bank",
    number: "5440",
    ifsc: "HDFC0541487",
    name: "Shivam",
  };

  return (
    <div className="bg-background p-4 h-fit rounded-lg">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-outfit font-semibold tracking-tight">
          Bank Account
        </h5>
        <Button variant="ghost" className="text-accent">
          Edit
        </Button>
      </div>
      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark /> Bank
          </div>
          {account.bank}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard /> Account Number
          </div>
          XXXX-{account.number}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash /> IFSC Code
          </div>
          {account.ifsc}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User /> Name
          </div>
          {account.name}
        </div>
      </div>
    </div>
  );
}

export default BankAccount;
