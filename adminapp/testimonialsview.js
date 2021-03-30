module.exports = {
    getHomePagee: (req, res) => { 
        let query = "SELECT * FROM `testimonials` ORDER BY id ASC"; 

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('admin/viewtestimonials.ejs', {
                testimonialsresult: result
                ,user:req.user
            });
        });
    },
};



