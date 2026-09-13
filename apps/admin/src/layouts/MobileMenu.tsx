export default function MobileMenu() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-64">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="text-blue-500 hover:underline">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/pets" className="text-blue-500 hover:underline">
              Pets
            </a>
          </li>
          <li>
            <a href="/adopters" className="text-blue-500 hover:underline">
              Adotantes
            </a>
          </li>
          <li>
            <a
              href="/adoption-requests"
              className="text-blue-500 hover:underline"
            >
              Solicitações
            </a>
          </li>
          <li>
            <a href="/adoptions" className="text-blue-500 hover:underline">
              Adoções
            </a>
          </li>
          <li>
            <a href="/rescues" className="text-blue-500 hover:underline">
              Resgates
            </a>
          </li>
          <li>
            <a href="/donations" className="text-blue-500 hover:underline">
              Doações
            </a>
          </li>
          <li>
            <a
              href="/recommendations"
              className="text-blue-500 hover:underline"
            >
              Recomendações
            </a>
          </li>
          <li>
            <a href="/partners" className="text-blue-500 hover:underline">
              Parceiros
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
