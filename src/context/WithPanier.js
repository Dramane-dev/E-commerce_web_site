import React from 'react'
import PanierContext from './panierContext'

const WithPanier = Component => props => (
  <PanierContext.Consumer>
    {context => <Component {...props} context={context} />}
  </PanierContext.Consumer>
)

export default WithPanier
