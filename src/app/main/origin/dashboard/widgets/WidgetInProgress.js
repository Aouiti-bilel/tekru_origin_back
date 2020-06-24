import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { widgetSTEC } from "app/services/originServices/dashboard.service";

const useStyles = makeStyles(theme => ({
	h240: {
		height: '400px',
	},
}));

function Widget(props) {
	const classes = useStyles(props);
	const { t } = useTranslation();
	const theme = useTheme();

	const [dataset, setDataset] = useState("quarter");
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState([]);
	const datasets = ["year", "quarter", "month"];

	useEffect(() => {
		setLoading(true);
		widgetSTEC({period: dataset})
		.then((response) => {
			setLoading(false);
			setData(
        response[0].data.map((e) => ({
          x: e.name,
          y: e.value,
        }))
      );
		})
		.catch((error) => {
			setLoading(false);
			console.log(error);
		});
	}, [dataset]);
	
	const widget = {
    datasets: [
      {
        type: "bar",
        label: t("dashApp:folder", { count: 2 }),
        data,
        fill: true,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            distribution: "series",
            offset: true,
            ticks: {
              major: {
                enabled: true,
                fontStyle: "bold",
              },
              source: "data",
              autoSkip: true,
              autoSkipPadding: 75,
              maxRotation: 0,
              sampleSize: 100,
            },
            time: {
              displayFormats: { day: "MMM YYYY" },
              tooltipFormat: dataset === "year" ? "MMM YYYY" : "DD/MM/YY",
              unit: dataset === "year" ? "month" : "day",
            },
          },
        ],
        yAxes: [
          {
						ticks: {
                beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: "CAD",
            },
          },
        ],
      },
      tooltips: {
        intersect: false,
        mode: "index",
        callbacks: {
          label: function (tooltipItem, myData) {
            var label = myData.datasets[tooltipItem.datasetIndex].label || "";
            if (label) {
              label += ": ";
            }
            label += formatter.format(tooltipItem.value);
            return label;
          },
        },
      },
    },
	}; 

	const formatter = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  });

	return (
		<Card className="w-full rounded-8 shadow-none border-1 p-16" style={{ opacity: loading ? 0.6 : 1 }}>
			<div className="relative flex flex-row items-center justify-between">
				<div className="flex flex-col">
					<Typography className="h3 sm:h2">{t('dashApp:in_progress_title')}</Typography>
				</div>

				<div className="flex flex-row items-center">
					{ datasets.map(key => (
						<Button
							key={key}
							className="py-8 px-12"
							size="small"
							onClick={() => setDataset(key)}
							disabled={key === dataset}
						>
							{t(`calendar.${key}`)}
						</Button>
					)) }
				</div>
			</div>

			<div className={`w-full pt-24 ${classes.h240}`}>
				<Bar
					data={{
						datasets: widget.datasets.map((obj, index) => {
							const palette = theme.palette[index === 0 ? 'secondary' : 'primary'];
							return {
								...obj,
								borderColor: palette.main,
								backgroundColor: palette.main,
								pointBackgroundColor: palette.dark,
								pointHoverBackgroundColor: palette.main,
								pointBorderColor: palette.contrastText,
								pointHoverBorderColor: palette.contrastText
							};
						})
					}}
					options={widget.options}
				/>
			</div>

			<Divider className="my-16" />

			<div className="flex flex-row justify-end">
				<Button size="small" disabled>{t('dashApp:button.see_all_my_folders')}</Button>
			</div>
		</Card>
	);
}

export default React.memo(Widget);
