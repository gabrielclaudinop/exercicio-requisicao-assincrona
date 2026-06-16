"use client";

import { useState, KeyboardEvent } from "react";

export default function Page() {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    state: "",
    city: "",
  });
  const [hasError, setHasError] = useState(false);

  const fetchAddress = async () => {
    const padraoCep = /^\d{8}$/;
    
    const cleanCep = cep.replace(/\D/g, "");

    setAddress({ street: "", number: "", neighborhood: "", state: "", city: "" });

    if (!padraoCep.test(cleanCep)) {
      setHasError(true);
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();

      if (data.erro) {
        setHasError(true);
        return;
      }

      setHasError(false);
      setAddress((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        state: data.uf || "",
        city: data.localidade || "",
      }));
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchAddress();
    }
  };

  return (
    <div className="min-h-screen bg-[#80deea] font-sans flex justify-center items-center">
      <main className="bg-white p-[30px] w-11/12 md:w-[40%]">
        <form className="flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-2xl font-bold mb-4">Address</h2>

          <input
            type="text"
            id="cep"
            placeholder="CEP (somente números)"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-1/2 my-2.5 p-2.5 outline-none border transition-colors ${
              hasError
                ? "border-red-500 bg-red-500/10"
                : "border-gray-300 focus:border-gray-400"
            }`}
          />
          
          <div
            className={`w-1/2 text-[rgba(255,0,0,0.68)] -mt-[5px] text-sm ${
              hasError ? "block" : "hidden"
            }`}
          >
            O CEP informado é invalido.
          </div>

          <input
            type="text"
            id="street"
            placeholder="Rua"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-1/2 my-2.5 p-2.5 outline-none border border-gray-300"
          />
          <input
            type="text"
            id="number"
            placeholder="Número"
            value={address.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
            className="w-1/2 my-2.5 p-2.5 outline-none border border-gray-300"
          />
          <input
            type="text"
            id="neighborhood"
            placeholder="Bairro"
            value={address.neighborhood}
            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
            className="w-1/2 my-2.5 p-2.5 outline-none border border-gray-300"
          />
          <input
            type="text"
            id="state"
            placeholder="Estado"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="w-1/2 my-2.5 p-2.5 outline-none border border-gray-300"
          />
          <input
            type="text"
            id="city"
            placeholder="Cidade"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-1/2 my-2.5 p-2.5 outline-none border border-gray-300"
          />
        </form>
      </main>
    </div>
  );
}