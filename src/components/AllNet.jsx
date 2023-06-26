import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { get } from '../services/HttpService'
import OptionsCB from './OptionsCB'


export default class AllNet extends Component {

    state = {
        net: [],
        banks: [],
        amounts: ['<10000', '>=10000'],
        optionscb: {
            bank: '',
            amount: ''
        },
        page: 0,
        totalNum: 0
    }

    fetchData = async () => {
        try {
            let queryParams = queryString.parse(this.props.location.search);
            let searchStr = this.makeSearchString(queryParams);
            let { data } = await get(`/getAllNetBankings?${searchStr}`);
            let banks = await get(`/getBanks`);
            this.setState({ net: data.items, banks: banks.data, page: data.page, totalNum: data.totalNum })
        } catch (error) {
            console.log('ERROR: ', error.message);
        }
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
        console.log(searchStr);
        this.props.history.push({ pathname: url, search: searchStr })
    }

    makeSearchString = (options) => {
        let { page = 1, bank, amount } = options;
        let searchStr = '';
        searchStr = this.addToQueryString(searchStr, 'page', page);
        searchStr = this.addToQueryString(searchStr, 'bank', bank);
        searchStr = this.addToQueryString(searchStr, 'amount', amount);
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
        this.callURL('/allNet', queryParams)
    }

    handleOptionChange = (options) => {
        this.setState({ optionscb: options })
        this.callURL(`/allNet`, options)
    }

    render() {
        let { net = [], banks = [], amounts = [], optionscb = {}, page, totalNum } = this.state;
        let totalItems = 5;
        let startIndex = (page - 1) * totalItems;
        let endIndex = totalNum > startIndex + totalItems - 1
            ? startIndex + totalItems - 1
            : totalNum - 1;

        return (
            <div className="container">
                <h1 className='mt-3'>ALL NET BANKING TRANSACTIONS</h1>
                <div className="row">
                    <div className="col-sm-3">
                        <OptionsCB banksArr={banks} amountsArr={amounts} options={optionscb} onOptionChange={this.handleOptionChange} />
                    </div>
                    <div className="col-sm-9">
                        <div className='text-start fst-italic fw-bold'>{startIndex + 1} - {endIndex + 1} of {totalNum}</div>
                        <div class="row bg-light fw-bold lead my-table-header mt-3">
                            <div className="col-sm-2">Name</div>
                            <div className="col-sm-3">Payee Name</div>
                            <div className="col-sm-3">Amount</div>
                            <div className="col-sm-2">Bank Name</div>
                            <div className="col-sm-2">Comment</div>
                        </div>
                        {
                            net.map(net =>
                                <div class="row lead my-table">
                                    <div className="col-sm-2">{net.name}</div>
                                    <div className="col-sm-3">{net.payeeName}</div>
                                    <div className="col-sm-3">{net.amount}</div>
                                    <div className="col-sm-2">{net.bankName}</div>
                                    <div className="col-sm-2">{net.comment}</div>
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
                    </div>
                </div>
            </div>
        )
    }
}

