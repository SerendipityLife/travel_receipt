'use client';

import { useState } from 'react';

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  destination: string;
  title: string;
  content: string;
  rating: number;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  date: string;
  images: string[];
  isLiked: boolean;
}

export default function ReviewsAndTips() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('popular');

  const categories = ['전체', '꿀팁', '맛집', '쇼핑', '교통', '숙박', '관광'];

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: '여행러버',
      userAvatar: '#3B82F6',
      destination: '도쿄',
      title: '돈키호테에서 꼭 사야할 아이템 BEST 5',
      content: '돈키호테 갈 때마다 뭘 사야 할지 고민이었는데, 이번에 정말 유용한 아이템들을 발견했어요! 1. 키트카이 마차맛 - 한국에 없는 맛이라 선물용으로 최고 2. 일본 화장품 샘플 세트...',
      rating: 5,
      likes: 247,
      comments: 32,
      category: '쇼핑',
      tags: ['돈키호테', '쇼핑', '기념품'],
      date: '2024-11-15',
      images: ['https://readdy.ai/api/search-image?query=Don%20Quijote%20store%20interior%20Japan%20discount%20chain%20store%20shopping%20aisles%20products%20shelves%20realistic%20photography&width=300&height=200&seq=24&orientation=landscape'],
      isLiked: false
    },
    {
      id: 2,
      userName: '도쿄맛집탐방',
      userAvatar: '#EC4899',
      destination: '도쿄',
      title: '현지인만 아는 신주쿠 숨은 맛집',
      content: '관광객들이 잘 모르는 신주쿠의 진짜 맛집을 소개합니다. 골목 안쪽에 있어서 찾기 어려워도 정말 맛있어요. 라멘은 물론이고 사이드 메뉴도 일품이에요...',
      rating: 5,
      likes: 189,
      comments: 28,
      category: '맛집',
      tags: ['신주쿠', '라멘', '현지맛집'],
      date: '2024-11-14',
      images: ['https://readdy.ai/api/search-image?query=Japanese%20ramen%20shop%20small%20local%20restaurant%20Shinjuku%20Tokyo%20authentic%20interior%20realistic%20photography&width=300&height=200&seq=25&orientation=landscape'],
      isLiked: true
    },
    {
      id: 3,
      userName: '절약여행가',
      userAvatar: '#10B981',
      destination: '오사카',
      title: '오사카 교통비 절약하는 꿀팁 3가지',
      content: '오사카 여행에서 교통비가 꽤 나와서 고민이었는데, 이 방법들로 30% 이상 절약했어요! 1. 오사카 어메이징 패스 활용법 2. 도보 + 지하철 조합 루트 3. 무료 셔틀버스 정보...',
      rating: 4,
      likes: 156,
      comments: 19,
      category: '교통',
      tags: ['오사카', '교통', '절약'],
      date: '2024-11-13',
      images: ['https://readdy.ai/api/search-image?query=Osaka%20public%20transportation%20subway%20train%20station%20Japan%20city%20travel%20realistic%20photography&width=300&height=200&seq=26&orientation=landscape'],
      isLiked: false
    },
    {
      id: 4,
      userName: '화장품덕후',
      userAvatar: '#8B5CF6',
      destination: '도쿄',
      title: '마츠키요에서 놓치면 안되는 화장품',
      content: '일본 드럭스토어 중에서 마츠모토키요시가 제일 좋은 것 같아요. 특히 이 제품들은 정말 추천! 시세이도 선크림은 한국 가격의 절반이고, 로트 마스크팩도...',
      rating: 5,
      likes: 143,
      comments: 24,
      category: '쇼핑',
      tags: ['마츠키요', '화장품', '드럭스토어'],
      date: '2024-11-12',
      images: ['https://readdy.ai/api/search-image?query=Matsumoto%20Kiyoshi%20cosmetics%20section%20Japanese%20drugstore%20beauty%20products%20shelves%20realistic%20photography&width=300&height=200&seq=27&orientation=landscape'],
      isLiked: false
    },
    {
      id: 5,
      userName: '가성비여행',
      userAvatar: '#F97316',
      destination: '오사카',
      title: '도톤보리 무료 체험 스팟 총정리',
      content: '도톤보리에서 돈 안쓰고도 충분히 즐길 수 있는 곳들이 많아요! 글리코 사인 앞에서 사진찍기, 무료 족욕 카페, 강변 산책로 등 알려드릴게요...',
      rating: 4,
      likes: 128,
      comments: 15,
      category: '관광',
      tags: ['도톤보리', '무료체험', '가성비'],
      date: '2024-11-11',
      images: ['https://readdy.ai/api/search-image?query=Dotonbori%20Osaka%20Japan%20neon%20lights%20canal%20Glico%20sign%20tourism%20night%20scene%20realistic%20photography&width=300&height=200&seq=28&orientation=landscape'],
      isLiked: true
    }
  ]);

  const filteredReviews = reviews.filter(review => 
    selectedCategory === '전체' || review.category === selectedCategory
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleLike = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            isLiked: !review.isLiked,
            likes: review.isLiked ? review.likes - 1 : review.likes + 1
          }
        : review
    ));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`${i < rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-300'}`}
        ></i>
      );
    }
    return stars;
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'recent': return '최신순';
      case 'popular': return '인기순';
      case 'rating': return '평점순';
      default: return '인기순';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedCategory === category
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {filteredReviews.length}개의 리뷰 & 팁
        </div>
        <div className="flex gap-2">
          {(['popular', 'recent', 'rating'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors !rounded-button ${
                sortBy === sort
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getSortLabel(sort)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: review.userAvatar }}
              >
                {review.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {review.destination}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {review.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-600">{review.date}</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-2">{review.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.content}</p>

            {review.images.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-1 gap-2">
                  {review.images.map((image, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden">
                      <img 
                        src={image} 
                        alt={`리뷰 이미지 ${idx + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mb-4">
              {review.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(review.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors !rounded-button ${
                    review.isLiked 
                      ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${review.isLiked ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                  {review.likes}
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors !rounded-button">
                  <i className="ri-chat-3-line"></i>
                  {review.comments}
                </button>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors !rounded-button">
                <i className="ri-share-line"></i>
                공유
              </button>
            </div>
          </div>
        ))}

        {sortedReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-chat-3-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">해당 카테고리의 리뷰가 없습니다</h3>
            <p className="text-gray-500">다른 카테고리를 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}