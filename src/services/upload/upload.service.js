// Initializes the `upload` service on path `/upload`
const Upload = require('./upload.class');
const hooks = require('./upload.hooks');
const route = '/api/images_backend_v2/uploads';

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.use(route, new Upload());
  const service = app.service(route);
  service.hooks(hooks);
};
