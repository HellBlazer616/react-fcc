import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Calculator from './Calculator';
import { blue, white } from './colors';

import {
  clearRecent,
  numberCheck,
  operatorCheck,
  decimalCheck,
  deleteCheck,
  enterCheck,
  escapeCheck,
  negateCheck,
  evaluate,
  percentCheck,
  percent,
  reciprocalCheck,
  reciprocal,
  squareRootCheck,
  square,
  squareRoot,
  squareCheck,
} from './utils/math';

function App() {
  const [history, setHistory] = useState('');
  const [display, setDisplay] = useState('');
  const [firstInput, setFirstInput] = useState('0');
  const [secondInput, setSecondInput] = useState('');
  const [operator, setOperator] = useState('');
  const [isFirstDecimal, setIsFirstDecimal] = useState(false);
  const [isSecondDecimal, setIsSecondDecimal] = useState(false);

  const handleNumber = (key) => {
    if (operator === '') {
      // if the first input is number get rid of initial value
      if (firstInput === '0') {
        setDisplay(key);
        setFirstInput(key);
        setHistory(key);
      } else {
        setFirstInput(firstInput.concat(key));
        setDisplay(firstInput.concat(key));
        setHistory(history.concat(key));
      }
    } // first input was operator so use second input
    else {
      setSecondInput(secondInput.concat(key));
      setDisplay(secondInput.concat(key));
      setHistory(history.concat(key));
    }
  };

  const handleDecimal = (key) => {
    if (operator === '') {
      if (isFirstDecimal) return;
      setFirstInput(firstInput.concat(key));
      setDisplay(firstInput.concat(key));
      setHistory(history.concat(key));
      setIsFirstDecimal(true);
    } else {
      if (isSecondDecimal) return;
      setSecondInput(secondInput.concat(key));
      setDisplay(secondInput.concat(key));
      setHistory(history.concat(key));
      setIsSecondDecimal(true);
    }
  };
  const handleOperator = (key) => {
    // when we have both first and second input calculate

    if (history.slice(-1) === '=') {
      setHistory(firstInput.concat(key));
      setOperator(key);
      setSecondInput('');
      return;
    }
    // check if the last input was operator set history as that
    if (operatorCheck.test(history.slice(-1))) {
      setHistory(history.slice(0, -1).concat(key));
      return;
    }
    if (secondInput !== '') {
      const result = evaluate(firstInput, operator, secondInput);
      setHistory(
        history.concat(`${firstInput}${operator}${secondInput}${key}`)
      );
      setOperator(key);
      setFirstInput(String(result));
      setDisplay(String(result));
      setSecondInput('');
      setOperator(key);
      setHistory(history.concat(key));
      return;
    }
    setOperator(key);
    setHistory(history.concat(key));
  };

  // handle delete
  const handleDelete = () => {
    if (operatorCheck.test(history.slice(-1))) {
      setOperator('');
      setHistory(history.slice(0, -1));
      return;
    }

    if (operator === '') {
      setFirstInput(firstInput.slice(0, -1));
      setDisplay(firstInput.slice(0, -1));
      setHistory(history.slice(0, -1));
    } else {
      setSecondInput(secondInput.slice(0, -1));
      setDisplay(secondInput.slice(0, -1));
      setHistory(history.slice(0, -1));
    }
  };
  // handling Enter and = logic
  const handleEnter = () => {
    if (operator === '') {
      if (history.slice(-1) === '=') return;
      setDisplay(display.concat(''));
      setHistory(history.concat('='));
    } else if (operatorCheck.test(operator)) {
      const result = String(evaluate(firstInput, operator, secondInput));
      const operatorIndex = history.match(operatorCheck);

      if (history.slice(-1) === '=') {
        setHistory(firstInput.concat(history.slice(operatorIndex.index)));

        if (decimalCheck.test(result)) {
          setIsFirstDecimal(true);
          setFirstInput(result);
        } else {
          setIsFirstDecimal(false);
          setFirstInput(result);
        }
        setDisplay(result);
        return;
      }
      setHistory(history.concat('='));
      if (decimalCheck.test(result)) {
        setIsFirstDecimal(true);
        setFirstInput(result);
      } else {
        setIsFirstDecimal(false);
        setFirstInput(result);
      }
      setDisplay(result);
    }
  };

  const resetState = () => {
    setHistory('');
    setDisplay('');
    setFirstInput('0');
    setSecondInput('');
    setOperator('');
    setIsFirstDecimal(false);
    setIsSecondDecimal(false);
  };

  const handleEscape = () => {
    resetState();
  };

  const handleClearRecent = () => {
    if (operator === '') {
      resetState();
    } else {
      setSecondInput('');
      setDisplay('');
      setHistory(''.concat(firstInput, operator));
    }
  };

  const handlePercent = () => {
    if (operator === '') resetState();
    else {
      const result = String(percent(secondInput));
      setHistory(
        history.slice(0, history.length - secondInput.length).concat(result)
      );
      if (decimalCheck.test(result)) {
        setIsSecondDecimal(true);
        setSecondInput(result);
      } else {
        setIsSecondDecimal(false);
        setSecondInput(result);
      }

      setDisplay(result);
    }
  };
  const handleReciprocal = () => {
    if (operator === '') {
      setSecondInput(firstInput);
      setOperator('/');
      setHistory(`1/${firstInput}`);
      const result = String(reciprocal(firstInput));
      setDisplay(result);
      if (decimalCheck.test(result)) {
        setIsFirstDecimal(true);
        setFirstInput(result);
      } else {
        setIsFirstDecimal(false);
        setFirstInput(result);
      }
    } else {
      const result = reciprocal(secondInput);
      setHistory(
        history.slice(0, history.length - secondInput.length).concat(result)
      );
      if (decimalCheck.test(result)) {
        setIsSecondDecimal(true);
        setSecondInput(result);
      } else {
        setIsSecondDecimal(false);
        setSecondInput(result);
      }
      setDisplay(result);
    }
  };

  const handleSquare = () => {
    if (operator === '') {
      const result = String(square(firstInput));
      setHistory(`sqr(${firstInput})`);
      if (decimalCheck.test(result)) {
        setIsFirstDecimal(true);
        setFirstInput(result);
      } else {
        setIsFirstDecimal(false);
        setFirstInput(result);
      }
      setDisplay(result);
    } else {
      const result = String(square(secondInput));
      setHistory(
        history
          .slice(0, history.length - secondInput.length)
          .concat(`sqr(${secondInput})`)
      );
      if (decimalCheck.test(result)) {
        setIsSecondDecimal(true);
        setSecondInput(result);
      } else {
        setIsSecondDecimal(false);
        setSecondInput(result);
      }
      setDisplay(result);
    }
  };

  const handleSquareRoot = () => {
    if (operator === '') {
      const result = String(squareRoot(firstInput));
      setHistory(`root(${firstInput})`);
      if (decimalCheck.test(result)) {
        setIsFirstDecimal(true);
        setFirstInput(result);
      } else {
        setIsFirstDecimal(false);
        setFirstInput(result);
      }
      setDisplay(result);
    } else {
      const result = String(squareRoot(secondInput));
      setHistory(
        history
          .slice(0, history.length - secondInput.length)
          .concat(`root(${secondInput})`)
      );
      if (decimalCheck.test(result)) {
        setIsSecondDecimal(true);
        setSecondInput(result);
      } else {
        setIsSecondDecimal(false);
        setSecondInput(result);
      }
      setDisplay(result);
    }
  };

  //
  const handleNegate = () => {
    if (operator === '') {
      if (firstInput[0] === '-') return;
      setFirstInput('-'.concat(firstInput.slice()));
      setDisplay('-'.concat(display.slice()));
      setHistory('-'.concat(history));
    } // slice at operator and then negate it and set history
    else {
      if (secondInput[0] === '-') return;
      setSecondInput('-'.concat(secondInput.slice()));
      setDisplay('-'.concat(secondInput.slice()));
      const secondInputSize = secondInput.length;
      setHistory(
        history
          .slice(0, history.length - secondInputSize)
          .concat('-', secondInput)
      );
    }
  };

  const handleKey = (event) => {
    const key = event?.target?.value ?? event?.key;

    if (numberCheck.test(key)) {
      handleNumber(key);
      return;
    }

    if (operatorCheck.test(key)) {
      handleOperator(key);
      return;
    }

    if (decimalCheck.test(key)) {
      handleDecimal(key);
      return;
    }

    if (deleteCheck.test(key)) {
      handleDelete();
      return;
    }
    if (enterCheck.test(key)) {
      handleEnter();
      return;
    }
    if (escapeCheck.test(key)) {
      handleEscape();
      return;
    }
    if (negateCheck.test(key)) {
      handleNegate();
      return;
    }

    if (clearRecent.test(key)) {
      handleClearRecent();
      return;
    }
    if (percentCheck.test(key)) {
      handlePercent();
      return;
    }
    if (reciprocalCheck.test(key)) {
      handleReciprocal();
      return;
    }
    if (squareCheck.test(key)) {
      handleSquare();
      return;
    }
    if (squareRootCheck.test(key)) {
      handleSquareRoot();
    }
  };

  useEffect(function buttonPressOrClick() {
    document.addEventListener('keydown', handleKey);

    return () => document.removeEventListener('keydown', handleKey);
  });

  return (
    <Page>
      <Wrapper>
        <Calculator
          handleButtonPressClick={handleKey}
          upperDisplay={history}
          lowerDisplay={display}
        />
      </Wrapper>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${blue};
`;

const Wrapper = styled.div`
  display: flex;
  background: ${white};
  padding: 1rem;
  flex-basis: 100%;
  max-width: 500px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem;
`;

export default App;
