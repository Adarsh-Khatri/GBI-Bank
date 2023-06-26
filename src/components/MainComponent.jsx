import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import ViewCustomers from './ViewCustomers';
import AddCustomer from './AddCustomer';
import AllCheque from './AllCheque';
import AllNet from './AllNet';
import ViewCheque from './ViewCheque';
import ViewNet from './ViewNet';
import CustomerDetails from './CustomerDetails';
import NomineeDetails from './NomineeDetails';
import AddPayee from './AddPayee';
import ChequeDetails from './ChequeDetails';
import NetBankingDetails from './NetBankingDetails';
import Login from './Login';
import Logout from './Logout';
import NotFound from './NotFound';
import { getUser } from '../services/AuthService';
import Admin from './Admin';

export default class MainComponent extends Component {
    render() {
        const user = getUser()
        console.log('USER: ', user);
        return (
            <div className="container-fluid">
                <Navbar user={user} />

                <Switch>

                    <Route path="/allCustomers" render={props => user ? user.role === 'manager' ? <ViewCustomers {...props} user={user} /> : <Redirect to="notfound" /> : <Redirect to="login" />} />

                    <Route path="/addCustomers" render={props => user ? user.role === 'manager' ? <AddCustomer {...props} user={user} /> : <Redirect to="notfound" /> : <Redirect to="login" />} />

                    <Route path="/allCheque" render={props => user ? user.role === 'manager' ? <AllCheque {...props} user={user} /> : <Redirect to="notfound" /> : <Redirect to="login" />} />

                    <Route path="/allNet" render={props => user ? user.role === 'manager' ? <AllNet {...props} user={user} /> : <Redirect to="notfound" /> : <Redirect to="login" />} />


                    <Route path="/viewCheque" render={props => <ViewCheque {...props} user={user} />} />

                    <Route path="/viewNet" render={props => <ViewNet {...props} user={user} />} />

                    <Route path="/customerDetails" render={props => <CustomerDetails {...props} user={user} />} />

                    <Route path="/nomineeDetails" render={props => <NomineeDetails {...props} user={user} />} />

                    <Route path="/addPayee" render={props => <AddPayee {...props} user={user} />} />

                    <Route path="/cheque" render={props => <ChequeDetails {...props} user={user} />} />

                    <Route path="/netBanking" render={props => <NetBankingDetails {...props} user={user} />} />

                    <Route path="/admin" render={props => user ? user.role === 'manager' ? <Admin {...props} user={user} /> : <Redirect to="notfound" /> : <Redirect to="login" />} />

                    <Route path="/customer" render={props => <Admin {...props} user={user} />} />

                    <Route path="/login" component={Login} />

                    <Route path="/logout" component={Logout} />

                    <Route path="/notfound" component={NotFound} />

                    <Redirect from="/" to="/login" />

                </Switch>
            </div>
        )
    }
}
