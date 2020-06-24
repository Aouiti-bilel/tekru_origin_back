import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import { widgetReceivedFolder } from "app/services/originServices/dashboard.service";

function Widget(props) {
	const { t } = useTranslation();
	const theme = useTheme();

	const [data, setData] = useState({
    activeFolders: 0,
		indicatorColor: "grey",
		graph: [67000, 54000, 82000, 57000, 72000, 57000, 87000, 72000, 89000, 98700, 112000, 136000, 110000, 149000, 98000],
		graphColor: 'grey',
		array: [
      {
        label: t("calendar.nDay", { count: 7 }),
        number: 0,
        color: "grey",
        change: 0,
      },
      {
        label: t("calendar.nDay", { count: 30 }),
        number: 0,
        color: "grey",
        change: 0,
      },
      {
        label: t("calendar.nMonth", { count: 3 }),
        number: 0,
        color: "grey",
        change: 0,
      },
    ],
	});
	
	const [loading, setLoading] = useState([]);

	useEffect(() => {
		setLoading(true);
    widgetReceivedFolder()
      .then((data) => {
        setLoading(false);
        setData({
          activeFolders: data.active,
          indicatorColor: "#039be6",
          graph: data.graph,
          array: (data.data || []).map((e) => ({
            label: genLabel(e.type),
            number: e.value,
            change: e.change,
            color: "#039be6",
          })),
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const genLabel = (v) => {
    switch (v) {
      case "this_month":
        return t("calendar.nDay", { count: 30 });
      case "this_quarter":
        return t("calendar.nMonth", { count: 3 });
      default:
        return t("calendar.nDay", { count: 7 });
    }
	};
	
	const chartData = {
    chartType: "line",
    datasets: [
      {
        label: t("dashApp:folder", { count: 2 }),
        data: (data.graph || []).map((e) => e.value),
        fill: false,
      },
    ],
    labels: (data.graph || []).map((e) => e.name),
    options: {
      spanGaps: false,
      legend: {
        display: false,
      },
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 2,
          borderWidth: 1,
          hoverRadius: 2,
          hoverBorderWidth: 1,
        },
        line: {
          tension: 0,
        },
      },
      layout: {
        padding: {
          top: 24,
          left: 16,
          right: 16,
          bottom: 16,
        },
      },
      scales: {
        xAxes: [{ display: false }],
        yAxes: [{ display: false, ticks: {} }],
      },
    },
  };

	const useStyles = makeStyles(theme => ({
		badge: {
			background: data && data.indicatorColor ? data.indicatorColor : 'grey',
			top: '20px',
			right: '-20px',
		},
		arrayBadge: {
			width: '10px',
			height: '10px',
			display: 'inline-block',
			background: 'grey',
			borderRadius: '100%',
			margin: '0px 0px 3px 5px',
		}
	}));

	const classes = useStyles(props);

	return (
    <Card className="w-full rounded-8 shadow-none border-1 p-16" style={{ opacity: loading ? 0.6 : 1 }}>
      <Typography className="h3" color="textSecondary">
        {t("dashApp:received_active_folders")}
      </Typography>
      <div className="flex flex-row flex-wrap items-end">
        <div className="flex">
          <Typography className="text-56 font-300 leading-none mt-8">
            <Badge badgeContent={""} classes={{ badge: classes.badge }}>
              {data.activeFolders}
            </Badge>
          </Typography>
        </div>
        <div className="ml-40 text-16 w-1/2 flex flex-row items-center">
          <Typography className="whitespace-normal">
            {t("dashApp:total_of_received_actif_folders")}
          </Typography>
        </div>
      </div>

      <div className="h-96 w-100-p">
        <Line
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map((obj) => ({
              ...obj,
              borderColor: theme.palette.secondary.main,
            })),
          }}
          options={chartData.options}
        />
      </div>

      <div className="flex flex-row items-center justify-center">
        {data.array.map((item, index) => (
          <div key={index} className="px-16 flex flex-col items-center">
            <Typography className="h4" color="textSecondary">
              {item.label}
            </Typography>
            <Typography className="h2 font-300 py-8">
              {item.number}
              <span
                className={classes.arrayBadge}
                style={{ background: item.color }}
              ></span>
            </Typography>

            <div className="flex flex-row items-center justify-center">
              {item.change < 0 && (
                <Icon className="text-18 text-red">arrow_downward</Icon>
              )}

              {item.change > 0 && (
                <Icon className="text-18 text-green">arrow_upward</Icon>
              )}
              <div className="h5 px-4">{Math.round(item.change)}%</div>
            </div>
          </div>
        ))}
      </div>

      <Divider className="my-16" />

      <div className="flex flex-row justify-end">
        <Button size="small" disabled>
          {t("dashApp:button.see_all_my_folders")}
        </Button>
      </div>
    </Card>
  );
}

export default React.memo(Widget);
