var config = {};

//TODO consider combining these with distances to make sure it's the right route.
config.shortNames = {
  'Trans-Canada Hwy': '417',
  'Riverside Dr/Ottawa Rd 19 and Ottawa Rd 16 W': 'Riverside/Baseline',
  'Riverside Dr/Ottawa Rd 19 and Trans-Canada Hwy': 'Riverside/Bronson/417'
};

// Options to pass to node-mailer https://github.com/andris9/Nodemailer
config.nmOptions = {};

/*
  Each trip will be processed according to the cron-formatted schedule
  The routes will be retrieved from the URL and compared.  An email will be
  sent to all emailRecipients listing the suggested routes sorted by the
  current travel time estimates with the shortest route appearing first.
*/
//TODO use long or short name for defaultRoute?
config.trips = [
  {
    name: '',
    schedule: '',
    url: '',
    email: {
      from: '',
      recipients: [],
      subject: 'Which Way...'
    }
  }
];

exports.config = config;