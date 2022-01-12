const express = require('express');
const TutorialController = require('../controllers/tutorial');

const router = express.Router();

//  const validator = require('../validators/validate')

// tutorial get,put,post routes
router.get('/search/:title', TutorialController.findTutorial);
router.get('/', TutorialController.getTutorial);
router.get('/sorting/sortdesc', TutorialController.getSortedTutorial);
router.put('/put/:id', TutorialController.putTutorial);
router.post('/post', TutorialController.postTutorial);
// user route for register
router.post('/register', TutorialController.registerUsers);
router.post('/login', TutorialController.loginUsers);
router.get('/getuser', TutorialController.getUsers);
router.delete('/deleteuser/:id', TutorialController.deleteUsers);
// tutorial route for delete
router.delete('/delete/:id', TutorialController.deleteTutorial);

// router.get("/tutorials",validator.createTutorialValidator,createTutorials);

module.exports = router;
