export function InsuranceStatus({
  status,
  label,
  carrier,
  expiration,
}: {
  status: string
  label: string
  carrier?: string | null
  expiration?: string | null
}) {
  const tone =
    status === "verified"
      ? "border-emerald-200 bg-emerald-50"
      : status === "expired" || status === "required"
        ? "border-amber-200 bg-amber-50"
        : "border-border bg-card"
  return (
    <div className={`rounded-xl border p-4 text-sm ${tone}`}>
      <h3 className="font-semibold">Renters insurance</h3>
      <p className="mt-1">{label}</p>
      {carrier ? <p className="text-muted-foreground">Carrier: {carrier}</p> : null}
      {expiration ? <p className="text-muted-foreground">Expires {expiration}</p> : null}
      {status === "required" ? (
        <p className="mt-2 text-muted-foreground">Upload proof on the documents step if this home requires coverage before move-in.</p>
      ) : null}
    </div>
  )
}
