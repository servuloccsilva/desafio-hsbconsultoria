import admin from "firebase-admin";
import path from "path";

// Importar as credenciais
const serviceAccount = require(
  path.join(__dirname, "../../serviceAccountKey.json"),
);

// Inicializar o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exportar o Firestore
export const db = admin.firestore();

// Nome da coleção
export const EMPRESAS_COLLECTION = "empresas";

console.log("Firebase conectado com sucesso!");
