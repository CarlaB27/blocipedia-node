const logger = require("morgan");

module.exports = {
    init(app) {
        const staticRoutes = require("../routes/static");
        app.use(staticRoutes);
        app.use(logger('dev'));
    }
};