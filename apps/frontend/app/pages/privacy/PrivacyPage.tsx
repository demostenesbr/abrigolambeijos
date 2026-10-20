"use client";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
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
            Política de Privacidade
          </h2>
          <p className="text-sm text-[#D1C4E9]">
            Bem-vindo à página de Política de Privacidade do Abrigo Lambeijos.
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
            Política de Privacidade
          </h1>
          <p className="text-sm text-[#546E7A]">
            Bem-vindo à página de Política de Privacidade do Abrigo Lambeijos.
            Aqui você encontrará informações sobre como coletamos, usamos e
            protegemos seus dados pessoais.
          </p>
          <hr className="my-4 border-[#E0E0E0]" />
          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Coleta de Dados
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Coletamos informações pessoais que você nos fornece diretamente,
            como nome, e-mail e informações de contato. Também podemos coletar
            dados automaticamente através do uso do nosso site.
          </p>

          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Uso de Dados
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Utilizamos os dados coletados para fornecer e melhorar nossos
            serviços, comunicar atualizações importantes e personalizar sua
            experiência no site.
          </p>

          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Proteção de Dados
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Implementamos medidas de segurança para proteger suas informações
            pessoais contra acesso não autorizado, alteração, divulgação ou
            destruição.
          </p>

          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Compartilhamento de Dados
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Não compartilhamos suas informações pessoais com terceiros, exceto
            quando necessário para cumprir a lei ou proteger nossos direitos.
          </p>

          <h2 className="font-bold text-2xl text-[#263238] mb-2">
            Seus Direitos
          </h2>
          <p className="text-sm text-[#546E7A] mb-4">
            Você tem o direito de acessar, corrigir ou excluir suas informações
            pessoais. Para exercer esses direitos, entre em contato conosco
            através dos canais fornecidos no site.
          </p>
        </div>
      </div>
    </div>
  );
}
