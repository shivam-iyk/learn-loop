import { useQuery } from "@tanstack/react-query";
import { DollarSign, Star, Users } from "lucide-react";
import { getOverview } from "../services/instructor";

function InstructorStats() {
  const { data } = useQuery({
    queryKey: ["instructor-overview"],
    queryFn: getOverview,
    staleTime: 10 * 1000 * 60, // 10 minutes
  });

  const stats = [
    {
      icon: Users,
      title: "Total Students",
      value: data?.average_rating || 0,
    },
    {
      icon: DollarSign,
      title: "Total Revenue",
      value: parseInt(data?.total_revenue) || 0,
    },
    {
      icon: Star,
      title: "Average Rating",
      value: data?.average_rating || 0,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
      {stats.map(({ icon, title, value }, index) => {
        const Icon = icon;
        return (
          <div className="p-8 rounded-xl border" key={index}>
            <Icon size={40} className="mb-4" />
            <h4 className="text-2xl font-agdasima uppercase font-bold tracking-tight text-accent">
              {title}
            </h4>
            <p className="text-4xl font-merriweather">
              {value.toLocaleString("en-IN", {
                style: title.toLowerCase().includes("revenue")
                  ? "currency"
                  : "decimal",
                currency: "INR",
                minimumFractionDigits: title.toLowerCase().includes("rating")
                  ? 1
                  : 0,
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default InstructorStats;
