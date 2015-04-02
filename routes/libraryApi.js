var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/costumes', function(req, res) {

	var info = [
		{
			url: "codecraft/Costumes/alonzo.gif",
			name: "alonzo.gif"
		},
		{
			url: "codecraft/Costumes/bat1-a.png",
			name: "bat1-a.png"
		},
		{
			url: "codecraft/Costumes/bat1-b.png",
			name: "bat1-b.png"
		},
		{
			url: "codecraft/Costumes/bat2-a.png",
			name: "bat2-a.png"
		},
		{
			url: "codecraft/Costumes/bat2-b.png",
			name: "bat2-b.png"
		},
		{
			url: "codecraft/Costumes/boy1-standing.gif",
			name: "boy1-standing.gif"
		},
		{
			url: "codecraft/Costumes/boy1-walking.gif",
			name: "boy1-walking.gif"
		},
		{
			url: "codecraft/Costumes/boy2.gif",
			name: "boy2.gif"
		},
		{
			url: "codecraft/Costumes/boy3.gif",
			name: "boy3.gif"
		},
		{
			url: "codecraft/Costumes/cat2.gif",
			name: "cat2.gif"
		},
		{
			url: "codecraft/Costumes/cat3.png",
			name: "cat3.png"
		},
		{
			url: "codecraft/Costumes/cat4.png",
			name: "cat4.png"
		},
		{
			url: "codecraft/Costumes/cat5.gif",
			name: "cat5.gif"
		},
		{
			url: "codecraft/Costumes/dog1-a.png",
			name: "dog1-a.png"
		},
		{
			url: "codecraft/Costumes/dog1-b.png",
			name: "dog1-b.png"
		},
		{
			url: "codecraft/Costumes/dog2-a.png",
			name: "dog2-a.png"
		},
		{
			url: "codecraft/Costumes/dog2-b.png",
			name: "dog2-b.png"
		},
		{
			url: "codecraft/Costumes/dog2-c.png",
			name: "dog2-c.png"
		},
		{
			url: "codecraft/Costumes/dragon1-a.png",
			name: "dragon1-a.png"
		},
		{
			url: "codecraft/Costumes/dragon1-b.png",
			name: "dragon1-b.png"
		},
		{
			url: "codecraft/Costumes/dragon2.gif",
			name: "dragon2.gif"
		},
		{
			url: "codecraft/Costumes/girl1-standing.gif",
			name: "girl1-standing.gif"
		},
		{
			url: "codecraft/Costumes/girl1-walking.gif",
			name: "girl1-walking.gif"
		},
		{
			url: "codecraft/Costumes/girl2-shouting.gif",
			name: "girl2-shouting.gif"
		},
		{
			url: "codecraft/Costumes/girl2-standing.gif",
			name: "girl2-standing.gif"
		},
		{
			url: "codecraft/Costumes/girl3-basketball.gif",
			name: "girl3-basketball.gif"
		},
		{
			url: "codecraft/Costumes/girl3-running.gif",
			name: "girl3-running.gif"
		},
		{
			url: "codecraft/Costumes/girl3-standing.gif",
			name: "girl3-standing.gif"
		},
		{
			url: "codecraft/Costumes/marissa-crouching.gif",
			name: "marissa-crouching.gif"
		},
		{
			url: "codecraft/Costumes/marissa-sitting.gif",
			name: "marissa-sitting.gif"
		},
		{
			url: "codecraft/Costumes/marissa.gif",
			name: "marissa.gif"
		},
		{
			url: "codecraft/Costumes/unicorn.png",
			name: "unicorn.png"
		}
	]

	var data = {
		api_type: 'library/costumes',
		api_description: 'get costume name and url from database',
		data: info,
	} 


	res.send(data);
});


module.exports = router;
