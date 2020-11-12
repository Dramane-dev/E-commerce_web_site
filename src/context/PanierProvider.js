import React from "react";
import PanierContext from "./panierContext";

import livres from "../livres";

class PanierProvider extends React.Component {
  state = {
    panier: {},
    livres,
    prixTotal: 0
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.panier !== this.state.panier) {
      this.prixTotal();
    }
  }

  ajouterAuPanier = id => {
    const panier = { ...this.state.panier };
    const livre = this.state.livres[id];
    const livreDansLePanier = Object.keys(panier).includes(id);
    if (livreDansLePanier) {
      panier[id].quantite += 1;
      this.setState({ panier })
    } else {
      panier[id] = livre;
      panier[id].quantite = 1;
      this.setState({ panier });
    }
    console.log(this.state.panier);
  };

  supprimerDuPanier = id => {
    const panier = { ...this.state.panier };
    panier[id].quantite -= 1;
    if (panier[id].quantite <= 0) {
      delete panier[id];
      this.setState({ panier });
    } else {
      this.setState({ panier });
    }
  }

  prixTotal = id => {
    const panier = { ...this.state.panier };
    const prixTotal = Object.keys(panier).reduce(
      (acc, id) => acc + panier[id].prix * panier[id].quantite,
      0
    );
    this.setState({ prixTotal });
  };

  render() {
    return (
      <PanierContext.Provider
        value={{
          state: this.state,
          ajouterAuPanier: id => this.ajouterAuPanier(id),
          supprimerDuPanier: id => this.supprimerDuPanier(id),
          prixTotal: () => this.prixTotal()
        }} 
      >
        {this.props.children}
      </PanierContext.Provider>
    );
  }
}

export default PanierProvider;
