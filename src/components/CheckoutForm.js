import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

import "./CheckoutForm.css";
import styled from "styled-components";

const Form = styled.form`
  margin-top: 16px;
  padding: 16px 32px 64px;
  margin: auto;
  font-size: 14px;
  transform: translateY(8px);
  & label {
    display: block;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    color: SILVER;
    font-family: "zilla slab", serif;
  }
`;

const Button = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 8px;
  border-radius: 4px;
  background: ${({ disabled }) => (disabled ? "silver" : "darkgoldenrod")};
  color: ${({ disabled }) => (disabled ? "DIMGRAY" : "GAINSBORO")};
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.25);
`;

class CheckoutForm extends Component {
  state = {
    name: "",
    email: "",
    address_line1: "",
    address_city: "",
    address_zip: "",
    valide: false,
    erreur: ""
  };

  handleChange = event => {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { 
      name,
      email,
      address_line1,
      address_city,
      address_zip
    } = this.state;

    const amount = this.props.prixTotal * 100;

    const { token } = await this.props.stripe.createToken({
      name,
      email,
      address_line1,
      address_city,
      address_zip
    });

    console.log(token);

    const resPaiement = await fetch("/.netlify/functions/paiement", {
      method: 'POST',
      body: JSON.stringify({
        amount,
        token: token.id
      })
    });

    console.log(resPaiement);
    if (resPaiement.ok) {
      const resMail = await fetch('/.netlify/functions/mail', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          address_line1,
          address_city,
          address_zip
        })
      });
      if (resMail.ok) {
        console.log('Paiement Validé');
        this.setState({ valide: true, erreur: '' });
      } else {
        this.setState({ 
          erreur: `Votre paiement à bien été validé, toutefois, nous ne sommes pas parvenue
          à le confirmer au propriétaire du site. Vous pouvez le contacter...`
        });
      }
    } else {
      this.setState({ 
        erreur: `Le paiement n'a pas été validé ... `
      });
    }
  };

  render() {
    return (
      <>
        {!this.state.valide ? (
          <Form onSubmit={this.handleSubmit}>
            <label htmlFor="name">Nom</label>
            <input
              className="StripeElement"
              type="text"
              onChange={this.handleChange}
              name="name"
              value={this.state.name}
              placeholder="Jon Snow"
              required
            />
            <label htmlFor="email">Email</label>
            <input
              className="StripeElement"
              type="email"
              onChange={this.handleChange}
              name="email"
              value={this.state.email}
              placeholder="jon@lagarde.com"
              required
            />
            <label htmlFor="address_line1">Adresse</label>
            <input
              className="StripeElement"
              type="txt"
              onChange={this.handleChange}
              name="address_line1"
              value={this.state.address_line1}
              placeholder="1 rue de Châteaunoir"
              required
            />
            <label htmlFor="address_zip">Code Postal</label>
            <input
              className="StripeElement"
              type="txt"
              onChange={this.handleChange}
              name="address_zip"
              value={this.state.address_zip}
              placeholder="75000"
              required
            />
            <label htmlFor="address_city">Ville</label>
            <input
              className="StripeElement"
              type="txt"
              onChange={this.handleChange}
              name="address_city"
              value={this.state.address_city}
              placeholder="Châteaunoir"
              required
            />
            <label>Carte</label>
            <CardElement hidePostalCode={true} />
            <Button disabled={this.props.prixTotal <= 0} type="submit">
              Payer
            </Button>
            {this.state.erreur && <p>{this.state.erreur}</p>}
          </Form>
        ) : (
          <p>Le paiement a bien été validé.</p>
        )}
      </>
    );
  }
}

export default injectStripe(CheckoutForm);
