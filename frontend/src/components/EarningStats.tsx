import { BookOpen, DollarSign, Wallet } from "lucide-react";
import useAppStore from "../store";
import { useQuery } from "@tanstack/react-query";
import { getOverview } from "../services/instructor";

function EarningStats() {
  const { user } = useAppStore();

  const { data } = useQuery({
    queryKey: ["instructor-overview"],
    queryFn: getOverview,
    staleTime: 10 * 1000 * 60, // 10 minutes
  });

  const earnings = [
    {
      icon: Wallet,
      title: "Wallet",
      value: user?.wallet,
    },
    {
      icon: BookOpen,
      title: "Courses Sold",
      value: data?.courses_sold,
    },
    {
      icon: DollarSign,
      title: "Earnings",
      value: parseInt(data?.total_revenue) || 0,
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
              {value?.toLocaleString("en-IN", {
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
