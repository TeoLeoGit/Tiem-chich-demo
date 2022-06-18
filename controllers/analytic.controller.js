const Order = require('../models/order.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');
const { multipleMongooseToObject, mongooseToObject} = require('../utils/mongooseUtil');

class AnalyticController {
    async getAnalytics(req, res, next) {
        if(req.isAuthenticated()) { 
            console.log(req.query)
            let option = req.query['AnalyticsOption']

            //assign values
            let saleAmount = 0
            let numberOfProduct = 0
            let income = 0
            
            let date_ob = new Date();
            let day = (date_ob.getDate());
            let month = ((date_ob.getMonth() + 1));
            let year = date_ob.getFullYear();

           
            
            let productsSaleAmount = []
            switch(option) {
                case "Today":
                    await Order.getTopSaleProductByDay(day, month, year)
                    .then(result => {
                        productsSaleAmount = result;
                    })
                    .catch(next) 
                    await Order.getIncomeByDay(day, month, year)
                        .then(result => {
                            if(result.length > 0)
                                income = result[0].sumPrice
                        })
                        .catch(next);
                    break;
                case "This month":
                    await Order.getTopSaleProductByMonth(month, year)
                        .then(result => {
                            productsSaleAmount = result;
                        })
                        .catch(next) 
                    await Order.getIncomeByMonth(month, year)
                        .then(result => {
                            if(result.length > 0)
                                income = result[0].sumPrice
                        })
                        .catch(next);
                    break;
                case "This year":
                    await Order.getTopSaleProductByYear(year)
                        .then(result => {
                            productsSaleAmount = result;
                        })
                        .catch(next)
                    await Order.getIncomeByYear(year)
                        .then(result => {
                            if(result.length > 0)
                                income = result[0].sumPrice
                        })
                        .catch(next);
                    break;  
                default:
                    await Order.getTopSaleProductByYear(year)
                        .then(result => {
                            productsSaleAmount = result;
                        })
                        .catch(next)
                    await Order.getIncome()
                        .then(result => {
                            if(result.length > 0)
                                income = result[0].sumPrice
                        })
                        .catch(next);
                    break;  
                }
            await Order.getSaleAmount()
                .then(result => {
                    saleAmount = result
                })
                .catch(next);  
                
            await Product.getNumberOfProduct()
                .then(result => {
                    numberOfProduct = result
                })
                .catch(next);
            
            //render char
            productsSaleAmount = productsSaleAmount.filter(e => e._id !== null)
            await Promise.all(productsSaleAmount.map(async (product) => {
                await Product.getProductById({_id: product._id})
                    .then(result => {
                        product['name'] = result.name
                    })
                    .catch(next);
              }));
            console.log(productsSaleAmount)
            let productList = ''
            let saleDatas = ''
            productsSaleAmount.forEach((element) => { productList = productList + element.name + ', '
                    saleDatas = saleDatas + element.count + ', '
            } )

            let monthsInYear = [{month: 1}, {month: 2}, {month: 3}, {month: 4}, {month: 5}, 
                {month: 6}, {month: 7}, {month: 8}, {month: 9}, {month: 10}, {month: 11}, {month: 12}]
            await Promise.all(monthsInYear.map(async (element) => {
                await Order.getIncomeByMonth(element.month, year)
                    .then(result => {
                        if (result.length > 0)
                            element['income'] = result[0].sumPrice
                        else
                            element['income'] = 0
                    })
                    .catch(next);
              }));
            let incomes = ''
            monthsInYear.forEach((element) => {
                incomes = incomes + element.income + ', '
              })
            console.log(monthsInYear)
            console.log(incomes)
            res.render('analytics/analytics', {
                saleAmount: saleAmount,
                numberOfProduct: numberOfProduct,
                income: (Math.round(income * 100) / 100).toFixed(2),
                products: productList,
                datas: saleDatas,
                incomes: incomes
            })
        }
        else   
            res.redirect('/login')
    }
}

module.exports = new AnalyticController();