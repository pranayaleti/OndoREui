import MessagesView from '@/components/owner/messages-view';
import { pageTitle } from "@/lib/site"

export const metadata = { title: pageTitle('Messages | Ondo Real Estate') };

export default function MessagesPage() {
  return <MessagesView />;
}
