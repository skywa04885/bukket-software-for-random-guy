import React, { Component } from "react";
import axios from "axios";
import Loader from "./loader.component";

import "./main.page.css"

// We do not have enums, so i'm using this
const QuestionTypes = {
    CheckBoxArray: 0,
    InputFieldSmall: 1,
    InputFieldLarge: 2,
    NumberMaxTen: 3
};

// A single checkbox
class Checkbox {
    constructor(
        value,
        label,
        id
    ) {
        this.value = value;
        this.label = label;
        this.id = id;
    }
};

// A question
class Question {
    constructor(
        context, // The message body, use {} for variable replacements
        type, // The type of question
        id, // The question id
        checkboxes = [] // If there are checkboxes, hold these items
    ) {
        this.context = context;
        this.type = type;
        this.id = id;
        this.checkboxes = checkboxes;
    }
};

class MainPage extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        currentQuestion: {},
        loading: true,
		q_index: 0,
        msg: null,
        help: null,
        answered: {
            q1_klachten: null,
            q2_pijn_schaal: null,
            q3_meer_minder_weken: null,
            q4_toegenomen_afgenomen: null,
            q5_wat_zelf_gedaan: null,
            q6_contact_data: null
        }
    };

    componentDidMount() {
        // Waits a second
        setTimeout(() => { // On finished
            // Updates the current state
            this.setState({
                currentQuestion: new Question(
                    "Hey ? {name} Wat vervelend dat je klachten hebt. Ik zou graag wat meer inzicht willen hebben in jou en je klachten, om te kijken of je in aanmerking komt voor een gratis fysiocheck.\nDit duurt ongeveer 2 mintuutjes\nWaar heb je momenteel de meeste klachten?",
                    QuestionTypes.CheckBoxArray,
                    0,
                    [
                        new Checkbox("nek", "Nek", "opt_nek"),
                        new Checkbox("hoofdpijn", "Hoofdpijn", "opt_hoofdpijn"),
                        new Checkbox("rug", "Rug", "opt_rug"),
                        new Checkbox("kaak", "Kaak", "opt_kaak")
                    ]),
                loading: false
            }, () => { // Once it is finished
                console.log("Initial question showing ...");
            });
        }, 1000);
    }

    renderQuestionFields = question => {
        // Checks which type it is
        switch (question.type) {
            case QuestionTypes.CheckBoxArray: {
                let result = []; // The final result

                // Loops over the checkboxes
                for (let i in question.checkboxes) {
                    let checkbox = question.checkboxes[i];

                    result.push(
                        <li className="main-inquiry__answer__list-item">
                            <label for={checkbox.id}>{checkbox.label}</label>
                            <input name="checkbox_input" id="checkbox_input" type="radio" id={checkbox.id} value={checkbox.value} />
                        </li>
                    );
                }

                // Returns the checkboxes
                return (
                    <ul>
                        {result}
                    </ul>
                );
            }

            case QuestionTypes.InputFieldSmall: {
                return <input type="text" name="small_text_input" id="small_text_input" />
            }

            case QuestionTypes.InputFieldLarge: {
                return <textarea rows="5" name="large_text_input" id="large_text_input"></textarea>
            }

            case QuestionTypes.NumberMaxTen: {
                return <input min="0" max="10" name="number_input" id="number_input" type="number" placeholder="0/10" />
            }
        }
    };

    onSubmit = e => {
        e.preventDefault();

		var { q_index } = this.state;

        // Checks if the value is valid
        switch (q_index) {
            case 0: {
                // Checks if value entered
                if (!document.querySelector("input[name='checkbox_input']:checked")) {
                    this.setState({
                        help: "Kies een optie a.u.b."
                    }, () => {});
                    return;
                }

                // Gets the value
                var radioValue = document.querySelector("input[name='checkbox_input']:checked").value;
                this.setState({
                    answered: Object.assign(this.state.answered, {
                        q1_klachten: radioValue
                    })
                }, () => {});

                break;
            }

            case 1: {
                // Checks if entered
                if (!document.querySelector("input[name='number_input']").value) {
                    this.setState({
                        help: "Vul een getal in a.u.b."
                    }, () => {});
                    return;
                }

                // Gets the value
                var numberValue = document.querySelector("input[name='number_input']").value;
                this.setState({
                    answered: Object.assign(this.state.answered, {
                        q2_pijn_schaal: numberValue
                    })
                }, () => {});

                break;
            }

            case 2: {
                // Checks if value entered
                if (!document.querySelector("input[name='checkbox_input']:checked")) {
                    return;
                }

                // Gets the value
                var radioValue = document.querySelector("input[name='checkbox_input']:checked").value;

                if (radioValue == 'minder') {
                    this.setState({
                        msg: "Vaak herstelt je lichaam vanzelf, maar als je na twee weken nog steeds geen verbetering ziet in je klachten, kan je weer even contact met me opnemen! Sterkte 😉\nUitzondering: als de kaak “geblokkeerd” is en/of de pijnscore hoger dan een 6 is neem dan toch direct contact op\nGroet Boris"
                    }, () => {});
                    return;
                }

                this.setState({
                    answered: Object.assign(this.state.answered, {
                        q3_meer_minder_weken: radioValue
                    })
                }, () => {});

                break;
            }

            case 3: {
                // Checks if value entered
                if (!document.querySelector("input[name='checkbox_input']:checked")) {
                    this.setState({
                        help: "Kies een optie a.u.b."
                    }, () => {});
                    return;
                }

                var radioValue = document.querySelector("input[name='checkbox_input']:checked").value;

                this.setState({
                    answered: Object.assign(this.state.answered, {
                        q4_toegenomen_afgenomen: radioValue
                    })
                }, () => {});

                break;
            }

            case 4: {
                // Checks if entered
                if (!document.querySelector("textarea[name='large_text_input']").value) {
                    this.setState({
                        help: "Vul een antwoord in a.u.b."
                    }, () => {});
                    return;
                }

                this.setState({
                    answered: Object.assign(this.state.answered, {
                        q5_wat_zelf_gedaan: document.querySelector("textarea[name='large_text_input']").value
                    })
                }, () => {});


                break;
            }

            case 5: {
                // Checks if entered
                if (!document.querySelector("input[name='small_text_input']").value) {
                    this.setState({
                        help: "Vul een antwoord in a.u.b."
                    }, () => {});
                    return;
                }
                
                this.setState({
                    answered: Object.assign(this.state.answered, {
                        q6_contact_data: document.querySelector("input[name='small_text_input']").value
                    })
                }, () => {});

                // Posts the data
                const params = new URLSearchParams();
                params.append("q1_klachten", this.state.answered.q1_klachten);
                params.append("q2_pijn_schaal", this.state.answered.q2_pijn_schaal);
                params.append("q3_meer_minder_weken", this.state.answered.q3_meer_minder_weken);
                params.append("q4_toegenomen_afgenomen", this.state.answered.q4_toegenomen_afgenomen);
                params.append("q5_wat_zelf_gedaan", this.state.answered.q5_wat_zelf_gedaan);
                params.append("q6_contact_data", this.state.answered.q6_contact_data);

                axios.post("http://localhost:8080/submit", params).then(() => {
                    console.log("Data sent ...");
                }).catch(err => {
                    console.log("Error", err);
                });
                
                
                break;
            }
        }

        // Increments the index
        q_index++;

        // Gets the next input
		switch (q_index) {
			case 1: {
                var question = new Question(
                    "Ik ben gespecialiseerd in schouder-, nek-, rug-, hoofdpijn- en kaakklachten. Als je andere klachten hebt, adviseer ik je om naar een andere fysiotherapeut te gaan. \nAls je de pijn een score zou moeten geven tussen 1 t/m 10? Wat zou je dan scoren?\n0=geen pijn\n10=de ergste pijn die je ooit gevoeld hebt",
                    QuestionTypes.NumberMaxTen,
                    1,
                    []
                )

                this.setState({
                    currentQuestion: question
                }, () => {});
                break;
			}

            case 2: {
                var question = new Question(
                    "Hoe lang heb je last van deze klachten? Minder dan 3 weken OF meer dan 3 weken",
                    QuestionTypes.CheckBoxArray,
                    2,
                    [
                        new Checkbox("minder", "Minder", "opt_minder"),
                        new Checkbox("meer", "Meer", "opt_meer")
                    ]
                )

                this.setState({
                    currentQuestion: question
                }, () => {});
                break;
            }

            case 3: {
                var question = new Question(
                    "Is de pijn nadat het ontstond erger geworden, hetzelfde gebleven of is de pijn toegenomen?",
                    QuestionTypes.CheckBoxArray,
                    3,
                    [
                        new Checkbox("erger", "Erger", "opt_erger"),
                        new Checkbox("hetzelfde", "Hetzelfde", "opt_hetzelfde")
                    ]
                )

                this.setState({
                    currentQuestion: question
                }, () => {});
                break;
            }

            case 4: {
                var question = new Question(
                    "Wat heb je zelf al gedaan om de pijn te verminderen?",
                    QuestionTypes.InputFieldLarge,
                    4,
                    []
                )

                this.setState({
                    currentQuestion: question
                }, () => {});
                break;
            }

            case 5: {
                var question = new Question(
                    "Op zich heel goed, maar dat is dan nog niet voldoende geweest om te herstellen…\nDat waren de vragen\nk denk inderdaad dat het verstandig is, dat je even langskomt voor een gratis fysiocheck. Ik doe dan even een paar korte onderzoekjes bij je, zodat je meteen weet, wat er nou precies aan de hand is! \nWat is je telefoonnummer en/of e mail adres, dan neem ik contact met je op",
                    QuestionTypes.InputFieldSmall,
                    5,
                    []
                )

                this.setState({
                    currentQuestion: question
                }, () => {});
                break;
            }

            case 6: {
                this.setState({
                    msg: "Helemaal goed! Ik neem zo snel mogelijk contact met je op om een gratis fysiocheck in te plannen! 😊"
                }, () => {});
                return;
            }
		}

		this.setState({
			q_index: q_index,
            help: null
		}, () => {});
    }

    render() {
        let { currentQuestion, loading, msg, help } = this.state;

        // Returns the loading component
        if (loading) {
            return <Loader />
        }

        // Inserts the name
        currentQuestion.context = currentQuestion.context.replace("{name}", "Luke Rieff");

        // Returns the main item
        return (
            <form onSubmit={this.onSubmit} className="main">
                {/* Checks for message*/}
                { msg !== null ? (
                    <p className="main-message" dangerouslySetInnerHTML={{__html: msg.replace("\n", "<br />")}}></p>
                ) : (
                    <div className="main-inquiry">
                        { help ? <p className="main-help">{ help }</p> : null }
                        <p className="main-inquiry__context" dangerouslySetInnerHTML={{__html: currentQuestion.context.replace("\n", "<br />")}}></p>
                        <div className="main-inquiry__answer">
                            {this.renderQuestionFields(currentQuestion)}
                        </div>
                        <button type="submit" className="main-inquiry__next">Volgende vraag</button>
                    </div>
                ) }
            </form>
        );
    }
};

export default MainPage;
