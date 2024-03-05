const User = require('../models/User');

const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');


module.exports = {

  // Fonction asynchrone pour créer un nouvel utilisateur.
  createUser: async(req, res) => {
    // Création d'un nouvel utilisateur avec les données reçues de la requête.
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      location: req.body.location,
       // Chiffrement du mot de passe avant de le stocker dans la base de données.
       password: CryptoJs.AES.encrypt(req.body.password, process.env.SECRET).toString(),
    });

    try {
      // Tentative de sauvegarde du nouvel utilisateur dans la base de données.
      await newUser.save();
      // En cas de succès, envoie une réponse avec le statut 201 et un message de succès.
      res.status(201).json({message: "User successfuly created"})

    } catch (error) {
      // En cas d'erreur, envoie une réponse avec le statut 500 et le message d'erreur.
      res.status(500).json({message: error})
    }
  },

  // Fonction asynchrone pour connecter un utilisateur.
  loginUser: async(req, res) => {
    try {
      // Recherche de l'utilisateur par email dans la base de données.
      const user = await User.findOne({email: req.body.email});

      if(!user){
        // Si aucun utilisateur n'est trouvé, envoie une réponse avec le statut 401 et un message d'erreur.
        // !user && res.status(401).json("Wrong credentials provide a valid email")
        return res.status(401).json("Wrong credentials provide a valid email");

      }
      
      // Déchiffrement du mot de passe stocké pour comparaison avec celui fourni.
      const decryptedPassword = CryptoJs.AES.decrypt(user.password, process.env.SECRET );
      const decryptedpass = decryptedPassword.toString(CryptoJs.enc.Utf8)

      // Si les mots de passe ne correspondent pas, envoie une réponse avec le statut 401.
      if (decryptedpass !== req.body.password) {
        // res.status(401).json("Wrong password");
        return res.status(401).json("Wrong password");
      }
        
      // Création d'un token JWT pour l'utilisateur connecté.
      const userToken = jwt.sign(
        {
          id: user.id
        }, process.env.JWT_SEC, {expiresIn: "7d"}
      );

      // Préparation des données de l'utilisateur à envoyer, en excluant certaines informations.
      const {password, __v, createdAt, updatedAt, ...userData } = user._doc;

         // Envoie des données de l'utilisateur et du token en réponse.
      res.status(200).json({...userData, token: userToken})

    } catch (error) {
      // En cas d'erreur générale, envoie une réponse avec le statut 500.
      res.status(500).json({message: error})
    }
  },
}