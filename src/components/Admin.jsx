import React, { Component } from 'react';

export default class Admin extends Component {
    render() {
        let { user } = this.props;
        const BANK_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/First_Bank_of_the_United_States%2C_Philadelphia%2C_Pennsylvania_LCCN2011633532_%28edited%29.jpg/1200px-First_Bank_of_the_United_States%2C_Philadelphia%2C_Pennsylvania_LCCN2011633532_%28edited%29.jpg';

        return (
            <div className="container">
                <div className="row text-center">
                    <h1 className='text-danger fs-1 fw-bold my-3'>Welcome To GBI Bank {user && user.role != 'manager' && <span className='text-success fw-bold'>Customer Portal</span>}</h1>
                    <div>
                        <img src={BANK_IMG} className='bank border border-5 border-dark' alt="GBI Bank" />
                    </div>
                </div>
            </div>
        )
    }
}
