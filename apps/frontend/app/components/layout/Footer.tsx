import Link from "next/link";
import Image from "next/image";
import Logo from "./../../assets/abrigo-lambeijos.png";

export default function Footer() {
  return (
    <footer className="bg-[#1A1033] text-[#D1C4E9] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">
              {" "}
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </span>
            <span className="font-semibold text-[#EDE7F6] text-xl">
              Abrigo Lambeijos
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#78909C]">
            Conectando animais que precisam de amor com famílias prontas para
            amar.
          </p>
          <div className="flex gap-3 mt-6">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#documentation-icon"></use>
            </svg>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#EDE7F6] mb-4 text-sm uppercase tracking-wider">
            Navegação
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Início", "/"],
              ["Adotar", "/adotar"],
              ["Doar", "/doar"],
              ["Sobre nós", "/sobre-nos"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="hover:text-[#F28C28] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#EDE7F6] mb-4 text-sm uppercase tracking-wider">
            Ajuda
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Contato", "/contato"],
              ["Doações", "/doacoes"],
              ["Como adotar", "/adotar"],
              ["Animais perdidos", "/adotar"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="hover:text-[#F28C28] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#EDE7F6] mb-4 text-sm uppercase tracking-wider">
            Contato
          </h4>
          <ul className="space-y-2 text-sm text-[#78909C]">
            <li>contato@abrigolambeijos.com.br</li>
            <li>(11) 3456-9999</li>
            <li>
              Rua Santo Amaro, 999
              <br />
              São Paulo, SP
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#2D1B4E] py-6 text-center text-xs text-[#546E7A]">
        © 2026 Abrigo Lambeijos. Todos os direitos reservados. Feito com ❤️ por
        quem ama animais.
      </div>
    </footer>
  );
}
