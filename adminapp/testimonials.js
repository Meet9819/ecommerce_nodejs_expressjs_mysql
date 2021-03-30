const fs = require('fs');

module.exports = {
    addtestimonialsPage: (req, res) => {
        res.render('admin/addtestimonials.ejs', {
            user:req.user
            ,message: '' 
        });
    },
    addtestimonials: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let messageofuser = req.body.messageofuser;
        let position = req.body.position;      
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `testimonials` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('admin/addtestimonials.ejs', {
                    message
                });
            } else {
                
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                  
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        
                        let query = "INSERT INTO `testimonials` (messageofuser, position, image, user_name) VALUES ('" +
                        messageofuser + "', '" + position + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/admin/testimonialsview');  
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('admin/addtestimonials.ejs', {
                        message
                    });
                }
            }
        });
    },
    edittestimonialsPage: (req, res) => {
        let testimonialsId = req.params.id;
        let query = "SELECT * FROM `testimonials` WHERE id = '" + testimonialsId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('admin/edittestimonials.ejs', {
                title: "Edit  testimonials"
                ,testimonials: result[0]
                ,message: ''
                ,user:req.user
            });
        });
    },
    edittestimonials: (req, res) => {
        let testimonialsId = req.params.id;
        
        let messageofuser = req.body.messageofuser;
        let position = req.body.position;
       

        let query = "UPDATE `testimonials` SET  `messageofuser` = '" + messageofuser + "', `position` = '" + position + "' WHERE `testimonials`.`id` = '" + testimonialsId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin/testimonialsview');  
        });
    },
    deletetestimonials: (req, res) => {
        let testimonialsId = req.params.id;
        let getImageQuery = 'SELECT image from `testimonials` WHERE id = "' + testimonialsId + '"';
        let deleteUserQuery = 'DELETE FROM testimonials WHERE id = "' + testimonialsId + '"';

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
                    res.redirect('/admin/testimonialsview'); 
                });
            });
        });
    }
};
