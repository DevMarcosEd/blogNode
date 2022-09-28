function adminAuth(req, res, next) {
    if(req.session.user != undefined && req.session.user.eAdmin == true) {
        next()
    } else {
        req.flash('error_msg', 'Você não pode acessar uma rota administrativa!')
        res.redirect('/')
    }
}

// function userAuth(req, res, next) {
//     if(req.session.user != undefined && req.session.user.eAdmin == false) {
//         next()
//     } else {
//         req.flash('error_msg', 'Você precisa ter um cadastro!')
//         res.redirect('/')
//     }
// }


module.exports = adminAuth