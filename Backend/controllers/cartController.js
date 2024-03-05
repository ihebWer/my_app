const Cart = require('../models/Cart');
const Product = require('../models/Products');



module.exports = {
  // Ajoute un produit au panier ou met à jour sa quantité si déjà présent
  addCart: async(req, res) => {
    const userId = req.user.id;
    const {cartItem, quantity} = (req.body);
    let count;

    try {
      // Vérifie si le produit existe déjà dans le panier de cet utilisateur
      const existingProduct = await Cart.findOne({userId, cartItem});

      if (existingProduct) {
         // Si le produit existe déjà, incrémente simplement sa quantité
        existingProduct.quantity += 1;
        await existingProduct.save();
      }else{
        // Sinon, crée une nouvelle entrée dans le panier pour ce produit
        const newCartEntry = new Cart({ // Sauvegarde la nouvelle entrée dans le panier
          userId: userId,
          cartItem: cartItem,
          quantity: req.body.quantity
        });
        await newCartEntry.save();
      }
      // Compte le nombre total d'articles dans le panier de l'utilisateur
      count = await Cart.countDocuments({userId: req.user.id});
       // Renvoie une réponse positive avec le nombre d'articles
      res.status(201).json({status: true, message:"Product added to cart successfully",
    count: count});
      
    } catch (error) {
      // En cas d'erreur, renvoie une réponse d'erreur
      res.status(500).json({status: false, message: "Failed to add product to cart"});
    }
  },


   // Récupère le contenu du panier de l'utilisateur
  getcart: async(req, res) => {

    try {
      // Recherche tous les articles dans le panier de l'utilisateur et les enrichit avec les détails du produit
      const cart = await Cart.find({ userId: req.user.id }).populate({
        path: 'cartItem',
        select : "title imageUrl price supplier"
      });
      res.status(200).json(cart);
    } catch (error) {
       // En cas d'erreur, renvoie une réponse d'erreur
      res.status(500).json({ status: false, message: "Failed to get cart" });
      
    }
  },


  // Diminue la quantité d'un article dans le panier ou le supprime si la quantité est 1
  decrementCartItem: async (req, res) => {
    let count;
    try {
      const cartItemId = req.params.cartItemId; // Extrai l'identifiant de l'article du panier depuis les paramètres de la requête

       // Trouve l'article dans le panier
      const cartItem = await Cart.findById(cartItemId);
      if (!cartItem) {
        return res.status(404).json({status: false, message: "cart item not found"});
      }

      if(cartItem.quantity > 1){
        // Si la quantité est supérieure à 1, la décrémente
        cartItem.quantity -= 1;
        await cartItem.save(); // Sauvegarde la modification

        res.status(200).json({status: true, count: cartItem.quantity});
      }else{
         // Si la quantité est 1, supprime l'article du panier
        await Cart.findByIdAndRemove(cartItem);
        // Compte le nombre d'articles restants dans le panier
        count = await Cart.countDocuments({userId: req.user.id});

        res.status(200).json({ status: true, message:"cart item removed", count: count });
      }
    } catch (error) {
      res.status(500).json({ status: false, message:"failed to update cart item"});
    }
  },

   // Supprime un article spécifique du panier
  deleteCartItem: async(req, res)=>{
    const cartItemId = req.params.id; // Identifiant de l'article à supprimer
    let count;

    try {
       // Supprime l'article du panier
      await Cart.findByIdAndDelete(cartItemId);
        // Compte le nombre d'articles restants dans le panier
      count = await Cart.countDocuments({userId: req.user.id});
      res.status(200).json({ status: true, message:"cart item deleted", count: count });
    } catch (error) {
      res.status(500).json({ status: false, message:"failed to delete cart item"});
      
    }
  },

   // Réinitialise le panier en supprimant tous ses articles
  resetCart: async(req, res)=>{

    try {
      // Supprime tous les articles du panier de l'utilisateur
      await Cart.deleteMany(req.user.id);
      res.status(200).json({ status: false, message:"Cart reset"});

    } catch (error) {
      res.status(500).json({ status: false, message:"failed to reset cart"});
      
    }

  },

  // Renvoie le nombre d'articles dans le panier de l'utilisateur
  getCartCount : async(req, res)=>{
    try {
       // Compte le nombre d'articles dans le panier
      const count = await Cart.countDocuments({userId: req.user.id});
      res.status(200).json(count)
    } catch (error) {
      res.status(500).json({ status: false, message:error.message});
      
    }

  },


}