import TripItineraryPage from './TripItineraryPage';

type PageProps = {
  params: Promise<{ tripId: string }>
}

export default async function Page({ params }: PageProps) {
  const { tripId } = await params;
  return <TripItineraryPage params={{ tripId }} />;
} 