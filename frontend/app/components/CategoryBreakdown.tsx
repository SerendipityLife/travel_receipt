
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
    const radius = 45; // 꽉 찬 파이
    const centerX = 50;
    const centerY = 50;

    return (
      <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90">
        {categories.map((category, index) => {
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + category.percentage) / 100) * 360;
          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
          const startRad = (Math.PI / 180) * startAngle;
          const endRad = (Math.PI / 180) * endAngle;

          const startX = centerX + radius * Math.cos(startRad);
          const startY = centerY + radius * Math.sin(startRad);
          const endX = centerX + radius * Math.cos(endRad);
          const endY = centerY + radius * Math.sin(endRad);

          const midAngle = ((startAngle + endAngle) / 2) - 90;
          // 라벨을 조각 내부에 배치 (반지름의 62% 지점)
          const labelRadius = radius * 0.62;
          const labelX = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
          const labelY = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);

          const colorMap: { [key: string]: string } = {
            'bg-blue-500': '#3B82F6',
            'bg-green-500': '#10B981',
            'bg-pink-500': '#EC4899',
            'bg-purple-500': '#8B5CF6',
            'bg-orange-500': '#F97316',
            'bg-yellow-500': '#EAB308',
            'bg-red-500': '#EF4444'
          };

          const pathD = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

          cumulativePercentage += category.percentage;

          return (
            <g key={index}>
              <path d={pathD} fill={colorMap[category.color] || '#6B7280'} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }} />
              {category.percentage >= 3 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-extrabold fill-white"
                  style={{ transform: 'rotate(90deg)', transformOrigin: `${labelX}px ${labelY}px`, paintOrder: 'stroke fill', stroke: '#111827', strokeWidth: 1.2 }}
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
            </div>
          </div>

          {/* 카테고리 목록 */}
          <div className="flex-1 space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full ${category.color} shadow-sm flex-shrink-0`}></div>
                  <span className="text-gray-700 font-medium text-xs leading-tight truncate">{category.name}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-bold text-gray-900 text-xs leading-tight break-words">₩{category.amount.toLocaleString()}</div>
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
