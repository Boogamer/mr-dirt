module.exports = {
    init(app) {
        app.get("/account", function (req, res) {
            res.render("account", {
                user: req.session.user
            });
        });
    }
}