import React, { Component } from 'react';
import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP }
  from './constants/index';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}
            &${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    }

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  checkTopStoriesSeachTerm(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setTopStories(result) {
    const { hits, page } = result;
    // const oldHits = page !== 0 ? this.state.result.hits : [];
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page}},
      isLoading: false
    });
  }

  fetchTopStories(searchTerm, page) {

    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.checkTopStoriesSeachTerm(searchTerm)) {
      this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  removeItem(id) {
    const { results, searchKey } = this.state;
    const { hits, page } = results[searchKey];
    const updatedList = hits.filter(item => item.objectID !== id);
    this.setState({ results: {...results, [searchKey]: {hits: updatedList, page}} })
  }

  searchValue(event) {
    // console.log(event);
    this.setState({ searchTerm: event.target.value });
  }

  render() {

    const { results, searchTerm, searchKey, isLoading } = this.state;

    const page = (results && results[searchKey] && results[searchKey].page) || 0;

    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    console.log(this);

    // if (!result) {return null};

    return (
      <div>

        <Grid fluid>
          <Row>
            <div className="jumbotron text-center">
              <Search
                onChange={ this.searchValue }
                value={ searchTerm }
                onSubmit={ this.onSubmit }
              >NEWSAPP</Search>
            </div>
          </Row>
        </Grid>

        <Grid>
          <Row>
          <Table
            list={ list }
            searchTerm={ searchTerm }
            removeItem={ this.removeItem }
          />

        <div className="text-center alert">

          { isLoading ? <Loading/> :
            <Button
              className="btn btn-success"
              onClick={ () => this.fetchTopStories(searchTerm, page + 1) }>
              Load more
            </Button>
          }

        </div>
        </Row>
      </Grid>

      </div>
    );
  }
}

class Search extends Component {
  componentDidMount() {
    this.input.focus();
  }
  render() {
  const { onChange, value, children, onSubmit } = this.props;
  return (
    <form onSubmit={ onSubmit }>
      <FormGroup>
        <h1 style={{ fontWeight: 'bold' }}>{ children }</h1> <hr style={{ border: '2px solid black', width: '100px' }}/>
        <div className="input-group">

          <input
            className="form-control width100 searchForm"
            type="text"
            onChange={ onChange }
            value={ value }
            ref={(node) => { this.input = node } }
          />

          <span className="input-group-btn">
            <Button
              className="btn btn-primary searchBtn"
              type="submit"
            >
              Search
            </Button>
          </span>

        </div>
      </FormGroup>
    </form>
  )
  }
}

const Table = ({ list, searchTerm, removeItem }) => {
  return (
      <div className="col-sm-10 col-sm-offset-1">
        {
          // list.filter( isSearched(searchTerm) ).map(item =>
          list.map(item =>
              <div key={ item.objectID }>
                <h1>
                  <a href={ item.url }> { item.title }</a>
                </h1>
                <h4>

                  { item.author} | { item.num_comments } Comments | { item.points } Points
                  <Button
                    className="btn btn-warning btn-xs"
                    type="button"
                    onClick={ () => removeItem(item.objectID) }>
                    Remove me
                  </Button>

                </h4> <hr />

              </div>
          )
        }
      </div>
    )
  }

  Table.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        objectID: PropTypes.string.isRequired,
        author: PropTypes.string,
        url: PropTypes.string,
        num_comments: PropTypes.number,
        points: PropTypes.number
      })
    ).isRequired,
    removeItem: PropTypes.func.isRequired,
  }

const Button = ({ onClick, children, className='' }) =>
  <button
    className={ className }
    onClick={ onClick } >
    { children }
  </button>

  Button.PropTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node
  }

  Button.defaultProps = {
    className: ''
  }

  const Loading = () =>
    <div>Loading...</div>


export default App;
