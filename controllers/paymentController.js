 const {Code, Payment} = require("../models")
 const generateCode = require("../utils/signUpCode")
 const nodemailer = require("nodemailer")
 const { Op } = require('sequelize'); 

// async function manuallySendCode(email) {
//     const code = generateCode();
  
//     // Save code to the database
//     await Code.create({ email, code, generatedBy: 'manual' });
  
//     // Send code via email
//     await transporter.sendMail({
//       from: '"Your App Name" <no-reply@example.com>',
//       to: email,
//       subject: 'Your Signup Code',
//       text: `Your code is: ${code}`,
//     });
  
//     console.log(`Code sent to ${email}: ${code}`);
//   }
  




// async function validateSignupCode(email, code) {
//     const entry = await Code.findOne({ where: { email, code, isUsed: false } });
  
//     if (!entry) {
//       throw new Error('Invalid or expired code.');
//     }
  
//     entry.isUsed = true; // Mark as used
//     await entry.save();
  
//     return true;
//   }
  

//   async function validatePayment(paymentDetails) {
//     const { transactionId, paymentProvider, amount, email } = paymentDetails;
  
//     // Check for required fields
//     if (!transactionId || !paymentProvider || !amount || !email) {
//       throw new Error('Missing payment details');
//     }
  
//     // Simulate validation with a mock API or real payment provider logic
//     try {
//       if (paymentProvider === 'mockProvider') {
//         // Simulate an API call to validate the payment (mock example)
//         const mockApiResponse = {
//           transactionId: transactionId,
//           status: 'completed', // Example status
//           amount: amount,
//         };
  
//         // Validate transaction ID and amount match expected values
//         if (mockApiResponse.status !== 'completed' || mockApiResponse.amount !== amount) {
//           return false;
//         }
  
//         return true;
//       }
  
//       // Example: Integrate with a real payment provider like Stripe/PayPal
//       // if (paymentProvider === 'stripe') {
//       //   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//       //   const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
//       //   return paymentIntent.status === 'succeeded' && paymentIntent.amount_received === amount;
//       // }
  
//       // Add additional provider checks as needed
//       return false; // Default to false if provider is unrecognized
  
//     } catch (error) {
//       console.error('Payment validation error:', error);
//       throw new Error('Payment validation failed');
//     }
//   }
  

  

//   async function handlePaymentSuccess(paymentDetails) {
//     const { email, amount, paymentProvider, transactionId } = paymentDetails;
  
//     // Save payment record
//     await Payment.create({
//       email,
//       paymentStatus: 'completed',
//       paymentProvider,
//       amount,
//       transactionId,
//     });
  
//     // Generate and send signup code
//     const code = generateCode();
//     await Code.create({ email, code, generatedBy: paymentProvider });
  
//     await transporter.sendMail({
//       from: '"Your App Name" <no-reply@example.com>',
//       to: email,
//       subject: 'Your Signup Code',
//       text: `Your code is: ${code}`,
//     });
  
//     console.log(`Payment completed. Code sent to ${email}`);
//   }



  
//   async function makePayment (req, res)  {
//     try {
//       const paymentDetails = req.body;
  
//       // Validate payment (via provider API, if necessary)
//       const isValidPayment = await validatePayment(paymentDetails);
//       if (!isValidPayment) {
//         return res.status(400).json({ error: 'Invalid payment' });
//       }
  
//       // Handle successful payment
//       await handlePaymentSuccess(paymentDetails);
  
//       res.status(200).json({ message: 'Payment processed successfully.' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };


