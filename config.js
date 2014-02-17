var config = {};

config.url = '';

//TODO consider combining these with distances to make sure it's the right route.
config.shortNames = {
  'Trans-Canada Hwy': '417',
  'Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W': 'Riverside/Baseline',
  'Riverside Dr/Ottawa Rd 19 and Trans-Canada Hwy': 'Riverside/Bronson/417'
};

// Options to pass to node-mailer https://github.com/andris9/Nodemailer
config.nmOptions = {};

config.email = {
  from: '',
  recipients: [],
  subject: 'Which Way...'
}

exports.config = config;