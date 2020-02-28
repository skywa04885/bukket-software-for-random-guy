import React, { Component } from "react";

class Loader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p class="loading">Loading ...</p>
        );
    }
}

export default Loader;