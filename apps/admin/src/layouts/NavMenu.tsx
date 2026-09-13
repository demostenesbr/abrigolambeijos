export default function NavMenu() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <a href="/dashboard" className="text-white hover:text-gray-300">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/pets" className="text-white hover:text-gray-300">
            Pets
          </a>
        </li>
        <li>
          <a href="/adopters" className="text-white hover:text-gray-300">
            Adotantes
          </a>
        </li>
        <li>
          <a
            href="/adoption-requests"
            className="text-white hover:text-gray-300"
          >
            Solicitações
          </a>
        </li>
        <li>
          <a href="/adoptions" className="text-white hover:text-gray-300">
            Adoções
          </a>
        </li>
        <li>
          <a href="/rescues" className="text-white hover:text-gray-300">
            Resgates
          </a>
        </li>
        <li>
          <a href="/donations" className="text-white hover:text-gray-300">
            Doações
          </a>
        </li>
        <li>
          <a href="/recommendations" className="text-white hover:text-gray-300">
            Recomendações
          </a>
        </li>
        <li>
          <a href="/partners" className="text-white hover:text-gray-300">
            Parceiros
          </a>
        </li>
      </ul>
    </nav>
  );
}
