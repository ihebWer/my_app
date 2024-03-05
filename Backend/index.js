const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

// Importation des routeurs pour différentes routes de l'API.
const productRouter = require('./routes/products');
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const cartRouter = require('./routes/cart')
const orderRoute = require('./routes/order')
// Définition du port par défaut.
const port = 3000;

// Configuration de dotenv pour permettre l'utilisation de variables d'environnement.
dotenv.config();

// Connexion à MongoDB en utilisant l'URL fournie dans le fichier .env.
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected")) // Confirmation de connexion réussie.
  .catch((err) => console.log(err));  // Log en cas d'erreur de connexion.

  // Configuration du middleware Express pour analyser le JSON et les URL encodées.
app.use(express.json({limit: '10mb'})); // Limite la taille des corps de requête JSON à 10MB.
app.use(express.urlencoded({limit: '10mb', extended: true})); // Permet d'analyser les URL encodées.

// Configuration des routeurs pour les différentes parties de l'API.
app.use('/api/products', productRouter) // Route pour les opérations liées aux produits.
app.use('/api/', authRouter) // Route pour l'authentification.
app.use('/api/users', userRouter) // Route pour les opérations liées aux utilisateurs.
app.use('/api/carts', cartRouter) // Route pour les opérations liées au panier.
app.use("/api/orders", orderRoute);

// Démarrage du serveur sur le port spécifié dans le fichier .env ou sur le port 3000 par défaut.
app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${process.env.PORT|| 3000}!`));


