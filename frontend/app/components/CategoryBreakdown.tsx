
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">카테고리별 지출</h3>

      {categories.length > 0 ? (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded-full ${category.color} shadow-sm flex-shrink-0`}></div>
                <span className="text-gray-700 font-medium text-sm leading-tight truncate">{category.name}</span>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-gray-900 text-sm leading-tight break-words">₩{category.amount.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs leading-tight">{Math.round(category.percentage)}%</div>
                </div>
              </div>
            </div>
          ))}
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
