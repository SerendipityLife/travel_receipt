'use client';

import { useState } from 'react';

interface RegionalItem {
  id: number;
  name: string;
  region: string;
  country: string;
  purchaseCount: number;
  averagePrice: number;
  popularStores: string[];
  uniqueScore: number;
  description: string;
  image: string;
}

interface RegionData {
  region: string;
  country: string;
  totalSpending: number;
  popularItems: RegionalItem[];
}

export default function RegionalItems() {
  const [selectedCountry, setSelectedCountry] = useState('일본');
  const [selectedRegion, setSelectedRegion] = useState('전체');

  const countries = ['일본', '태국', '한국', '중국', '베트남'];

  const [regionData] = useState<RegionData[]>([
    {
      region: '도쿄',
      country: '일본',
      totalSpending: 89200,
      popularItems: [
        {
          id: 1,
          name: '도쿄 바나나',
          region: '도쿄',
          country: '일본',
          purchaseCount: 1847,
          averagePrice: 1200,
          popularStores: ['도쿄역', '하네다공항'],
          uniqueScore: 95,
          description: '도쿄의 대표 기념품, 부드러운 카스테라와 커스터드',
          image: 'https://readdy.ai/api/search-image?query=Tokyo%20Banana%20Japanese%20souvenir%20sweet%20confectionery%20gift%20box%20yellow%20packaging%20realistic%20detailed%20product%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=19&orientation=squarish'
        },
        {
          id: 2,
          name: '시부야 스크램블 티셔츠',
          region: '도쿄',
          country: '일본',
          purchaseCount: 892,
          averagePrice: 2500,
          popularStores: ['시부야109', '언더커버'],
          uniqueScore: 87,
          description: '시부야 횡단보도를 모티브로 한 한정 디자인',
          image: 'https://readdy.ai/api/search-image?query=Shibuya%20crossing%20t-shirt%20Tokyo%20Japan%20souvenir%20clothing%20design%20street%20fashion%20realistic%20product%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=20&orientation=squarish'
        }
      ]
    },
    {
      region: '오사카',
      country: '일본',
      totalSpending: 76400,
      popularItems: [
        {
          id: 3,
          name: '오사카 타코야키 소스',
          region: '오사카',
          country: '일본',
          purchaseCount: 1234,
          averagePrice: 380,
          popularStores: ['도톤보리', '우메다'],
          uniqueScore: 92,
          description: '오사카 현지 맛을 집에서도, 진짜 타코야키 소스',
          image: 'https://readdy.ai/api/search-image?query=Osaka%20takoyaki%20sauce%20bottle%20Japanese%20condiment%20local%20specialty%20food%20product%20realistic%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=21&orientation=squarish'
        },
        {
          id: 4,
          name: '오사카성 모형',
          region: '오사카',
          country: '일본',
          purchaseCount: 567,
          averagePrice: 1800,
          popularStores: ['오사카성 매점', '기념품샵'],
          uniqueScore: 89,
          description: '정교하게 재현된 오사카성 미니어처',
          image: 'https://readdy.ai/api/search-image?query=Osaka%20castle%20miniature%20model%20Japanese%20historical%20architecture%20souvenir%20gift%20realistic%20detailed%20product%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=22&orientation=squarish'
        }
      ]
    },
    {
      region: '방콕',
      country: '태국',
      totalSpending: 54300,
      popularItems: [
        {
          id: 5,
          name: '태국 코코넛 오일',
          region: '방콕',
          country: '태국',
          purchaseCount: 743,
          averagePrice: 450,
          popularStores: ['채투착 시장', '세븐일레븐'],
          uniqueScore: 85,
          description: '100% 천연 코코넛 오일, 태국 현지에서 직접 제조',
          image: 'https://readdy.ai/api/search-image?query=Thai%20coconut%20oil%20natural%20organic%20beauty%20product%20glass%20bottle%20tropical%20ingredient%20realistic%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=23&orientation=squarish'
        }
      ]
    }
  ]);

  const filteredRegions = regionData.filter(region => region.country === selectedCountry);
  const regions = ['전체', ...filteredRegions.map(region => region.region)];

  const getRegionItems = () => {
    if (selectedRegion === '전체') {
      return filteredRegions.flatMap(region => region.popularItems);
    }
    const region = filteredRegions.find(region => region.region === selectedRegion);
    return region ? region.popularItems : [];
  };

  const items = getRegionItems().sort((a, b) => b.purchaseCount - a.purchaseCount);

  const getUniqueScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-100';
    if (score >= 80) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getUniqueScoreLabel = (score: number) => {
    if (score >= 90) return '초희귀';
    if (score >= 80) return '희귀';
    return '특별함';
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => {
              setSelectedCountry(country);
              setSelectedRegion('전체');
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedCountry === country
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedRegion === region
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <i className="ri-treasure-map-line text-2xl text-red-600"></i>
          <div>
            <h3 className="font-bold text-gray-900">지역별 특산품 랭킹</h3>
            <p className="text-sm text-gray-600">현지에서만 만날 수 있는 특별한 아이템들</p>
          </div>
        </div>
        
        {selectedRegion !== '전체' && (
          <div className="bg-white/60 rounded-lg p-3 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {selectedRegion} 지역 평균 지출
              </div>
              <div className="text-2xl font-bold text-red-600">
                ₩{filteredRegions.find(r => r.region === selectedRegion)?.totalSpending.toLocaleString() || '0'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        {items.length}개의 지역 특산품
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        {item.region}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getUniqueScoreColor(item.uniqueScore)}`}>
                        {getUniqueScoreLabel(item.uniqueScore)} {item.uniqueScore}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₩{item.averagePrice.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">평균 가격</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-shopping-cart-line text-gray-400"></i>
                    <span className="text-gray-600">구매 {item.purchaseCount.toLocaleString()}회</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs text-gray-500 mb-1">주요 판매처</div>
                  <div className="flex flex-wrap gap-1">
                    {item.popularStores.map((store, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {store}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-treasure-map-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">해당 지역의 특산품이 없습니다</h3>
            <p className="text-gray-500">다른 지역을 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}