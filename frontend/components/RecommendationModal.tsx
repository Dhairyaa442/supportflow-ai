type Props = {
  open: boolean;
  recommendation: string;
  onClose: () => void;
};

export default function RecommendationModal({
  open,
  recommendation,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[600px] shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          AI Resolution Recommendation
        </h2>

        <p className="text-slate-300 leading-relaxed">
          {recommendation}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}