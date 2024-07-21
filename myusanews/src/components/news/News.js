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
    let url = `https://gnews.io/api/v4/top-headlines?category=general&apikey=27546ea6f2c88af074a2077cae1231a0`;
    if (query) {
      url = `https://gnews.io/api/v4/search?q=${query}&apikey=27546ea6f2c88af074a2077cae1231a0`;
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
            ele.image === null
              ? 'https://via.placeholder.com/150'
              : ele.image
          }
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title">{ele.source.name}</h5>
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
