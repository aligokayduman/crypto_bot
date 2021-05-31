'use strict';

const getIndex = (req, res) => {
  
    res.render('pages/home', {
        title: 'Home Page',
        layout: 'layouts/guest'        
    });   

}

const getLogin = (req, res) => {
  
    res.render('pages/login', {
        title: 'Login Page',
        layout: 'layouts/guest'        
    });   

}

export default {
    getIndex,
    getLogin
};