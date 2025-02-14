// profileLogger.ts

const logProfileImage = (message: string, data: any) => {
    console.log(`[ProfileLogger] ${message}:`, data);
};

const logLoginProfileImage = (profileImage: string | null) => {
    logProfileImage('Login - Imagem de Perfil', profileImage);
};

const logProfileImageUpdate = (profileImage: string | null) => {
    logProfileImage('Atualização da Imagem de Perfil', profileImage);
};

export { logLoginProfileImage, logProfileImageUpdate };