let transporter = nodemailer.createTransport({
  host: "mail.skilltopims.com",  
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function manuallySendCode(req,res) {
  const {name, email,amount, subs,phone} = req.body
 try {
  const code = generateCode();

  // Save code to the database with expiration date
  await Code.create({ 
    email, 
    businessName:name,
    code, 
    phone, 
    subType:subs,
    paymentDate:null, 
    generatedBy: 'manual', 
    expiresAt:null
   });
  await Payment.create({
    email,
    amount,
    paymentProvider:null,
    transactionId:null
  })
  //Send code via email
  await transporter.sendMail({
    from: `"IMS" <${process.env.EMAIL_USER}>`,
    to: process.env.SKILLTOP_EMAIL,
    subject: 'Signup Code Request',
    text: `Dear Admin,\n\nA client  NAME
    
    
    name:${name} with email:${email}  has requested to subscribe.\n\nKindly attend to ${name} as soon as payment is made!`,
  });

  console.log(`Code sent to ${email}: ${code}`);
  res.status(200).json({ msg: 'Subcribe successfully' });
 } catch (error) {
  console.error('Error sending code:', error);
  res.status(500).json({'msg':error.message})
 }
}

// async function getAllCodes(req, res) {
//   try {
//     const codes = await Code.findAll();
//     const pays = await Payment.findAll()
//     res.status(200).json({codes,pays});
//   } catch (error) {
//     res.status(500).json({ msg: 'Error fetching codes', error: error.message });
//   }
// }

async function getAllCodes(req, res) {
  try {
    const codes = await Code.findAll({
      include: {
        model: Payment,
        as: 'Payment',
        required: false, 
      },
    });
    res.status(200).json({ codes });
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching codes', error: error.message });
  }
}

async function getCodeById(req, res) {
  const { id } = req.params;
  try {
    const code = await Code.findOne({ where: { payId:id } });
    const pay = await Payment.findOne({ where: { email:code.email } });
    if (!code) return res.status(404).json({ msg: 'Code not found' });
    res.status(200).json({code,pay});
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching code', error: error.message });
  }
}


async function updateCode(req, res) {
  const { id } = req.params;
  const { name, email, subs, payDate, phone, sendEmail,amount,paymentProvider,transactionId,paymentStatus, } = req.body;

  try {
    // Find the code entry by payId
    const code = await Code.findOne({ where: { payId: id } });
    const payment= await Payment.findOne({where:{email:code.email}})
    if (!code) return res.status(404).json({ msg: 'Code not found' });

    let expiresAt = code.expiresAt; // Default to current expiration

    // Calculate new expiration date if subs and payDate are provided
    if (subs && payDate) {
      const startDate = new Date(payDate); // Use payDate as the start date
      switch (subs) {
        case '1 month':
          expiresAt = new Date(startDate.setMonth(startDate.getMonth() + 1));
          break;
        case '6 months':
          expiresAt = new Date(startDate.setMonth(startDate.getMonth() + 6));
          break;
        case '1 year':
          expiresAt = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
          break;
        default:
          return res.status(400).json({ msg: 'Invalid subscription duration' });
      }
    }

    // Update the code entry
    await code.update({
      name: name || code.name,
      email: email || code.email,
      expiresAt,
      paymentDate: payDate || code.paymentDate,
      phone: phone || code.phone,
      isUsed: true, // Mark as used
    });
    await payment.update({
      email:email || payment.email,
      paymentStatus: paymentStatus || payment.paymentStatus,
      amount:amount || payment.amount,
      paymentProvider:paymentProvider || payment.paymentProvider,
      transactionId: transactionId || payment.transactionId,
      paidDate:payDate || payment.paidDate
    })
    // Check if sendEmail is true and send the email if required
    if (sendEmail) {
      await transporter.sendMail({
        from: `"IMS" <${process.env.EMAIL_USER}>`,
        to: email || code.email, // Use the updated or existing email
        subject: 'Subscription Updated',
        text: `Dear ${name || code.name},\n\nYour subscription has been successfully updated.\n\nThank you for staying with us!`,
      });
      console.log(`Email sent to ${email || code.email}`);
    }

    // Respond with success message and updated code data
    res.status(200).json({ msg: 'Code updated successfully', code,payment });
  } catch (error) {
    console.error('Error updating code:', error);
    res.status(500).json({ msg: 'Error updating code', error: error.message });
  }
}


async function deleteCode(req, res) {
  const { id } = req.params;
  try {
    const deleted = await Code.destroy({ where: { payId:id } });
    if (!deleted) return res.status(404).json({ msg: 'Code not found' });

    res.status(200).json({ msg: 'Code deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting code', error: error.message });
  }
}




async function validateSignupCode(req, res, next) {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ msg: 'Email and code are required.' });
  }
  
  try {
    // Find the code entry in the database
    const entry = await Code.findOne({
      where: {
        email,
        code,
        isUsed: false
      },
    });

    // Handle case where the code is invalid or expired
    if (!entry) {
      return res.status(400).json({ msg: 'Invalid or expired code.' });
    }
    // Mark the code as used
    entry.isUsed = true;
    await entry.save();
    req.validatedCode = entry
    console.log("entry",entry)
    return next ()
    //res.status(200).json({ msg: 'Code validated successfully.' })
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
}



async function handlePaymentSuccess(paymentDetails) {
  const { email, amount, paymentProvider, transactionId, subs } = paymentDetails;

  // Save payment record
  await Payment.create({
    email,
    paymentStatus: 'completed',
    paymentProvider,
    amount,
    transactionId,
  });

  // Generate and send signup code
  await manuallySendCode(email, subs);

  console.log(`Payment completed. Code sent to ${email}`);
}

async function makePayment(req, res) {
  try {
    const paymentDetails = req.body;

    // Validate payment (via provider API, if necessary)
    const isValidPayment = await validatePayment(paymentDetails);
    if (!isValidPayment) {
      return res.status(400).json({ error: 'Invalid payment' });
    }

    // Handle successful payment and send the code
    await handlePaymentSuccess(paymentDetails);

    res.status(200).json({ message: 'Payment processed successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


  module.exports = {
    manuallySendCode,
    validateSignupCode,
    makePayment,
    getAllCodes,
    getCodeById,
    updateCode,
    deleteCode
  }


