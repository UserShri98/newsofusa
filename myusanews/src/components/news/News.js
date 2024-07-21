import React, { useState, useEffect } from 'react';
import './News.css';

const ITEMS_PER_PAGE = 10; // Number of items to display per page

const News = () => {
  const [myNews, setMyNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (query) => {
    setLoading(true);
    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=696a92ae5a554a1d8c69381618b87c68`;
    if (query) {
      url = `https://newsapi.org/v2/everything?q=${query}&apiKey=696a92ae5a554a1d8c69381618b87c68`;
    }
    try {
      let res = await fetch(url);
      let data = await res.json();
      setMyNews(data.articles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderArticles = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArticles = myNews.slice(startIndex, endIndex);

    return currentArticles.map((ele, index) => (
      <div key={index} className="card">
        <img
          src={
            ele.urlToImage === null
              ? 'https://via.placeholder.com/150'
              : ele.urlToImage
          }
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{ele.author}</h5>
          <p className="card-text">{ele.title}</p>
          <a href={ele.url} target="_blank" className="btn btn-primary" rel="noopener noreferrer">
            Read more...
          </a>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="mainDiv">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          renderArticles()
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(myNews.length / ITEMS_PER_PAGE) }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default News;
