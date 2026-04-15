import { useToast } from './Toast';

export default function ShareButton({ movie }) {
  const { addToast } = useToast();

  const handleShare = async (e) => {
    e?.stopPropagation();
    const url = `${window.location.origin}/movie/${movie.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: movie.title, text: movie.description, url });
        return;
      } catch { /* user cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(url);
      addToast('Link copied to clipboard!', 'success');
    } catch {
      addToast('Could not copy link', 'error');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/30 flex items-center justify-center transition-all hover:scale-110 hover:border-white/60 text-white"
      title="Share"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
}
