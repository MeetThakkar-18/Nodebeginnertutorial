const express = require('express');
const TutorialController = require('../controllers/tutorial');
const verify = require('../helpers/token');

const router = express.Router();

// tutorial get,put,post,delete routes
router.get('/search/:title', TutorialController.findTutorial);
router.get('/', TutorialController.getTutorial);
router.get('/sorting/sortdesc', TutorialController.getSortedTutorial);
router.put('/put/:id', verify, TutorialController.putTutorial);
router.post('/post', verify, TutorialController.postTutorial);
router.delete('/delete/:id', TutorialController.deleteTutorial);

// user routes login,forgot,get,delete,register
router.get('/getuser', verify, TutorialController.getUsers);
router.post('/register', TutorialController.registerUsers);
router.post('/login', TutorialController.loginUsers);
router.post('/forgotpassword', TutorialController.forgotPassword);
router.put('/resetpassword', TutorialController.resetPassword);
router.delete('/deleteuser/:id', TutorialController.deleteUsers);

module.exports = router;
