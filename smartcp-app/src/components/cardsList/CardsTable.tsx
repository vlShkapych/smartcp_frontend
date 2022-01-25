
import {Table,} from 'react-bootstrap';
import {useState,useEffect,} from 'react'
import { any } from '@tensorflow/tfjs-core';





type InputProps = { // The common Part
    cardsTable: Array<any> ;

    
}



export const CardsTable = (props:InputProps) => { 


    const [cardsList, setCardsList] = useState(props.cardsTable);


    useEffect(()=>{
        
        setCardsList(props.cardsTable)
  
      },[props.cardsTable])






    var tableRow = [];
    

    if(cardsList !== undefined){
        for (var i = 0; i < cardsList.length; i++) {
            tableRow.push(
                <tr>
                    <td>{i}</td>
                    <td>{cardsList[i]._id["$oid"]}</td>
                    <td>{cardsList[i].name}</td>
                   
                </tr>   
            );
        }
    }
   

    

    return(
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Uid</th>
            <th>Name</th>
           
          </tr>
        </thead>
        <tbody>
          {tableRow}
        </tbody>
        </Table>
        )

}

export default CardsTable;




