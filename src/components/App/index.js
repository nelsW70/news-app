import React, { Component } from 'react';
import list from '../../list';
import { Grid, Row, FormGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import Table from '../Table/index';
import { Button, Loading } from '../Button/index';

import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP }
  from '../../constants/index';


const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}
            &${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />

const updateTopStories = (hits, page) => prevState => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];

  return { results: { ...results, [searchKey]: {hits: updatedHits, page}},
    isLoading: false
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false
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
    this.setState(updateTopStories(hits, page));
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

    const { results, searchTerm, searchKey,
            isLoading } = this.state;

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
            removeItem={ this.removeItem }
          />

        <div className="text-center alert">

            <ButtonWithLoading
              isLoading={ isLoading }
              className="btn btn-success"
              onClick={ () => this.fetchTopStories(searchTerm, page + 1) }>
              Load more
            </ButtonWithLoading>

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

const ButtonWithLoading = withLoading(Button);

export default App;
