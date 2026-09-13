import TenantMessagesView from '@/components/tenant/messages-view';
import { pageTitle } from "@/lib/site"

export const metadata = { title: pageTitle('Messages | Ondo Real Estate') };

export default function TenantMessagesPage() {
  return <TenantMessagesView />;
}
