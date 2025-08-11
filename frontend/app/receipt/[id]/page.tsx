
import ReceiptDetail from './ReceiptDetail';

// 동적 라우팅을 위해 generateStaticParams 제거
// 클라이언트 사이드에서 데이터를 로드하므로 정적 생성이 필요하지 않음

export default function ReceiptPage({ params }: { params: { id: string } }) {
  return <ReceiptDetail receiptId={params.id} />;
}
