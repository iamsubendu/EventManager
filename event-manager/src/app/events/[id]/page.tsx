import { EventDetailPageContent } from "@/components/events/event-detail-content";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  return <EventDetailPageContent eventId={id} />;
}
