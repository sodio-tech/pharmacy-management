import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"

export function RecentTransactions() {
  const transactions = [
    {
      id: "#INV-2024-001234",
      customer: "Walk-in Customer",
      items: 2,
      amount: "₹485.00",
      time: "2 mins ago",
      color: "text-green-600",
    },
    {
      id: "#INV-2024-001233",
      customer: "John Smith",
      items: 5,
      amount: "₹1,250.00",
      time: "15 mins ago",
      color: "text-blue-600",
    },
    {
      id: "#INV-2024-001232",
      customer: "Sarah Johnson",
      items: 3,
      amount: "₹750.00",
      time: "32 mins ago",
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-muted ${transaction.color}`}>
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{transaction.id}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.customer} • {transaction.items} items
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{transaction.amount}</p>
              <p className="text-sm text-muted-foreground">{transaction.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
