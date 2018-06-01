import React, { Component } from 'react';
import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';
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
      list,
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

    const { list, searchTerm } = this.state;

    console.log(this);

    return (
      <div className="App">

        <Grid fluid>
          <Row>
            <div className="jumbotron">
              <Search
                onChange={ this.searchValue }
                value={ searchTerm }
              >Search here</Search>
            </div>
          </Row>
        </Grid>

        <Table
          list={ list }
          searchTerm={ searchTerm }
          removeItem={ this.removeItem }
        />

      </div>
    );
  }
}

const Search = ({ onChange, value, children }) => {
  return (
    <form>
      <FormGroup>
        { children }
        <div className="input-group">

          <input
            className="form-control width100"
            type="text"
            onChange={ onChange }
            value={ value }
          />

          <span className="input-group-btn">
            <button
              className="btn btn-primary"
              type="submit"
            >
              Search
            </button>
          </span>

        </div>
      </FormGroup>
    </form>
  )
}

const Table = ({ list, searchTerm, removeItem }) => {
  return (
      <div>
        {
          list.filter( isSearched(searchTerm) ).map(item =>
              <div key={ item.objectID }>
                <h3> <a href={ item.url }> { item.title }</a> by { item.author}</h3>
                <p>{ item.num_comments } Comments | { item.points } Points</p>
                <Button
                  type="button"
                  onClick={ () => removeItem(item.objectID) }>
                  Remove me
                </Button>
              </div>
          )
        }
      </div>
    )
  }

const Button = ({ onClick, children }) =>
  <button
    onClick={ onClick } >
    { children }
  </button>


export default App;
