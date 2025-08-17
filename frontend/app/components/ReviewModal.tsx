'use client';

import { useEffect, useMemo, useState } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
  title?: string;
}

export default function ReviewModal({ isOpen, onClose, onSubmit, title }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderStars = () => {
    const stars = [] as JSX.Element[];
    const value = hover ?? rating;
    // 5 stars, allow half increments
    for (let i = 1; i <= 5; i++) {
      const fullThreshold = i;
      const halfThreshold = i - 0.5;
      const isFull = value >= fullThreshold;
      const isHalf = !isFull && value >= halfThreshold;
      stars.push(
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onClick={() => setRating(i)}
          className="text-2xl"
        >
          {isFull ? (
            <i className="ri-star-fill text-yellow-400"></i>
          ) : isHalf ? (
            <i className="ri-star-half-fill text-yellow-400"></i>
          ) : (
            <i className="ri-star-line text-gray-300"></i>
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">{title || '리뷰 작성'}</h3>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose}>
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">{renderStars()}</div>
          <div className="text-xs text-gray-500">최소 반개 ~ 최대 다섯 개</div>
        </div>
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 100))}
            placeholder="100자 이내로 작성해주세요"
            className="w-full border border-gray-200 rounded-lg p-3 text-sm h-28 resize-none"
          />
          <div className="text-right text-xs text-gray-500 mt-1">{text.length}/100</div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-2 rounded-lg border" onClick={onClose}>취소</button>
          <button
            className="px-3 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300"
            onClick={() => onSubmit(Math.max(0.5, Math.round((hover ?? rating) * 2) / 2), text)}
            disabled={(hover ?? rating) < 0.5}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}


