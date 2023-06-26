import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import { get } from '../services/HttpService'


export default class ViewCustomers extends Component {

    state = {
        customers: [],
        page: 0,
        totalNum: 0
    }

    fetchData = async () => {
        let queryParams = queryString.parse(this.props.location.search);
        console.log(queryParams);
        let searchStr = this.makeSearchString(queryParams);
        console.log(searchStr);
        let { data } = await get(`/getCustomers?${searchStr}`);
        console.log(data);
        this.setState({ customers: data.items, page: data.page, totalNum: data.totalNum })
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
        this.callURL('/allCustomers', queryParams)
    }


    render() {
        let { customers = [], page, totalNum } = this.state;
        let totalItems = 5;
        let startIndex = (page - 1) * totalItems;
        let endIndex = totalNum > startIndex + totalItems - 1
            ? startIndex + totalItems - 1
            : totalNum - 1;

        console.log('Start Index:', startIndex);
        console.log('End Index:', endIndex);
        console.log('Items Per Page:', totalItems);
        console.log('Total Items:', totalNum);

        return (
            <div className="container text-center">
                <h1 className='mt-3'>ALL CUSTOMERS</h1>
                <div className='text-start fst-italic fw-bold'>{startIndex + 1} - {endIndex + 1} of {totalNum}</div>
                <div class="row bg-light fw-bold lead my-table-header mt-3">
                    <div className="col-sm-2">Name</div>
                    <div className="col-sm-3">State</div>
                    <div className="col-sm-2">City</div>
                    <div className="col-sm-2">PAN</div>
                    <div className="col-sm-3">DOB</div>
                </div>
                {
                    customers.map(customer =>
                        <div class="row lead my-table">
                            <div className="col-sm-2">{customer.name}</div>
                            <div className="col-sm-3">{customer.state}</div>
                            <div className="col-sm-2">{customer.city}</div>
                            <div className="col-sm-2">{customer.PAN}</div>
                            <div className="col-sm-3">{customer.dob}</div>
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
        )
    }
}

