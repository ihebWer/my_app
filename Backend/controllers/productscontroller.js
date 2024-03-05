const Product = require("../models/Products");

module.exports = {
   // Fonction pour créer un nouveau produit.
  createProduct: async (req, res) => {
     // Création d'une nouvelle instance de produit avec les données reçues.
    const newProduct = new Product(req.body);
    try {
       // Tentative de sauvegarde du nouveau produit dans la base de données.
      await newProduct.save();
       // Si la sauvegarde est réussie, renvoie une réponse positive.
      res.status(200).json("Product created successfully");
    } catch (error) {
      res.status(500).json("failed to created a Product ");
    }
  },

  // Fonction pour récupérer tous les produits.
  getAllProduct: async (req, res) => {
    try {
      // Récupère tous les produits et les trie par date de création décroissante.
      const products = await Product.find().sort({ createdAt: -1 });
      // Renvoie la liste des produits avec une réponse positive.
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("failed to get the Products ");
    }
  },

  // Fonction pour récupérer un produit spécifique par son ID.
  getProduct: async (req, res) => {
    try {
      // Récupère le produit par son ID.
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json("failed to get the Product ");
    }
  },

  // Fonction pour rechercher des produits en fonction d'un mot-clé.
  searchProduct: async (req, res) => {
    try {
       // Utilise l'agrégation MongoDB pour rechercher des produits correspondant au mot-clé.
      const result = await Product.aggregate([
        {
          $search: {
            index: "index", // Spécifie l'index à utiliser pour la recherche.
            text: {
              query: req.params.key, // Le mot-clé de recherche.
              path: {
                wildcard: "*", // Recherche dans tous les champs textuels.
              },
            },
          },
        },
      ]);
       // Renvoie les résultats de la recherche avec une réponse positive.
      res.status(200).json(result);
    } catch (error) {
       // En cas d'erreur, renvoie une réponse d'erreur.
      res.status(500).json("failed to get the Products ");
    }
  },
};
