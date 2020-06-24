import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { widgetBvNbHours } from 'app/services/originServices/dashboard.service';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  arrayBadge: {
    width: '10px',
    height: '10px',
    display: 'inline-block',
    background: 'grey',
    borderRadius: '100%',
    margin: '0px 0px 0px 5px',
  }
}));

function Widget(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateSorter, setDateSorter] = useState("date_mandat");
  const [loading, setLoading] = useState(false);

  const possibleDatesSorters = [
    {
      name: t("dashApp:date_mandat"),
      value: "date_mandat",
    },
    {
      name: t("dashApp:date_cloture"),
      value: "closing_date",
    },
  ];

  useEffect(() => {
    queryData(rowsPerPage, dateSorter);
  }, [rowsPerPage, dateSorter]);

  const queryData = (count, dateSorter) => {
    setLoading(true);
    widgetBvNbHours({ count, dateSorter })
      .then(({data, options}) => {
        setLoading(false);
        setDataCount((data || {}).count || 0);
        const dat = ((data || {}).table || []).map((item) => {
          const pf_nf =
            item.billed > 0
              ? (item.billed * 100) / (item.billed + item.noneBilled)
              : 100;
          // Manage colors by options
          let pColor = "green";
          if (item.budget < (item.billed + item.noneBilled)) {
            pColor = "red";
          }
          let customerColor;
          if (options.customers_type_color) {
            customerColor = options.customers_type_color.find(
              (element) => element.type === item.customerType
            ).color;
            if (customerColor === 'yellow') customerColor = "yellow-700";
          }
          return {
            budget: item.budget,
            client: {
              type: item.customerType,
              color: customerColor || "blue",
              name: item.customerName,
            },
            folder_id: item.folder,
            pf_nf: {
              value: Math.round(pf_nf * 100) / 100,
              color: pColor, // black, gray, orange, yellow, green, teal, blue, indigo, purple, pink,
            },
            h_n_billed: item.noneBilled,
            billed: item.billed,
            amountBilled: item.amountBilled,
            amountNoneBilled: item.amountNoneBilled,
          };
        });
        setData(dat);
      })
      .catch((error) => {
        setLoading(false);
        if (process.env.NODE_ENV !== "production") console.error(error);
      });
  };

  const handleOnChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  
  const handleOnChangeDateSorter = (event) => {
    setDateSorter(event.target.value);
  };

  const columns = [
    {
      id: "client_type",
      title: t("dashApp:client_type"),
    },
    {
      id: "client",
      title: t("dashApp:client"),
    },
    {
      id: "folder",
      title: t("dashApp:folder"),
    },
    {
      id: "p_f_nf",
      title: t("dashApp:a_f_nf"),
    },
    {
      id: "none_billed_hours",
      title: t("dashApp:none_billed_hours"),
    },
  ];

  const formatter = new Intl.NumberFormat("fr-CA");
  
  const rows = data.map(row => {
    return {
      id: row.id,
      cells: [
        {
          id: "client_type",
          value: row.client.type,
          classes: `text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-no-wrap bg-${row.client.color}`,
        },
        {
          id: "client_name",
          value: row.client.name,
          classes: "font-bold",
        },
        {
          id: "folder_id",
          value: row.folder_id,
        },
        {
          id: "pf_nf",
          value: (
            <>
              <span>{formatter.format(row.amountNoneBilled)}</span>
              <span className="text-grey">
                {" "}
                / {formatter.format(row.amountBilled)}
              </span>
              <Tooltip
                title={t("dashApp:budget_count", {
                  count: formatter.format(row.budget),
                })}
                aria-label="budget"
              >
                <span
                  className={classes.arrayBadge}
                  style={{ background: row.pf_nf.color }}
                ></span>
              </Tooltip>
            </>
          ),
        },
        {
          id: "h_n_billed",
          value: (
            <>
              {row.h_n_billed}
              <span className="text-grey"> / {row.billed}</span>
            </>
          ),
        },
      ],
    };
  });

  return (
    <Card className="w-full rounded-8 shadow-none border-1 p-16">
      <div className="relative flex flex-row items-center justify-between mb-8">
        <div className="flex">
          <Typography className="h3 sm:h2 mt-4">
            {t("dashApp:hours_not_billed_in_closed_folders")}
          </Typography>
          <Chip label={t('dashApp:n_folder_plural', { count: dataCount })} className="ml-8" color="secondary" />
        </div>
        <div className="flex flex-row items-center">
          <FormControl className={classes.formControl} disabled={loading}>
            <InputLabel id="rows-per-page">{t("lines_to_show")}</InputLabel>
            <Select
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handleOnChangeRowsPerPage}
            >
              {[5, 10, 30, 50].map((item, key) => (
                <MenuItem value={item} key={key}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} disabled={loading}>
            <InputLabel id="rows-per-page">{t("sort_date")}</InputLabel>
            <Select
              id="rows-per-page"
              value={dateSorter}
              onChange={handleOnChangeDateSorter}
            >
              {possibleDatesSorters.map((item, key) => (
                <MenuItem value={item.value} key={key}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="table-responsive">
        <Table className="w-full min-w-full" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} className="whitespace-no-wrap">
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="full-w text-center p-16">
                    {loading ? t("loading") : t("no_data")}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, key) => (
                <TableRow key={key}>
                  {row.cells.map((cell, key) => (
                    <TableCell key={key} component="th" scope="row">
                      <Typography className={cell.classes}>
                        {cell.value}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default React.memo(Widget);
