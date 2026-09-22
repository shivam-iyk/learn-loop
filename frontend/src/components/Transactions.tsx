import { Avatar, Pagination } from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import useAppStore from "../store";
import { getPageNumbers } from "../lib/helpers";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInstructorTransacations } from "../services/transactions";

interface TransactionI {
  id: number;
  transaction_id: string;
  amount: number;
  status: "pending" | "success" | "failed";
  user_avatar: string;
  course_name: string;
  user_name: string;
  created_at: string;
}

function Transactions() {
  const { data } = useQuery<TransactionI[]>({
    queryKey: ["transactions"],
    queryFn: getInstructorTransacations,
    staleTime: 10 * 1000 * 60, // 10 minutes
  });

  const { pagination, setPagination } = useAppStore();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const transactions = searchParams.get("transactions");
    setPagination({ ...pagination, page: parseInt(transactions || "1") });
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4 bg-background/50 rounded-lg p-4">
      <h5 className="text-xl font-outfit font-semibold tracking-tight">
        Transactions
      </h5>
      <div className="flex flex-col">
        {data?.map((item, index) => (
          <div
            className="flex items-center justify-between first:border-0 border-t gap-4 py-2"
            key={index}
          >
            <div className="flex items-center gap-2">
              <Avatar className="rounded-full" size="md">
                <Avatar.Image src={item.user_avatar} />
                <Avatar.Fallback>{item.user_name[0]}</Avatar.Fallback>
              </Avatar>
              <div>
                <p className="font-medium leading-4">{item.user_name}</p>
                <span className="text-muted text-sm">{item.course_name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-accent text-xl font-semibold">
                {item.amount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </p>
              <span className="text-muted text-xs">
                {new Date(item.created_at).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
      {pagination.pages > 1 && (
        <Pagination className="mt-4 justify-center">
          <Pagination.Content className="max-sm:mx-auto">
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={pagination.page === 1}
                onClick={() =>
                  setSearchParams({
                    transactions: (pagination.page - 1).toString(),
                  })
                }
              >
                <Pagination.PreviousIcon />
                <span className="max-sm:hidden">Back</span>
              </Pagination.Previous>
            </Pagination.Item>
            <div className="flex gap-1">
              {getPageNumbers(pagination).map((page, i) =>
                page === "ellipsis" ? (
                  <Pagination.Item key={`ellipsis-${i}`}>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={page}>
                    <Pagination.Link
                      isActive={page === pagination.page}
                      onPress={() =>
                        setSearchParams({ transactions: page.toString() })
                      }
                    >
                      {page}
                    </Pagination.Link>
                  </Pagination.Item>
                ),
              )}
            </div>
            <Pagination.Item>
              <Pagination.Next
                onClick={() =>
                  setSearchParams({
                    transactions: (pagination.page + 1).toString(),
                  })
                }
                isDisabled={pagination.page === pagination.pages}
              >
                <span className="max-sm:hidden">Next</span>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      )}
    </div>
  );
}

export default Transactions;
