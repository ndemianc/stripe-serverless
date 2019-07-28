var stripe = require('stripe')('sk_test_A68iPiLXA6XwPr2gIsCihvoP00GabIlDfC');
// ^ this is a stripe testing key

module.exports = function(context, req) {
  context.log('starting to get down');

  //if we have a request body, an email, and a token, let's get started
  if (
    req.body &&
    req.body.stripeEmail &&
    req.body.stripeAmt
  ) {
    context.log('creating chargable card');
    stripe.tokens
      .create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2020,
          cvc: '123'
        }
      })
      .then(token => {
        context.log('creating stripe customer');
        stripe.customers.create({
          email: req.body.stripeEmail,
          source: token
        });
      })
      .then(customer => {
        context.log('starting the stripe charges');
        stripe.charges.create({
          amount: req.body.stripeAmt,
          description: 'Sample Charge',
          currency: 'usd',
          customer: customer.id
        });
      })
      .then(charge => {
        context.log('finished the stripe charges');
        context.res = {
          // status: 200
          body: 'This has been completed'
        };
        context.done();
      })
      .catch(err => {
        context.log(err);
        context.done();
      });
  } else {
    context.log(req.body);
    context.res = {
      status: 400,
      body: "We're missing something"
    };
    context.done();
  }
};
