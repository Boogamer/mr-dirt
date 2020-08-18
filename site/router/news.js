module.exports = {
    init(app) {
        app.get("/news", function (req, res) {
            res.render("news", {
                user: req.session.user,
                activeMenu: "news"
            });
        });
    }
}