import ItineraryBoardClient from './ItineraryBoardClient';

type PageProps = {
  params: Promise<{ tripId: string }>
}

export default async function ItineraryBoardPage({ params }: PageProps) {
  const { tripId } = await params;
  return <ItineraryBoardClient tripId={tripId} />;
} 