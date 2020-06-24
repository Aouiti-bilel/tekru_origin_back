import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Icon,
    Typography
} from '@material-ui/core';
import { FusePageCarded } from '@fuse';
import { jwtService } from 'app/services/originServices';
import AccessComponent from './sub-component/AccessComponent';
import { Link } from "react-router-dom";

const styles = theme => ({
    layoutRoot: {}
});

class AccessesPage extends Component {
    constructor(props) {
        super(props);
        // init the state
        this.state = {
            accesses: [],
            levels: [],
            accesstemplate: [],
        }
    }

    getData() {
        // Get the data from API
        jwtService.getAccessData().then(response => {
            let tempData = [];
            response.levels.forEach((level) => {
                level.accesses.forEach((access) => {
                    let temp = {}
                    temp.ids = {
                        level: level.niveau,
                        access: access.id,
                    };
                    temp.level = level.description;
                    temp.access = access.accessName;
                    temp.value = access.value;
                    tempData.push(temp);
                });
            });
            this.setState({
                accesses: tempData,
                levels: response.levels,
                accesstemplate: response.accesses
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const { classes } = this.props;
        return (
            <FusePageCarded
                classes={{
                    root: classes.layoutRoot,
                }}
                header={
                    <div className="flex flex-1 items-center justify-between p-24">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <Icon className="text-18" color="action">build</Icon>
                                <Icon className="text-16" color="action">chevron_right</Icon>
                                <Typography
                                    component={Link}
                                    role="button"
                                    to="/admin"
                                    color="textSecondary"
                                >
                                    Administration
                                </Typography>
                                <span style={{
                                    margin: '0px 5px',
                                }}>/</span>
                                <Typography color="textSecondary"><strong>Gestion des droits utilisateurs</strong></Typography>
                            </div>
                        </div>
                    </div>
                }
                content={
                    <AccessComponent
                        levels = {
                            this.state.levels
                        }
                        accesses = {
                            this.state.accesses
                        }
                        accesstemplate = {
                            this.state.accesstemplate
                        }
                    />               
                }
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })( AccessesPage );