const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const sslRedirect = require('heroku-ssl-redirect');

const PORT = process.env.PORT || 4000;

const app = express()
app.use(sslRedirect())
const censoredRoutes = express.Router()
const userRoutes = express.Router()

const mongoDB = 'mongodb://127.0.0.1/censored';
mongoose.connect(process.env.MONGODB_URI || mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once("open", () => {
	console.log("MongoDB connection established")
})

let Censored = require("./Models/Censored.model");
let User = require("./Models/User.model");

app.use(bodyParser.json())

censoredRoutes.route("/").get((req, res) => {
	Censored.find()
	.then(censor => {
		res.status(200).json(censor)
	})
	.catch(error => {
		console.log(error)
		res.status(400).send("Database not found")
	})
})

censoredRoutes.route("/add").post((req, res) => {
	let censor = new Censored(req.body)

	censor.save()
	.then(censor => {
		res.status(200).send("Censor added successfully")
	})
	.catch(err => {
		res.status(400).send("Censor was not added")
		console.log("Censor was not added")
		console.log(err)
	})
})


censoredRoutes.route('/update/:id').put((req, res, next) => {
	Censored.findByIdAndUpdate(req.params.id, {
		$set: req.body
	}, (error, data) => {
		if (error){
			console.log(error)
			return next(error);
		} else {
			res.json(data)
			console.log('Record updated successfully')
		}
	})
})

censoredRoutes.route('/search').post((req, res) => {

	Censored.find({ answer: {$regex: req.body.searchValue, $options: 'i'}}).limit(10)
	.then(results => {
		res.status(200).json(results)
	})
	.catch(err => {
		res.status(400).send("Not Found")
		console.log(err)
	})
})

userRoutes.route("/topten").get((req, res) => {
	User.find().sort({score: -1}).limit(10)
		.then(users => {
			res.status(200).json(users)
		})
		.catch(err => {
			res.status(400).send("records not found")
			console(err)
			console.log("Records not found")
		})
})

userRoutes.route("/add").post((req, res) => {
	let user = new User(req.body)

	user.save()
	.then((user) => {
		res.status(200).send("User added successfully")
	})
	.catch(err => {
		res.status(400).send("User was not added")
		console.log("User was not added")
		console.log(err)
	})
})

userRoutes.route("/query").post((req, res) => {
	let query = req.body;
	User.find(query, (err, user) => {
		if(!user){
			res.status(400)
			console.log(err)
			console.log("Database not found")
		}
		else{
			res.json(user)
		}
	})
})

userRoutes.route('/update/:id').put((req, res) => {
	User.findByIdAndUpdate(req.params.id, {$set: req.body})
	.then(user => {
		res.status(200).send("record updated successfully")
		console.log("record updated successfully")
	})
	.catch(err => {
		res.status(400).send("not updated")
		console.log("not updated")
	})
})


app.use("/censored", censoredRoutes)
app.use("/users", userRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.use(express.urlencoded({
	extended: false
}));


app.listen(PORT, () => {
	console.log("MongoDB running on PORT: " + PORT);
});