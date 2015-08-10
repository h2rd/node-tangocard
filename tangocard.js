var request = require('request')
  , fs = require('fs')
  , path = require('path');

var certContent = fs.readFileSync(path.join(__dirname, 'ca_cert', 'digicert_chain.pem'));

module.exports = function(options) {
  var token = new Buffer(options.name + ':' + options.key).toString('base64')
    , domain = options.domain || 'https://api.tangocard.com';

  var _request = function(method, uri, payload, callback) {
    if ('undefined' === typeof callback ) {
      callback = payload;
      payload = null;
    }

    method = method.toUpperCase() || 'GET';

    var options = {
      uri: domain + uri
    , method: method
    , qs: 'GET' === method ? payload : null
    , headers: { 'Authorization': 'Basic ' + token }
    , json: true
    , body: 'GET' !== method ? payload : null
    , agentOptions: { ca: certContent }
    };

    return request(options, function(err, req, body) {
      if (err) {
        return callback(err);
      }

      if (!body) {
        return callback(new Error('API Response is empty'));
      }

      if (false === body.success && 'string' === typeof body.error_message) {
        return callback(new Error(body.error_message));
      }

      return callback(null, body);
    });
  };

  return {
    createAccount: function(payload, callback) {
      return _request('POST', '/raas/v1/accounts', payload, callback);
    },

    getAccountInfo: function(customer, accountId, callback) {
      return _request('GET', '/raas/v1/accounts/' + customer + '/' + accountId, callback);
    },

    registerCreditCard: function(payload, callback) {
      return _request('POST', '/raas/v1/cc_register', payload, callback);
    },

    fundAccount: function(payload, callback) {
      return _request('POST', '/raas/v1/cc_fund', payload, callback);
    },

    deleteCreditCard: function(payload, callback) {
      return _request('POST', '/raas/v1/cc_unregister', payload, callback);
    },

    getRewards: function(callback) {
      return _request('GET', '/raas/v1/rewards', callback);
    },

    placeOrder: function(payload, callback) {
      return _request('POST', '/raas/v1/orders', payload, callback);
    },

    getOrderInfo: function(orderId, callback) {
      return _request('GET', '/raas/v1/orders/' + orderId, callback);
    },

    getOrderHistory: function(qs, callback) {
      return _request('GET', '/raas/v1/orders', qs, callback);
    }
  }
};
