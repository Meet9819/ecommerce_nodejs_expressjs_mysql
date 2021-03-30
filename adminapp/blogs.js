const fs = require('fs');

module.exports = {
    addblogPage: (req, res) => {
        res.render('admin/addblogs.ejs', {
            user:req.user
            ,message: '' 
        });
    },
    addblog: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `blogs` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('admin/addblogs.ejs', {
                    message
                });
            } else {
                
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                  
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        
                        let query = "INSERT INTO `blogs` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/admin/blogsview'); 
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('admin/addblogs.ejs', {
                        message
                    });
                }
            }
        });
    },
    editblogPage: (req, res) => {
        let blogId = req.params.id;
        let query = "SELECT * FROM `blogs` WHERE id = '" + blogId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('admin/editblogs.ejs', {
                title: "Edit  Blogs"
                ,blog: result[0]
                ,message: ''
                ,user:req.user
            });
        });
    },
    editblog: (req, res) => {
        let blogId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `blogs` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `blogs`.`id` = '" + blogId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/blogsview'); 
        });
    },
    deleteblog: (req, res) => {
        let blogId = req.params.id;
        let getImageQuery = 'SELECT image from `blogs` WHERE id = "' + blogId + '"';
        let deleteUserQuery = 'DELETE FROM blogs WHERE id = "' + blogId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/admin/blogsview'); 
                });
            });
        });
    }
};
