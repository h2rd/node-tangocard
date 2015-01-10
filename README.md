# tangocard-node

[Tangocard](https://www.tangocard.com/) node.js sdk


## Installation

```
npm install node-tangocard
```

## Api specifications

https://github.com/tangocarddev/RaaS/blob/master/README.md

## Usage example

```javascript

var Tango = require('./tangocard');

var tangoClient = new Tango({
  name: 'TangoTest'
, key: '5xItr3dMDlEWAa9S4s7vYh7kQ01d5SFePPUoZZiK/vMfbo3A5BvJLAmD4tI='
, domain: 'https://sandbox.tangocard.com'
});

tangoClient.getRewards(function(err, rewards) {
  console.log(rewards);

  /*
  {
    "success": true,
    "brands": [
      {
        "description": "Tango Card",
        "image_url": "https://dwwvg90koz96l.cloudfront.net/graphics/item-images/tango-card-gift-card.png",
        "rewards": [
          {
            "description": "Tango Card E-Custom",
            "sku": "TNGO-E-V-STD",
            "currency_type": "USD",
            "unit_price": -1,
            "available": true,
            "min_price": 1,
            "max_price": 500000
          }
        ]
      },

    ...
    ]
  }
  */
});
```
