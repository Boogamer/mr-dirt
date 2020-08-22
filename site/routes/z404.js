module.exports = {
    init(app) {
        app.get("*", function (req, res) {
            res.status(404).render("404");
        });
    }
}