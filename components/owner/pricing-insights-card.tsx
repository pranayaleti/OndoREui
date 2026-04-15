"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  getSuggestedRent,
  type SuggestedRentResult,
} from "@/lib/api/pricing";

interface PricingInsightsCardProps {
  propertyId: string;
  propertyTitle: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingInsightsCard({
  propertyId,
  propertyTitle,
}: PricingInsightsCardProps) {
  const [data, setData] = useState<SuggestedRentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const result = await getSuggestedRent(propertyId);
        setData(result);
      } catch (err) {
        setError("Unable to load pricing data");
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, [propertyId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return null;
  }

  const currentRent = data.currentRent ?? 0;
  const gap = data.suggestedRent - currentRent;
  const gapPercent =
    currentRent > 0 ? Math.round((gap / currentRent) * 100) : 0;
  const isBelow = gap > 50;
  const isAbove = gap < -50;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{propertyTitle}</CardTitle>
        <CardDescription>
          Based on {data.comparableCount} comparable{data.comparableCount !== 1 ? "s" : ""} nearby
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Rent</p>
            <p className="text-lg font-bold">
              {currentRent > 0 ? formatCurrency(currentRent) : "Not set"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Market Suggestion</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(data.suggestedRent)}
            </p>
          </div>
        </div>

        {currentRent > 0 && data.comparableCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {isBelow ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  {formatCurrency(Math.abs(gap))} below market (+{Math.abs(gapPercent)}%)
                </Badge>
              </>
            ) : isAbove ? (
              <>
                <TrendingDown className="h-4 w-4 text-amber-600" />
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  {formatCurrency(Math.abs(gap))} above market
                </Badge>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">At market rate</Badge>
              </>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Area avg: {formatCurrency(data.avgAreaRent)}/mo</span>
          {data.pricePerSqft > 0 && (
            <span>${data.pricePerSqft.toFixed(2)}/sqft</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
