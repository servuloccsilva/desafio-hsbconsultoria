import * as admin from "firebase-admin";
import * as path from "path";

let serviceAccount: any;

try {
  // Tenta carregar do arquivo
  const serviceAccountPath = path.join(
    __dirname,
    "../../serviceAccountKey.json",
  );
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  // Se falhar, usa variáveis de ambiente
  const { firebaseConfig } = require("./firebaseConfig");
  serviceAccount = firebaseConfig;
}

// Inicializar Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const EMPRESAS_COLLECTION = "empresas";

console.log("Firebase configurado com sucesso!");
