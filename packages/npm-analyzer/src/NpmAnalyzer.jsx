import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import Select from '@splunk/react-ui/Select';

import Line from '@splunk/visualizations/Line';

import { StyledContainer } from './NpmAnalyzerStyles';

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
            message: "Click 'Get Downloads' to Get Results", fetch_error: "", github_token: "", github_username: "", package_source: "NPM", current_package: "@splunk/create", dates: [''], downloads: ['']
        };
    }
    render() {
        const { current_package } = this.state;
        const { downloads } = this.state;
        const { dates } = this.state;
        const { message } = this.state;
        const { package_source } = this.state;
        const { github_token } = this.state;
        const { github_username } = this.state;
        const { fetch_error } = this.state;



        const handleChange = (e, { value }) => {
            this.setState({ current_package: value });
        };

        const handleRepoChange = (e, { value }) => {
            this.setState({ package_source: value });
        };
        const handleGithubUsernameChange = (e, { value }) => {
            this.setState({ github_username: value });
        };
        const handleGithubTokenChange = (e, { value }) => {
            this.setState({ github_token: value });
        };

        const toggle = <Button appearance="toggle" label="Select Package Source" isMenu />;

        const handleClick = async () => {

            this.setState({dates: ['']})
            this.setState({downloads: ['']})

            var new_downloads = []
            var new_dates = []

            var response = ""
            if (package_source == "NPM") {
                response = await fetch("https://api.npmjs.org/downloads/range/last-year/" + current_package)
                    .then(response => {
                        if (response.ok) {
                            this.setState({fetch_error:""})
                            return response.json()
                        }
                        else{
                            throw new Error('Something went wrong');
                        }
                    })
                    .then(result => {
                        
                            return result
                    })
                    .catch(e => {
                        this.setState({ fetch_error: "Error Fetching Data. " })
                        this.setState({ ...this.state, isFetching: false });
                    });


                for (const value of response.downloads) {
                    new_downloads.push(value.downloads)
                    new_dates.push(value.day)
                }
                this.setState({ downloads: new_downloads })
                this.setState({ dates: new_dates })
                this.setState({ message: "" })
            }
            if (package_source == "Github") {
                response = await fetch("https://api.github.com/repos/" + current_package + "/traffic/clones", {
                    headers: {
                        'Authorization': 'Basic ' + btoa(github_username + ":" + github_token)
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            this.setState({fetch_error:""})
                            return response.json()
                        }
                        else{
                            throw new Error('Something went wrong');
                        }
                    })
                    .then(result => {
                        return result
                    })
                    .catch(e => {
                        console.log("ERRORRRRR")
                        this.setState({ fetch_error: "Error Fetching Data. Verify you have a personal access token and it has push permissions to the repository" })
                        this.setState({ ...this.state, isFetching: false });
                    });

                for (const value of response.clones) {
                    new_downloads.push(value.count)
                    new_dates.push(value.timestamp)
                }
                this.setState({ downloads: new_downloads })
                this.setState({ dates: new_dates })
                this.setState({ message: "" })
            }
        }

        var github_entry = ""
        if (package_source == "Github") {
            github_entry = <>
            <p>Enter Github Username</p>
            <Text defaultValue="Username" canClear onChange={handleGithubUsernameChange} />
            <p>Enter a <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token">Personal Access Token</a></p>
            <Text type="password"
defaultValue="Personal Access Token" canClear onChange={handleGithubTokenChange} /></>
        }

        return (
            <StyledContainer stye={{ width: '100%' }}>
                <div>Enter NPM Package or Github Repo (This should include org/owner and the repo name. For example: @splunk/create for NPM or splunk/dashpub for Github):</div>
                <Text defaultValue="@splunk/create" canClear onChange={handleChange} />
                <p>{fetch_error}</p>
                <Select value={package_source} onChange={handleRepoChange}>
                    <Select.Option label="Github" value="Github" />
                    <Select.Option label="NPM" value="NPM" />
                </Select>
                {github_entry}

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
