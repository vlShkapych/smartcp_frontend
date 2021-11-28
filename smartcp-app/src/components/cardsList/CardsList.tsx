

import React, { Component, } from 'react';






class CardsList extends Component<{},{cards:any}> {

    constructor(props:any){
        super(props);

        this.state = {
            cards: [],
        }
    }

    // componentDidMount(){


    //     fetch('http://localhost:5000/cardsList', {
    //       method: 'GET',
    //       mode: 'cors',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //       })
    //       .then(response => response.json())
    //       .then(json => {

    //         const jsonObj = JSON.parse(json);
    //         //this.setState({cards: jsonObj})
    //         console.log(jsonObj);
            
    //       })
    //}
    
    



    


    render() {
        return(
            <>
                {this.state.cards}
            </>
        )
  }
}

export default CardsList;


