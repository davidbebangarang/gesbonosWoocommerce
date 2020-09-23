const express = require('express');
const router = express.Router();

// Routes
router.get('/', (req,res) => {
    res.render('index',{
        title: 'Aplicación de gestión de bonos en FisioProyectos.',
        dni: '12345678X',
        items: []
    });
    //__dirname : It will resolve to your project folder.
});

module.exports = router;