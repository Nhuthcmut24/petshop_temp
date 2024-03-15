import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Trangchu.module.css';
import voting from '../images/voting.png';
import Header from '../Component/Header.js';
import Sideboard from '../Component/Sideboard.js';
import { useSearch } from '../SearchContext';
import Footer from '../Component/Footer.js';

function Product(props) {
  return (
    <Link to={`/xemsanpham/${props.bookId}`} id='link-to-product-tag'>
    <div className={styles.stproduct}>
      <img className={styles.productImg} src={props.imgSrc} alt = {props.name}/>
      <p className={styles.booTitle} id='ten_sach'>{props.name}</p>
      {
        props.vote === null ? (
          <p className={styles.pVoting}>Chưa có đánh giá</p>
        ) : (
          <p className={styles.pVoting}>{props.vote.toFixed(1) + "/5"}<span><img className={styles.starVoting} src={voting} /></span></p>
        )
      }
      <p>{props.price.toLocaleString('vi-VN')}<sup>đ</sup></p>
    </div>
    </Link>
  )
}

function TrangChu() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }
  const renderPageNumbers = pageNumbers.map((number) => (
    <li key={number} >
      <a href="#" onClick={() => paginate(number)}
      className={number === currentPage ? styles.currentPage : styles.nonCurrentPage}>
        {number}
      </a>
    </li>
  ));

  useEffect(() => {
    if (searchTerm) {
      setIsSearch(true);
      fetch(`http://localhost:3001/api/search?q=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching search results:', error));
    } else {
      setIsSearch(false);
      fetch('http://localhost:3001/api/getBooksForHomePage')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching books:', error));
    }
  }, [searchTerm]);

  const listProducts =
  <ul className={styles.listProducts}>
    {products.map((product, index) => (
      <li key={index} className={styles.listProductsEle}>
        <Product
          bookId={product.ID}
          imgSrc={`/images/${product.Anh}`}
          name={product.Ten}
          vote={product.DiemTrungBinh}
          price={product.Gia}
        />
      </li>
    ))}
  </ul>

  // const content =
  // <div className={styles.content}>
  // {listProducts}
  // <ul className={styles.pagination}>{renderPageNumbers}</ul>
  // </div>;

  const content =
    <div className={styles.content}>
      <ul className={styles.listProducts}>
        {currentProducts.map((product, index) => (
          <li key={index} className={styles.listProductsEle}>
            <Product
              bookId={product.ID}
              imgSrc={`/images/${product.Anh}`}
              name={product.Ten}
              vote={product.DiemTrungBinh}
              price={product.Gia}
            />
          </li>
        ))}
      </ul>
    </div>;

  return (
    <React.Fragment>
      <Header/>
      <Sideboard/>
      {isSearch ? <p id='search-result'>Kết quả tìm kiếm cho "{searchTerm}":</p> : null}
      {content}
      <ul className={styles.pagination}>{renderPageNumbers}</ul>
      <Footer/>
    </React.Fragment>
  );
}
export default TrangChu;
export { Product };