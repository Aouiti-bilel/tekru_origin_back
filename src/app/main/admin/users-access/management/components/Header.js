import React from "react";
import { FuseAnimate } from "@fuse";
import {
    Typography,
    Icon,
    Paper,
    Input,
    Button
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {ThemeProvider} from "@material-ui/styles";
import {useSelector, useDispatch} from "react-redux";
import * as Actions  from '../store/actions';
import { useTranslation } from 'react-i18next';

function Header(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainTheme = useSelector(({fuse}) => fuse.settings.mainTheme);
    const { searchTrigger, loading } = props
    const searchWord = useSelector(({ userManager }) => userManager.searchWord);

    const search = (event) => {
        dispatch(Actions.setSearchWord(event.target.value));
        if (typeof searchTrigger === 'function') {
            searchTrigger(event.target.value);
        }
    }

    return (
        <div className="flex flex-1 w-full items-center justify-between">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <div className="flex flex-col items-start max-w-full">
                    <div className="flex flex-1 items-center justify-between p-24">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <Icon className="text-18" color="action">
                                    build
                                </Icon>
                                <Icon className="text-16" color="action">
                                    chevron_right
                                </Icon>
                                <Typography
                                    component={Link}
                                    role="button"
                                    to="/admin"
                                    color="textSecondary"
                                >
                                    {t("administration")}
                                </Typography>
                                <Typography color="textSecondary" className="mx-6">
                                    /
                                </Typography>
                                <Typography color="textSecondary">
                                <strong>{t("umApp:title")}</strong>
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
            <ThemeProvider theme={mainTheme} >
                <FuseAnimate animation="transition.fadeIn" delay={300}>
                    <Paper className="flex p-4 items-center w-full max-w-512 px-8 py-4" elevation={1}>
                        <Icon className="mr-8" color="action">search</Icon>
                        <Input
                            placeholder={t('search')}
                            className="flex flex-1"
                            disableUnderline
                            fullWidth
                            onChange={search}
                            disabled={loading}
                            value={searchWord || ""}
                            inputProps={{
                                'aria-label': t('search')
                            }}
                        />
                    </Paper>
                </FuseAnimate>
            </ThemeProvider>
            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                    className="whitespace-no-wrap"
                    variant="contained"
                    component={Link}
                    disabled={loading}
                    role="button"
                    to="/admin/users/add"
                    onClick={() => {
                        dispatch(Actions.resetUserForm())
                    }}
                >
                   {t("create")}
                </Button>
            </FuseAnimate>
        </div>
    )
}

export default Header
