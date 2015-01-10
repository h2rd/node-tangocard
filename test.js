var expect = require('chai').expect
  , crypto = require("crypto")
  , Tango = require('./tangocard');

var tangoClient = new Tango({
  name: 'TangoTest'
, key: '5xItr3dMDlEWAa9S4s7vYh7kQ01d5SFePPUoZZiK/vMfbo3A5BvJLAmD4tI='
, domain: 'https://sandbox.tangocard.com'
});

var customer = randomString()
  , accountIdentifier = randomString()
  , cardToken = null;

describe('Tango client', function() {
  it('should initialize', function() {
    expect(tangoClient).to.be.ok();
    expect(tangoClient).to.have.property('createAccount');
    expect(tangoClient).to.have.property('getAccountInfo');
    expect(tangoClient).to.have.property('registerCreditCard');
    expect(tangoClient).to.have.property('fundAccount');
    expect(tangoClient).to.have.property('deleteCreditCard');
    expect(tangoClient).to.have.property('getRewards');
    expect(tangoClient).to.have.property('placeOrder');
    expect(tangoClient).to.have.property('getOrderInfo');
    expect(tangoClient).to.have.property('getOrderHistory');
  })

  it('should create an account', function(done) {
    tangoClient.createAccount({
      customer: customer
    , identifier: accountIdentifier
    , email: "test@test.com"
    }, function(err, accountInfo) {
      expect(accountInfo).to.be.ok;
      expect(accountInfo.success).to.be.true;
      expect(accountInfo.account.customer).to.be.equal(customer);
      expect(accountInfo.account.identifier).to.be.equal(accountIdentifier);
      expect(accountInfo.account.email).to.be.equal('test@test.com');
      expect(accountInfo.account.available_balance).to.be.equal(0);
      done(err);
    });
  });

  it('should return account information', function(done) {
    tangoClient.getAccountInfo(customer, accountIdentifier, function(err, accountInfo) {
      expect(accountInfo).to.be.ok;
      expect(accountInfo.success).to.be.true;
      expect(accountInfo.account.customer).to.be.equal(customer);
      expect(accountInfo.account.identifier).to.be.equal(accountIdentifier);
      expect(accountInfo.account.email).to.be.equal('test@test.com');
      expect(accountInfo.account.available_balance).to.be.equal(0);
      done(err);
    });
  });

  it('should register a credit card', function(done) {
    var payload = {
      customer: customer,
      account_identifier: accountIdentifier,
      client_ip: "127.0.0.1",
      credit_card: {
        number: "4111111111111111",
        security_code: "123",
        expiration: "2016-01",
        billing_address: {
          f_name: "FName",
          l_name: "LName",
          address: "Address",
          city: "Seattle",
          state: "WA",
          zip: "98116",
          country: "USA",
          email: "test@example.com"
        }
      }
    };

    tangoClient.registerCreditCard(payload, function(err, cardInfo) {
      expect(cardInfo).to.be.ok;
      expect(cardInfo.success).to.be.true;
      expect(cardInfo).to.have.property('cc_token');
      expect(cardInfo).to.have.property('active_date');

      cardToken = cardInfo.cc_token;
      done(err);
    });
  });

  it('should fund an account', function(done) {
    // need to wait approval time
    // we dont need to wait it
    done();
  });

  it('should remove a credit card', function(done) {
    var payload = {
      customer: customer,
      account_identifier: accountIdentifier,
      cc_token: cardToken
    };

    tangoClient.deleteCreditCard(payload, function(err, cardInfo) {
      expect(cardInfo).to.be.ok;
      expect(cardInfo.success).to.be.true;
      done(err);
    });
  });

  it('should return list of rewards', function(done) {
    tangoClient.getRewards(function(err, rewards) {
      expect(rewards).to.be.ok;
      expect(rewards.success).to.be.true;
      expect(rewards).to.have.property('brands');
      expect(rewards.brands).to.have.length.above(0);

      done(err);
    });
  });

  it('should place an order', function(done) {
    // need to use credit card
    done();
  });

  it('should return information about order', function(done) {
    // need to make order
    done();
  });

  it('should return order history', function(done) {
    var qs = {
      customer: customer
    , account_identifier: accountIdentifier
    };

    tangoClient.getOrderHistory(qs, function(err, history) {
      expect(history).to.be.ok;
      expect(history.success).to.be.true;
      expect(history).to.have.property('orders');
      expect(history).to.have.property('offset');
      expect(history).to.have.property('limit');
      expect(history).to.have.property('result_count');
      expect(history).to.have.property('total_count');
      done();
    });
  });
});


function randomString() {
  return crypto.randomBytes(20).toString('hex');
}
