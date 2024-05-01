import React from 'react';
import './App.css';

function App() {
  return (
    <>
      {/* Header */}
      <header className="title">지식이 축적되는 중이에요..</header>
      {/* List */}
      <span className="list-title">축적된 링크 모음</span>
      <div className="list-container">
        <ul className="list">
          {/* Link */}
          <li className="list-item">
            <div className="url">
              {/* favicon */}
              <div className="favicon"></div>
              {/* URL */}
              <span className="domain">www.google.com</span>
            </div>
            {/* cancle btn */}
            <button className="delete-btn">X</button>
          </li>
          {/* Link */}
          <li className="list-item">
            <div className="url">
              {/* favicon */}
              <div className="favicon"></div>
              {/* URL */}
              <span className="domain">www.google.com</span>
            </div>
            {/* cancle btn */}
            <button className="delete-btn">X</button>
          </li>
          {/* Link */}
          <li className="list-item">
            <div className="url">
              {/* favicon */}
              <div className="favicon"></div>
              {/* URL */}
              <span className="domain">www.google.com</span>
            </div>
            {/* cancle btn */}
            <button className="delete-btn">X</button>
          </li>
          {/* Link */}
          <li className="list-item">
            <div className="url">
              {/* favicon */}
              <div className="favicon"></div>
              {/* URL */}
              <span className="domain">www.google.com</span>
            </div>
            {/* cancle btn */}
            <button className="delete-btn">X</button>
          </li>
          {/* Link */}
          <li className="list-item">
            <div className="url">
              {/* favicon */}
              <div className="favicon"></div>
              {/* URL */}
              <span className="domain">www.google.com</span>
            </div>
            {/* cancle btn */}
            <button className="delete-btn">X</button>
          </li>
        </ul>
      </div>
      {/* Button */}
      <button className="submit-btn">보고서 작성하기</button>
    </>
  );
}

export default App;
