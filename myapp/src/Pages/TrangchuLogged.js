//import logo from './logo.svg';
import React from 'react';

// import '../Styles/Trangchu.css';
import namiya from '../images/namiya.jpg';
import nxc1ct from '../images/nxc1ct.jpg';
import vncncd from '../images/vncncd.jpg';
import yThien from '../images/yThien.jpg';
import osho from '../images/osho-tu-ton.jpg';
import toancc from '../images/toancc.webp';
import grammar from '../images/grammar.webp';
import ketoanviahe from '../images/ktvh.png';
import nonggian from '../images/nglbn.webp';
import tddn from '../images/tddn.jpg';
import tiengnguoitrongvan from '../images/tiengnguoitrongvan.jpg';
import voting from '../images/voting.png';
// import Header from '../Component/logHeader.js';
import Header from '../Component/logHeader.js';
import Footer from '../Component/Footer.js';

function Product(props) {
  return (
    <div className="product">
      <img className="product-img" src={props.imgSrc} alt={props.name} />
      <a href="#top">{props.name}</a>
      {/* <ul>
        <li className="voting">
          <p>{props.vote}</p>
          <span><img className="star-voting" src={voting}/></span>
        </li>
        <li>
          <p>{props.price}</p>
        </li>
      </ul> */}
      <p className="p-voting">{props.vote}<span><img className="star-voting" src={voting} /></span></p>
      <p>{props.price}<sup>đ</sup></p>
    </div>
  )
}

function Label(props) {
  return (
    <div className={props.clName}>
      <p className="text-label">{props.text}</p>
    </div>
  )
}

const labels =
  <div className="labels">
    <Label clName="orange-label" text="Giảm giá sốc" />
    <Label clName="orange-label" text="Mua sách tặng vở" />
    <Label clName="light-green-label" text="Bao sách miễn phí" />
    <Label clName="light-green-label" text="Hỗ trợ vận chuyển" />
  </div>

const productsBar1 =
  <div className="product-bar">
    <div className="header">
      <h1 className="header-title">Sách bán chạy</h1>
      <div className="spacer"></div>
      <a href="#view-all" className="header-link">Xem tất cả sản phẩm</a>
    </div>
    <div className="multiple-products">
      <Product
        imgSrc={yThien}
        name="Ỷ thiên đồ long ký"
        vote="5/5"
        price="25.000đ"
      />
      <Product
        imgSrc={vncncd}
        name="Về nơi có nhiều cánh đồng"
        vote="4.9/5"
        price="150.000đ"
      />
      <Product
        imgSrc={namiya}
        name="Điều kỳ diệu ở tiệm tạp hóa Namiya"
        vote="5/5"
        price="63.000đ"
      />
      <Product
        imgSrc={nxc1ct}
        name="Ngày xưa có một chuyện tình"
        vote="4.5/5"
        price="99.000đ"
      />
      <Product
        imgSrc={grammar}
        name="Essential Grammar in Use"
        vote="4.7/5"
        price="155.000đ"
      />
      <Product
        imgSrc={toancc}
        name="Toán cao cấp tập 1"
        vote="4.6/5"
        price="76.000đ"
      />
    </div>
  </div>

const productsBar2 =
  <div className="product-bar">
    <div className="header">
      <h1 className="header-title">Sách giảm giá</h1>
      <div className="spacer"></div>
      <a href="#view-all" className="header-link">Xem tất cả sản phẩm</a>
    </div>
    <div className="multiple-products">
      <Product
        imgSrc={nonggian}
        name="Nóng giận là bản năng, tĩnh lặng là bản lĩnh"
        vote="4.1/5"
        price="53.000đ"
      />
      <Product
        imgSrc={osho}
        name="Osho - Tự tôn"
        vote="4.6/5"
        price="103.000đ"
      />
      <Product
        imgSrc={namiya}
        name="Điều kỳ diệu ở tiệm tạp hóa Namiya"
        vote="5/5"
        price="63.000đ"
      />
      <Product
        imgSrc={tddn}
        name="Thánh dực dũng nghĩa"
        vote="4.2/5"
        price="84.500đ"
      />
      <Product
        imgSrc={ketoanviahe}
        name="Kế toán vỉa hè"
        vote="5/5"
        price="154.999đ"
      />
      <Product
        imgSrc={tiengnguoitrongvan}
        name="Tiếng người trong văn"
        vote="4.8/5"
        price="85.600đ"
      />
    </div>
  </div>


function App() {
  return (
    <React.Fragment>
      <Header />
      {labels}
      {productsBar1}
      {productsBar2}
      <Footer />
    </React.Fragment>
  );
}
export default App;
export { Product };