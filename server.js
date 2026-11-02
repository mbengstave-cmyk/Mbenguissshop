// Importation des modules nécessaires
const express = require('express');
const app = express();

// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Initialiser Stripe avec la clé secrète lue de manière sécurisée dans l'environnement
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Middleware pour parser le JSON
app.use(express.json());

// Route de test pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.send('Serveur opérationnel et sécurisé !');
});

// Exemple de route pour créer une session de paiement Stripe
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Création d'un PaymentIntent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Le montant en centimes
      currency: 'eur',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
