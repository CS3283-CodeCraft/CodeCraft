var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/costumes', function(req, res) {

	var info = [
		{
			url: "codecraft/Costumes/alonzo.gif",
			name: "alonzo.gif",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/bat1-a.png",
			name: "bat1-a.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/bat1-b.png",
			name: "bat1-b.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/bat2-a.png",
			name: "bat2-a.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/bat2-b.png",
			name: "bat2-b.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/boy1-standing.gif",
			name: "boy1-standing.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/boy1-walking.gif",
			name: "boy1-walking.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/boy2.gif",
			name: "boy2.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/boy3.gif",
			name: "boy3.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/cat2.gif",
			name: "cat2.gif",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/cat3.png",
			name: "cat3.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/cat4.png",
			name: "cat4.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/cat5.gif",
			name: "cat5.gif",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dog1-a.png",
			name: "dog1-a.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dog1-b.png",
			name: "dog1-b.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dog2-a.png",
			name: "dog2-a.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dog2-b.png",
			name: "dog2-b.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dog2-c.png",
			name: "dog2-c.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dragon1-a.png",
			name: "dragon1-a.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dragon1-b.png",
			name: "dragon1-b.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/dragon2.gif",
			name: "dragon2.gif",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/girl1-standing.gif",
			name: "girl1-standing.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/girl1-walking.gif",
			name: "girl1-walking.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/girl2-shouting.gif",
			name: "girl2-shouting.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/girl2-standing.gif",
			name: "girl2-standing.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/girl3-basketball.gif",
			name: "girl3-basketball.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/girl3-running.gif",
			name: "girl3-running.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/girl3-standing.gif",
			name: "girl3-standing.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/marissa-crouching.gif",
			name: "marissa-crouching.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/marissa-sitting.gif",
			name: "marissa-sitting.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/marissa.gif",
			name: "marissa.gif",
			tag1: "people"
		},
		{
			url: "codecraft/Costumes/unicorn1.png",
			name: "unicorn1.png",
			tag1: "animal"
		},
		{
			url: "codecraft/Costumes/local/singapore/bubbletea.png",
			name: "bubbletea.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/singapore/coffeepacket.png",
			name: "coffeepacket.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/singapore/flag.png",
			name: "flag.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/singapore/laksa.png",
			name: "laksa.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/singapore/merlion.png",
			name: "merlion.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/singapore/satay.png",
			name: "satay.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/singapore/sg.png",
			name: "sg.png",
			tag1: "singapore"
		},
		{
			url: "codecraft/Costumes/local/china/china.png",
			name: "china.png",
			tag1: "china"
		},
		{
			url: "codecraft/Costumes/local/china/chinaboat.png",
			name: "chinaboat.png",
			tag1: "china"
		},
		{
			url: "codecraft/Costumes/local/china/dimsum.png",
			name: "dimsum.png",
			tag1: "china"
		},
		{
			url: "codecraft/Costumes/local/china/mandarin.png",
			name: "mandarin.png",
			tag1: "china"
		},
		{
			url: "codecraft/Costumes/local/china/sheep.png",
			name: "sheep.png",
			tag1: "china"
		},
		{
			url: "codecraft/Costumes/local/india/buddha.png",
			name: "buddha.png",
			tag1: "india"
		},
		{
			url: "codecraft/Costumes/local/india/spice.png",
			name: "spice.png",
			tag1: "india"
		},
		{
			url: "codecraft/Costumes/local/india/boy.png",
			name: "boy.png",
			tag1: "india"
		},
		{
			url: "codecraft/Costumes/local/japan/isuzu.png",
			name: "isuzu.png",
			tag1: "japan"
		},
		{
			url: "codecraft/Costumes/local/japan/moffu.png",
			name: "moffu.png",
			tag1: "japan"
		},
		{
			url: "codecraft/Costumes/local/japan/sushi.png",
			name: "sushi.png",
			tag1: "japan"
		},
		{
			url: "codecraft/Costumes/local/japan/sushi2.png",
			name: "sushi2.png",
			tag1: "japan"
		},
		{
			url: "codecraft/Costumes/local/japan/sushi3.png",
			name: "sushi3.png",
			tag1: "japan"
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
