'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactElement, MouseEvent } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
  title?: string;
  initialRating?: number;
  initialText?: string;
  mode?: 'create' | 'edit';
  remainingEdits?: number; // 편집 가능 횟수(남은)
}

export default function ReviewModal({ isOpen, onClose, onSubmit, title, initialRating, initialText, mode = 'create', remainingEdits }: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const [text, setText] = useState(initialText ?? '');

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating ?? 0);
      setText(initialText ?? '');
    }
  }, [isOpen, initialRating, initialText]);

  if (!isOpen) return null;

  const currentRating = Math.round(((hover ?? rating)) * 2) / 2;

  const renderStars = () => {
    const stars = [] as ReactElement[];
    const value = hover ?? rating;
    // 5 stars, allow half increments by mouse position (left half = .5)
    for (let i = 1; i <= 5; i++) {
      const fullThreshold = i;
      const halfThreshold = i - 0.5;
      const isFull = value >= fullThreshold;
      const isHalf = !isFull && value >= halfThreshold;

      const handlePositionalSet = (e: MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeftHalf = e.clientX - rect.left < rect.width / 2;
        return isLeftHalf ? i - 0.5 : i;
      };

      stars.push(
        <button
          key={i}
          type="button"
          aria-label={`${i}번째 별`}
          onMouseEnter={(e) => setHover(handlePositionalSet(e))}
          onMouseMove={(e) => setHover(handlePositionalSet(e))}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => setRating(handlePositionalSet(e))}
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
          <h3 className="font-bold text-gray-900">{title || (mode === 'edit' ? '리뷰 수정' : '리뷰 작성')}</h3>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose}>
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">{renderStars()}</div>
            {currentRating > 0 && (
              <span className="text-sm text-gray-700">선택 {currentRating.toFixed(1)}점</span>
            )}
            <span className="text-sm text-gray-500">만점 5점</span>
          </div>
          {mode === 'edit' && (
            <div className="text-xs text-gray-500">남은 수정 횟수: {Math.max(0, (remainingEdits ?? 2))}회</div>
          )}
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
            disabled={(hover ?? rating) < 0.5 || (mode === 'edit' && (remainingEdits ?? 2) <= 0)}
          >
            {mode === 'edit' ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}


