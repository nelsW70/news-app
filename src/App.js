import React, { Component } from 'react';
import list from './list';
import logo from './logo.svg';
import './App.css';

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list,
      searchTerm: ''
    }

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }

  removeItem(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  searchValue(event) {
    // console.log(event);
    this.setState({ searchTerm: event.target.value });
  }

  render() {

    console.log(this);

    return (
      <div className="App">

        <form>
          <input type="text" onChange={ this.searchValue }/>
        </form>

        <h1>
          {
            this.state.list.filter( isSearched(this.state.searchTerm) ).map(item =>
                <div key={ item.objectID }>
                  <h3> <a href={ item.url }> { item.title }</a> by { item.author}</h3>
                  <p>{ item.num_comments } Comments | { item.points } Points</p>
                  <button type="button" onClick={ () => this.removeItem(item.objectID) }>Remove</button>
                </div>
            )
          }
        </h1>
      </div>
    );
  }
}

export default App;
