const jwt = require('jsonwebtoken');

// Définition du middleware verifyToken.
const verifyToken = (req, res, next) =>{

  // Extraction du token de l'en-tête 'Authorization' de la requête.
  const authHeader = req.headers.token;

   // Vérifie si l'en-tête d'authentification est présent.
  if (authHeader) {

    // Séparation du Bearer token et extraction du token lui-même.
    const token = authHeader.split(" ")[1];

    // Vérification du token avec la clé secrète stockée dans les variables d'environnement.
    jwt.verify(token, process.env.JWT_SEC, async(err, user)=>{
      // Si une erreur survient pendant la vérification, renvoie une erreur 403.
      if (err) {
        return res.status(403).json("Invalid token")
      }

       // Si le token est valide, attache les informations de l'utilisateur à l'objet req pour les utiliser dans les middlewares suivants.
      req.user = user;
      // Passe à l'exécution du middleware suivant.
      next();
    })
  }else{
     // Si aucun token n'est fourni, renvoie une erreur 401 indiquant que l'utilisateur n'est pas authentifié.
    return res.status(401).json("You are not authentificaterd")
  }
}
// Exportation du middleware pour utilisation dans d'autres parties de l'application.
module.exports = {verifyToken};