

import React, { Component, } from 'react';
import CardsTable from "./CardsTable"





class CardsList extends Component<{},{cards:any|undefined}> {

    constructor(props:any){
        super(props);

        this.state = {
            cards: undefined,
        }
    }

    componentWillMount(){


        fetch('http://localhost:5000/cardsList', {
          method: 'GET',
          mode: 'cors',
          })
          .then(response => response.json())
          .then(json => {

            const jsonObj = JSON.parse(json);
            this.setState({cards: jsonObj})
            console.log(this.state.cards)
            
          })
    }
    

    render() {
        return(
            <>
                <CardsTable cardsTable = {this.state.cards}/>
            </>
        )
  }
}

export default CardsList;


