import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sideboard.module.css';
import { useSearch } from '../SearchContext';

function Sideboard() {
    const { setSearchTerm } = useSearch();
    const [searchInput, setSearchInput] = useState('');
  
    const handleSearchInputChange = (event) => {
      setSearchInput(event.target.value);
    };
  
    const handleSearchSubmit = (event) => {
      event.preventDefault();
      setSearchTerm(searchInput.trim());
    };
  
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSearchSubmit(event);
        }
      };
    
      useEffect(() => {
        // Reset the search term when the component unmounts
        return () => {
          setSearchTerm('');
        };
      }, [setSearchTerm]);

   
    return (
        <div>
            <div className={styles.searchBar}>
            <form onSubmit={handleSearchSubmit}>
            <input
            className={styles.searchInput}
            type="text"
            placeholder="Nhập tên sách, tác giả bạn muốn tìm"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            />
            </form>
            </div>
            <div className={styles.sideboard}>
                <div className={styles.sideboardele}>
                    <ul>
                        <li>
                            <Link to="/">Tất cả</Link>
                        </li>
                        <li>
                            <Link to="/">Truyện ngắn</Link>
                        </li>
                        <li>
                            <Link to="/">Truyện dài</Link>
                        </li>
                        <li>
                            <Link to="/">Tiểu thuyết</Link>
                        </li>
                        <li>
                            <Link to="/">Truyện tranh</Link>
                        </li>
                        <li>
                            <Link to="/">Sách tham khảo</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default Sideboard;