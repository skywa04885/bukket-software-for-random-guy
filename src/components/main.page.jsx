import React, { Component } from "react";
import Loader from "./loader.component";

import "./main.page.css"

// We do not have enums, so i'm using this
const QuestionTypes = {
    CheckBoxArray: 0,
    InputFieldSmall: 1,
    InputFieldLarge: 2
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
        loading: true
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
                            <input type="checkbox" id={checkbox.id} value={checkbox.value} />
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
                break;
            }

            case QuestionTypes.InputFieldLarge: {
                break;
            }
        }
    };

    onSubmit = e => {
        e.preventDefault();
    }

    render() {
        let { currentQuestion, loading } = this.state;

        // Returns the loading component
        if (loading) {
            return <Loader />
        }

        // Inserts the name
        currentQuestion.context = currentQuestion.context.replace("{name}", "Luke Rieff");

        // Returns the main item
        return (
            <form onSubmit={this.onSubmit} className="main">
                {/* The current question */}
                <div className="main-inquiry">
                    <p className="main-inquiry__context">{ currentQuestion.context }</p>
                    <div className="main-inquiry__answer">
                        {this.renderQuestionFields(currentQuestion)}
                    </div>
                    <button type="submit" className="main-inquiry__next">Volgende vraag</button>
                </div>
            </form>
        );
    }
};

export default MainPage;