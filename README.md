Which Way
=========

My wife doesn't have a smartphone so I wrote this little tool to check the current drive times for her commute home at the end of the day.  It finds the current routes suggested by Google Maps and emails them along with the expected trip times.

Most of the time the suggested route is the same so I'm going to update the tool so that you can set a default route.  The app will only email you if the fastest route is something other than the default route.

Configuration
-------------

Configuration is done through the `config.js` file.

URL for the directions on Google Maps

    config.url = 'https://maps.google.com/maps?saddr=Unknown+road&daddr=45.444446,-75.693809&hl=en&ll=45.432943,-75.697002&spn=0.023611,0.034761&sll=45.437912,-75.69638&sspn=0.011804,0.017381&geocode=FYAgtQIdSOp8-w%3BFV5ttQIdDwF9-w&mra=ls&t=m&z=15';

Suggested routes from Google can be given shorter names.  This is optional, but handy if you're sending the routes via SMS and would like concise labels.

    config.shortNames = {
      'Sussex Dr/Ottawa Rd 93': 'Sussex',
      'King Edward Ave': 'Kind Edward'
    };

`nmOptions` is the options object passed to Nodemailer when [setting up its transport](https://github.com/andris9/Nodemailer#setting-up-a-transport-method).

    // Options to pass to node-mailer 
    config.nmOptions = {
      service: 'Gmail',
      auth: {
        user: 'some.email@example.com',
        pass: 'somepassword'
      }
    };

Parameters for the email that is sent with the routes.  `recipients` is an array of email addresses.  If you want to send the results via SMS most carriers have an email to SMS gateway that you can use.  See [emailtextmessages.com](http://www.emailtextmessages.com/) for a list.

    config.email = {
      from: 'some.email@example.com',
      recipients: [
        'My Wife <my.wife@example.com>'
      ],
      subject: 'Which Way...'
    }

