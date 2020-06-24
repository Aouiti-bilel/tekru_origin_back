import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { widgetBudgetAndDelais } from "app/services/originServices/dashboard.service";

const useStyles = makeStyles((theme) => ({
  h240: {
    height: "400px",
  },
  chartName: {
		width: '100%',
		textAlign: 'center',
	},
}));

function Widget(props) {
	const classes = useStyles(props);
	const { t } = useTranslation();
	const theme = useTheme();

	const [dataset, setDataset] = React.useState("quarter");
  const [loading, setLoading] = useState([]);
  const datasets = ["year", "quarter", "month", "week"];
  const [data, setData] = useState({
    budget: [],
    delais_exam: [],
    delais_redaction: [],
    delais_revision: [],
  });

  useEffect(() => {
    setLoading(true);
    widgetBudgetAndDelais({ period: dataset })
      .then((response) => {
        const data = {};
        response.map((e) => {
          return data[e.name] = e.data;
        });
        data.budget = data.budget.sort((a, b) => {
          if (a.name < b.name) return -1;
          else if (a.firstname > b.firstname) return 1;
          else return 0;
        });
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset]);

	const widget1 = {
    datasets: [
      {
        type: "bar",
        label: t("dashApp:budget"),
        data: (data.budget || []).map((e) => {
          if (e.value >= 80) {
            return 80;
          } else {
            return e.value;
          }
        }),
        fill: true,
      },
      {
        type: "bar",
        label: t("dashApp:danger_zone"),
        backgroundColor: "#FFA400",
        data: (data.budget || []).map((e) => {
          if (e.value > 80) {
            return e.value >= 100 ? 20 : (e.value - 80);
          } else {
            return 0;
          }
        }),
        fill: true,
      },
      {
        type: "bar",
        label: t("dashApp:overshoot"),
        backgroundColor: "#f44336",
        data: (data.budget || []).map((e) => {
          if (e.value > 100) {
            return e.value - 100;
          } else {
            return 0;
          }
        }),
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
            stacked: true,
            display: true,
            gridLines: {
              display: false,
            },
            labels: (data.budget || []).map((e) => e.name),
          },
        ],
        yAxes: [
          {
            stacked: true,
            type: "linear",
            display: true,
            position: "left",
            gridLines: {
              display: true,
            },
            ticks: {
              beginAtZero: true,
            },
            labels: {
              show: true,
            },
          },
        ],
      },
      tooltips: {
        intersect: false,
        mode: "index",
        callbacks: {
          label: function (tooltipItem, { datasets }) {
            const value = parseFloat(tooltipItem.value);
            if (value === 0) {
              return "";
            }
            const trueValue = datasets
              .map((dset) => dset.data[tooltipItem.index])
              .reduce((sum, value) => sum + value);
            
            let label = datasets[tooltipItem.datasetIndex].label || "";
            if (label) {
              label += ": ";
            }
            label += `${round(value === 80 ? trueValue : value)} %`;

            return label;
          },
        },
      },
    },
  }; 
  
  const round = (number) => {
    return (Math.round((number + Number.EPSILON) * 100) / 100);
  }

	const widget2 = {
    ...widget1,
    datasets: [
      {
        type: "bar",
        backgroundColor: "#039BE6",
        label: t("dashApp:delais_exam", { count: 2 }),
        data: data.delais_exam.map((e) => e.value),
      },
      {
        type: "bar",
        backgroundColor: "#00D1D7",
        label: t("dashApp:delais_redaction", { count: 2 }),
        data: data.delais_redaction.map((e) => e.value),
      },
      {
        type: "bar",
        backgroundColor: "#9FF389",
        label: t("dashApp:delais_revision", { count: 2 }),
        data: data.delais_revision.map((e) => e.value),
      },
    ],
    options: {
      ...widget1.options,
      tooltips: {
        intersect: false,
        mode: "index",
        callbacks: {
          label: function (tooltipItem, { datasets }) {
            const value = parseFloat(tooltipItem.value);
            if (!value) {
              return "";
            }

            let label = datasets[tooltipItem.datasetIndex].label || "";
            if (label) {
              label += ": ";
            }
            label += t("calendar.nDay", { count: value });

            return label;
          },
        },
      },
    },
  }; 

	return (
    <Card className="w-full rounded-8 shadow-none border-1 p-16" style={{ opacity: loading ? 0.6 : 1 }}>
      <div className="relative flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <Typography className="h3 sm:h2">
            {t("dashApp:reports_delais_and_budgets_active_folders")}
          </Typography>
        </div>

        <div className="flex flex-row items-center">
          {datasets.map((e, key) => (
            <Button
              key={key}
              className="py-8 px-12"
              size="small"
              onClick={() => setDataset(e)}
              disabled={e === dataset}
            >
              {t(`calendar.${e}`)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-row flex-wrap mb-16">
        <div className={`w-full pt-24 w-full sm:w-1/2`}>
          <div className={`${classes.h240} mb-8`}>
            <Bar
              data={{
                datasets: widget1.datasets.map((obj, index) => {
                  const palette =
                    theme.palette[index === 0 ? "secondary" : "primary"];
                  return {
                    ...obj,
                    borderColor: obj.borderColor || palette.main,
                    backgroundColor: obj.backgroundColor || palette.main,
                    pointBackgroundColor:
                      obj.pointBackgroundColor || palette.dark,
                    pointHoverBackgroundColor:
                      obj.pointHoverBackgroundColor || palette.main,
                    pointBorderColor:
                      obj.pointBorderColor || palette.contrastText,
                    pointHoverBorderColor:
                      obj.pointHoverBorderColor || palette.contrastText,
                  };
                }),
              }}
              options={widget1.options}
            />
          </div>
          <div className={classes.chartName}>{t("dashApp:budget")}</div>
        </div>

        <div className="w-full pt-24 w-full sm:w-1/2">
          <div className={`${classes.h240} mb-8`}>
            <Bar
              data={{
                datasets: widget2.datasets.map((obj, index) => {
                  const palette =
                    theme.palette[index === 0 ? "primary" : "secondary"];
                  return {
                    ...obj,
                    borderColor: obj.borderColor || palette.main,
                    backgroundColor: obj.backgroundColor || palette.main,
                    pointBackgroundColor:
                      obj.pointBackgroundColor || palette.dark,
                    pointHoverBackgroundColor:
                      obj.pointHoverBackgroundColor || palette.main,
                    pointBorderColor:
                      obj.pointBorderColor || palette.contrastText,
                    pointHoverBorderColor:
                      obj.pointHoverBorderColor || palette.contrastText,
                  };
                }),
              }}
              options={widget2.options}
            />
          </div>
          <div className={classes.chartName}>{t("dashApp:delais")}</div>
        </div>
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
