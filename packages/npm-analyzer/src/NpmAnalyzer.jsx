import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import Line from '@splunk/visualizations/Line';

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
        this.state = {
            message: "Click 'Get Downloads' to Get Results", current_package: "@splunk/create", dates: [''], downloads: ['']
        };
    }
    render() {
        const { current_package } = this.state;
        const { downloads } = this.state;
        const { dates } = this.state;
        const { message } = this.state;



        const handleChange = (e, { value }) => {
            this.setState({ current_package: value });
        };


        const handleClick = async () => {

            var new_downloads = []
            var new_dates = []
            const response = await fetch("https://api.npmjs.org/downloads/range/last-year/" + current_package)
                .then(response => response.json())
                .then(result => {
                    return result
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, isFetching: false });
                });
            this.setState({ data: response.downloads })

            for (const value of response.downloads) {
                new_downloads.push(value.downloads)
                new_dates.push(value.day)
            }
            this.setState({ downloads: new_downloads })
            this.setState({ dates: new_dates })
            this.setState({ message: "" })

        }

        return (
            <StyledContainer stye={{width:'100%'}}>
                <div>Enter NPM Package:</div>
                <Text defaultValue="@splunk/create" canClear onChange={handleChange} />
                <Button
                    label="Get Downloads"
                    appearance="primary"
                    onClick={handleClick}
                />
                <h1>{current_package}</h1>
                <p>{message}</p>
                <Line
                    options={{}}
                    dataSources={{
                        primary: {
                            requestParams: { offset: 0, count: 20 },
                            data: {
                                fields: [
                                    {
                                        name: 'Date',
                                    },
                                    {
                                        name: 'Downloads',
                                        type_special: 'count',
                                    },
                                ],
                                columns: [
                                    dates,
                                    downloads,
                                ],
                            },
                            meta: { totalCount: 20 },
                        },
                    }}
                />

            </StyledContainer>

        );
    }
}

export default NpmAnalyzer;
