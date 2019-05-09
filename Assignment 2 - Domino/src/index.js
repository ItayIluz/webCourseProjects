import React from 'react';
import ReactDOM from 'react-dom';

import DominoGame from './domino-game.jsx';

const App = () => (
    <div>
        <DominoGame />       
    </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
