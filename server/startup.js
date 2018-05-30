Meteor.startup(() => {
  const adminUser = Meteor.settings.private.adminUser;
  if (!Meteor.users.findOne({ username: adminUser.username })) {
    Accounts.createUser({
      username: adminUser.username,
      email: adminUser.email,
      password: adminUser.password,
      plan: 'business'
    });
  }

  // allow creating apps in the config.json file
  const apps = Meteor.settings.private.apps;
  if (apps.length > -1) {
    apps.map((app) => {
      if (app.name && app.appId && app.secret) {
        if (!Apps.findOne(app.appId)) {
          Apps.insert({
            _id: app.appId,
            name: app.name,
            created: new Date(),
            owner: Meteor.users.findOne({
              username: { $eq: adminUser.username }})._id,
            secret: app.secret,
            plan: 'business',
            subShard: Math.floor(Math.random() * 128),
          })
          console.log(`App ${app.name} created`);
        } else {
          console.log('Duplicate app, ignored');
        }
      }
    })
  }
});
