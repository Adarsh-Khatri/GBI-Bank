import React, { Component } from 'react';
import './app.css'
import MainComponent from './components/MainComponent'
import { BrowserRouter } from 'react-router-dom'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MainComponent />
      </BrowserRouter>
    )
  }
}
