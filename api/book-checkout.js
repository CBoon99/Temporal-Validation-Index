const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, edition } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const editionType = edition || 'digital'; // 'digital' or 'hardcover'
    const isHardcover = editionType === 'hardcover';

    // Check if founding edition sold out
    const { data: remaining } = await supabase.rpc('get_remaining_copies');
    
    if (remaining <= 0) {
      return res.status(400).json({ 
        error: 'Sold out',
        message: 'Founding edition sold out. Regular edition available.',
        waitlist: true
      });
    }

    // Get next copy number (reserve it)
    const { data: copyNumber, error: copyError } = await supabase.rpc('get_next_copy_number');
    
    if (copyError) {
      return res.status(500).json({ error: 'Unable to reserve copy number' });
    }

    // Product details based on edition
    const productName = isHardcover 
      ? 'TIME AS PROOF - Hardcover + Digital (Founding Edition)'
      : 'TIME AS PROOF - Digital Edition (Founding)';
    
    const productDescription = isHardcover
      ? `Hardcover book + PDF + EPUB + Flipbook access - Numbered copy #${copyNumber} of 100 - Ships in 14 days`
      : `Digital book (PDF + EPUB + Flipbook access) - Numbered copy #${copyNumber} of 100 - Instant delivery`;
    
    const price = isHardcover ? 3995 : 1995; // $39.95 or $19.95 in cents

    // Create Stripe checkout for book
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: productDescription,
            images: ['https://TVI-Framework.com/assets/book-cover.jpg']
          },
          unit_amount: price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/book-success.html?copy=${copyNumber}&edition=${editionType}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/book.html?cancelled=true`,
      metadata: {
        product_type: 'book',
        edition: 'founding',
        edition_type: editionType,
        copy_number: copyNumber,
        customer_email: email,
        customer_name: name || ''
      }
    });

    // Reserve the copy number (mark as pending)
    await supabase.from('book_purchases').insert({
      email,
      name,
      copy_number: copyNumber,
      edition: 'founding',
      price: 19.95,
      stripe_payment_id: session.id
    });

    res.status(200).json({ 
      sessionId: session.id,
      copyNumber,
      remaining: remaining - 1
    });

  } catch (err) {
    console.error('Book checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
};

