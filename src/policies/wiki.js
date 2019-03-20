const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

    new() {
        return (this._isAdmin() || this._isPremium() || this._isStandard());
    }
    //users to edit any public wiki regardless of user role
    create() {
        return this.new();
    }

    edit() {
        return this.create();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}