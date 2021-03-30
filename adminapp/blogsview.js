module.exports = {
    getHomePage: (req, res) => { 
        let query = "SELECT * FROM `blogs` ORDER BY id ASC"; 

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('admin/viewblogs.ejs', {
                title: "Admin Panel | View Products"
                ,blogsresult: result
                ,user:req.user
            });
        });
    },
};



