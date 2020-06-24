import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Icon, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse';
import { useTranslation } from "react-i18next";
import WidgetReceivedFolder from './widgets/WidgetReceivedFolder';
import WidgetGoal from './widgets/WidgetGoal';
import WidgetInProgress from './widgets/WidgetInProgress';
import WidgetDelaisBudget from "./widgets/WidgetDelaisBudget";
import WidgetHoursNotBilledInClosedFolders from "./widgets/WidgetHoursNotBilledInClosedFolders";

const styles = theme => ({
	layoutRoot: {}
});

function Dashboard(props) {
	const { t } = useTranslation();
	const { classes } = props;
	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-1 items-center justify-between p-24">
					<div className="flex flex-col">
						<div className="flex items-center">
							<Icon className="text-18" color="action">dashboard</Icon>
							<Icon className="text-16" color="action">chevron_right</Icon>
							<Typography color="textSecondary">{t("dashboard")}</Typography>
						</div>
					</div>
				</div>
			}
			content={
				<>
					<div className="flex flex-col md:flex-row sm:p-8 container  mb-32">
						<div className="flex flex-1 flex-col min-w-0">
							<div className="flex flex-col sm:flex sm:flex-row">
								<div className="widget flex w-full sm:w-1/3 p-16">
									<WidgetReceivedFolder />
								</div>

								<div className="widget flex w-full sm:w-2/3 p-16">
									<WidgetGoal />
								</div>
							</div>
							<div className="flex flex-col sm:flex sm:flex-row">
								<div className="widget flex w-full p-16">
									<WidgetInProgress />
								</div>
							</div>
							<div className="flex flex-col sm:flex sm:flex-row">
								<div className="widget flex w-full p-16">
									<WidgetDelaisBudget />
								</div>
							</div>
							<div className="flex flex-col sm:flex sm:flex-row">
								<div className="widget flex w-full p-16">
									<WidgetHoursNotBilledInClosedFolders />
								</div>
							</div>
						</div>
						<div className="flex flex-wrap w-full md:w-320 pt-16">

						</div>
					</div>
				</>
			}
		/>
	)
}

export default withStyles(styles, {
	withTheme: true
})(Dashboard);