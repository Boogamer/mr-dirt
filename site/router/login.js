module.exports = {
    init(app) {
        app.get("/login", function (req, res) {
            res.render("login");
        });
    }
}