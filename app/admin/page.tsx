'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import FiguresList from '@/components/admin/FiguresList';
import FigureDetail from '@/components/admin/FigureDetail';
import FigureEditor from '@/components/admin/FigureEditor';
import type { Figure } from '@/lib/types';
import { getFigureById } from '@/lib/firebase/firestore';

type AdminView = 'list' | 'detail' | 'add';

const ADMIN_EMAILS = ['gargibala1@gmail.com'];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [view, setView] = useState<AdminView>('list');
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, authLoading, isAdmin, router]);

  const handleSelectFigure = (figure: Figure) => {
    setSelectedFigure(figure);
    setView('detail');
  };

  const handleAddFigure = () => {
    setSelectedFigure(null);
    setView('add');
  };

  const handleBack = () => {
    setSelectedFigure(null);
    setView('list');
  };

  const handleFigureSaved = () => {
    setView('list');
    setRefreshKey((k) => k + 1);
  };

  const handleFigureUpdated = async () => {
    // Reload the figure data
    if (selectedFigure) {
      const updated = await getFigureById(selectedFigure.id);
      if (updated) {
        setSelectedFigure(updated);
      }
    }
    setRefreshKey((k) => k + 1);
  };

  const handleFigureDeleted = () => {
    setSelectedFigure(null);
    setView('list');
    setRefreshKey((k) => k + 1);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-[#536471] dark:text-[#71767b]">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  // Don't render if not logged in or not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout
      title={
        view === 'detail' && selectedFigure
          ? selectedFigure.displayName
          : 'Admin Dashboard'
      }
    >
      {view === 'list' && (
        <FiguresList
          key={refreshKey}
          onSelectFigure={handleSelectFigure}
          onAddFigure={handleAddFigure}
        />
      )}

      {view === 'detail' && selectedFigure && (
        <FigureDetail
          figure={selectedFigure}
          onBack={handleBack}
          onFigureUpdated={handleFigureUpdated}
          onFigureDeleted={handleFigureDeleted}
        />
      )}

      {view === 'add' && (
        <FigureEditor
          onClose={handleBack}
          onSaved={handleFigureSaved}
        />
      )}
    </AdminLayout>
  );
}
