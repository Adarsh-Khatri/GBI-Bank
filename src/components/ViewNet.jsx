import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { get } from '../services/HttpService'


export default class ViewNet extends Component {

    state = {
        net: [],
        page: 0,
        totalNum: 0
    }

    fetchData = async () => {
        let { user } = this.props;
        let queryParams = queryString.parse(this.props.location.search);
        let searchStr = this.makeSearchString(queryParams);
        let { data } = await get(`/getNetBankingByName/${user.name}?${searchStr}`);
        this.setState({ net: data.items, page: data.page, totalNum: data.totalNum })
    }

    componentDidMount() {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props)
            this.fetchData()
    }

    callURL = (url, options) => {
        let searchStr = this.makeSearchString(options);
        this.props.history.push({ pathname: url, search: searchStr })
    }

    makeSearchString = (options) => {
        let { page } = options;
        let searchStr = '';
        searchStr = this.addToQueryString(searchStr, 'page', page);
        return searchStr;
    };

    addToQueryString = (str, paramName, paramValue) =>
        paramValue ? str ? `${str}&${paramName}=${paramValue}` :
            `${paramName}=${paramValue}` : str;


    handlePage = (num) => {
        let queryParams = queryString.parse(this.props.location.search);
        let { page = '1' } = queryParams;
        let newPage = +page + num;
        queryParams.page = newPage;
        this.callURL('/viewNet', queryParams)
    }


    render() {
        let { net = [], page, totalNum } = this.state;
        let totalItems = 5;
        let startIndex = (page - 1) * totalItems;
        let endIndex = totalNum > startIndex + totalItems - 1
            ? startIndex + totalItems - 1
            : totalNum - 1;

        return (
            <div className="container text-center">
                <h1 className='mt-3'>ALL NET BANKING DETAILS</h1>
                {
                    net.length === 0 ? <h1 className='text-danger fw-bold'>No Transactions To Show</h1> : (
                        <>
                            <div className='text-start fst-italic fw-bold'>{startIndex + 1} - {endIndex + 1} of {totalNum}</div>
                            <div class="row bg-light fw-bold lead my-table-header mt-3">
                                <div className="col-sm-3">Payee Name</div>
                                <div className="col-sm-3">Amount</div>
                                <div className="col-sm-3">Bank Name</div>
                                <div className="col-sm-3">Comment</div>
                            </div>
                            {
                                net.map(customer =>
                                    <div class="row lead my-table">
                                        <div className="col-sm-3">{customer.payeeName}</div>
                                        <div className="col-sm-3">{customer.amount}</div>
                                        <div className="col-sm-3">{customer.bankName}</div>
                                        <div className="col-sm-3">{customer.comment}</div>
                                    </div>
                                )
                            }
                            <div className="row my-3">
                                <div className="col-sm-2">
                                    {
                                        startIndex > 0 ? (
                                            <button className='btn btn-outline-primary fw-bold' onClick={() => this.handlePage(-1)}>Prev</button>
                                        ) : ('')
                                    }
                                </div>
                                <div className="col-sm-8"></div>
                                <div className="col-sm-2">
                                    {
                                        startIndex + totalItems < totalNum ? (
                                            <button className='btn btn-outline-success fw-bold' onClick={() => this.handlePage(1)}>Next</button>
                                        ) : ('')
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        )
    }
}

