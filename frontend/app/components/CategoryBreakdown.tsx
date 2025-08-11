
'use client';

interface Category {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface CategoryBreakdownProps {
  categories: Category[];
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);

  const createPieChart = () => {
    if (categories.length === 0) return null;

    let cumulativePercentage = 0;
    const radius = 38;
    const strokeWidth = 12;
    const centerX = 50;
    const centerY = 50;

    return (
      <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90">
        {/* 배경 원 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />

        {categories.map((category, index) => {
          const circumference = 2 * Math.PI * radius;
          const strokeDasharray = circumference;
          const strokeDashoffset = circumference - (category.percentage / 100) * circumference;
          const rotation = (cumulativePercentage / 100) * 360;

          // 퍼센티지 텍스트 위치 계산 (섹션 중앙)
          const midAngle = ((cumulativePercentage + category.percentage / 2) / 100) * 360 - 90;
          const textRadius = radius - strokeWidth / 4; // 섹션 중앙에 위치하도록 조정
          const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
          const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);

          const colorMap: { [key: string]: string } = {
            'bg-blue-500': '#3B82F6',
            'bg-green-500': '#10B981',
            'bg-pink-500': '#EC4899',
            'bg-purple-500': '#8B5CF6',
            'bg-orange-500': '#F97316',
            'bg-yellow-500': '#EAB308',
            'bg-red-500': '#EF4444'
          };

          cumulativePercentage += category.percentage;

          return (
            <g key={index}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={colorMap[category.color] || '#6B7280'}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transformOrigin: '50% 50%',
                  transform: `rotate(${rotation}deg)`,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
              {/* 퍼센티지 표시 (5% 이상인 경우만) */}
              {category.percentage >= 5 && (
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-bold fill-white drop-shadow-sm"
                  style={{ transform: 'rotate(90deg)', transformOrigin: `${textX}px ${textY}px` }}
                >
                  {Math.round(category.percentage)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">카테고리별 지출</h3>

      {categories.length > 0 ? (
        <div className="flex items-start gap-6">
          {/* 원형 그래프 */}
          <div className="flex-shrink-0">
            <div className="relative">
              {createPieChart()}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-sm">
                  <div>
                    <div className="text-[10px] text-gray-600 font-medium">총 지출</div>
                    <div className="text-xs font-bold text-gray-900">
                      ₩{totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 카테고리 목록 */}
          <div className="flex-1 space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color} shadow-sm`}></div>
                  <span className="text-gray-700 font-medium text-sm">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">₩{category.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="ri-pie-chart-line text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-500 text-sm">아직 지출 기록이 없습니다</p>
        </div>
      )}
    </div>
  );
}
