import React from 'react'

export default function Alert(props) {

    const capitalize = (word) =>{
      if (word=== "danger"){
        word = "error"
      }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1); //slice(1) cuts the first character and return the rest of the string
    }
  return (
    //to prevent cumulative layout shift
    <div style={{height: '50px'}}>  

{props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
  <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
</div>}

</div>
  )
  
}
