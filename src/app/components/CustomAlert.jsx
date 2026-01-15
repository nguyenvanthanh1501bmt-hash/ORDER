export default function CustomAlert({ text }) {
  if (!text) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-24 pointer-events-none">
      <div className="rounded-xl bg-gray-900 px-6 py-3 shadow-xl animate-fade-in">
        <span className="text-sm font-medium text-white">
          {text}
        </span>
      </div>
    </div>
  )
}
