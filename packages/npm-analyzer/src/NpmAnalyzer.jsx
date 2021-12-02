import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import Select from '@splunk/react-ui/Select';

import Line from '@splunk/visualizations/Line';
import SingleValue from '@splunk/visualizations/SingleValue';

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

        var search = window.location.search
        const params = new URLSearchParams(search);
        const url_param_package = params.get('package')

        this.state = {
            message: "Click 'Get Downloads' to Get Results", visualizations: [], fetch_error: "", total_downloads: [''], github_token: "", github_username: "", package_source: "NPM", current_package: url_param_package, dates: [''], downloads: ['']
        };

    }

    render() {
        const { current_package } = this.state;
        const { message } = this.state;
        const { package_source } = this.state;
        const { github_token } = this.state;
        const { github_username } = this.state;
        const { fetch_error } = this.state;
        const { visualizations } = this.state


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

        const textLoad = (e) => {
            console.log("Loaded")

        };



        const handleClick = async () => {


            if (current_package) {
                var packages = current_package.split(", ")

                this.setState({ dates: [''] })
                this.setState({ downloads: [''] })

                var visuals = []
                var i = 0
                for (const repo of packages) {
                    var i = i + 1
                    var new_downloads = []
                    var new_dates = []

                    var final_downloads = 0
                    var response = ""

                    if (package_source == "NPM") {
                        response = await fetch("https://api.npmjs.org/downloads/range/last-year/" + repo)
                            .then(response => {
                                if (response.ok) {
                                    this.setState({ fetch_error: "" })
                                    return response.json()
                                }
                                else {
                                    throw new Error('Something went wrong');
                                }
                            })
                            .then(result => {

                                return result
                            })
                            .catch(e => {
                                this.setState({ fetch_error: "Error Fetching Data. Repo Name: "+ repo })
                                this.setState({ ...this.state, isFetching: false });
                            });


                        for (const value of response.downloads) {
                            new_downloads.push(value.downloads)
                            new_dates.push(value.day)
                            final_downloads = final_downloads + value.downloads
                        }


                        visuals.push(<div key={i}><h1>{repo}</h1><div style={flexContainer}>
                            <div style={flexChildLine}>
                                <p>Downloads (Over Time)</p>

                                <Line
                                    options={{}}
                                    dataSources={{
                                        primary: {
                                            requestParams: { offset: 0, count: 20 },
                                            data: {
                                                fields: [
                                                    {
                                                        name: '_time',
                                                    },
                                                    {
                                                        name: 'Downloads',
                                                        type_special: 'count',
                                                    },
                                                ],
                                                columns: [
                                                    new_dates,
                                                    new_downloads,
                                                ],
                                            },
                                            meta: { totalCount: 20 },
                                        },
                                    }}
                                /></div>
                            <div style={flexChildSV}>
                                <p>Total Downloads</p>
                                <SingleValue
                                    options={{}}
                                    dataSources={{
                                        primary: {
                                            data: {
                                                columns: [
                                                    [final_downloads]

                                                ],
                                                fields: [
                                                    {
                                                        name: 'Count',
                                                    }
                                                ],
                                            },
                                            meta: {},
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        </div>)

                    }
                    if (package_source == "Github") {
                        response = await fetch("https://api.github.com/repos/" + repo + "/traffic/clones", {
                            headers: {
                                'Authorization': 'Basic ' + btoa(github_username + ":" + github_token)
                            }
                        })
                            .then(response => {
                                if (response.ok) {
                                    this.setState({ fetch_error: "" })
                                    return response.json()
                                }
                                else {
                                    throw new Error('Something went wrong');
                                }
                            })
                            .then(result => {
                                return result
                            })
                            .catch(e => {
                                console.log("ERROR")
                                this.setState({ fetch_error: "Error Fetching Data. Verify you have a personal access token and it has push permissions to the repository. Repo Name: " + repo })
                                this.setState({ ...this.state, isFetching: false });
                            });

                        for (const value of response.clones) {
                            new_downloads.push(value.count)
                            new_dates.push(value.timestamp)
                            final_downloads = final_downloads + value.count

                        }

                        visuals.push(<><h1>{repo}</h1><div style={flexContainer}>
                            <div style={flexChildLine}>
                                <p>Downloads (Over Time)</p>

                                <Line
                                    options={{}}
                                    dataSources={{
                                        primary: {
                                            requestParams: { offset: 0, count: 20 },
                                            data: {
                                                fields: [
                                                    {
                                                        name: '_time',
                                                    },
                                                    {
                                                        name: 'Downloads',
                                                        type_special: 'count',
                                                    },
                                                ],
                                                columns: [
                                                    new_dates,
                                                    new_downloads,
                                                ],
                                            },
                                            meta: { totalCount: 20 },
                                        },
                                    }}
                                /></div>
                            <div style={flexChildSV}>
                                <p>Total Downloads</p>
                                <SingleValue
                                    options={{}}
                                    dataSources={{
                                        primary: {
                                            data: {
                                                columns: [
                                                    [final_downloads]

                                                ],
                                                fields: [
                                                    {
                                                        name: 'Count',
                                                    }
                                                ],
                                            },
                                            meta: {},
                                        },
                                    }}
                                />
                            </div>
                        </div></>)
                    }
                }
                this.setState({ visualizations: visuals })
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

        const flexContainer = {
            display: "flex"
        }

        const flexChildSV = {
            flex: "1",
        }
        const flexChildLine = {
            flex: "2",
        }

        return (
            <StyledContainer stye={{ width: '100%' }}>
                <div><strong>Enter NPM Package or Github Repo. This should include org/owner and the repo name.</strong>
                    <br/>
                    For example: @splunk/create for NPM or splunk/dashpub for Github. 
                    <br/>
                    We also accept comma separated list of repos for example: @splunk/create, @splunk/react-ui:</div>
                <Text onLoad={textLoad()} id="packagelist" defaultValue={current_package} canClear onChange={handleChange} />
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
                <p>{message}</p>
                <>
                    {visualizations.map((visualization) => <div>{visualization}</div>)}
                </>

            </StyledContainer>
        );
    }
}

export default NpmAnalyzer;
