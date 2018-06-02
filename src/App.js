import React, { Component } from 'react';
// import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';

const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
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
      result: null,
      searchTerm: DEFAULT_QUERY
    }

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  setTopStories(result) {
    this.setState({ result: result });
  }

  fetchTopStories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
      &${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  onSubmit(event) {
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }

  removeItem(id) {
    const { result } = this.state;
    const updatedList = result.hits.filter(item => item.objectID !== id);
    this.setState({ result: {...result, hits: updatedList} })
  }

  searchValue(event) {
    // console.log(event);
    this.setState({ searchTerm: event.target.value });
  }

  render() {

    const { result, searchTerm } = this.state;

    const page = (result && result.page) || 0;

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

        { result &&
        <Table
          list={ result.hits }
          searchTerm={ searchTerm }
          removeItem={ this.removeItem }
        />
      }

      <div>

      </div>
        <Button
          onClick={ () => this.fetchTopStories(searchTerm, page + 1) }
        >
          Load more
        </Button>
      </div>
    );
  }
}

const Search = ({ onChange, value, children, onSubmit }) => {
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
          />

          <span className="input-group-btn">
            <button
              className="btn btn-primary searchBtn"
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
                    className="btn btn-danger btn-xs"
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

const Button = ({ onClick, children, className='' }) =>
  <button
    className={className}
    onClick={ onClick } >
    { children }
  </button>


export default App;
