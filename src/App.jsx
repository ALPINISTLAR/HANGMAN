import React, { useState, useEffect } from 'react';

const App = () => {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [keyboardLetters, setKeyboardLetters] = useState([]);
  const [countries, setCountries] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setCountries(data.categories.Countries);
        handleNextCountry(data.categories.Countries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    setKeyboardLetters(alphabet.split(''));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleNextCountry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [countries, selectedLetters, score]);

  const handleLetterClick = (letter) => {
    if (!selectedLetters.includes(letter)) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleKeyPress = (event) => {
    const pressedLetter = event.key.toLowerCase();
    if (keyboardLetters.includes(pressedLetter) && !selectedLetters.includes(pressedLetter)) {
      setSelectedLetters([...selectedLetters, pressedLetter]);
    }
  };

  const handleNextCountry = () => {
    const allLetters = document.querySelectorAll('.d-item');
    const isAnyEmpty = Array.from(allLetters).some(letter => !letter.textContent.trim());

    if (isAnyEmpty) {
      return;
    }

    const randomCountry = getRandomCountry(countries);
    setCountryName(randomCountry.name);
    setSelectedLetters([]);
    setScore(score + 5); // Increase the score by 5

    const hideButton = document.querySelector('.next-c');

    setTimeout(() => {
      hideButton.style.display = 'none';
    }, 10);
  };

  const getRandomCountry = (countries) => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [selectedLetters]);

  const renderCountryName = () => {
    const words = countryName.split(' ');

    return words.map((word, wordIndex) => (
      <div key={wordIndex} className={`d-${wordIndex + 1}`}>
        {word.split('').map((letter, index) => (
          <div
            key={index}
            className={`d-item ${selectedLetters.includes(letter) || index === 0 ? 'highlight' : ''}`}
          >
            {selectedLetters.includes(letter) || index === 0 ? letter : ''}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className='container'>
      <div className="score">{score}</div>
      <div className='display'>{renderCountryName()}</div>

      <div className='key-wrap'>
        {keyboardLetters.map((letter) => (
          <button
            key={letter}
            className={`key ${selectedLetters.includes(letter) ? 'disabled' : ''}`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <button className='next-c' onClick={handleNextCountry}>
        start game
      </button>
    </div>
  );
};

export default App;
