import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';

import { StyledContainer, StyledGreeting } from './NpmAnalyzerStyles';

class NpmAnalyzer extends Component {
    static propTypes = {
        name: PropTypes.string,
    };

    static defaultProps = {
        name: 'User',
    };

    constructor(props) {
        super(props);
        this.state = { data: "Click 'Get Downloads' to Get Results", current_package: "@splunk/create" };
    }



    render() {
        const { data } = this.state;
        const { current_package } = this.state;

        const handleChange = (e, { value }) => {
            this.setState({ current_package: value });
        };


        const handleClick = async () => {
            const response = await fetch("https://api.npmjs.org/downloads/range/last-year/" + current_package)
                .then(response => response.json())
                .then(result => {
                    return result
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, isFetching: false });
                });
            this.setState({ data: response })
            console.log(data)
        }

        return (
            <StyledContainer>
                <div>Enter NPM Package:</div>
                <Text defaultValue="@splunk/create" canClear onChange={handleChange} />
                <Button
                    label="Get Downloads"
                    appearance="primary"
                    onClick={handleClick}
                />
                <h1>{current_package}</h1>
                <p>{JSON.stringify(data)}</p>

            </StyledContainer>

        );
    }
}

export default NpmAnalyzer;
