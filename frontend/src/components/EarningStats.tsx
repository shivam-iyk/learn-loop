import { BookOpen, DollarSign, Wallet } from "lucide-react";

function EarningStats() {
  const earnings = [
    {
      icon: Wallet,
      title: "Wallet",
      value: 1200,
    },
    {
      icon: BookOpen,
      title: "Courses Sold",
      value: 54,
    },
    {
      icon: DollarSign,
      title: "Earnings",
      value: 5400,
    },
  ];
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
      {earnings.map(({ icon, title, value }, index) => {
        const Icon = icon;
        return (
          <div className="p-8 rounded-xl border" key={index}>
            <Icon size={40} className="mb-4" />
            <h4 className="text-2xl font-agdasima uppercase font-bold tracking-tight text-accent">
              {title}
            </h4>
            <p className="text-4xl">
              {value.toLocaleString("en-IN", {
                style: title.toLowerCase().includes("courses sold")
                  ? "decimal"
                  : "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default EarningStats;
