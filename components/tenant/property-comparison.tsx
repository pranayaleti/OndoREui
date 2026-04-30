"use client"

import Image from "next/image"

interface Property {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  amenities: string | null
  photos: { url: string }[]
}

interface PropertyComparisonProps {
  properties: Property[]
  onRemove: (id: string) => void
}

export function PropertyComparison({ properties, onRemove }: PropertyComparisonProps) {
  if (properties.length < 2) {
    return <p className="text-center text-gray-500 py-8">Select at least 2 properties to compare</p>
  }

  const rows: { label: string; getValue: (p: Property) => string }[] = [
    { label: "Price", getValue: (p) => `$${p.price.toLocaleString()}/mo` },
    { label: "Bedrooms", getValue: (p) => String(p.bedrooms) },
    { label: "Bathrooms", getValue: (p) => String(p.bathrooms) },
    { label: "Sq Ft", getValue: (p) => p.sqft?.toLocaleString() || "N/A" },
    { label: "Price/Sq Ft", getValue: (p) => p.sqft ? `$${(p.price / p.sqft).toFixed(2)}` : "N/A" },
    { label: "Address", getValue: (p) => p.address },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 text-sm font-medium text-gray-500 w-32">Feature</th>
            {properties.map((p) => (
              <th key={p.id} className="p-3 text-center min-w-[200px]">
                {p.photos.length > 0 && (
                  <div className="relative w-full h-32 mb-2">
                    <Image
                      src={p.photos[0].url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="font-medium text-sm">{p.title}</p>
                <button onClick={() => onRemove(p.id)} className="text-xs text-red-500 hover:text-red-700 mt-1">
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const values = properties.map((p) => row.getValue(p))
            // Find best value for price (lowest)
            const isBestFn = row.label === "Price" || row.label === "Price/Sq Ft"
              ? (v: string, all: string[]) => {
                  const nums = all.map((s) => parseFloat(s.replace(/[$,/mo]/g, ""))).filter((n) => !isNaN(n))
                  const parsed = parseFloat(v.replace(/[$,/mo]/g, ""))
                  return !isNaN(parsed) && parsed === Math.min(...nums)
                }
              : row.label === "Sq Ft" || row.label === "Bedrooms" || row.label === "Bathrooms"
                ? (v: string, all: string[]) => {
                    const nums = all.map((s) => parseFloat(s.replace(/,/g, ""))).filter((n) => !isNaN(n))
                    const parsed = parseFloat(v.replace(/,/g, ""))
                    return !isNaN(parsed) && parsed === Math.max(...nums)
                  }
                : () => false

            return (
              <tr key={row.label} className="border-t">
                <td className="p-3 text-sm font-medium text-gray-500">{row.label}</td>
                {values.map((v, i) => (
                  <td
                    key={properties[i].id}
                    className={`p-3 text-center text-sm ${isBestFn(v, values) ? "font-bold text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/15" : ""}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
