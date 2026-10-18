const express = require('express');
const stripe = require('stripe')('TA_CLE_SECRETE_STRIPE');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
  const items = req.body.items;

  const line_items = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items,
    mode: 'payment',
    success_url: 'https://tonsite.onrender.com/succes.html',
    cancel_url: 'https://tonsite.onrender.com/annule.html',
  });

  res.json({ id: session.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Serveur lancé sur le port ' + PORT))
