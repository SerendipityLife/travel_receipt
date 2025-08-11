
import ReceiptDetail from './ReceiptDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ReceiptPage({ params }: { params: { id: string } }) {
  return <ReceiptDetail receiptId={params.id} />;
}
