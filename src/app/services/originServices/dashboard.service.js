import { jwtService } from 'app/services/originServices';
import gql from 'graphql-tag'
import apolloService from '../apolloService'

export async function widgetReceivedFolder(){
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetReceivedFolder {
              widgetReceivedFolder {
                active
                graph {
                  name
                  value
                }
                data {
                  type
                  value
                  change
                }
              }
            }
          `
        )
      )
      .then(({ data }) => {
        resolve(data.widgetReceivedFolder);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
};

export async function widgetIncomeVsGoals(){
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetIncomeVGoals {
              widgetIncomeVGoals {
                name
                data { value name }
              }
            }
          `
        )
      )
      .then(({ data }) => {
        resolve(data.widgetIncomeVGoals);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
};

export async function widgetSTEC(opts){
  const { period } = opts || {}
  let options = [];
  if (!!period) {
    options.push({
      name: "period",
      value: `${period}`, // Force to string
    });
  }
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetSTEC($options: [queryOption]) {
              widgetSTEC(options: $options) {
                name
                data { value name }
              }
            }
          `,
          { options }
        )
      )
      .then(({ data }) => {
        resolve(data.widgetSTEC);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
};

export async function widgetBudgetAndDelais(opts){
  const { period } = opts || {}
  let options = [];
  if (!!period) {
    options.push({
      name: "period",
      value: `${period}`, // Force to string
    });
  }
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetBudgetAndDelais($options: [queryOption]) {
              widgetBudgetAndDelais(options: $options) {
                name
                data { value name }
              }
            }
          `,
          { options }
        )
      )
      .then(({ data }) => {
        resolve(data.widgetBudgetAndDelais);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
};

export async function widgetBvNbHours({ count, dateSorter }){
  let options = [];
  if (!!parseInt(count)) {
    options.push({
      name: "count",
      value: `${count}`, // Force to string
    });
  }
  if (dateSorter) {
    options.push({
      name: "dateSorter",
      value: `${dateSorter}`,
    });
  }
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetBvNbHours($options: [queryOption]) {
              widgetBvNbHours(options: $options) {
                count
                table {
                  folder
                  customerType
                  customerName
                  billed
                  noneBilled
                  amountBilled
                  amountNoneBilled
                  budget
                }
              }
              options(slugs: ["dbrd_wgt5_prctg_color", "customers_type_color"]) {
                name
                value
              }
            }
          `,
          { options }
        )
      )
      .then(({ data }) => {
        const options = {};
        (data.options || []).map(({name, value}) => options[name] = JSON.parse(value))
        resolve({
          data: data.widgetBvNbHours,
          options,
        });
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
};

function queryGen(query, variables=null) {
  return {
    variables,
    query,
    context: {
      headers: {
        authorization: "Bearer " + jwtService.getAccessToken(),
      },
    },
  };
}

function handleError(error, reject) {
	console.error(error);
  reject(error);
}