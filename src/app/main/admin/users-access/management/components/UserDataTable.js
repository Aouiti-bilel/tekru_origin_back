import React, { useState, useEffect } from "react";
import {
    Typography,
    Icon,
    Avatar,
    IconButton,
} from "@material-ui/core";
import ReactTable from "react-table";
import { useDispatch, useSelector } from "react-redux";
import * as Actions  from '../store/actions';
import UserCheckBoxComponent from './UserCheckBoxComponent';
import UserSwitchComponent from './UserSwitchComponent';
import UserDeleteIconComponent from './UserDeleteIconComponent';
import { userService } from "app/services/originServices";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';

function UserTable(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();  
    const [users, setUsers] = useState([]);
    const data = useSelector(({ userManager }) => userManager.data);
    const search = useSelector(({ userManager }) => userManager.searchWord);
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        if (!Array.isArray(data) || data.length <= 1) {
            userService
            .getAll()
            .then(response => {
                //console.log(response);
                dispatch(Actions.setUsers(response));
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
        } else {
            setLoading(false);
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (!search) {
            setUsers(data);
        } else {
            const keyword = search.toLowerCase();
            const filters = ['prenom', 'nomFamille', 'courriel', 'fonction'];
            if (Array.isArray(data)) {
                setUsers( data.filter(user => {
                    for (const filterBy of filters) {
                        if (user[filterBy].toLowerCase().indexOf(keyword) >= 0) {
                            return true;
                        }
                    }
                    return false;
                }) );
            }
        }
    }, [search, data]);


    const genAvatar = (row) => {
        let src = row.value;
        if (!src) {
            src = '/assets/images/avatars/profile'+(row.original.sexe === 'M' ? '' : '-f')+'.jpg'
        }
        return (
            <Avatar
                className="mr-8"
                alt={row.original.name}
                src={src}
            />
        )
    }

    const genClickableTypography = ({ value, original }) => {
        return (
            <Typography
                role='button'
                onClick={() => {
                    dispatch(Actions.editUser(original));
                        props.history.push('/admin/users/edit/'+original.id_Emp);
                }}
                style={{color:"black"}}
            >
                {value}
            </Typography>

        )
    }

    const genRowActions = (row) => {
        return (
            <div style={{margin: 'auto'}}>
                <UserDeleteIconComponent userId={row.original.id_Emp} />
                <IconButton
                    onClick={() => {
                        dispatch(Actions.editUser(row.original));
                        props.history.push('/admin/users/edit/'+row.original.id_Emp);
                    }}
                >
                    <Icon>edit</Icon>
                </IconButton>
            </div>
        )
    }

    return (
        loading ? (
            <div style={{padding: '100px 50px', textAlign: 'center'}}>
                <div style={{marginBottom: '30px'}}>Chargement...</div>
                <LinearProgress variant="query" color="secondary"  />
            </div>
        ) : 
        <ReactTable
            className="-striped -highlight h-full rounded-8 overflow-hidden"
            data={users}
            columns={[
                {
                    Header: () => (
                        <UserCheckBoxComponent
                            id={0}
                        />
                    ),
                    Cell: row => (
                        <UserCheckBoxComponent
                            id={row.original.id_Emp}
                        />
                    ),
                    className: 'justify-center',
                    sortable: false,
                    width: 64
                },
                {
                    accessor: "picture",
                    Cell: genAvatar,
                    className: "justify-center",
                    width: 64,
                    sortable: false
                },
                {
                    Header: t("user.name"),
                    accessor: "prenom",
                    filterable: true,
                    className: "font-bold",
                    Cell: genClickableTypography
                },
                {
                    Header: t('user.familyName'),
                    accessor: "nomFamille",
                    filterable: true,
                    className: "font-bold",
                    Cell: genClickableTypography
                },
                {
                    Header: t('email'),
                    accessor: "courriel",
                    filterable: true,
                    className: "font-bold",
                    Cell: genClickableTypography
                },
                {
                    Header: t('user.level'),
                    id: 'niveau',
                    accessor: row => row.description,
                    filterable: true,
                    Cell: genClickableTypography
                },
                {
                    Header: t('user.function'),
                    accessor: "fonction",
                    filterable: true,
                    Cell: genClickableTypography
                },
                {
                    Header: t('cellphone'),
                    accessor: "telCellulaire",
                    filterable: true,
                    Cell: genClickableTypography
                },
                {
                    Header: t('user.active'),
                    accessor: "actif",
                    Cell: row => (
                        <UserSwitchComponent
                            value={row.value}
                            userId={row.original.id_Emp}
                        />
                    ),
                    className: "justify-center",
                    width: 64,
                    sortable: false
                },
                {
                    Header: t('actions'),
                    width: 128,
                    Cell: genRowActions
                }
            ]}
            defaultPageSize={10}
            noDataText= {t('umApp:noUsers')}
        />
    )
}

export default UserTable
