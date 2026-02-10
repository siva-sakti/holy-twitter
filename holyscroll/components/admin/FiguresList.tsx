'use client';

import { useState, useEffect } from 'react';
import { IoAdd, IoPencil, IoDocumentText } from 'react-icons/io5';
import type { Figure } from '@/lib/types';
import { getFigures, getQuoteCountsForFigures } from '@/lib/firebase/firestore';

interface FiguresListProps {
  onSelectFigure: (figure: Figure) => void;
  onAddFigure: () => void;
}

export default function FiguresList({
  onSelectFigure,
  onAddFigure,
}: FiguresListProps) {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [quoteCounts, setQuoteCounts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const figuresData = await getFigures();
      setFigures(figuresData);

      const figureIds = figuresData.map((f) => f.id);
      const counts = await getQuoteCountsForFigures(figureIds);
      setQuoteCounts(counts);
    } catch (err) {
      console.error('Error loading figures:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#536471] dark:text-[#71767b]">Loading figures...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#16181c] rounded-xl border border-[#eff3f4] dark:border-[#2f3336]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#eff3f4] dark:border-[#2f3336] flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#0f1419] dark:text-[#e7e9ea]">
          Figures ({figures.length})
        </h2>
        <button
          onClick={onAddFigure}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f1419] dark:bg-[#eff3f4] text-white dark:text-[#0f1419] text-[14px] font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          <IoAdd className="w-4 h-4" />
          Add Figure
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[13px] text-[#536471] dark:text-[#71767b] border-b border-[#eff3f4] dark:border-[#2f3336]">
              <th className="px-4 py-3 font-medium">Figure</th>
              <th className="px-4 py-3 font-medium">Tradition</th>
              <th className="px-4 py-3 font-medium text-center">Quotes</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {figures.map((figure) => (
              <tr
                key={figure.id}
                className="border-b border-[#eff3f4] dark:border-[#2f3336] last:border-b-0 hover:bg-[#f7f9f9] dark:hover:bg-[#1d1f23] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={figure.profilePicUrl || '/default-avatar.png'}
                      alt={figure.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[15px] font-medium text-[#0f1419] dark:text-[#e7e9ea]">
                        {figure.displayName}
                      </p>
                      <p className="text-[13px] text-[#536471] dark:text-[#71767b]">
                        @{figure.handle || figure.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[14px] text-[#536471] dark:text-[#71767b]">
                    {figure.tradition}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[14px] text-[#0f1419] dark:text-[#e7e9ea]">
                    {quoteCounts.get(figure.id) || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelectFigure(figure)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#536471] dark:text-[#71767b] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] hover:bg-[#eff3f4] dark:hover:bg-[#2f3336] rounded-lg transition-colors"
                    >
                      <IoPencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onSelectFigure(figure)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#536471] dark:text-[#71767b] hover:text-[#0f1419] dark:hover:text-[#e7e9ea] hover:bg-[#eff3f4] dark:hover:bg-[#2f3336] rounded-lg transition-colors"
                    >
                      <IoDocumentText className="w-3.5 h-3.5" />
                      Quotes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {figures.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-[15px] text-[#536471] dark:text-[#71767b]">
            No figures yet. Add your first figure to get started.
          </p>
        </div>
      )}
    </div>
  );
}
