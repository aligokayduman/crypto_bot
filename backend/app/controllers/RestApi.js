'use strict';

import Pair from '../models/Pair.js';

const create = (req, res) => {

  if(!req.body.name){
      return res.status(400).send({
          message: 'Pair name can not be empty'
      })
  }

  if(!req.body.status){
    return res.status(400).send({
        message: 'Pair status can not be empty'
    })
}  

  Pair.create({
      name:req.body.name,
      status: req.body.status
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Pair."
        });
    });   

}

const findAll = (req, res) => {  
    Pair.findAll().then(pairs => {
        res.send(pairs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Pairs."
        });
    });   
  
}

const findOne = (req, res) => {

  Pair.findByPk(req.params.Id).then(pair =>{
      if(!pair){
          return res.status(400).send({
              message: 'Pair not found with id:'+req.params.Id
          })
      }
      res.send(pair);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Pair not found with id " + req.params.Id
        });                
    }
    return res.status(500).send({
        message: "Error retrieving Pair with id " + req.params.Id
    });
  });

};

const update = (req, res) => {

    Pair.findByPk(req.params.Id).then(pair =>{
        if(!pair){
            return res.status(400).send({
                message: 'Pair not found with id:'+req.params.Id
            })
        }
        pair.name = req.body.name;
        pair.status = req.body.status;
        pair.save().then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the Pair."
            });
        });   
    }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Pair not found with id " + req.params.Id
          });                
      }
      return res.status(500).send({
          message: "Error updating pair with id " + req.params.Id
      });
    });

}

const remove = (req, res) => {

    Pair.findByPk(req.params.Id).then(pair =>{
        if(!pair){
            return res.status(400).send({
                message: 'Pair not found with id:'+req.params.Id
            })
        }
        pair.destroy().then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while deleting the Pair."
            });
        });   
    }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Pair not found with id " + req.params.Id
          });                
      }
      return res.status(500).send({
          message: "Could not delete pair with id " + req.params.Id
      });
    });

}

export default {
    create,
    findAll,
    findOne,
    update,
    remove
};