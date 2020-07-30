const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const sslRedirect = require('heroku-ssl-redirect');

const PORT = process.env.PORT || 4000;

const app = express()
app.use(sslRedirect())
const censoredRoutes = express.Router()

const mongoDB = 'mongodb://127.0.0.1/censored';
mongoose.connect(process.env.MONGODB_URI || mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once("open", () => {
	console.log("MongoDB connection established")
})

let Censored = require("./Censored.model");

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

app.use("/censored", censoredRoutes)


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