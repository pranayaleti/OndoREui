import { LICENSING_LIVE, NMLS_CONSUMER_ACCESS_URL, SITE_COMPANY_NMLS_ID, SITE_LOAN_OFFICER } from "@/lib/site"

type LoanOfficerLineProps = {
  className?: string
  live?: boolean
  companyId?: string
}

/**
 * "Loan officer: name, NMLS #id". Once licensing is live and the owner has supplied the
 * sponsoring company's NMLS ID, the company ID is shown beside the officer's and NMLS
 * Consumer Access is linked. Until then it prints the individual line only.
 */
export function LoanOfficerLine({
  className = "mt-2 text-sm text-muted-foreground",
  live = LICENSING_LIVE,
  companyId = SITE_COMPANY_NMLS_ID,
}: LoanOfficerLineProps) {
  const showCompany = live && companyId.length > 0
  return (
    <p className={className}>
      Loan officer: {SITE_LOAN_OFFICER.name}, NMLS #{SITE_LOAN_OFFICER.nmlsId}
      {showCompany ? (
        <>
          . Company NMLS #{companyId}.{" "}
          <a
            href={NMLS_CONSUMER_ACCESS_URL}
            className="font-medium text-primary underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            NMLS Consumer Access
          </a>
        </>
      ) : null}
    </p>
  )
}
