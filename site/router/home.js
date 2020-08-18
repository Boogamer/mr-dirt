module.exports = {
    init(app) {
        app.get("/", function (req, res) {
            res.render("home");
        });
    }
}