import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
const published = "2025-12-10";
const modified = "2025-12-10";
const slug = "/blog/designing-property-owner-portal";
const title = "Designing a Property Owner Portal: Managing Assets at Scale";
const description = "How we built a comprehensive dashboard for landlords to track performance, manage tenants, and organize documents.";
const author = "Product Team";

const keywords = [
  "Property Management Dashboard",
  "Landlord Software",
  "React Dashboard Design",
  "Real Estate Asset Management",
  "Tenant Portal"
];

export const metadata = articleMetadata({
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  keywords,
  category: "Product",
})

export default function DesigningPropertyOwnerPortal() {
  return (
    <ArticleShell
      meta={{
        path: slug,
        title,
        description,
        published,
        modified,
        author,
        keywords,
        category: "Product",
        bannerSubtitle: "Moving from spreadsheets to a unified digital command center.",
      }}
    >
{/* Gestalt: quick scan anchors */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Audience" body="Landlords and operators who need one command center." />
            <CardSpot title="Promise" body="See financials, maintenance, and documents without tab sprawl." />
            <CardSpot title="Outcome" body="Move from reactive to proactive management with clear signals." />
          </div>

            <p className="lead text-xl text-foreground/70 mb-8">
              For landlords, transparency is everything. The <strong>Ondo Owner Dashboard</strong> was designed to replace the mess of spreadsheets and emails with a single, secure command center.
            </p>

            <h2>Architecture of the Dashboard</h2>
            <p>
              Located in <code>app/owner/</code> and <code>components/owner/</code>, the dashboard is a secure route protected by Supabase Auth. It aggregates data from three primary sources:
            </p>
            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Security frame" detail="Supabase Auth + RLS keep each owner isolated by portfolio." />
              <KeyLine title="Information scent" detail="Financials, maintenance, and documents are grouped to reduce search cost." />
            </div>
            <ol>
              <li><strong>Financials</strong>: Rent rolls and expense tracking.</li>
              <li><strong>Maintenance</strong>: Active work orders and vendor communications.</li>
              <li><strong>Documents</strong>: Leases, contracts, and inspections.</li>
            </ol>

            <h2>Visualizing Performance</h2>
            <p>
              We built the <code>PropertyPerformanceChart</code> and <code>IncomeExpenseChart</code> to give owners an instant &quot;health check&quot; of their portfolio.
            </p>
            <ul>
              <li><strong>Occupancy Rates</strong>: visualized over time.</li>
              <li><strong>Net Operating Income (NOI)</strong>: Monthly tracking of revenue vs. repairs.</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <CardSpot title="Signal density" body="Charts sit near actions so owners can react immediately." />
              <CardSpot title="Trend clarity" body="NOI and occupancy live in consistent axes to avoid re-interpretation." />
            </div>

            <h2>Streamlining Operations</h2>
            <p>
              The dashboard isn't just for viewing data; it's for taking action.
            </p>
            <ul>
              <li><strong><code>AddTenantDialog</code></strong>: A streamlined wizard for onboarding new residents.</li>
              <li><strong><code>MaintenanceManagement</code></strong>: A ticket system that allows owners to approve repairs and chat with property managers directly.</li>
              <li><strong><code>DocumentsView</code></strong>: A digital filing cabinet where owners can upload/download leases (<code>add-document-dialog.tsx</code>), ensuring nothing gets lost.</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
              <KeyLine title="Action proximity" detail="Tasks live beside the data they affect, reducing context-switching." />
              <KeyLine title="Recoverability" detail="Document uploads + audit trails keep decisions traceable." />
              <KeyLine title="Speed" detail="Dialogs keep users in flow instead of navigating away." />
            </div>

            <h2>Tenant Communication</h2>
            <p>
              Communication is central to retention. Our <code>MessagesView</code> component enables threaded conversations between owners (or managers) and tenants, keeping all correspondence in a legal audit trail rather than scattered SMS messages.
            </p>

            <h2>Conclusion</h2>
            <p>
              The Ondo Owner Portal empowers landlords to move from &quot;reactive&quot; to &quot;proactive&quot; management. By centralizing data and communication, we help owners maximize the ROI we calculated for them in the buying stage.
            </p>

            <hr className="my-12 border-border" />

            <h3>FAQ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg">Q: Is my financial data secure?</h4>
                <p>A: Yes, all data is protected by Supabase Row Level Security (RLS), ensuring you can only see assets you own or manage.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: Can I manage multiple properties?</h4>
                <p>A: Absolutely. The <code>PropertiesView</code> is designed to handle portfolios ranging from a single condo to multi-family complexes.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-0">
                The Ondo Owner Portal is a React-based dashboard designed for comprehensive property asset management. It features modules for Financial Tracking (income/expense charts), Maintenance Management (ticketing system), and Document Storage (digital lease repository). Built on Supabase, it enforces strict data privacy via Row Level Security. The dashboard enables landlords to manage tenants, approve repairs, and visualize portfolio performance through interactive charts, replacing disparate manual tools with a unified digital experience.
              </p>
            </div>
          
    </ArticleShell>
  )
}

function CardSpot({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-primary mb-1">{title}</p>
      <p className="text-sm text-foreground">{body}</p>
    </div>
  );
}

function KeyLine({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/60 px-4 py-3 h-full">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm text-foreground/70">{detail}</p>
    </div>
  );
}
