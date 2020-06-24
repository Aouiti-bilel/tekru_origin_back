import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { widgetIncomeVsGoals } from "app/services/originServices/dashboard.service";

const useStyles = makeStyles(theme => ({
	h240: {
		height: '255px',
	},
}));

function Widget(props) {
	const classes = useStyles(props);
	const { t } = useTranslation();
	const theme = useTheme();
	
	const [loading, setLoading] = useState([]);
	const [data, setData] = useState({
    goal: [{ x: new Date(), y: 0 }],
    income: [{ x: new Date(), y: 0 }],
    cumulativeIncome: [{ x: new Date(), y: 0 }],
  });

	useEffect(() => {
		setLoading(true);
		widgetIncomeVsGoals()
      .then((response) => {
				const data = {}
				response.map(
          (element) =>
            (data[element.name] = element.data.map((d, k) => ({
              x: d.name,
              y: d.value,
            })))
        );
				setData(data);
				setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	const widget = {
    datasets: [
      {
        type: "line",
        label: t("dashApp:goal"),
        data: data.goal,
        fill: false,
        pointRadius: 0,
        lineTension: 0,
      },
      {
        type: "line",
        label: t("dashApp:income"),
        data: data.cumulativeIncome,
        fill: false,
        pointRadius: 0,
        lineTension: 0,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
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
              displayFormats: { day: "MM/YY" },
              tooltipFormat: "DD/MM/YY",
              unit: "month",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
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
		<Card className="w-full rounded-8 shadow-none border-1 p-16"  style={{ opacity: loading ? 0.6 : 1 }}>
			<Typography className="h3" color="textSecondary">
				{t('dashApp:income_v_goals')}
			</Typography>

			<div className={`w-full pt-24 ${classes.h240}`}>
				<Bar
					data={{
						datasets: widget.datasets.map((obj, index) => {
							const palette = theme.palette[index === 0 ? 'primary' : 'secondary'];
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
				<Button size="small" disabled>{t('dashApp:button.see_all_my_bills')}</Button>
			</div>
		</Card>
	);
}

export default React.memo(Widget);
