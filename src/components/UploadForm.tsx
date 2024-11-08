// src/components/UploadForm.tsx
import React, { useState } from 'react';

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files ? e.target.files[0] : null;
        setFile(uploadedFile);
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            console.log("Arquivo para upload:", file);
            // Implementar lógica de upload aqui
        }
    };

    return (
        <div className="upload-form">
            <h3>Upload de Criativos</h3>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadForm;
