module.exports = {
    init(app) {
        app.get("/", function (req, res) {
            res.render("home", {
                user: req.session.user,
                activeMenu: "home"
            });
        });
    }
}