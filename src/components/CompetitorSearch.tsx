// src/components/CompetitorSearch.tsx
import React, { useState } from 'react';

const CompetitorSearch: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<string[]>([]); // Exemplo de resultado de pesquisa

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulação de pesquisa - adicionar lógica de pesquisa real
        setResults([`Resultado de pesquisa para: ${query}`]);
    };

    return (
        <div className="competitor-search">
            <h3>Pesquisa de Anúncios de Concorrentes</h3>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite o nome do concorrente"
                />
                <button type="submit">Pesquisar</button>
            </form>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
};

export default CompetitorSearch;
