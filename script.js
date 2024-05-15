// select dom elements
const matchContainer = document.querySelector(".all-matches")
const addMatchBtn = document.querySelector(".lws-addMatch")
const resetBtn = document.querySelector(".lws-reset")
const totalScore = document.getElementById("totalScore")

// action identifiers
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const RESET = "score/reset"
const ADD_MATCH = "match/add"
const DELETE_MATCH = "match/delete"


// action creators

//action for incrementing match score
const increment = (payload) => {
    return {
        type: INCREMENT,
        payload
    };
};

//action for decrementing match score
const decrement = (payload) => {
    return {
        type: DECREMENT,
        payload
    };
};

//action for reseting all match score
const reset = () => {
    return {
        type: RESET
    }
}

//add new match action
const addMatch = () => {
    return { type: ADD_MATCH }
}

//delete match action
const deleteMatch = (matchId) => {
    return {
        type: DELETE_MATCH,
        payload: matchId
    }
}
         

const nextMatchId = (matches) => {
    const maxId = matches.reduce((maxId, match) => Math.max(match.id, maxId), -1);
    return maxId + 1;
};

// initial state
const initialState = [
    {
        id: 1,
        score: 0    
    }
];

// create reducer function
function matchReducer(state = initialState, action) {
   //increment score
   switch(action.type) {
        case INCREMENT:
            const newMatches = state.map((item) => {
                if( item.id === action.payload.id ) {
                    return {
                        ...item,
                        score: item.score + Number(action.payload.value)
                    }
                } else {
                    return item
                }
            })
            return newMatches
        
        case DECREMENT:
            const newMatchesDecrement = state.map((item) => {
                if( item.id === action.payload.id ) {
                    const newScore = item.score - Number(action.payload.value)

                    return {
                        ...item,
                        score: newScore > 0 ? newScore : 0
                    }
                } else {
                    return item
                }
            })
            return newMatchesDecrement   
        
        case RESET:
            //reset scores
            const refreshedMatches = state.map((item) => ({
                ...item,
                score: 0
            }))     
            return refreshedMatches
        
        case ADD_MATCH:
            //Add new match
            const id = nextMatchId(state)    
            return [...state, {id, score: 0}]

        case DELETE_MATCH:
            const deleteMatchesAfter = state.filter((match) => match.id !== action.payload)
            return deleteMatchesAfter  

        default:
            return state     
   }

}

// create store
const store = Redux.createStore(matchReducer);


const incrementHandler = (id, formEl) => {

    
    //get the increment input
    const input = formEl.querySelector(".lws-increment");
    
    //get value
    const value = Number(input.value);

    if (value > 0) {
        store.dispatch(increment({id, value}));
    } else {
        alert("Not accepted are 0 or negative values.")
        input.value = ''
    }
}


const decrementHandler = (id, formEl) => {
    //get the increment input
    const input = formEl.querySelector(".lws-decrement");
    
    //get value
    const value = Number(input.value);

    if (value > 0) {
        store.dispatch(decrement({id, value}));
    }else {
        alert("Not accepted are 0 or negative values.")
        input.value = ''
    }
}

const handleMatchDelete = (matchId) => {
    store.dispatch(deleteMatch(matchId))
} 

addMatchBtn.addEventListener("click", () => {
    store.dispatch(addMatch())
})

resetBtn.addEventListener("click", () => {
    store.dispatch(reset())
})


const render = () => {
    const state = store.getState()

    const matchView = state
    .map((item) => {
        return `
        <div class="match">
        <div class="wrapper">
            <button class="lws-delete" onclick="handleMatchDelete(${item.id})">
                <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${item.id}</h3>
        </div>
        <div class="inc-dec">
            <form class="incrementForm" onsubmit="event.preventDefault(); incrementHandler(${item.id}, this)">
                <h4>Increment</h4>
                <input
                    type="number"
                    name="increment"
                    class="lws-increment"
                />
            </form>
            <form class="decrementForm" onsubmit="event.preventDefault(); decrementHandler(${item.id}, this)">
                <h4>Decrement</h4>
                <input
                    type="number"
                    name="decrement"
                    class="lws-decrement"
                />
            </form>
        </div>
        <div class="numbers">
            <h2 class="lws-singleResult">${item.score}</h2>
        </div>
    </div>        
        `})
    .join("")
    matchContainer.innerHTML = matchView;


    const totalScoreCalc = state.reduce((acc, match) => acc + match.score, 0) 

    totalScore.innerHTML = totalScoreCalc;

};

render();
store.subscribe(render);
