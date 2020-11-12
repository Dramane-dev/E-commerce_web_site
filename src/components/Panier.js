import React, { Component } from 'react'
import WithPanier from '../context/WithPanier'
import styled from 'styled-components'

const Bulle = styled.div`
  position: fixed;
  bottom: 16px;
  left: 8px;
  border-radius: 500px;
  padding: 8px 16px;
  background: darkgoldenrod;
  font-family: 'zilla slab', serif;
  font-weight: 700;
  z-index: 999;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.25);
  & a {
    color: white;
    text-decoration: none;
    color: GAINSBORO;
  }
`

class Panier extends Component {
  render() {
    const { prixTotal } = this.props.context.state
    return (
      <Bulle>
        <a href="#checkout">
          <span role="img" aria-label="Livre">
            📚
          </span>{' '}
          Votre panier {prixTotal > 0 ? ` : ${prixTotal},00€` : 'est vide.'}
        </a>
      </Bulle>
    )
  }
}

export default WithPanier(Panier)
