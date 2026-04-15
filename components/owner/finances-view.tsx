"use client"

import { useState, useEffect, useMemo } from "react"
import { getStatements, type OwnerStatement } from "@/lib/api/owner-financials"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/dashboard/date-picker-with-range"
import type { DateRange } from "react-day-picker"
// Use tree-shaken imports for better bundle size
import { format, subMonths } from "date-fns"
import {
  DollarSign,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Calendar,
  Building,
  Search,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// recharts does not support SSR — lazy-load both chart components so the
// recharts bundle is excluded from the initial page payload entirely.
const ChartSkeleton = () => (
  <div className="h-full w-full space-y-2 p-1">
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-[calc(100%-2rem)] w-full" />
  </div>
)

const IncomeExpenseChart = dynamic(
  () =>
    import("@/components/owner/income-expense-chart").then(
      (mod) => mod.IncomeExpenseChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

const PropertyPerformanceChart = dynamic(
  () =>
    import("@/components/owner/property-performance-chart").then(
      (mod) => mod.PropertyPerformanceChart
    ),
  { ssr: false, loading: () => <ChartSkeleton /> }
)
import { AddTransactionDialog } from "@/components/owner/add-transaction-dialog"
import { useToast } from "@/hooks/use-toast"

// Mock properties — kept for Reports tab ROI display (ROI % not available from statements API)
const PROPERTIES = [
  {
    id: "prop1",
      name: "2701 N Thanksgiving Way",
    income: 3400,
    expenses: 2100,
    netIncome: 1300,
    roi: 8.2,
  },
  {
    id: "prop2",
    name: "456 Oak Avenue",
    income: 1850,
    expenses: 950,
    netIncome: 900,
    roi: 7.5,
  },
  {
    id: "prop3",
    name: "789 Pine Street",
    income: 0,
    expenses: 400,
    netIncome: -400,
    roi: -2.1,
  },
]

export function FinancesView() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [transactions, setTransactions] = useState<
    Array<{
      id: string
      date: string
      property: string
      category: string
      description: string
      amount: number
      type: string
      status: string
    }>
  >([])
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  })
  const [statements, setStatements] = useState<OwnerStatement[]>([])
  const [statementsLoading, setStatementsLoading] = useState(true)

  useEffect(() => {
    async function fetchStatements() {
      try {
        const data = await getStatements()
        setStatements(data)
      } catch (err) {
        console.error("Failed to fetch statements:", err)
      } finally {
        setStatementsLoading(false)
      }
    }
    fetchStatements()
  }, [])

  const financialSummary = useMemo(() => {
    if (statements.length === 0) return null
    const current = statements[0]
    const previous = statements[1]
    return {
      currentMonth: {
        income: current.totalIncomeCents / 100,
        expenses: current.totalExpenseCents / 100,
        netIncome: current.netCents / 100,
      },
      previousMonth: previous
        ? {
            income: previous.totalIncomeCents / 100,
            expenses: previous.totalExpenseCents / 100,
            netIncome: previous.netCents / 100,
          }
        : null,
      ytd: {
        income: statements.reduce((sum, s) => sum + s.totalIncomeCents, 0) / 100,
        expenses: statements.reduce((sum, s) => sum + s.totalExpenseCents, 0) / 100,
        netIncome: statements.reduce((sum, s) => sum + s.netCents, 0) / 100,
      },
    }
  }, [statements])

  const derivedTransactions = useMemo(() => {
    return statements
      .flatMap((s) =>
        (s.lineItems || []).map((li, idx) => ({
          id: `${s.id}-${idx}`,
          date: li.date,
          property: li.description.split(" — ")[1] || "Property",
          category: li.type === "income" ? "Rent" : li.description.split(":")[0] || "Expense",
          description: li.description,
          amount: li.amountCents / 100,
          type: li.type,
          status: "completed" as const,
        }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [statements])

  useEffect(() => {
    if (derivedTransactions.length > 0) {
      setTransactions(derivedTransactions)
    }
  }, [derivedTransactions])

  // Filter transactions based on search term, type, property, and category
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = transactionType === "all" || transaction.type === transactionType
    const matchesProperty = propertyFilter === "all" || transaction.property === propertyFilter
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

    return matchesSearch && matchesType && matchesProperty && matchesCategory
  })

  // Calculate totals for filtered transactions
  const filteredTotals = filteredTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount
      } else {
        acc.expenses += transaction.amount
      }
      return acc
    },
    { income: 0, expenses: 0 },
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddTransaction = (data: any) => {
    // In a real app, this would call an API to add the transaction
    const newTransaction = {
      id: `txn${transactions.length + 1}`,
      date: format(new Date(), "yyyy-MM-dd"),
      property: data.property,
      category: data.category,
      description: data.description,
      amount: Number.parseFloat(data.amount),
      type: data.type,
      status: "completed",
    }

    setTransactions([newTransaction, ...transactions])

    toast({
      title: "Transaction added",
      description: "The transaction has been successfully recorded.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${statementsLoading ? "opacity-60" : ""}`}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-foreground/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(financialSummary?.currentMonth.income ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-foreground/70">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  {financialSummary?.previousMonth
                    ? (
                        ((financialSummary.currentMonth.income - financialSummary.previousMonth.income) /
                          financialSummary.previousMonth.income) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  % from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-foreground/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(financialSummary?.currentMonth.expenses ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-foreground/70">
                  <TrendingDown className="inline h-3 w-3 text-red-500 mr-1" />
                  {financialSummary?.previousMonth
                    ? (
                        ((financialSummary.currentMonth.expenses - financialSummary.previousMonth.expenses) /
                          financialSummary.previousMonth.expenses) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  % from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                <DollarSign className="h-4 w-4 text-foreground/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(financialSummary?.currentMonth.netIncome ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-foreground/70">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  {financialSummary?.previousMonth
                    ? (
                        ((financialSummary.currentMonth.netIncome - financialSummary.previousMonth.netIncome) /
                          financialSummary.previousMonth.netIncome) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  % from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Income vs. Expenses</CardTitle>
                <CardDescription>Monthly financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <IncomeExpenseChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
                <CardDescription>Monthly net income by property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PROPERTIES.map((property) => (
                    <div key={property.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{property.name}</span>
                        <span
                          className={
                            property.netIncome >= 0 ? "text-primary font-medium" : "text-destructive font-medium"
                          }
                        >
                          ${property.netIncome.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          property.netIncome >= 0
                            ? (property.netIncome / Math.max(...PROPERTIES.map((p) => p.netIncome))) * 100
                            : 0
                        }
                        className={`h-2 ${property.netIncome < 0 ? "bg-red-200" : ""}`}
                      />
                      {property.netIncome < 0 && (
                        <Progress
                          value={
                            (Math.abs(property.netIncome) /
                              Math.max(
                                ...PROPERTIES.filter((p) => p.netIncome < 0).map((p) => Math.abs(p.netIncome)),
                              )) *
                            100
                          }
                          className="h-2 bg-transparent"
                          indicatorClassName="bg-red-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Where your money is going</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <PropertyPerformanceChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-foreground/70" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.property}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-muted text-green-700 ring-1 ring-inset ring-green-600/20"
                              : "bg-muted text-red-700 ring-1 ring-inset ring-red-600/20"
                          }`}
                        >
                          {transaction.category}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`text-right ${transaction.type === "income" ? "text-primary" : "text-destructive"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("transactions")}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="2701 N Thanksgiving Way">2701 N Thanksgiving Way</SelectItem>
                    <SelectItem value="456 Oak Avenue">456 Oak Avenue</SelectItem>
                    <SelectItem value="789 Pine Street">789 Pine Street</SelectItem>
                    <SelectItem value="All Properties">Shared Expenses</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Mortgage">Mortgage</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Property Management">Property Management</SelectItem>
                    <SelectItem value="Taxes">Taxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <DatePickerWithRange date={date} setDate={setDate} />
              <AddTransactionDialog onAddTransaction={handleAddTransaction} />
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    {filteredTransactions.length} transactions found • ${filteredTotals.income.toLocaleString()} income
                    • ${filteredTotals.expenses.toLocaleString()} expenses
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-foreground/70">
                          <Filter className="h-8 w-8 mb-2" />
                          <p>No transactions found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-foreground/70" />
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-foreground/70" />
                            {transaction.property}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.type === "income"
                                ? "bg-muted text-green-700 ring-1 ring-inset ring-green-600/20"
                                : "bg-muted text-red-700 ring-1 ring-inset ring-red-600/20"
                            }`}
                          >
                            {transaction.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-muted text-primary ring-1 ring-inset ring-primary/20"
                                : "bg-muted text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                            }`}
                          >
                            {transaction.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell
                          className={`text-right ${transaction.type === "income" ? "text-primary" : "text-destructive"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">Financial Reports</h3>
              <p className="text-sm text-foreground/70">Generate and view financial reports</p>
            </div>
            <div className="flex gap-2">
              <DatePickerWithRange date={date} setDate={setDate} />
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Income Statement</CardTitle>
                    <CardDescription>Summary of income and expenses</CardDescription>
                  </div>
                  <BarChart className="h-5 w-5 text-foreground/70" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Income</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Rental Income</span>
                        <span>${((financialSummary?.currentMonth.income ?? 0) * 0.95).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Late Fees</span>
                        <span>${((financialSummary?.currentMonth.income ?? 0) * 0.03).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Income</span>
                        <span>${((financialSummary?.currentMonth.income ?? 0) * 0.02).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total Income</span>
                        <span>${(financialSummary?.currentMonth.income ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Expenses</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Mortgage</span>
                        <span>${((financialSummary?.currentMonth.expenses ?? 0) * 0.52).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Property Management</span>
                        <span>${((financialSummary?.currentMonth.expenses ?? 0) * 0.17).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance</span>
                        <span>${((financialSummary?.currentMonth.expenses ?? 0) * 0.13).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance</span>
                        <span>${((financialSummary?.currentMonth.expenses ?? 0) * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilities</span>
                        <span>${((financialSummary?.currentMonth.expenses ?? 0) * 0.08).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total Expenses</span>
                        <span>${(financialSummary?.currentMonth.expenses ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Net Income</span>
                      <span className="text-primary">
                        ${(financialSummary?.currentMonth.netIncome ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cash Flow Analysis</CardTitle>
                    <CardDescription>Monthly cash flow trends</CardDescription>
                  </div>
                  <TrendingUp className="h-5 w-5 text-foreground/70" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <IncomeExpenseChart />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Expense Distribution</CardTitle>
                    <CardDescription>Breakdown of expenses by category</CardDescription>
                  </div>
                  <PieChart className="h-5 w-5 text-foreground/70" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PropertyPerformanceChart />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Property Performance</CardTitle>
                    <CardDescription>Financial metrics by property</CardDescription>
                  </div>
                  <Building className="h-5 w-5 text-foreground/70" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead className="text-right">Income</TableHead>
                      <TableHead className="text-right">Expenses</TableHead>
                      <TableHead className="text-right">Net Income</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PROPERTIES.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.name}</TableCell>
                        <TableCell className="text-right">${property.income.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${property.expenses.toLocaleString()}</TableCell>
                        <TableCell
                          className={`text-right ${property.netIncome >= 0 ? "text-primary" : "text-destructive"}`}
                        >
                          ${property.netIncome.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right ${property.roi >= 0 ? "text-primary" : "text-destructive"}`}>
                          {property.roi.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
