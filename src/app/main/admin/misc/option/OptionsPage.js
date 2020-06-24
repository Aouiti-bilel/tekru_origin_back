import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import { FusePageSimple } from '@fuse';
import { Link } from "react-router-dom";
import MainComponent from './sub-component/MainComponent';
import { useTranslation } from 'react-i18next';

const styles = theme => ({
	layoutRoot: {}
});

function OptionsPage(props) {
	const { classes } = props;
	const { t } = useTranslation();

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
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
								{t("administration")}
							</Typography>
							<span style={{
								margin: '0px 5px',
							}}>/</span>
							<Typography color="textSecondary"><strong>{t("settings")}</strong></Typography>
						</div>
					</div>
				</div>
			}
			content={
				<div className="p-16 sm:p-24">
					<MainComponent />
				</div>
			}
		/>
	)
}

export default withStyles(styles, { withTheme: true })(OptionsPage);