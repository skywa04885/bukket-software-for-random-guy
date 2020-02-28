const express = require("express");
const bp = require("body-parser");
const nm = require("nodemailer");
const cors = require("cors");
const nmdp =  require("nodemailer-direct-transport");
const hm = require("helmet");

const app = express();

app.use(cors());
app.use(bp.urlencoded({
	extended: false
}));
app.use(hm());

const transporter = nm.createTransport(nmdp({}));

app.post("/submit", (req, res, next) => {
	const {
		q1_klachten,
		q2_pijn_schaal,
		q3_meer_minder_weken,
		q4_toegenomen_afgenomen,
		q5_wat_zelf_gedaan,
		q6_contact_data
	} = req.body;

	if (
		!q1_klachten ||
		!q2_pijn_schaal ||
		!q3_meer_minder_weken ||
		!q4_toegenomen_afgenomen ||
		!q5_wat_zelf_gedaan ||
		!q6_contact_data
	) {
		res.status(500).send();
		return res.end();
	};

	transporter.sendMail({
		from: "Fouad <mailer@fouad.nl>",
		to: "Luke Rieff <luke.rieff@gmail.com>",
		subject: "Nieuw formulier entry ...",
		text: `
Geachte Boris,

Hierbij heb ik een nieuw ingevuld formulier:
- Klachten: ${q1_klachten}
- Pijn schaal 0/10: ${q2_pijn_schaal}
- Meer of minder dan 3 weken: ${q3_meer_minder_weken}
- Toegenomen of afgenomen: ${q4_toegenomen_afgenomen}
- Wat heb je zelf gedaan: ${q5_wat_zelf_gedaan}
- Contact gegevens: ${q6_contact_data}
		`
	}, (error, info) => {
		if (error) {
			res.status(500).send();
			return res.end();
		}

		res.status(200).send();
		return res.end();
	});
});

app.listen(8080);
