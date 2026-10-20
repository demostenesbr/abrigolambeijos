"use client";
import Image from "next/image";

export default function TermsPage() {
    return (
     <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A1033 0%, #4D246A 100%)",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=900&fit=crop&auto=format"
          alt="Animal feliz"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          width={800}
          height={900}
          loading="eager"
        />
        <div className="relative z-10">
          <h2 className="text-3xl text-[#EDE7F6] font-bold">
            Abrigo Lambeijos
          </h2>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl text-white font-bold leading-snug">
            Termos de Serviço
          </h2>
          <p className="text-sm text-[#D1C4E9]">
            Bem-vindo à página de Termos de Serviço do Abrigo Lambeijos.
          </p>
        </div>
        <div className="relative z-10 text-xs text-[#546E7A]">
          Grátis para sempre para tutores e protetores
        </div>
      </div>
      {/* Right panel */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 bg-[#FFF8F0]">
        <div className="w-full max-w-prose">
          <h1 className="font-bold text-4xl text-[#263238] mb-4">
            Termos de Serviço
          </h1>
          <p className="text-sm text-[#546E7A]">
            Bem-vindo à página de Termos de Serviço do Abrigo Lambeijos.
            Aqui você encontrará informações sobre as regras e condições de uso do nosso site.
          </p>
          <hr className="my-4 border-[#E0E0E0]" />
          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Aceitação dos Termos
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Ao utilizar nosso site, você concorda com os termos e condições descritos nesta página. Se você não concordar com algum dos termos, por favor, não utilize nosso site.
          </p>
          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Modificações dos Termos
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. Recomendamos que você revise os termos periodicamente.
          </p>
          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Limitação de Responsabilidade
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            O Abrigo Lambeijos não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso do nosso site. O uso do site é de sua própria responsabilidade.
          </p>
        </div>
      </div>
    </div>
  );
}
