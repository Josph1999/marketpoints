'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCardStore } from '@/store/useCardStore';
import CardDetail from '@/components/cards/CardDetail';

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { cards, deleteCard } = useCardStore();
  const [showDelete, setShowDelete] = useState(false);

  const card = cards.find((c) => c._id === id);

  if (!card) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Card not found</p>
          <button onClick={() => router.back()} className="text-white underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteCard(card._id);
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-14 left-6 z-50 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* More button */}
      <button
        onClick={() => setShowDelete(!showDelete)}
        className="absolute top-14 right-6 z-50 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        </svg>
      </button>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="absolute top-28 right-6 z-50 bg-[#1c1c1e] border border-white/10 rounded-2xl p-2 shadow-2xl">
          <button
            onClick={handleDelete}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition-colors w-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete card
          </button>
        </div>
      )}

      <CardDetail card={card} />
    </div>
  );
}
