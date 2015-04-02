var express = require('express');
var router = express.Router();


/*
	GET A LIST OF SHAREBOX
	======================
	GET sharebox/
	@request null
	@response a list of sharebox
	{
		action: "get a list of sharebox",
		status: "success",
		data: []
	}
*/
router.get('/', function(req, res) {
	// TODO 
	// Code to get a list of sharebox
	var data = {
		action: "get a list of sharebox",
		status: "success",
		data: [
			{
				id: 123,
				creator_id: 23,
				share_with: [22, 33, 11],
				status: "active",
				create_time: "2013-12-01T19:00+0800",
				update_time: "2014-01-01T21:00+0800"
			}
		]
	};

	res.send(data);
});

/*
	CREATE A NEW SHAREBOX
	======================
	POST sharebox/
	@request sharebox info
	{
		creator_id: 23,
		share_with: [22, 33, 11]
	}
	@response a sharebox
	{
		action: "create a new sharebox",
		status: "success",
		data: []
	}
*/
router.post('/', function(req, res) {
	// TODO 
	// Code to create a sharebox

	var data = {
		action: "create a new sharebox",
		status: "success",
		data: [
			{
				id: 123,
				creator_id: req.body.creator_id,
				share_with: req.body.share_with,
				status: "active",
				create_time: "2013-12-01T19:00+0800",
				update_time: "2014-01-01T21:00+0800",
				items:[]
			}
		]
	};

	res.send(data);
});

/*
	GET A SPECIFIC SHAREBOX
	======================
	GET sharebox/:id
	@request null
	@response a sharebox
	{
		action: "get a specific sharebox",
		status: "success",
		data: []
	}
*/
router.get('/:id', function(req, res) {
	var shareboxId = req.params.id;
	// TODO 
	// Code to get a sharebox
	var data = {
		action: "get a specific sharebox",
		status: "success",
		data: [
			{
				id: shareboxId,
				creator_id: 23,
				share_with: [22, 33, 11],
				status: "active",
				create_time: "2013-12-01T19:00+0800",
				update_time: "2014-01-01T21:00+0800",
				items: [
					{
						name: "fuck you morph" ,
						type: "script",
						xml: "<script><block s='forward'><l>10</l></block></script>"
					}
				]
			}
		]
	};

	res.send(data);
});


/*
	UPDATE A SHAREBOX
	======================
	PUT sharebox/
	@request a sharebox items
	{
		items: [
			{
				name: "fuck you morph" ,
				type: "script",
				xml: "<script><block s='forward'><l>10</l></block></script>"
			}
		]
	}
	@response a sharebox
	{
		action: "update a sharebox",
		status: "success",
		data: []
	}
*/
router.put('/:id', function(req, res) {
	var shareboxId = req.params.id;
	// TODO 
	// Code to update a sharebox
	var data = {
		action: "update a sharebox",
		status: "success",
		data: [
			{
				id: shareboxId,
				creator_id: 23,
				share_with: [22, 33, 11],
				status: "active",
				create_time: "2013-12-01T19:00+0800",
				update_time: "2014-01-01T21:00+0800",
				items: req.body.items
			}
		]
	};

	res.send(data);
});

/*
	DELETE A SHAREBOX
	======================
	PUT sharebox/
	@request null
	@response a sharebox
	{
		action: "update a sharebox",
		status: "success",
		data: []
	}
*/
router.delete('/:id', function(req, res) {
	var shareboxId = req.params.id;
	// TODO 
	// Code to delete a sharebox
	var data = {
		action: "delete a sharebox",
		status: "success",
		data: [
			{
				id: shareboxId,
				creator_id: 23,
				share_with: [22, 33, 11],
				status: "active",
				create_time: "2013-12-01T19:00+0800",
				update_time: "2014-01-01T21:00+0800",
				items: [
					{
						name: "fuck you morph" ,
						type: "script",
						xml: "<script><block s='forward'><l>10</l></block></script>"
					}
				]
			}
		]
	};

	res.send(data);
});

module.exports = router;
