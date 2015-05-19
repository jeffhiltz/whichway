# Which Way

## NOTE

This is an older project and I haven't been using it for a while.  Google Maps has been updated and the tool may no longer work.  Good luck!

## Description

My wife doesn't have a smartphone so I wrote this little tool to check the current drive times for her commute home at the end of the day.  It finds the current routes suggested by Google Maps and emails them along with the expected trip times.

The application supports multiple *trips*.  A trip represents the directions associated with a single Google Maps URL.  Each trip has its own name, schedule, URL, default route and email recipients.  The (optional) default route can be used to avoid sending email when the fastest route is the one that you would take anyway.  If you still want to receive the email so that you will know how long the trip is going to take leave the default route as an empty string.

## Requirements
This tool requires [Node.js](http://nodejs.org/).  See the `package.json` for version information.

## Configuration

Configuration is done through the `config.js` file.

### Trips

Trips are defined as objects in an array.  Each trip looks like this:

    config.trips = [
      {
        name: 'Commute Home', // Trip name, used for logging
        schedule: '00 25 17 * * 1-5',  // cron-style schedule 
        url: 'https://maps.google.com/maps?saddr=Unknown+road&daddr=45.444446,-75.693809&hl=en&ll=45.432943,-75.697002&spn=0.023611,0.034761&sll=45.437912,-75.69638&sspn=0.011804,0.017381&geocode=FYAgtQIdSOp8-w%3BFV5ttQIdDwF9-w&mra=ls&t=m&z=15', // URL for the directions from Google Maps
        defaultRoute: 'King Edward Ave', // (Optional) Route description from either Google Maps page or shortName (see below)
        email: {
          from: 'ww@example.com', // Address from which the emails will be sent
          recipients: [
            'pm@example.com'
          ], // Array of recipient email addresses
          subject: 'Which Way Home' // Subject line for the email message
        }
      }
    ];

Wikipedia has a quick primer/refresher on [cron syntax](https://en.wikipedia.org/wiki/Cron).

To get the URL for your trip go to Google Maps and enter your start and end points and get the directions for your trip.  There is a chain icon above the route directions which you can click to get a permanent URL for the specified route.  The Which Way tool will visit the provided URL to retrieve the current travel times.  You should test your URL by pasting it into a new tab and ensuring that it displays the correct directions.

If you would rather send SMS instead of email, most carriers have an email to SMS gateway that you can use.  See [emailtextmessages.com](http://www.emailtextmessages.com/) for a list.

### Short Names

Suggested routes from Google can be given shorter names.  This is optional, but handy if you're sending the routes via SMS and would like concise labels.

The "long" names are the object keys are they need to be an exact match to the route name found on the Google Maps directions page.  The corresponding value is the short name that you want to assign to that route.

    config.shortNames = {
      'Sussex Dr/Ottawa Rd 93': 'Sussex',
      'King Edward Ave': 'Kind Edward'
    };

### Mailer Options

`nmOptions` is the options object passed to Nodemailer when [setting up its transport](https://github.com/andris9/Nodemailer#setting-up-a-transport-method).

    // Options to pass to node-mailer 
    config.nmOptions = {
      service: 'Gmail',
      auth: {
        user: 'some.email@example.com',
        pass: 'somepassword'
      }
    };

## Feedback

If you're having any problems, please open an issue on github.  You're the best.

## License

MIT
