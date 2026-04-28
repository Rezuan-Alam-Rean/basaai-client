import { ListingDetailPage } from "@/app/pages/listing-detail";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  return <ListingDetailPage key={id} />;
}
