'use strict';

const getIndex = (req, res) => {
  
    res.render('pages/admin/dashboard', {
        title: 'Dashboard'
    });   

}

export default {
    getIndex
};